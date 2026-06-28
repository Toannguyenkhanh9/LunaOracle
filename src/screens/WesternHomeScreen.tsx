import React, { useMemo, useState } from 'react';

import {
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';
import MysticHomeFeed from '../components/MysticHomeFeed';
import MoonDustMiniCard from '../components/MoonDustMiniCard';
import OracleProgressCard from '../components/OracleProgressCard';

type HomeRoute =
  | 'DailyHoroscope'
  | 'ZodiacProfile'
  | 'TarotReading'
  | 'ZodiacCompatibility'
  | 'MoonCalendar'
  | 'AstroGlossary'
  | 'AstroJournal'
  | 'AdvancedTarotJournal'
  | 'LoveCenter'
  | 'YearMonthlyForecast'
  | 'TarotLibrary'
  | 'SmartNotificationSettings'
  | 'LoveModeAdvanced'
  | 'DailyRitual'
  | 'StreakAchievements'
  | 'Settings'
  | 'MoonDustRewards'
  | 'ThemeShop'
  | 'AskOracle'
  | 'WeeklyReport'
  | 'SocialShareTemplates'
  | 'PremiumDeepReading'
  | 'DailyQuest'
  | 'OracleProgress'
  | 'UserProgressHub'
  | 'OracleJourney'
  | 'MoodTracker'
  | 'MonthlyEnergyCalendar'
  | 'OracleGuides'
  | 'DreamJournal'
  | 'RelationshipTimeline'
  | 'PalmReadingIntro'
  | 'PalmReadingCamera'
  | 'PalmReadingResult'
  | 'PalmReadingHistory';

type Props = {
  navigation: {
    navigate: (route: string, params?: Record<string, unknown>) => void;
  };
};

type CardItem = {
  route: HomeRoute;
  icon: string;
  title: string;
  subtitle: string;
  tone: 'purple' | 'gold' | 'moon' | 'rose';
};

const HERO_IMAGE = require('../assets/images/home/western_home_hero.png');

function getTodayText(language: string): string {
  try {
    return new Intl.DateTimeFormat(language, {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    }).format(new Date());
  } catch {
    return new Date().toLocaleDateString();
  }
}

function getTone(tone: CardItem['tone']) {
  switch (tone) {
    case 'gold':
      return {
        backgroundColor: 'rgba(217,183,110,0.16)',
        color: '#B8872E',
      };

    case 'moon':
      return {
        backgroundColor: 'rgba(232,226,255,0.22)',
        color: '#6F65A8',
      };

    case 'rose':
      return {
        backgroundColor: 'rgba(220,110,150,0.13)',
        color: '#A74372',
      };

    case 'purple':
    default:
      return {
        backgroundColor: 'rgba(110,77,168,0.14)',
        color: '#6E4DA8',
      };
  }
}

function Card({
  item,
  onPress,
}: {
  item: CardItem;
  onPress: (route: HomeRoute) => void;
}) {
  const tone = getTone(item.tone);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.title}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => onPress(item.route)}
    >
      <View
        style={[
          styles.cardIcon,
          {
            backgroundColor: tone.backgroundColor,
          },
        ]}
      >
        <Text
          style={[
            styles.cardIconText,
            {
              color: tone.color,
            },
          ]}
        >
          {item.icon}
        </Text>
      </View>

      <View style={styles.cardCopy}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>

        <Text style={styles.cardSubtitle} numberOfLines={2}>
          {item.subtitle}
        </Text>
      </View>

      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

function Section({
  eyebrow,
  title,
  cards,
  onPress,
  initialCount,
}: {
  eyebrow: string;
  title: string;
  cards: CardItem[];
  onPress: (route: HomeRoute) => void;
  initialCount?: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const shouldCollapse =
    typeof initialCount === 'number' &&
    cards.length > initialCount;

  const visibleCards =
    shouldCollapse && !expanded && initialCount
      ? cards.slice(0, initialCount)
      : cards;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionHeaderCopy}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>

          <Text style={styles.sectionTitle}>{title}</Text>
        </View>

        {shouldCollapse ? (
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.showMoreButton,
              pressed && styles.pressed,
            ]}
            onPress={() => setExpanded(previous => !previous)}
          >
            <Text style={styles.showMoreText}>
              {expanded ? 'Less' : `+${cards.length - initialCount}`}
            </Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.cardList}>
        {visibleCards.map(item => (
          <Card key={item.route} item={item} onPress={onPress} />
        ))}
      </View>
    </View>
  );
}

