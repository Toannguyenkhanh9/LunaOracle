import React, {
  useCallback,
  useMemo,
} from 'react';

import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type {
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useTranslation,
} from 'react-i18next';

import type {
  RootTabParamList,
} from '../navigation/RootNavigator';

import {
  isHomeWidgetNativeAvailable,
  refreshHomeWidget,
} from '../services/homeWidget';

import {
  refreshSmartNotificationsIfNeeded,
} from '../services/smartNotifications';

type Props = BottomTabScreenProps<
  RootTabParamList,
  'Home'
>;

type HomeRoute =
  | 'Today'
  | 'LunarCalendar'
  | 'BuddhistCalendar'
  | 'FortuneStick'
  | 'Horoscope'
  | 'BaziChart'
  | 'BaziHistory'
  | 'UserProfiles'
  | 'RecentlyViewed'
  | 'BookmarksNotes'
  | 'LifeTimeline'
  | 'AdvancedCompatibility'
  | 'ExpertMode'
  | 'DailyBrief'
  | 'MonthlyReview'
  | 'SmartNotifications'
  | 'Glossary'
  | 'BaziStage4'
  | 'ZiweiChart'
  | 'Settings';

type HomeCard = {
  route: HomeRoute;
  icon: string;
  title: string;
  subtitle: string;
  accent: string;
  image?: ImageSourcePropType;
};

type HomeSectionProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  cards: HomeCard[];
  onPress: (
    route: HomeRoute,
  ) => void;
};

const HERO_IMAGE =
  require('../assets/images/home/eastern_home_hero.png');

const COMPASS_IMAGE =
  require('../assets/images/home/eastern_compass.png');

const BAZI_ART =
  require('../assets/images/home/home_bazi_art.png');

const ZIWEI_ART =
  require('../assets/images/home/home_ziwei_art.png');

const TODAY_ART =
  require('../assets/images/home/home_today_art.png');

const LIBRARY_ART =
  require('../assets/images/home/home_library_art.png');

function getGreetingKey(): string {
  const hour =
    new Date().getHours();

  if (hour < 11) {
    return 'astrologyHome.greetingMorning';
  }

  if (hour < 18) {
    return 'astrologyHome.greetingAfternoon';
  }

  return 'astrologyHome.greetingEvening';
}

function formatCurrentDate(
  language: string,
): string {
  try {
    return new Intl.DateTimeFormat(
      language,
      {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    ).format(new Date());
  } catch {
    return new Date().toLocaleDateString();
  }
}

function FeatureCard({
  item,
  onPress,
}: {
  item: HomeCard;
  onPress: (
    route: HomeRoute,
  ) => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        item.title
      }
      style={({pressed}) => [
        styles.featureCard,
        pressed &&
          styles.pressed,
      ]}
      onPress={() =>
        onPress(item.route)
      }>
      <View
        style={[
          styles.featureIconWrap,
          {
            backgroundColor:
              item.accent,
          },
        ]}>
        <Text style={styles.featureIcon}>
          {item.icon}
        </Text>
      </View>

      <View style={styles.featureCopy}>
        <Text
          style={styles.featureTitle}
          numberOfLines={2}>
          {item.title}
        </Text>

        <Text
          style={
            styles.featureSubtitle
          }
          numberOfLines={3}>
          {item.subtitle}
        </Text>
      </View>

      <View style={styles.featureArrowWrap}>
        <Text
          style={
            styles.featureArrow
          }>
          ›
        </Text>
      </View>
    </Pressable>
  );
}

