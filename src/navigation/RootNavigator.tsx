import React, {
  useEffect,
  useState,
} from 'react';

import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';

import {
  BottomTabBar,
  createBottomTabNavigator,
  type BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';

import {
  useTranslation,
} from 'react-i18next';

import {
  recordRecentlyViewedRoute,
} from '../services/recentlyViewed';

import {
  maybeShowInterstitialForRouteChange,
  preloadAds,
  shouldShowBannerAds,
} from '../services/adController';

import SmallBannerAd
  from '../components/SmallBannerAd';

import WesternHomeScreen
  from '../screens/WesternHomeScreen';

import DailyHoroscopeScreen
  from '../screens/DailyHoroscopeScreen';

import ZodiacProfileScreen
  from '../screens/ZodiacProfileScreen';

import TarotReadingScreen
  from '../screens/TarotReadingScreen';

import ZodiacCompatibilityScreen
  from '../screens/ZodiacCompatibilityScreen';

import MoonCalendarScreen
  from '../screens/MoonCalendarScreen';

import AstroGlossaryScreen
  from '../screens/AstroGlossaryScreen';

import TarotJournalScreen
  from '../screens/TarotJournalScreen';

import SettingsScreen
  from '../screens/SettingsScreen';
  import BirthProfilesScreen
  from '../screens/BirthProfilesScreen';

import BirthProfileEditorScreen
  from '../screens/BirthProfileEditorScreen';
  import DailyInsightScreen
  from '../screens/DailyInsightScreen';
  import TransitTodayScreen
  from '../screens/TransitTodayScreen';

import ProfileCompatibilityScreen
  from '../screens/ProfileCompatibilityScreen';

import AdvancedTarotSpreadScreen
  from '../screens/AdvancedTarotSpreadScreen';

import BirthChartWheelScreen
  from '../screens/BirthChartWheelScreen';
  import DailyRitualScreen
  from '../screens/DailyRitualScreen';
  import StreakAchievementsScreen
  from '../screens/StreakAchievementsScreen';
  import AdvancedTarotJournalScreen
  from '../screens/AdvancedTarotJournalScreen';

import LoveCenterScreen
  from '../screens/LoveCenterScreen';

import LunaOnboardingScreen
  from '../screens/LunaOnboardingScreen';
  import OnboardingGateScreen
  from '../screens/OnboardingGateScreen';
  import YearMonthlyForecastScreen
  from '../screens/YearMonthlyForecastScreen';

export type RootTabParamList = {
  Home: undefined;

  DailyHoroscope: undefined;

  TarotReading: undefined;

  More: undefined;

  ZodiacCompatibility: undefined;

  MoonCalendar: undefined;

  AstroGlossary: undefined;

  AstroJournal: undefined;

  TarotJournal: undefined;

  Settings: undefined;
    ZodiacProfile: undefined;
  BirthProfiles: undefined;
  BirthProfileEditor:
    | {
        profileId?: string;
      }
    | undefined;
      DailyInsight: undefined;
        TransitToday: undefined;
  ProfileCompatibility: undefined;
  AdvancedTarotSpread: undefined;
  BirthChartWheel: undefined;
  DailyRitual :undefined;
  StreakAchievements:undefined;
  AdvancedTarotJournal: {
  tag?: string;
} | undefined;
LoveCenter: undefined;
LunaOnboarding: undefined;
  OnboardingGate: undefined;
};

const Tab =
  createBottomTabNavigator<
    RootTabParamList
  >();

export const navigationRef =
  createNavigationContainerRef<
    RootTabParamList
  >();

let lastTrackedRouteName:
  string | undefined;

type TabIconProps = {
  icon: string;
  focused: boolean;
};

function TabIcon({
  icon,
  focused,
}: TabIconProps) {
  return (
    <View
      style={[
        styles.tabIconWrap,
        focused &&
          styles.tabIconWrapActive,
      ]}>
      <Text
        style={[
          styles.tabIcon,
          focused &&
            styles.tabIconActive,
        ]}>
        {icon}
      </Text>
    </View>
  );
}

function MoreScreen({
  navigation,
}: BottomTabScreenProps<
  RootTabParamList,
  'More'
>) {
  const {t} =
    useTranslation();

  const items: Array<{
    route:
      | 'ZodiacCompatibility'
      | 'MoonCalendar'
      | 'AstroGlossary'
      | 'AstroJournal'
      | 'Settings';
    icon: string;
    title: string;
    subtitle: string;
  }> = [
    {
      route: 'ZodiacCompatibility',
      icon: '♡',
      title: t(
        'western.home.compatibility',
        {
          defaultValue:
            'Compatibility',
        },
      ),
      subtitle: t(
        'western.home.compatibilitySubtitle',
        {
          defaultValue:
            'Compare signs through element and modality.',
        },
      ),
    },
    {
      route: 'MoonCalendar',
      icon: '☾',
      title: t(
        'western.home.moonCalendar',
        {
          defaultValue:
            'Moon Calendar',
        },
      ),
      subtitle: t(
        'western.home.moonCalendarSubtitle',
        {
          defaultValue:
            'New moon, full moon, intention, and release.',
        },
      ),
    },
    {
      route: 'AstroGlossary',
      icon: 'A',
      title: t(
        'western.home.glossary',
        {
          defaultValue:
            'Astro Glossary',
        },
      ),
      subtitle: t(
        'western.home.glossarySubtitle',
        {
          defaultValue:
            'Learn signs, planets, houses, aspects, and tarot terms.',
        },
      ),
    },
    {
      route: 'AstroJournal',
      icon: '✎',
      title: t(
        'luna.tarotJournal.title',
        {
          defaultValue:
            'Tarot Journal',
        },
      ),
      subtitle: t(
        'western.home.journalSubtitle',
        {
          defaultValue:
            'Save tarot pulls, moods, dreams, and reflections.',
        },
      ),
    },
    {
      route: 'Settings',
      icon: '⚙',
      title: t(
        'settings.title',
        {
          defaultValue:
            'Settings',
        },
      ),
      subtitle:
        'Language, ads, premium, notifications, and privacy.',
    },
  ];

  return (
    <ScrollView
      style={styles.moreScreen}
      contentContainerStyle={
        styles.moreContent
      }>
      <Text style={styles.moreEyebrow}>
        Luna Oracle
      </Text>

      <Text style={styles.moreTitle}>
        More
      </Text>

      {items.map(item => (
        <Pressable
          key={item.route}
          style={({pressed}) => [
            styles.moreItem,
            pressed &&
              styles.pressed,
          ]}
          onPress={() =>
            navigation.navigate(
              item.route,
            )
          }>
          <View style={styles.moreIconWrap}>
            <Text style={styles.moreIcon}>
              {item.icon}
            </Text>
          </View>

          <View style={styles.moreCopy}>
            <Text style={styles.moreItemTitle}>
              {item.title}
            </Text>

            <Text style={styles.moreItemSubtitle}>
              {item.subtitle}
            </Text>
          </View>

          <Text style={styles.moreArrow}>
            ›
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

export default function RootNavigator() {
  const {t} =
    useTranslation();

  const [
    showAdsBanner,
    setShowAdsBanner,
  ] = useState(false);

  useEffect(() => {
    let active = true;

    void shouldShowBannerAds()
      .then(result => {
        if (active) {
          setShowAdsBanner(result);
        }
      })
      .catch(() => {
        if (active) {
          setShowAdsBanner(false);
        }
      });

    void preloadAds();

    return () => {
      active = false;
    };
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        lastTrackedRouteName =
          navigationRef.getCurrentRoute()
            ?.name;
      }}
      onStateChange={state => {
        const route =
          state?.routes[
            state.index
          ];

        if (!route) {
          return;
        }

        const nextRouteName =
          route.name;

        void maybeShowInterstitialForRouteChange(
          lastTrackedRouteName,
          nextRouteName,
        );

        lastTrackedRouteName =
          nextRouteName;

        void recordRecentlyViewedRoute(
          nextRouteName,
          route.params,
        );
      }}>
      <View style={styles.root}>
        <Tab.Navigator
          initialRouteName="OnboardingGate"
          tabBar={props => (
            <View style={styles.bottomArea}>
              {showAdsBanner && (
                <View
                  style={
                    styles.bannerContainer
                  }>
                  <SmallBannerAd
                    visible={
                      showAdsBanner
                    }
                  />
                </View>
              )}

              <BottomTabBar {...props} />
            </View>
          )}
          screenOptions={{
            headerShown: false,
            tabBarHideOnKeyboard: true,

            tabBarActiveTintColor:
              COLORS.gold,

            tabBarInactiveTintColor:
              COLORS.tabInactive,

            tabBarStyle:
              styles.tabBar,

            tabBarLabelStyle:
              styles.tabBarLabel,

            tabBarItemStyle:
              styles.tabBarItem,
          }}>
          <Tab.Screen
            name="Home"
            component={
              WesternHomeScreen
            }
            options={{
              title: t(
                'tabs.home',
                {
                  defaultValue:
                    'Home',
                },
              ),
              tabBarIcon: ({
                focused,
              }) => (
                <TabIcon
                  icon="☾"
                  focused={focused}
                />
              ),
            }}
          />

          <Tab.Screen
            name="DailyHoroscope"
            component={
              DailyHoroscopeScreen
            }
            options={{
              title: t(
                'western.home.dailyHoroscope',
                {
                  defaultValue:
                    'Horoscope',
                },
              ),
              tabBarIcon: ({
                focused,
              }) => (
                <TabIcon
                  icon="☉"
                  focused={focused}
                />
              ),
            }}
          />

          <Tab.Screen
            name="TarotReading"
            component={
              TarotReadingScreen
            }
            options={{
              title: t(
                'western.home.tarot',
                {
                  defaultValue:
                    'Tarot',
                },
              ),
              tabBarIcon: ({
                focused,
              }) => (
                <TabIcon
                  icon="✦"
                  focused={focused}
                />
              ),
            }}
          />

          <Tab.Screen
            name="ZodiacProfile"
            component={
              ZodiacProfileScreen
            }
            options={{
              title: t(
                'western.home.zodiacProfile',
                {
                  defaultValue:
                    'Profile',
                },
              ),
              tabBarIcon: ({
                focused,
              }) => (
                <TabIcon
                  icon="♈"
                  focused={focused}
                />
              ),
            }}
          />

          <Tab.Screen
            name="More"
            component={MoreScreen}
            options={{
              title: t(
                'common.more',
                {
                  defaultValue:
                    'More',
                },
              ),
              tabBarIcon: ({
                focused,
              }) => (
                <TabIcon
                  icon="⋯"
                  focused={focused}
                />
              ),
            }}
          />

          <Tab.Screen
            name="ZodiacCompatibility"
            component={
              ZodiacCompatibilityScreen
            }
            options={{
              title: t(
                'western.home.compatibility',
                {
                  defaultValue:
                    'Compatibility',
                },
              ),
              tabBarButton:
                () => null,
              tabBarItemStyle:
                styles.hiddenTab,
            }}
          />

          <Tab.Screen
            name="MoonCalendar"
            component={
              MoonCalendarScreen
            }
            options={{
              title: t(
                'western.home.moonCalendar',
                {
                  defaultValue:
                    'Moon Calendar',
                },
              ),
              tabBarButton:
                () => null,
              tabBarItemStyle:
                styles.hiddenTab,
            }}
          />

          <Tab.Screen
            name="AstroGlossary"
            component={
              AstroGlossaryScreen
            }
            options={{
              title: t(
                'western.home.glossary',
                {
                  defaultValue:
                    'Astro Glossary',
                },
              ),
              tabBarButton:
                () => null,
              tabBarItemStyle:
                styles.hiddenTab,
            }}
          />

          <Tab.Screen
            name="AstroJournal"
            component={
              TarotJournalScreen
            }
            options={{
              title: t(
                'luna.tarotJournal.title',
                {
                  defaultValue:
                    'Tarot Journal',
                },
              ),
              tabBarButton:
                () => null,
              tabBarItemStyle:
                styles.hiddenTab,
            }}
          />

          <Tab.Screen
            name="TarotJournal"
            component={
              TarotJournalScreen
            }
            options={{
              title: t(
                'luna.tarotJournal.title',
                {
                  defaultValue:
                    'Tarot Journal',
                },
              ),
              tabBarButton:
                () => null,
              tabBarItemStyle:
                styles.hiddenTab,
            }}
          />

          <Tab.Screen
            name="Settings"
            component={
              SettingsScreen
            }
            options={{
              title: t(
                'settings.title',
                {
                  defaultValue:
                    'Settings',
                },
              ),
              tabBarButton:
                () => null,
              tabBarItemStyle:
                styles.hiddenTab,
            }}
          />
          <Tab.Screen
  name="BirthProfiles"
  component={BirthProfilesScreen}
  options={{
    title: t('lunaBirthProfiles.title', {
      defaultValue: 'Birth Profiles',
    }),
    tabBarButton: () => null,
    tabBarItemStyle: styles.hiddenTab,
  }}
/>

<Tab.Screen
  name="BirthProfileEditor"
  component={BirthProfileEditorScreen}
  options={{
    title: t('lunaBirthProfiles.editorEyebrow', {
      defaultValue: 'Birth Profile',
    }),
    tabBarButton: () => null,
    tabBarItemStyle: styles.hiddenTab,
  }}
/>
<Tab.Screen
  name="DailyInsight"
  component={DailyInsightScreen}
  options={{
    title: t('lunaDailyInsight.eyebrow', {
      defaultValue: 'Today',
    }),
        tabBarButton: () => null,
    tabBarItemStyle: styles.hiddenTab,
  }}
/>
<Tab.Screen
  name="TransitToday"
  component={TransitTodayScreen}
  options={{
    title: t('lunaAdvanced.transit.title', {
      defaultValue: 'Transit Today',
    }),
    tabBarButton: () => null,
    tabBarItemStyle: styles.hiddenTab,
  }}
/>

<Tab.Screen
  name="ProfileCompatibility"
  component={ProfileCompatibilityScreen}
  options={{
    title: t('lunaAdvanced.compat.title', {
      defaultValue: 'Profile Compatibility',
    }),
    tabBarButton: () => null,
    tabBarItemStyle: styles.hiddenTab,
  }}
/>

<Tab.Screen
  name="AdvancedTarotSpread"
  component={AdvancedTarotSpreadScreen}
  options={{
    title: t('lunaAdvanced.tarot.title', {
      defaultValue: 'Deep Tarot Spreads',
    }),
    tabBarButton: () => null,
    tabBarItemStyle: styles.hiddenTab,
  }}
/>

<Tab.Screen
  name="BirthChartWheel"
  component={BirthChartWheelScreen}
  options={{
    title: t('lunaAdvanced.wheel.title', {
      defaultValue: 'Chart Wheel',
    }),
    tabBarButton: () => null,
    tabBarItemStyle: styles.hiddenTab,
  }}
/>
<Tab.Screen
  name="DailyRitual"
  component={DailyRitualScreen}
  options={{
    title: t('lunaDailyRitual.homeTitle', {
      defaultValue: 'Daily Ritual',
    }),
    tabBarButton: () => null,
    tabBarItemStyle: styles.hiddenTab,
  }}
/>
<Tab.Screen
  name="StreakAchievements"
  component={StreakAchievementsScreen}
  options={{
    title: t('lunaAchievements.homeTitle', {
      defaultValue: 'Streak & Achievements',
    }),
    tabBarButton: () => null,
    tabBarItemStyle: styles.hiddenTab,
  }}
/>
<Tab.Screen
  name="AdvancedTarotJournal"
  component={AdvancedTarotJournalScreen}
  options={{
    title: t('lunaTarotJournal.homeTitle', {
      defaultValue: 'Advanced Tarot Journal',
    }),
    tabBarButton: () => null,
    tabBarItemStyle: styles.hiddenTab,
  }}
/>

<Tab.Screen
  name="LoveCenter"
  component={LoveCenterScreen}
  options={{
    title: t('lunaLoveCenter.homeTitle', {
      defaultValue: 'Love Center',
    }),
    tabBarButton: () => null,
    tabBarItemStyle: styles.hiddenTab,
  }}
/>

<Tab.Screen
  name="LunaOnboarding"
  component={LunaOnboardingScreen}
  options={{
    title: t('lunaOnboarding.homeTitle', {
      defaultValue: 'Beautiful Onboarding',
    }),
    tabBarButton: () => null,
    tabBarItemStyle: styles.hiddenTab,
  }}
/>
<Tab.Screen
  name="OnboardingGate"
  component={OnboardingGateScreen}
  options={{
    tabBarButton: () => null,
    tabBarItemStyle: styles.hiddenTab,
    headerShown: false,
  }}
/>
<Tab.Screen
  name="YearMonthlyForecast"
  component={YearMonthlyForecastScreen}
  options={{
    title: t('lunaForecast.homeTitle', {
      defaultValue: 'Year / Monthly Forecast',
    }),
    tabBarButton: () => null,
    tabBarItemStyle: styles.hiddenTab,
  }}
/>
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}

const COLORS = {
  night: '#120B22',
  midnight: '#1B1537',
  purple: '#6E4DA8',
  gold: '#D9B76E',
  moon: '#E8E2FF',
  paper: '#FFFDF8',
  cream: '#F7F2EA',
  border: '#E9DCC5',
  text: '#282236',
  muted: '#756D7D',
  tabInactive: '#8C8395',
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor:
      COLORS.cream,
  },

  bottomArea: {
    backgroundColor:
      COLORS.paper,
  },

  bannerContainer: {
    width: '100%',
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      COLORS.paper,
    borderTopWidth:
      StyleSheet.hairlineWidth,
    borderTopColor:
      COLORS.border,
  },

  tabBar: {
    height:
      Platform.OS === 'ios'
        ? 88
        : 70,

    paddingTop: 6,

    paddingBottom:
      Platform.OS === 'ios'
        ? 22
        : 8,

    backgroundColor:
      COLORS.paper,

    borderTopWidth:
      StyleSheet.hairlineWidth,

    borderTopColor:
      COLORS.border,

    elevation: 10,

    shadowColor: '#000000',

    shadowOpacity:
      Platform.OS === 'ios'
        ? 0.08
        : 0,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: -3,
    },
  },

  tabBarItem: {
    paddingTop: 1,
  },

  tabBarLabel: {
    fontSize: 10,
    fontWeight: '800',
  },

  tabIconWrap: {
    width: 33,
    height: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },

  tabIconWrapActive: {
    backgroundColor:
      'rgba(217,183,110,0.16)',
  },

  tabIcon: {
    color: COLORS.tabInactive,
    fontSize: 19,
    fontWeight: '900',
    opacity: 0.72,
  },

  tabIconActive: {
    color: COLORS.gold,
    fontSize: 20,
    opacity: 1,
  },

  hiddenTab: {
    display: 'none',
  },

  moreScreen: {
    flex: 1,
    backgroundColor:
      COLORS.cream,
  },

  moreContent: {
    padding: 18,
    paddingBottom: 110,
  },

  moreEyebrow: {
    color: '#9A7939',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  moreTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 5,
    marginBottom: 16,
  },

  moreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 84,
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },

  moreIconWrap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(110,77,168,0.12)',
    borderRadius: 16,
  },

  moreIcon: {
    color: COLORS.purple,
    fontSize: 22,
    fontWeight: '900',
  },

  moreCopy: {
    flex: 1,
    marginLeft: 13,
  },

  moreItemTitle: {
    color: COLORS.text,
    fontSize: 14.5,
    fontWeight: '900',
  },

  moreItemSubtitle: {
    color: COLORS.muted,
    fontSize: 10.5,
    lineHeight: 16,
    marginTop: 4,
  },

  moreArrow: {
    color: '#9C8FAA',
    fontSize: 24,
    fontWeight: '800',
    marginLeft: 8,
  },

  comingSoonScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      COLORS.cream,
    padding: 18,
  },

  comingSoonCard: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 24,
  },

  comingSoonIcon: {
    color: COLORS.purple,
    fontSize: 44,
    fontWeight: '900',
  },

  comingSoonTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 12,
  },

  comingSoonSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 8,
  },

  comingSoonNote: {
    color: '#9A7939',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 16,
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