export default function WesternHomeScreen({ navigation }: Props) {
  const { t, i18n } = useTranslation();

  const language = i18n.resolvedLanguage ?? i18n.language ?? 'en';

  const today = useMemo(() => getTodayText(language), [language]);

  const tr = (key: string, defaultValue: string) =>
    t(key, {
      defaultValue,
    });

  const navigateTo = (route: HomeRoute) => {
    navigation.navigate(route);
  };

  const todayCards: CardItem[] = [
    {
      route: 'DailyHoroscope',
      icon: '☉',
      title: tr('western.home.dailyHoroscope', 'Daily Horoscope'),
      subtitle: tr(
        'western.home.dailyHoroscopeSubtitle',
        'Guidance for love, career, money, and energy.',
      ),
      tone: 'gold',
    },
    {
      route: 'DailyRitual',
      icon: '✦',
      title: tr('lunaDailyRitual.homeTitle', 'Daily Ritual'),
      subtitle: tr(
        'lunaDailyRitual.homeSubtitle',
        'Check in, draw a card, breathe, journal, and keep your streak alive.',
      ),
      tone: 'moon',
    },
    {
      route: 'TarotReading',
      icon: '✦',
      title: tr('western.home.tarot', 'Tarot Reading'),
      subtitle: tr(
        'western.home.tarotSubtitle',
        'One-card or three-card reflective reading.',
      ),
      tone: 'rose',
    },
    {
      route: 'AskOracle',
      icon: '☉',
      title: tr('askOracle.homeTitle', 'Ask the Oracle'),
      subtitle: tr(
        'askOracle.homeSubtitle',
        'Ask a question and receive a reflective tarot message.',
      ),
      tone: 'purple',
    },

  ];

  const dailyGrowthCards: CardItem[] = [
    {
      route: 'DailyQuest',
      icon: '✦',
      title: tr('dailyQuest.homeTitle', 'Daily Quest'),
      subtitle: tr(
        'dailyQuest.homeSubtitle',
        'Complete small daily tasks to earn EXP and Moon Dust.',
      ),
      tone: 'gold',
    },
    {
      route: 'OracleJourney',
      icon: '✦',
      title: tr('journey.homeTitle', 'Guided Journey'),
      subtitle: tr(
        'journey.homeSubtitle',
        'Start a 7-day, 21-day, or 30-day reflective path.',
      ),
      tone: 'gold',
    },
    {
      route: 'MoodTracker',
      icon: '☁',
      title: tr('moodTracker.homeTitle', 'Mood Tracker'),
      subtitle: tr(
        'moodTracker.homeSubtitle',
        'Track mood and reveal weekly pattern insights.',
      ),
      tone: 'moon',
    },
    {
      route: 'WeeklyReport',
      icon: '☽',
      title: tr('weeklyReport.homeTitle', 'Weekly Report'),
      subtitle: tr(
        'weeklyReport.homeSubtitle',
        'Review your energy, tarot patterns, streak, and next action.',
      ),
      tone: 'moon',
    },
  ];

  const astrologyCards: CardItem[] = [
    {
      route: 'ZodiacProfile',
      icon: '♈',
      title: tr('western.home.zodiacProfile', 'Zodiac Profile'),
      subtitle: tr(
        'western.home.zodiacProfileSubtitle',
        'Sun sign, element, modality, strengths, and patterns.',
      ),
      tone: 'purple',
    },
    {
      route: 'YearMonthlyForecast',
      icon: '♃',
      title: tr('lunaForecast.homeTitle', 'Year / Monthly Forecast'),
      subtitle: tr(
        'lunaForecast.homeSubtitle',
        'See your yearly rhythm, monthly scores, opportunities, challenges, and action prompts.',
      ),
      tone: 'moon',
    },
    {
      route: 'MoonCalendar',
      icon: '☾',
      title: tr('western.home.moonCalendar', 'Moon Calendar'),
      subtitle: tr(
        'western.home.moonCalendarSubtitle',
        'New moon, full moon, intention, and release.',
      ),
      tone: 'moon',
    },
    {
      route: 'MonthlyEnergyCalendar',
      icon: '☽',
      title: tr('monthlyEnergy.homeTitle', 'Energy Calendar'),
      subtitle: tr(
        'monthlyEnergy.homeSubtitle',
        'Plan love, career, ritual, rest, and creative days.',
      ),
      tone: 'purple',
    },
  ];

  const tarotCards: CardItem[] = [
    {
      route: 'TarotLibrary',
      icon: '▣',
      title: tr('tarotLibrary.homeTitle', 'Tarot Library'),
      subtitle: tr(
        'tarotLibrary.homeSubtitle',
        'Collect, favorite, and track every tarot card you discover.',
      ),
      tone: 'purple',
    },
    {
      route: 'AdvancedTarotJournal',
      icon: '✎',
      title: tr('lunaTarotJournal.homeTitle', 'Advanced Tarot Journal'),
      subtitle: tr(
        'lunaTarotJournal.homeSubtitle',
        'Search, favorite, tag, and review repeated tarot themes.',
      ),
      tone: 'purple',
    },
    {
      route: 'PremiumDeepReading',
      icon: '◆',
      title: tr('premiumDeepReading.homeTitle', 'Premium Deep Reading'),
      subtitle: tr(
        'premiumDeepReading.homeSubtitle',
        'Unlock deeper tarot, love, yearly, and birth chart reports.',
      ),
      tone: 'gold',
    },
    {
      route: 'SocialShareTemplates',
      icon: '↗',
      title: tr('shareTemplates.homeTitle', 'Share Templates'),
      subtitle: tr(
        'shareTemplates.homeSubtitle',
        'Create story, square, quote, love, and weekly share images.',
      ),
      tone: 'rose',
    },
  ];

  const loveCards: CardItem[] = [
    {
      route: 'ZodiacCompatibility',
      icon: '♡',
      title: tr('western.home.compatibility', 'Compatibility'),
      subtitle: tr(
        'western.home.compatibilitySubtitle',
        'Compare signs through element and modality.',
      ),
      tone: 'moon',
    },
    {
      route: 'LoveModeAdvanced',
      icon: '♡',
      title: tr('loveMode.homeTitle', 'Advanced Love Mode'),
      subtitle: tr(
        'loveMode.homeSubtitle',
        'Venus, Mars, Moon, tarot, prompts, and relationship signals.',
      ),
      tone: 'rose',
    },
    {
      route: 'LoveCenter',
      icon: '♡',
      title: tr('lunaLoveCenter.homeTitle', 'Love Center'),
      subtitle: tr(
        'lunaLoveCenter.homeSubtitle',
        'Daily love insight, compatibility, relationship tarot, and Venus-Mars guidance.',
      ),
      tone: 'rose',
    },
    {
      route: 'RelationshipTimeline',
      icon: '♡',
      title: tr('relationshipTimeline.homeTitle', 'Relationship Timeline'),
      subtitle: tr(
        'relationshipTimeline.homeSubtitle',
        'Track relationship moments and reveal repeating patterns.',
      ),
      tone: 'rose',
    },
  ];

  const progressCards: CardItem[] = [
    {
      route: 'UserProgressHub',
      icon: '▲',
      title: tr('progressHub.homeTitle', 'Progress Hub'),
      subtitle: tr(
        'progressHub.homeSubtitle',
        'See Oracle level, journey, moods, dreams, and relationship progress.',
      ),
      tone: 'purple',
    },
    {
      route: 'OracleProgress',
      icon: '▲',
      title: tr('oracleLevel.homeTitle', 'Oracle Level'),
      subtitle: tr(
        'oracleLevel.homeSubtitle',
        'Level up from Seeker to Mystic Guide through daily practice.',
      ),
      tone: 'purple',
    },
    {
      route: 'MoonDustRewards',
      icon: '✦',
      title: tr('moonDust.homeTitle', 'Moon Dust'),
      subtitle: tr(
        'moonDust.homeSubtitle',
        'Claim daily rewards, keep your streak, and unlock mystical bonuses.',
      ),
      tone: 'gold',
    },
    {
      route: 'ThemeShop',
      icon: '◈',
      title: tr('oracleShop.homeTitle', 'Theme Shop'),
      subtitle: tr(
        'oracleShop.homeSubtitle',
        'Unlock themes and card backs with Moon Dust.',
      ),
      tone: 'gold',
    },
  ];

  const setupCards: CardItem[] = [
    {
      route: 'OracleGuides',
      icon: '◇',
      title: tr('oracleGuides.homeTitle', 'Oracle Guides'),
      subtitle: tr(
        'oracleGuides.homeSubtitle',
        'Unlock guide voices like Love Oracle, Shadow Guide, and Dream Oracle.',
      ),
      tone: 'gold',
    },
    {
      route: 'StreakAchievements',
      icon: '🏆',
      title: tr('lunaAchievements.homeTitle', 'Streak & Achievements'),
      subtitle: tr(
        'lunaAchievements.homeSubtitle',
        'Track your practice streak and unlock spiritual achievement badges.',
      ),
      tone: 'gold',
    },
    {
      route: 'SmartNotificationSettings',
      icon: '☽',
      title: tr('smartNotifications.homeTitle', 'Smart Reminders'),
      subtitle: tr(
        'smartNotifications.homeSubtitle',
        'Personalized reminders from your daily card, energy, and love signal.',
      ),
      tone: 'moon',
    },
  ];

  const journalCards: CardItem[] = [
    {
      route: 'PalmReadingIntro',
      icon: '✋',
      title: tr('palmReading.homeTitle', 'Palm Reading'),
      subtitle: tr(
        'palmReading.homeSubtitle',
        'Capture your palm and receive a reflective palmistry reading.',
      ),
      tone: 'gold',
    },
    {
      route: 'DreamJournal',
      icon: '✧',
      title: tr('dreamJournal.homeTitle', 'Dream Journal'),
      subtitle: tr(
        'dreamJournal.homeSubtitle',
        'Record dreams, symbols, waking mood, and interpretation.',
      ),
      tone: 'moon',
    },
    {
      route: 'AstroJournal',
      icon: '✎',
      title: tr('western.home.journal', 'Journal'),
      subtitle: tr(
        'western.home.journalSubtitle',
        'Save tarot pulls, moods, dreams, and reflections.',
      ),
      tone: 'gold',
    },
    {
      route: 'AstroGlossary',
      icon: 'A',
      title: tr('western.home.glossary', 'Astro Glossary'),
      subtitle: tr(
        'western.home.glossarySubtitle',
        'Learn signs, planets, houses, aspects, and tarot terms.',
      ),
      tone: 'purple',
    },
  ];

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#120B22" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ImageBackground
          source={HERO_IMAGE}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.topRow}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>☾</Text>
            </View>

            <View style={styles.brand}>
              <Text style={styles.brandLabel}>
                {tr('western.appName', 'Astro Tarot')}
              </Text>

              <Text style={styles.brandSub}>Zodiac • Tarot • Moon</Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.settingsButton,
                pressed && styles.pressed,
              ]}
              onPress={() => navigateTo('Settings')}
            >
              <Text style={styles.settingsText}>⚙</Text>
            </Pressable>
          </View>

          <View style={styles.heroCopy}>
            <Text style={styles.heroKicker}>{today}</Text>

            <Text style={styles.heroTitle}>
              {tr('western.heroTitle', 'Read the sky with a calm mind')}
            </Text>

            <Text style={styles.heroSubtitle}>
              {tr(
                'western.heroSubtitle',
                'Daily horoscope, zodiac profile, tarot reading, moon rhythm, and reflective journaling.',
              )}
            </Text>
          </View>

          <View style={styles.heroActions}>
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
              onPress={() => navigateTo('DailyHoroscope')}
            >
              <Text style={styles.primaryText}>
                {tr('western.openToday', 'Open Today')}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.pressed,
              ]}
              onPress={() => navigateTo('TarotReading')}
            >
              <Text style={styles.secondaryText}>
                {tr('western.drawCard', 'Draw a Card')}
              </Text>
            </Pressable>
          </View>
        </ImageBackground>

        <View style={styles.quickPanel}>
          <Pressable
            style={({ pressed }) => [
              styles.quickItem,
              pressed && styles.quickItemPressed,
            ]}
            onPress={() => navigateTo('TarotLibrary')}
          >
            <Text style={styles.quickValue}>78</Text>
            <Text style={styles.quickLabel}>Tarot Cards</Text>
          </Pressable>

          <View style={styles.quickDivider} />

          <Pressable
            style={({ pressed }) => [
              styles.quickItem,
              pressed && styles.quickItemPressed,
            ]}
            onPress={() => navigateTo('LoveModeAdvanced')}
          >
            <Text style={styles.quickValue}>♡</Text>
            <Text style={styles.quickLabel}>Love Mode</Text>
          </Pressable>

          <View style={styles.quickDivider} />

          <Pressable
            style={({ pressed }) => [
              styles.quickItem,
              pressed && styles.quickItemPressed,
            ]}
            onPress={() => navigateTo('SmartNotificationSettings')}
          >
            <Text style={styles.quickValue}>☽</Text>
            <Text style={styles.quickLabel}>Reminders</Text>
          </Pressable>
        </View>

        <View style={styles.dashboardWrap}>
          <OracleProgressCard />
        </View>

        <View style={styles.dashboardWrap}>
          <MoonDustMiniCard />
        </View>

        <View style={styles.mysticFeedWrap}>
          <MysticHomeFeed />
        </View>

        <Section
          eyebrow={tr('western.sections.mainEyebrow', 'Start Here')}
          title={tr('western.sections.mainTitle', 'Today & Core')}
          cards={todayCards}
          onPress={navigateTo}
        />

        <Section
          eyebrow={tr('dailyQuest.eyebrow', 'Daily Growth')}
          title={tr('dailyQuest.sectionTitle', 'Quests, Journey & Mood')}
          cards={dailyGrowthCards}
          onPress={navigateTo}
        />

        <Section
          eyebrow={tr('western.sections.astroEyebrow', 'Astrology')}
          title={tr('western.sections.astroTitle', 'Zodiac, Moon & Forecast')}
          cards={astrologyCards}
          onPress={navigateTo}
        />

        <Section
          eyebrow={tr('western.sections.tarotEyebrow', 'Tarot')}
          title={tr(
            'western.sections.tarotTitle',
            'Cards, Journal & Deep Reading',
          )}
          cards={tarotCards}
          onPress={navigateTo}
        />

        <Section
          eyebrow={tr('lunaLoveCenter.homeTitle', 'Love')}
          title={tr(
            'western.sections.loveTitle',
            'Compatibility & Relationship',
          )}
          cards={loveCards}
          onPress={navigateTo}
        />

        <Section
          eyebrow={tr('progressHub.eyebrow', 'Progress')}
          title={tr('western.sections.progressTitle', 'Rewards & Level')}
          cards={progressCards}
          onPress={navigateTo}
        />

        <Section
          eyebrow={tr('oracleGuides.eyebrow', 'Guides')}
          title={tr('western.sections.setupTitle', 'Guides, Streak & Reminders')}
          cards={setupCards}
          onPress={navigateTo}
        />

        <Section
          eyebrow={tr('western.sections.libraryEyebrow', 'Library')}
          title={tr(
            'western.sections.libraryTitle',
            'Palm, Dreams & Learning',
          )}
          cards={journalCards}
          onPress={navigateTo}
        />

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>
            {tr('western.noticeTitle', 'For reflection')}
          </Text>

          <Text style={styles.noticeText}>
            {tr(
              'western.noticeText',
              'Astrology and tarot content is for cultural reflection and self-awareness. It should not replace professional advice.',
            )}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F2EA',
  },

  content: {
    paddingBottom: 120,
  },

  hero: {
    minHeight: 382,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 22,
    justifyContent: 'space-between',
  },

  heroImage: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(217,183,110,0.45)',
    borderRadius: 16,
  },

  logoText: {
    color: '#E8E2FF',
    fontSize: 24,
    fontWeight: '900',
  },

  brand: {
    flex: 1,
    marginLeft: 12,
  },

  brandLabel: {
    color: '#F8EBCB',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  brandSub: {
    color: '#C9BFEA',
    fontSize: 10,
    marginTop: 3,
  },

  settingsButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
  },

  settingsText: {
    color: '#F8EBCB',
    fontSize: 18,
  },

  heroCopy: {
    marginTop: 58,
    maxWidth: 340,
  },

  heroKicker: {
    color: '#D9B76E',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'capitalize',
  },

  heroTitle: {
    color: '#FFF8EA',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    marginTop: 8,
  },

  heroSubtitle: {
    color: '#E9E4F5',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 9,
  },

  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
  },

  primaryButton: {
    minHeight: 44,
    justifyContent: 'center',
    backgroundColor: '#D9B76E',
    borderRadius: 15,
    paddingHorizontal: 17,
    marginRight: 10,
  },

  primaryText: {
    color: '#1B1537',
    fontSize: 11,
    fontWeight: '900',
  },

  secondaryButton: {
    minHeight: 44,
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: 15,
    paddingHorizontal: 17,
  },

  secondaryText: {
    color: '#FFF8EA',
    fontSize: 11,
    fontWeight: '900',
  },

  quickPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E9DCC5',
    borderRadius: 22,
    marginHorizontal: 18,
    marginTop: -26,
    paddingVertical: 13,
    shadowColor: '#20132F',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 4,
  },

  quickItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 58,
  },

  quickItemPressed: {
    opacity: 0.72,
  },

  quickValue: {
    color: '#6E4DA8',
    fontSize: 18,
    fontWeight: '900',
  },

  quickLabel: {
    color: '#7B7185',
    fontSize: 9.5,
    fontWeight: '800',
    marginTop: 4,
  },

  quickDivider: {
    width: 1,
    height: 38,
    backgroundColor: '#E9DCC5',
  },

  dashboardWrap: {
    paddingHorizontal: 18,
  },

  mysticFeedWrap: {
    paddingHorizontal: 18,
  },

  section: {
    paddingHorizontal: 18,
    marginTop: 28,
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionHeaderCopy: {
    flex: 1,
  },

  showMoreButton: {
    minHeight: 34,
    justifyContent: 'center',
    backgroundColor: '#EEE6F4',
    borderRadius: 999,
    paddingHorizontal: 12,
    marginLeft: 12,
  },

  showMoreText: {
    color: '#6E4DA8',
    fontSize: 11,
    fontWeight: '900',
  },

  eyebrow: {
    color: '#9A7939',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  sectionTitle: {
    color: '#282236',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 3,
  },

  cardList: {},

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 82,
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E9DCC5',
    borderRadius: 19,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },

  cardIcon: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },

  cardIconText: {
    fontSize: 22,
    fontWeight: '900',
  },

  cardCopy: {
    flex: 1,
    marginLeft: 13,
  },

  cardTitle: {
    color: '#282236',
    fontSize: 14.5,
    fontWeight: '900',
  },

  cardSubtitle: {
    color: '#756D7D',
    fontSize: 10.5,
    lineHeight: 16,
    marginTop: 4,
  },

  arrow: {
    color: '#9C8FAA',
    fontSize: 24,
    fontWeight: '800',
    marginLeft: 8,
  },

  notice: {
    backgroundColor: '#EEE6F4',
    borderWidth: 1,
    borderColor: '#DED0E9',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 18,
    marginTop: 22,
  },

  noticeTitle: {
    color: '#4D405E',
    fontSize: 13,
    fontWeight: '900',
  },

  noticeText: {
    color: '#74677F',
    fontSize: 11,
    lineHeight: 18,
    marginTop: 5,
  },

  pressed: {
    opacity: 0.76,
    transform: [
      {
        scale: 0.99,
      },
    ],
  },
  moonDustWrap: {
    paddingHorizontal: 18,
  },
  oracleProgressWrap: {
    paddingHorizontal: 18,
  },
});