function PrimaryFeatureCard({
  item,
  onPress,
}: {
  item: HomeCard;
  onPress: (
    route: HomeRoute,
  ) => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        item.title
      }
      style={({pressed}) => [
        styles.primaryCard,
        pressed &&
          styles.pressed,
      ]}
      onPress={() =>
        onPress(item.route)
      }>
      {item.image ? (
        <ImageBackground
          source={item.image}
          style={styles.primaryImage}
          imageStyle={
            styles.primaryImageStyle
          }>
          <View
            style={
              styles.primaryShade
            }
          />

          <View
            style={[
              styles.primaryIconWrap,
              {
                backgroundColor:
                  item.accent,
              },
            ]}>
            <Text
              style={
                styles.primaryIcon
              }>
              {item.icon}
            </Text>
          </View>
        </ImageBackground>
      ) : (
        <View
          style={[
            styles.primaryImage,
            styles.primaryFallback,
          ]}>
          <Text
            style={
              styles.primaryFallbackIcon
            }>
            {item.icon}
          </Text>
        </View>
      )}

      <View style={styles.primaryBody}>
        <Text
          style={styles.primaryTitle}
          numberOfLines={2}>
          {item.title}
        </Text>

        <Text
          style={
            styles.primarySubtitle
          }
          numberOfLines={3}>
          {item.subtitle}
        </Text>

        <View
          style={
            styles.primaryFooter
          }>
          <Text
            style={
              styles.primaryOpen
            }>
            開
          </Text>

          <Text
            style={
              styles.primaryArrow
            }>
            ›
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function HomeSection({
  eyebrow,
  title,
  subtitle,
  cards,
  onPress,
}: HomeSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View>
          <Text
            style={
              styles.sectionEyebrow
            }>
            {eyebrow}
          </Text>

          <Text
            style={
              styles.sectionTitle
            }>
            {title}
          </Text>
        </View>

        <View
          style={
            styles.sectionSeal
          }>
          <Text
            style={
              styles.sectionSealText
            }>
            東
          </Text>
        </View>
      </View>

      <Text
        style={
          styles.sectionSubtitle
        }>
        {subtitle}
      </Text>

      <View style={styles.featureGrid}>
        {cards.map(item => (
          <FeatureCard
            key={item.route}
            item={item}
            onPress={onPress}
          />
        ))}
      </View>
    </View>
  );
}

