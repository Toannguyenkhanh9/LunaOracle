import React, {
  useMemo,
} from 'react';

import {
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useTranslation,
} from 'react-i18next';

type HomeRoute =
  | 'DailyHoroscope'
  | 'ZodiacProfile'
  | 'TarotReading'
  | 'ZodiacCompatibility'
  | 'MoonCalendar'
  | 'AstroGlossary'
  | 'AstroJournal'
  | 'Settings';

type Props = {
  navigation: {
    navigate: (
      route: string,
      params?: Record<
        string,
        unknown
      >,
    ) => void;
  };
};

type CardItem = {
  route: HomeRoute;
  icon: string;
  title: string;
  subtitle: string;
  tone: 'purple' | 'gold' | 'moon' | 'rose';
};

const HERO_IMAGE =
  require('../assets/images/home/western_home_hero.png');

function getTodayText(
  language: string,
): string {
  try {
    return new Intl.DateTimeFormat(
      language,
      {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
      },
    ).format(new Date());
  } catch {
    return new Date().toLocaleDateString();
  }
}

function getTone(
  tone: CardItem['tone'],
) {
  switch (tone) {
    case 'gold':
      return {
        backgroundColor:
          'rgba(217,183,110,0.16)',
        color: '#B8872E',
      };

    case 'moon':
      return {
        backgroundColor:
          'rgba(232,226,255,0.22)',
        color: '#6F65A8',
      };

    case 'rose':
      return {
        backgroundColor:
          'rgba(220,110,150,0.13)',
        color: '#A74372',
      };

    case 'purple':
    default:
      return {
        backgroundColor:
          'rgba(110,77,168,0.14)',
        color: '#6E4DA8',
      };
  }
}

function Card({
  item,
  onPress,
}: {
  item: CardItem;
  onPress: (
    route: HomeRoute,
  ) => void;
}) {
  const tone =
    getTone(item.tone);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.title}
      style={({pressed}) => [
        styles.card,
        pressed && styles.pressed,
      ]}
      onPress={() =>
        onPress(item.route)
      }>
      <View
        style={[
          styles.cardIcon,
          {
            backgroundColor:
              tone.backgroundColor,
          },
        ]}>
        <Text
          style={[
            styles.cardIconText,
            {
              color: tone.color,
            },
          ]}>
          {item.icon}
        </Text>
      </View>

      <View style={styles.cardCopy}>
        <Text
          style={styles.cardTitle}
          numberOfLines={1}>
          {item.title}
        </Text>

        <Text
          style={styles.cardSubtitle}
          numberOfLines={2}>
          {item.subtitle}
        </Text>
      </View>

      <Text style={styles.arrow}>
        ›
      </Text>
    </Pressable>
  );
}

function Section({
  eyebrow,
  title,
  cards,
  onPress,
}: {
  eyebrow: string;
  title: string;
  cards: CardItem[];
  onPress: (
    route: HomeRoute,
  ) => void;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.eyebrow}>
        {eyebrow}
      </Text>

      <Text style={styles.sectionTitle}>
        {title}
      </Text>

      <View style={styles.cardList}>
        {cards.map(item => (
          <Card
            key={item.route}
            item={item}
            onPress={onPress}
          />
        ))}
      </View>
    </View>
  );
}