export default function HomeScreen({
  navigation,
}: Props) {
  const {t, i18n} =
    useTranslation();

  const language =
    i18n.resolvedLanguage ??
    i18n.language ??
    'en';

  const currentDate = useMemo(
    () =>
      formatCurrentDate(
        language,
      ),
    [language],
  );

  useFocusEffect(
    useCallback(() => {
      if (
        isHomeWidgetNativeAvailable()
      ) {
        void refreshHomeWidget(
          language,
        ).catch(() =>
          false,
        );
      }

      void refreshSmartNotificationsIfNeeded(
        language,
      ).catch(() =>
        false,
      );
    }, [language]),
  );

  const navigateTo = (
    route: HomeRoute,
  ) => {
    navigation.navigate(
      route as never,
    );
  };

  const tr = (
    key: string,
    defaultValue: string,
  ) =>
    t(key, {
      defaultValue,
    });

  const mainCards: HomeCard[] = [
    {
      route: 'BaziChart',
      icon: '☯',
      title: tr(
        'astrologyHome.cards.baziTitle',
        'BaZi Chart',
      ),
      subtitle: tr(
        'astrologyHome.cards.baziSubtitle',
        'Four Pillars, elements, luck cycles, and interpretation.',
      ),
      accent: '#F0D18B',
      image: BAZI_ART,
    },
    {
      route: 'ZiweiChart',
      icon: '紫',
      title: tr(
        'astrologyHome.cards.ziweiTitle',
        'Zi Wei Dou Shu',
      ),
      subtitle: tr(
        'astrologyHome.cards.ziweiSubtitle',
        'Twelve palaces, main stars, transformations, and cycles.',
      ),
      accent: '#EAD7FF',
      image: ZIWEI_ART,
    },
    {
      route: 'Horoscope',
      icon: '日',
      title: tr(
        'astrologyHome.cards.auspiciousTitle',
        'Auspicious Dates',
      ),
      subtitle: tr(
        'astrologyHome.cards.auspiciousSubtitle',
        'Find reference dates for important activities.',
      ),
      accent: '#D9E9D4',
      image: TODAY_ART,
    },
    {
      route: 'BaziStage4',
      icon: '合',
      title: tr(
        'astrologyHome.cards.compatibilityTitle',
        'Timing & Compatibility',
      ),
      subtitle: tr(
        'astrologyHome.cards.compatibilitySubtitle',
        'Compare charts, read timing, and review relationship flow.',
      ),
      accent: '#F1D2C2',
      image: LIBRARY_ART,
    },
  ];

  const dailyCards: HomeCard[] = [
    {
      route: 'Today',
      icon: '☀',
      title: tr(
        'today.title',
        'Today',
      ),
      subtitle: tr(
        'today.homeSubtitle',
        'Daily timing, lunar date, and practical reminders.',
      ),
      accent: '#F3DBA2',
    },
    {
      route: 'DailyBrief',
      icon: '☾',
      title: tr(
        'dailyBrief.title',
        'Daily Brief',
      ),
      subtitle: tr(
        'dailyBrief.homeSubtitle',
        'A concise lunar-date, sexagenary, and profile-based briefing.',
      ),
      accent: '#E8D3A0',
    },
    {
      route: 'LunarCalendar',
      icon: '月',
      title: tr(
        'astrologyHome.cards.lunarTitle',
        'Lunar Calendar',
      ),
      subtitle: tr(
        'astrologyHome.cards.lunarSubtitle',
        'Follow lunar dates, new moons, full moons, and seasonal rhythm.',
      ),
      accent: '#D4E1EA',
    },
    {
      route: 'BuddhistCalendar',
      icon: '節',
      title: tr(
        'astrologyHome.cards.holidayTitle',
        'Observance Days',
      ),
      subtitle: tr(
        'astrologyHome.cards.holidaySubtitle',
        'View common observance days and cultural reference dates.',
      ),
      accent: '#E6D8BA',
    },
  ];

  const profileCards: HomeCard[] = [
    {
      route: 'UserProfiles',
      icon: '人',
      title: tr(
        'userProfiles.title',
        'Profiles',
      ),
      subtitle: tr(
        'userProfiles.subtitle',
        'Create and manage birth profiles for your readings.',
      ),
      accent: '#D7E4EB',
    },
    {
      route: 'BaziHistory',
      icon: '冊',
      title: tr(
        'astrologyHome.cards.savedTitle',
        'Saved Charts',
      ),
      subtitle: tr(
        'astrologyHome.cards.savedSubtitle',
        'Review and manage saved BaZi charts.',
      ),
      accent: '#DDE8D6',
    },
    {
      route: 'RecentlyViewed',
      icon: '◷',
      title: tr(
        'insightFeatures.home.cards.recentTitle',
        'Recently Viewed',
      ),
      subtitle: tr(
        'insightFeatures.home.cards.recentSubtitle',
        'Return to readings and tools you opened recently.',
      ),
      accent: '#D4E2EE',
    },
    {
      route: 'BookmarksNotes',
      icon: '☆',
      title: tr(
        'insightFeatures.home.cards.libraryTitle',
        'Bookmarks & Notes',
      ),
      subtitle: tr(
        'insightFeatures.home.cards.librarySubtitle',
        'Save useful insights and add personal notes.',
      ),
      accent: '#EFE0BD',
    },
  ];

  const insightCards: HomeCard[] = [
    {
      route: 'LifeTimeline',
      icon: '流',
      title: tr(
        'insightFeatures.home.cards.timelineTitle',
        'Life Timeline',
      ),
      subtitle: tr(
        'insightFeatures.home.cards.timelineSubtitle',
        'Review yearly rhythm and record real life events.',
      ),
      accent: '#DDE8D8',
    },
    {
      route: 'AdvancedCompatibility',
      icon: '緣',
      title: tr(
        'insightFeatures.home.cards.compatibilityTitle',
        'Compatibility',
      ),
      subtitle: tr(
        'insightFeatures.home.cards.compatibilitySubtitle',
        'Compare two profiles through multiple reference dimensions.',
      ),
      accent: '#E8DAEC',
    },
    {
      route: 'ExpertMode',
      icon: '玄',
      title: tr(
        'expertMode.home.title',
        'Expert Mode',
      ),
      subtitle: tr(
        'expertMode.home.subtitle',
        'Show technical factors, raw codes, and calculation details.',
      ),
      accent: '#DDE2EC',
    },
    {
      route: 'MonthlyReview',
      icon: '録',
      title: tr(
        'monthlyReview.title',
        'Monthly Review',
      ),
      subtitle: tr(
        'monthlyReview.homeSubtitle',
        'Review events, notes, bookmarks, and usage habits.',
      ),
      accent: '#DDE8E4',
    },
    {
      route: 'SmartNotifications',
      icon: '鈴',
      title: tr(
        'smartNotifications.title',
        'Widget & Notifications',
      ),
      subtitle: tr(
        'smartNotifications.homeSubtitle',
        'Schedule Daily Brief, Monthly Review, and refresh the Widget.',
      ),
      accent: '#E6DDED',
    },
    {
      route: 'Glossary',
      icon: '字',
      title: tr(
        'glossary.title',
        'Glossary',
      ),
      subtitle: tr(
        'glossary.homeSubtitle',
        'Learn core Eastern destiny terms in simple language.',
      ),
      accent: '#EFE1C7',
    },
  ];

  return (
    <SafeAreaView
      edges={['top']}
      style={styles.screen}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          COLORS.ink
        }
      />

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }>
        <ImageBackground
          source={HERO_IMAGE}
          style={styles.hero}
          imageStyle={styles.heroImage}>
          <View
            pointerEvents="none"
            style={
              styles.heroRedGlow
            }
          />

          <View
            pointerEvents="none"
            style={
              styles.heroGoldGlow
            }
          />

          <Image
            pointerEvents="none"
            source={COMPASS_IMAGE}
            style={styles.heroCompass}
          />

          <View style={styles.heroTopRow}>
            <View style={styles.brandSeal}>
              <Text
                style={
                  styles.brandSealText
                }>
                命
              </Text>
            </View>

            <View style={styles.brandTextWrap}>
              <Text
                style={
                  styles.brandCategoryText
                }>
                {tr(
                  'astrologyHome.brandCategory',
                  'Eastern Destiny',
                )}
              </Text>

              <Text style={styles.brandTiny}>
                天 • 地 • 人
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={tr(
                'astrologyHome.settings',
                'Settings',
              )}
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
              <Text
                style={
                  styles.settingsIcon
                }>
                ⚙
              </Text>
            </Pressable>
          </View>

          <View style={styles.heroCopy}>
            <Text style={styles.greeting}>
              {tr(
                getGreetingKey(),
                'Welcome back',
              )}
            </Text>

            <Text style={styles.appName}>
              {tr(
                'astrologyHome.appName',
                'Eastern Destiny',
              )}
            </Text>

            <Text
              style={
                styles.brandDescriptor
              }>
              {tr(
                'astrologyHome.brandDescriptor',
                'Eastern wisdom for modern reflection',
              )}
            </Text>

            <Text
              style={
                styles.appTagline
              }>
              {tr(
                'astrologyHome.appTagline',
                'Explore BaZi, Zi Wei, lunar timing, compatibility, and personal reflection in one calm space.',
              )}
            </Text>
          </View>

          <View style={styles.heroActions}>
            <Pressable
              accessibilityRole="button"
              style={({pressed}) => [
                styles.heroPrimaryButton,
                pressed &&
                  styles.pressed,
              ]}
              onPress={() =>
                navigateTo(
                  'BaziChart',
                )
              }>
              <Text
                style={
                  styles.heroPrimaryText
                }>
                {tr(
                  'astrologyHome.cards.baziTitle',
                  'BaZi Chart',
                )}
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              style={({pressed}) => [
                styles.heroSecondaryButton,
                pressed &&
                  styles.pressed,
              ]}
              onPress={() =>
                navigateTo(
                  'Today',
                )
              }>
              <Text
                style={
                  styles.heroSecondaryText
                }>
                {tr(
                  'today.openToday',
                  'Open Today',
                )}
              </Text>
            </Pressable>
          </View>

          <View style={styles.todayCard}>
            <View style={styles.todaySymbol}>
              <Text
                style={
                  styles.todaySymbolText
                }>
                ☾
              </Text>
            </View>

            <View style={styles.todayTextWrap}>
              <Text
                style={
                  styles.todayEyebrow
                }>
                {tr(
                  'astrologyHome.today',
                  'Today',
                )}
              </Text>

              <Text
                style={
                  styles.todayDate
                }
                numberOfLines={2}>
                {currentDate}
              </Text>
            </View>

            <View style={styles.todayPill}>
              <Text style={styles.todayPillText}>
                吉
              </Text>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.floatingPanel}>
          <View style={styles.panelHeaderRow}>
            <View>
              <Text style={styles.panelEyebrow}>
                {tr(
                  'astrologyHome.insightTitle',
                  'Daily Insight',
                )}
              </Text>

              <Text style={styles.panelTitle}>
                {tr(
                  'dailyBrief.title',
                  'Daily Brief',
                )}
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              style={({pressed}) => [
                styles.panelButton,
                pressed &&
                  styles.pressed,
              ]}
              onPress={() =>
                navigateTo(
                  'DailyBrief',
                )
              }>
              <Text
                style={
                  styles.panelButtonText
                }>
                {tr(
                  'today.openToday',
                  'Open',
                )}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.panelText}>
            {tr(
              'astrologyHome.insightText',
              'Use today as a quiet reference point. Read the rhythm, then choose one grounded action.',
            )}
          </Text>

          <View style={styles.quickRow}>
            <Pressable
              style={({pressed}) => [
                styles.quickChip,
                pressed &&
                  styles.pressed,
              ]}
              onPress={() =>
                navigateTo(
                  'UserProfiles',
                )
              }>
              <Text
                style={
                  styles.quickChipIcon
                }>
                人
              </Text>
              <Text
                style={
                  styles.quickChipText
                }>
                {tr(
                  'userProfiles.title',
                  'Profiles',
                )}
              </Text>
            </Pressable>

            <Pressable
              style={({pressed}) => [
                styles.quickChip,
                pressed &&
                  styles.pressed,
              ]}
              onPress={() =>
                navigateTo(
                  'Glossary',
                )
              }>
              <Text
                style={
                  styles.quickChipIcon
                }>
                字
              </Text>
              <Text
                style={
                  styles.quickChipText
                }>
                {tr(
                  'glossary.title',
                  'Glossary',
                )}
              </Text>
            </Pressable>

            <Pressable
              style={({pressed}) => [
                styles.quickChip,
                pressed &&
                  styles.pressed,
              ]}
              onPress={() =>
                navigateTo(
                  'AdvancedCompatibility',
                )
              }>
              <Text
                style={
                  styles.quickChipIcon
                }>
                緣
              </Text>
              <Text
                style={
                  styles.quickChipText
                }>
                {tr(
                  'insightFeatures.home.cards.compatibilityTitle',
                  'Compatibility',
                )}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text
                style={
                  styles.sectionEyebrow
                }>
                {tr(
                  'astrologyHome.mainEyebrow',
                  'Core Tools',
                )}
              </Text>

              <Text
                style={
                  styles.sectionTitle
                }>
                {tr(
                  'astrologyHome.mainTitle',
                  'Destiny Calculators',
                )}
              </Text>
            </View>

            <View
              style={
                styles.sectionSeal
              }>
              <Text
                style={
                  styles.sectionSealText
                }>
                命
              </Text>
            </View>
          </View>

          <Text
            style={
              styles.sectionSubtitle
            }>
            {tr(
              'astrologyHome.mainSubtitle',
              'Start with the main Eastern destiny charts and timing tools.',
            )}
          </Text>

          <View style={styles.primaryGrid}>
            {mainCards.map(item => (
              <PrimaryFeatureCard
                key={item.route}
                item={item}
                onPress={navigateTo}
              />
            ))}
          </View>
        </View>

        <HomeSection
          eyebrow={tr(
            'astrologyHome.calendarEyebrow',
            'Time & Calendar',
          )}
          title={tr(
            'astrologyHome.calendarTitle',
            'Today’s Rhythm',
          )}
          subtitle={tr(
            'astrologyHome.calendarSubtitle',
            'Follow lunar dates, seasonal markers, observance days, and daily guidance.',
          )}
          cards={dailyCards}
          onPress={navigateTo}
        />

        <HomeSection
          eyebrow={tr(
            'astrologyHome.profileEyebrow',
            'Profiles',
          )}
          title={tr(
            'astrologyHome.profileTitle',
            'Personal Archive',
          )}
          subtitle={tr(
            'astrologyHome.profileSubtitle',
            'Keep profiles, saved charts, notes, and reading history together.',
          )}
          cards={profileCards}
          onPress={navigateTo}
        />

        <HomeSection
          eyebrow={tr(
            'insightFeatures.home.eyebrow',
            'Library & Insights',
          )}
          title={tr(
            'insightFeatures.home.title',
            'Deeper Reflection',
          )}
          subtitle={tr(
            'insightFeatures.home.subtitle',
            'Compare, explain, review, and learn through your saved data.',
          )}
          cards={insightCards}
          onPress={navigateTo}
        />

        <View style={styles.disclaimerCard}>
          <View style={styles.disclaimerSeal}>
            <Text
              style={
                styles.disclaimerSealText
              }>
              和
            </Text>
          </View>

          <View style={styles.disclaimerCopy}>
            <Text
              style={
                styles.disclaimerTitle
              }>
              {tr(
                'astrologyHome.disclaimerTitle',
                'For reflection',
              )}
            </Text>

            <Text
              style={
                styles.disclaimerText
              }>
              {tr(
                'astrologyHome.disclaimerText',
                'Results are cultural references for reflection and should not replace professional advice or real-world decisions.',
              )}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const COLORS = {
  ink: '#130D16',
  inkBlue: '#102435',
  oxblood: '#4A111D',
  cinnabar: '#9A2F24',
  gold: '#D7AF5E',
  paleGold: '#F2D38A',
  jade: '#557A68',
  cream: '#F6F0E4',
  rice: '#FFF9EC',
  paper: '#FFFCF4',
  text: '#2A2520',
  muted: '#746B5D',
  border: '#E2D3B8',
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor:
      COLORS.cream,
  },

  content: {
    paddingBottom: 134,
  },

  hero: {
    overflow: 'hidden',
    minHeight: 535,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    justifyContent: 'space-between',
  },

  heroImage: {
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },

  heroRedGlow: {
    position: 'absolute',
    left: -115,
    top: 105,
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor:
      'rgba(154,47,36,0.33)',
  },

  heroGoldGlow: {
    position: 'absolute',
    right: -90,
    top: -65,
    width: 265,
    height: 265,
    borderRadius: 133,
    backgroundColor:
      'rgba(215,175,94,0.18)',
  },

  heroCompass: {
    position: 'absolute',
    right: -90,
    bottom: 80,
    width: 235,
    height: 235,
    opacity: 0.72,
  },

  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  brandSeal: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(98,21,27,0.82)',
    borderWidth: 1,
    borderColor:
      'rgba(242,211,138,0.75)',
    borderRadius: 17,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 6,
  },

  brandSealText: {
    color: COLORS.paleGold,
    fontSize: 24,
    fontWeight: '900',
  },

  brandTextWrap: {
    flex: 1,
    marginLeft: 12,
  },

  brandCategoryText: {
    color: '#F4DEAC',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },

  brandTiny: {
    color: '#C7B89A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2.8,
    marginTop: 4,
  },

  settingsButton: {
    width: 43,
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.18)',
    borderRadius: 15,
  },

  settingsIcon: {
    color: '#F7E6BE',
    fontSize: 20,
  },

  heroCopy: {
    maxWidth: 335,
    marginTop: 84,
  },

  greeting: {
    color: '#D8C7A5',
    fontSize: 13,
    fontWeight: '800',
  },

  appName: {
    color: '#FFF7E7',
    fontSize: 37,
    fontWeight: '900',
    letterSpacing: 0.2,
    lineHeight: 43,
    marginTop: 8,
  },

  brandDescriptor: {
    color: COLORS.paleGold,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginTop: 9,
    textTransform: 'uppercase',
  },

  appTagline: {
    color: '#E7E1D7',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },

  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
  },

  heroPrimaryButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gold,
    borderRadius: 15,
    paddingHorizontal: 20,
    marginRight: 11,
  },

  heroPrimaryText: {
    color: '#21150C',
    fontSize: 12,
    fontWeight: '900',
  },

  heroSecondaryButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.2)',
    borderRadius: 15,
    paddingHorizontal: 18,
  },

  heroSecondaryText: {
    color: '#FFF3D6',
    fontSize: 12,
    fontWeight: '900',
  },

  todayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(14,20,30,0.58)',
    borderWidth: 1,
    borderColor:
      'rgba(242,211,138,0.28)',
    borderRadius: 20,
    padding: 13,
    marginTop: 18,
  },

  todaySymbol: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(215,175,94,0.18)',
    borderRadius: 15,
  },

  todaySymbolText: {
    color: '#F4D58A',
    fontSize: 23,
  },

  todayTextWrap: {
    flex: 1,
    marginLeft: 12,
  },

  todayEyebrow: {
    color: '#C8B792',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  todayDate: {
    color: '#FFF9EA',
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 18,
    marginTop: 3,
    textTransform: 'capitalize',
  },

  todayPill: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(154,47,36,0.72)',
    borderWidth: 1,
    borderColor:
      'rgba(242,211,138,0.44)',
    borderRadius: 18,
  },

  todayPillText: {
    color: COLORS.paleGold,
    fontSize: 17,
    fontWeight: '900',
  },

  floatingPanel: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 17,
    marginHorizontal: 18,
    marginTop: -38,
    shadowColor: '#2B2116',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 6,
  },

  panelHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  panelEyebrow: {
    color: '#9C6B24',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },

  panelTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 3,
  },

  panelButton: {
    marginLeft: 'auto',
    backgroundColor:
      COLORS.oxblood,
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  panelButtonText: {
    color: '#FFF1D4',
    fontSize: 10,
    fontWeight: '900',
  },

  panelText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 10,
  },

  quickRow: {
    flexDirection: 'row',
    marginTop: 14,
  },

  quickChip: {
    flex: 1,
    minHeight: 72,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2E8D5',
    borderWidth: 1,
    borderColor: '#E0CDAE',
    borderRadius: 18,
    paddingHorizontal: 6,
    marginRight: 8,
  },

  quickChipIcon: {
    color: COLORS.oxblood,
    fontSize: 21,
    fontWeight: '900',
  },

  quickChipText: {
    color: '#4D4032',
    fontSize: 9.5,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 5,
  },

  section: {
    paddingHorizontal: 18,
    marginTop: 29,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sectionEyebrow: {
    color: '#9C6B24',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 3,
  },

  sectionSeal: {
    marginLeft: 'auto',
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.oxblood,
    borderRadius: 14,
  },

  sectionSealText: {
    color: COLORS.paleGold,
    fontSize: 18,
    fontWeight: '900',
  },

  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 13,
  },

  primaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  primaryCard: {
    overflow: 'hidden',
    width: '48.5%',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    marginBottom: 13,
    shadowColor: '#3B2B15',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 3,
  },

  primaryImage: {
    height: 126,
    justifyContent: 'flex-end',
  },

  primaryImageStyle: {
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
  },

  primaryShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      'rgba(10,15,22,0.08)',
  },

  primaryFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#241926',
  },

  primaryFallbackIcon: {
    color: COLORS.paleGold,
    fontSize: 42,
    fontWeight: '900',
  },

  primaryIconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 18,
  },

  primaryIcon: {
    color: '#21150C',
    fontSize: 22,
    fontWeight: '900',
  },

  primaryBody: {
    padding: 14,
    minHeight: 148,
  },

  primaryTitle: {
    color: COLORS.text,
    fontSize: 14.5,
    fontWeight: '900',
    lineHeight: 20,
  },

  primarySubtitle: {
    color: COLORS.muted,
    fontSize: 10.5,
    lineHeight: 16,
    marginTop: 6,
  },

  primaryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 10,
  },

  primaryOpen: {
    color: '#9C6B24',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  primaryArrow: {
    color: COLORS.oxblood,
    fontSize: 24,
    lineHeight: 24,
    marginLeft: 'auto',
  },

  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  featureCard: {
    width: '48.5%',
    minHeight: 172,
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#3B2B15',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    elevation: 2,
  },

  featureIconWrap: {
    width: 47,
    height: 47,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },

  featureIcon: {
    color: COLORS.inkBlue,
    fontSize: 23,
    fontWeight: '900',
  },

  featureCopy: {
    flex: 1,
  },

  featureTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 19,
    marginTop: 12,
  },

  featureSubtitle: {
    color: COLORS.muted,
    fontSize: 10.5,
    lineHeight: 16,
    marginTop: 5,
  },

  featureArrowWrap: {
    alignSelf: 'flex-end',
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0E4CF',
    borderRadius: 13,
    marginTop: 8,
  },

  featureArrow: {
    color: COLORS.oxblood,
    fontSize: 23,
    lineHeight: 23,
    fontWeight: '900',
  },

  disclaimerCard: {
    flexDirection: 'row',
    backgroundColor: '#E9E0D0',
    borderWidth: 1,
    borderColor: '#D9C8AA',
    borderRadius: 21,
    padding: 16,
    marginHorizontal: 18,
    marginTop: 19,
  },

  disclaimerSeal: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9C390',
    borderRadius: 15,
  },

  disclaimerSealText: {
    color: COLORS.oxblood,
    fontSize: 21,
    fontWeight: '900',
  },

  disclaimerCopy: {
    flex: 1,
    marginLeft: 12,
  },

  disclaimerTitle: {
    color: '#5A4936',
    fontSize: 12,
    fontWeight: '900',
  },

  disclaimerText: {
    color: '#746758',
    fontSize: 10.5,
    lineHeight: 17,
    marginTop: 5,
  },

  pressed: {
    opacity: 0.72,
    transform: [
      {
        scale: 0.985,
      },
    ],
  },
});