export default function WesternHomeScreen({
  navigation,
}: Props) {
  const {t, i18n} =
    useTranslation();

  const language =
    i18n.resolvedLanguage ??
    i18n.language ??
    'en';

  const today =
    useMemo(
      () => getTodayText(language),
      [language],
    );

  const tr = (
    key: string,
    defaultValue: string,
  ) =>
    t(key, {
      defaultValue,
    });

  const navigateTo = (
    route: HomeRoute,
  ) => {
    navigation.navigate(route);
  };

  const mainCards: CardItem[] = [
    {
      route: 'DailyHoroscope',
      icon: '☉',
      title: tr(
        'western.home.dailyHoroscope',
        'Daily Horoscope',
      ),
      subtitle: tr(
        'western.home.dailyHoroscopeSubtitle',
        'Guidance for love, career, money, and energy.',
      ),
      tone: 'gold',
    },
    {
      route: 'ZodiacProfile',
      icon: '♈',
      title: tr(
        'western.home.zodiacProfile',
        'Zodiac Profile',
      ),
      subtitle: tr(
        'western.home.zodiacProfileSubtitle',
        'Sun sign, element, modality, strengths, and patterns.',
      ),
      tone: 'purple',
    },
    {
      route: 'TarotReading',
      icon: '✦',
      title: tr(
        'western.home.tarot',
        'Tarot Reading',
      ),
      subtitle: tr(
        'western.home.tarotSubtitle',
        'One-card or three-card reflective reading.',
      ),
      tone: 'rose',
    },
    {
      route: 'ZodiacCompatibility',
      icon: '♡',
      title: tr(
        'western.home.compatibility',
        'Compatibility',
      ),
      subtitle: tr(
        'western.home.compatibilitySubtitle',
        'Compare signs through element and modality.',
      ),
      tone: 'moon',
    },
  ];

  const extraCards: CardItem[] = [
    {
      route: 'MoonCalendar',
      icon: '☾',
      title: tr(
        'western.home.moonCalendar',
        'Moon Calendar',
      ),
      subtitle: tr(
        'western.home.moonCalendarSubtitle',
        'New moon, full moon, intention, and release.',
      ),
      tone: 'moon',
    },
    {
      route: 'AstroGlossary',
      icon: 'A',
      title: tr(
        'western.home.glossary',
        'Astro Glossary',
      ),
      subtitle: tr(
        'western.home.glossarySubtitle',
        'Learn signs, planets, houses, aspects, and tarot terms.',
      ),
      tone: 'purple',
    },
    {
      route: 'AstroJournal',
      icon: '✎',
      title: tr(
        'western.home.journal',
        'Journal',
      ),
      subtitle: tr(
        'western.home.journalSubtitle',
        'Save tarot pulls, moods, dreams, and reflections.',
      ),
      tone: 'gold',
    },
  ];

  return (
    <SafeAreaView
      edges={['top']}
      style={styles.screen}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#120B22"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }>
        <ImageBackground
          source={HERO_IMAGE}
          style={styles.hero}
          imageStyle={styles.heroImage}>
          <View style={styles.topRow}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>
                ☾
              </Text>
            </View>

            <View style={styles.brand}>
              <Text style={styles.brandLabel}>
                {tr(
                  'western.appName',
                  'Astro Tarot',
                )}
              </Text>

              <Text style={styles.brandSub}>
                Zodiac • Tarot • Moon
              </Text>
            </View>

            <Pressable
              style={({pressed}) => [
                styles.settingsButton,
                pressed &&
                  styles.pressed,
              ]}
              onPress={() =>
                navigateTo(
                  'Settings',
                )
              }>
              <Text style={styles.settingsText}>
                ⚙
              </Text>
            </Pressable>
          </View>

          <View style={styles.heroCopy}>
            <Text style={styles.heroKicker}>
              {today}
            </Text>

            <Text style={styles.heroTitle}>
              {tr(
                'western.heroTitle',
                'Read the sky with a calm mind',
              )}
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
              style={({pressed}) => [
                styles.primaryButton,
                pressed &&
                  styles.pressed,
              ]}
              onPress={() =>
                navigateTo(
                  'DailyHoroscope',
                )
              }>
              <Text style={styles.primaryText}>
                {tr(
                  'western.openToday',
                  'Open Today',
                )}
              </Text>
            </Pressable>

            <Pressable
              style={({pressed}) => [
                styles.secondaryButton,
                pressed &&
                  styles.pressed,
              ]}
              onPress={() =>
                navigateTo(
                  'TarotReading',
                )
              }>
              <Text style={styles.secondaryText}>
                {tr(
                  'western.drawCard',
                  'Draw a Card',
                )}
              </Text>
            </Pressable>
          </View>
        </ImageBackground>

        <View style={styles.quickPanel}>
          <View style={styles.quickItem}>
            <Text style={styles.quickValue}>
              12
            </Text>
            <Text style={styles.quickLabel}>
              Zodiac Signs
            </Text>
          </View>

          <View style={styles.quickDivider} />

          <View style={styles.quickItem}>
            <Text style={styles.quickValue}>
              3
            </Text>
            <Text style={styles.quickLabel}>
              Card Spread
            </Text>
          </View>

          <View style={styles.quickDivider} />

          <View style={styles.quickItem}>
            <Text style={styles.quickValue}>
              ☾
            </Text>
            <Text style={styles.quickLabel}>
              Moon Ritual
            </Text>
          </View>
        </View>

        <Section
          eyebrow={tr(
            'western.sections.mainEyebrow',
            'Start Here',
          )}
          title={tr(
            'western.sections.mainTitle',
            'Astrology & Tarot',
          )}
          cards={mainCards}
          onPress={navigateTo}
        />

        <Section
          eyebrow={tr(
            'western.sections.libraryEyebrow',
            'Library',
          )}
          title={tr(
            'western.sections.libraryTitle',
            'Learn & Reflect',
          )}
          cards={extraCards}
          onPress={navigateTo}
        />

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>
            {tr(
              'western.noticeTitle',
              'For reflection',
            )}
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
    backgroundColor:
      'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor:
      'rgba(217,183,110,0.45)',
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
    backgroundColor:
      'rgba(255,255,255,0.1)',
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
    backgroundColor:
      'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.16)',
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

  section: {
    paddingHorizontal: 18,
    marginTop: 28,
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
    marginBottom: 12,
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
});
