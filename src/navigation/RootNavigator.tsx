import React, {useEffect, useState} from 'react';

import {
  Platform,
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
} from '@react-navigation/bottom-tabs';

import {
  useTranslation,
} from 'react-i18next';

import notifee, {
  EventType,
} from '@notifee/react-native';

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

import HomeScreen
  from '../screens/HomeScreen';

import LunarCalendarScreen
  from '../screens/LunarCalendarScreen';

import TodayScreen
  from '../screens/TodayScreen';

import RecentlyViewedScreen
  from '../screens/RecentlyViewedScreen';

import BookmarksNotesScreen
  from '../screens/BookmarksNotesScreen';

import LifeTimelineScreen
  from '../screens/LifeTimelineScreen';

import AdvancedCompatibilityScreen
  from '../screens/AdvancedCompatibilityScreen';

import ExpertModeScreen
  from '../screens/ExpertModeScreen';

import TimelineEventEditorScreen
  from '../screens/TimelineEventEditorScreen';

import ProfileOverviewScreen
  from '../screens/ProfileOverviewScreen';

import ExplainableResultScreen
  from '../screens/ExplainableResultScreen';

import DailyBriefScreen
  from '../screens/DailyBriefScreen';

import MonthlyReviewScreen
  from '../screens/MonthlyReviewScreen';

import SmartNotificationsScreen
  from '../screens/SmartNotificationsScreen';

import GlossaryScreen
  from '../screens/GlossaryScreen';

import BaziChartScreen
  from '../screens/BaziChartScreen';

import ZiweiChartScreen
  from '../screens/ZiweiChartScreen';

import SettingsScreen
  from '../screens/SettingsScreen';

import UserProfilesScreen
  from '../screens/UserProfilesScreen';

import UserProfileEditorScreen
  from '../screens/UserProfileEditorScreen';

import HoroscopeScreen
  from '../screens/HoroscopeScreen';

import BaziHistoryScreen
  from '../screens/BaziHistoryScreen';

import BaziStage4Screen
  from '../screens/BaziStage4Screen';

import FortuneStickScreen
  from '../screens/FortuneStickScreen';

import BuddhistCalendarScreen
  from '../screens/BuddhistCalendarScreen';

export type RootTabParamList = {
  Home: undefined;

  LunarCalendar: undefined;

  Today: undefined;

  RecentlyViewed: undefined;

  BookmarksNotes: undefined;

  LifeTimeline:
    | {
        profileId?: string;
        year?: number;
      }
    | undefined;

  AdvancedCompatibility:
    | {
        profileAId?: string;
        profileBId?: string;
        mode?:
          | 'love'
          | 'marriage'
          | 'friendship'
          | 'business'
          | 'parentChild';
      }
    | undefined;

  ExpertMode: undefined;

  TimelineEventEditor: {
    profileId: string;
    year?: number;
    eventId?: string;
  };

  ProfileOverview: {
    profileId: string;
  };

  DailyBrief:
    | {
        profileId?: string;
      }
    | undefined;

  MonthlyReview:
    | {
        profileId?: string;
        year?: number;
        month?: number;
      }
    | undefined;

  SmartNotifications: undefined;

  Glossary:
    | {
        termId?: string;
        category?:
          | 'foundation'
          | 'calendar'
          | 'bazi'
          | 'ziwei'
          | 'compatibility'
          | 'practice';
      }
    | undefined;

  ExplainableResult:
    | {
        kind: 'today';
        profileId?: string;
        date?: string;
      }
    | {
        kind: 'timeline';
        profileId: string;
        year: number;
      }
    | {
        kind: 'compatibility';
        profileAId: string;
        profileBId: string;
        mode:
          | 'love'
          | 'marriage'
          | 'friendship'
          | 'business'
          | 'parentChild';
      }
    | {
        kind:
          | 'bazi'
          | 'ziwei';
        payload: {
          title?: string;
          factors: Array<{
            code: string;
            label: string;
            description?: string;
            score?: number;
            rawValue?: string;
          }>;
          rawData?: Record<
            string,
            string | number | boolean | null
          >;
          modelVersion?: string;
        };
      };

  BaziChart:
    | {
        savedRecordId?: string;
        profileId?: string;
      }
    | undefined;

  ZiweiChart:
    | {
        profileId?: string;
      }
    | undefined;

  UserProfiles: undefined;

  UserProfileEditor:
    | {
        profileId?: string;
      }
    | undefined;

  Settings: undefined;

  Horoscope:
    | {
        profileId?: string;
      }
    | undefined;

  BaziHistory: undefined;

  BaziStage4: undefined;

  FortuneStick: undefined;

  BuddhistCalendar: undefined;
};

const Tab =
  createBottomTabNavigator<
    RootTabParamList
  >();


const navigationRef =
  createNavigationContainerRef<
    RootTabParamList
  >();

let pendingNotificationData:
  Record<string, unknown> | null =
    null;

let lastTrackedRouteName:
  string | undefined;

function openNotificationRoute(
  data:
    Record<string, unknown> | undefined,
): void {
  if (!data) {
    return;
  }

  if (!navigationRef.isReady()) {
    pendingNotificationData =
      data;
    return;
  }

  const route =
    String(
      data.route ?? '',
    );

  if (route === 'DailyBrief') {
    const profileId =
      String(
        data.profileId ?? '',
      );

    if (profileId) {
      navigationRef.navigate(
        'DailyBrief',
        {
          profileId,
        },
      );
    } else {
      navigationRef.navigate(
        'DailyBrief',
      );
    }

    return;
  }

  if (
    route ===
    'MonthlyReview'
  ) {
    const year =
      Number(
        data.year,
      );

    const month =
      Number(
        data.month,
      );

    navigationRef.navigate(
      'MonthlyReview',
      {
        year:
          Number.isFinite(
            year,
          )
            ? year
            : undefined,
        month:
          Number.isFinite(
            month,
          )
            ? month
            : undefined,
      },
    );
  }
}

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

export default function RootNavigator() {
  const {t} = useTranslation();

  const [showAdsBanner, setShowAdsBanner] =
    useState(false);

  useEffect(() => {
    let active = false;

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

  useEffect(() => {
    const unsubscribe =
      notifee.onForegroundEvent(
        ({
          type,
          detail,
        }) => {
          if (
            type ===
            EventType.PRESS
          ) {
            openNotificationRoute(
              detail.notification
                ?.data as
                | Record<
                    string,
                    unknown
                  >
                | undefined,
            );
          }
        },
      );

    void notifee
      .getInitialNotification()
      .then(initial => {
        openNotificationRoute(
          initial?.notification
            .data as
            | Record<
                string,
                unknown
              >
            | undefined,
        );
      })
      .catch(() => {
        // No initial notification.
      });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        lastTrackedRouteName =
          navigationRef.getCurrentRoute()
            ?.name;

        if (
          pendingNotificationData
        ) {
          const data =
            pendingNotificationData;

          pendingNotificationData =
            null;

          openNotificationRoute(
            data,
          );
        }
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
          initialRouteName="Home"
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
            component={HomeScreen}
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
                  icon="✦"
                  focused={focused}
                />
              ),
            }}
          />

          <Tab.Screen
            name="LunarCalendar"
            component={
              LunarCalendarScreen
            }
            options={{
              title: t(
                'lunarCalendar.title',
                {
                  defaultValue:
                    'Calendar',
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
            name="BaziChart"
            component={
              BaziChartScreen
            }
            options={{
              title: t(
                'bazi.title',
                {
                  defaultValue:
                    'BaZi',
                },
              ),

              tabBarIcon: ({
                focused,
              }) => (
                <TabIcon
                  icon="☯"
                  focused={focused}
                />
              ),
            }}
          />

          <Tab.Screen
            name="ZiweiChart"
            component={
              ZiweiChartScreen
            }
            options={{
              title: t(
                'ziwei.title',
                {
                  defaultValue:
                    'Zi Wei',
                },
              ),

              tabBarIcon: ({
                focused,
              }) => (
                <TabIcon
                  icon="紫"
                  focused={focused}
                />
              ),
            }}
          />

          <Tab.Screen
            name="UserProfiles"
            component={
              UserProfilesScreen
            }
            options={{
              title: t(
                'userProfiles.tabTitle',
                {
                  defaultValue:
                    'Profiles',
                },
              ),

              tabBarIcon: ({
                focused,
              }) => (
                <TabIcon
                  icon="◎"
                  focused={focused}
                />
              ),
            }}
          />

          {/*
           * Các màn hình bên dưới vẫn điều hướng được từ HomeScreen,
           * nhưng không hiển thị thành nút trên thanh tab.
           */}

          <Tab.Screen
            name="Today"
            component={
              TodayScreen
            }
            options={{
              title: t(
                'today.title',
                {
                  defaultValue:
                    'Today',
                },
              ),

              tabBarButton:
                () => null,

              tabBarItemStyle:
                styles.hiddenTab,
            }}
          />

          <Tab.Screen
            name="RecentlyViewed"
            component={
              RecentlyViewedScreen
            }
            options={{
              title: t(
                'insightFeatures.recent.title',
                {
                  defaultValue:
                    'Recently Viewed',
                },
              ),

              tabBarButton:
                () => null,

              tabBarItemStyle:
                styles.hiddenTab,
            }}
          />

          <Tab.Screen
            name="BookmarksNotes"
            component={
              BookmarksNotesScreen
            }
            options={{
              title: t(
                'insightFeatures.library.title',
                {
                  defaultValue:
                    'Bookmarks & Notes',
                },
              ),

              tabBarButton:
                () => null,

              tabBarItemStyle:
                styles.hiddenTab,
            }}
          />

          <Tab.Screen
            name="LifeTimeline"
            component={
              LifeTimelineScreen
            }
            options={{
              title: t(
                'insightFeatures.timeline.title',
                {
                  defaultValue:
                    'Visual Timeline',
                },
              ),

              tabBarButton:
                () => null,

              tabBarItemStyle:
                styles.hiddenTab,
            }}
          />

          <Tab.Screen
            name="AdvancedCompatibility"
            component={
              AdvancedCompatibilityScreen
            }
            options={{
              title: t(
                'insightFeatures.compatibility.title',
                {
                  defaultValue:
                    'Advanced Compatibility',
                },
              ),

              tabBarButton:
                () => null,

              tabBarItemStyle:
                styles.hiddenTab,
            }}
          />

          <Tab.Screen
            name="ExpertMode"
            component={
              ExpertModeScreen
            }
            options={{
              title: t(
                'expertMode.title',
                {
                  defaultValue:
                    'Expert Mode',
                },
              ),

              tabBarButton:
                () => null,

              tabBarItemStyle:
                styles.hiddenTab,
            }}
          />

          <Tab.Screen
            name="TimelineEventEditor"
            component={
              TimelineEventEditorScreen
            }
            options={{
              title: t(
                'timelineEvents.createTitle',
                {
                  defaultValue:
                    'Add Timeline Event',
                },
              ),

              tabBarButton:
                () => null,

              tabBarItemStyle:
                styles.hiddenTab,
            }}
          />

          <Tab.Screen
            name="ProfileOverview"
            component={
              ProfileOverviewScreen
            }
            options={{
              title: t(
                'profileOverview.title',
                {
                  defaultValue:
                    'Profile Overview',
                },
              ),
              tabBarButton:
                () => null,
              tabBarItemStyle:
                styles.hiddenTab,
            }}
          />

          <Tab.Screen
            name="DailyBrief"
            component={
              DailyBriefScreen
            }
            options={{
              title: t(
                'dailyBrief.title',
                {
                  defaultValue:
                    'Daily Brief',
                },
              ),
              tabBarButton:
                () => null,
              tabBarItemStyle:
                styles.hiddenTab,
            }}
          />

          <Tab.Screen
            name="MonthlyReview"
            component={
              MonthlyReviewScreen
            }
            options={{
              title: t(
                'monthlyReview.title',
                {
                  defaultValue:
                    'Monthly Review',
                },
              ),
              tabBarButton:
                () => null,
              tabBarItemStyle:
                styles.hiddenTab,
            }}
          />

          <Tab.Screen
            name="SmartNotifications"
            component={
              SmartNotificationsScreen
            }
            options={{
              title: t(
                'smartNotifications.title',
                {
                  defaultValue:
                    'Widget & Notifications',
                },
              ),
              tabBarButton:
                () => null,
              tabBarItemStyle:
                styles.hiddenTab,
            }}
          />

          <Tab.Screen
            name="Glossary"
            component={
              GlossaryScreen
            }
            options={{
              title: t(
                'glossary.title',
                {
                  defaultValue:
                    'Glossary',
                },
              ),
              tabBarButton:
                () => null,
              tabBarItemStyle:
                styles.hiddenTab,
            }}
          />

          <Tab.Screen
            name="ExplainableResult"
            component={
              ExplainableResultScreen
            }
            options={{
              title: t(
                'explainable.title',
                {
                  defaultValue:
                    'Why this result?',
                },
              ),
              tabBarButton:
                () => null,
              tabBarItemStyle:
                styles.hiddenTab,
            }}
          />

          <Tab.Screen
            name="UserProfileEditor"
            component={
              UserProfileEditorScreen
            }
            options={{
              title: t(
                'userProfiles.createTitle',
                {
                  defaultValue:
                    'Create Profile',
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
            name="Horoscope"
            component={
              HoroscopeScreen
            }
            options={{
              title: t(
                'horoscope.title',
                {
                  defaultValue:
                    'Horoscope and Auspicious Dates',
                },
              ),

              tabBarButton:
                () => null,

              tabBarItemStyle:
                styles.hiddenTab,
            }}
          />

          <Tab.Screen
            name="BaziHistory"
            component={
              BaziHistoryScreen
            }
            options={{
              title: t(
                'bazi.stage3.historyTitle',
                {
                  defaultValue:
                    'Saved Charts',
                },
              ),

              tabBarButton:
                () => null,

              tabBarItemStyle:
                styles.hiddenTab,
            }}
          />

          <Tab.Screen
            name="BaziStage4"
            component={
              BaziStage4Screen
            }
            options={{
              title: t(
                'bazi.stage4.title',
                {
                  defaultValue:
                    'Timing and Compatibility',
                },
              ),

              tabBarButton:
                () => null,

              tabBarItemStyle:
                styles.hiddenTab,
            }}
          />

          <Tab.Screen
            name="FortuneStick"
            component={
              FortuneStickScreen
            }
            options={{
              title: t(
                'fortuneStick.title',
                {
                  defaultValue:
                    'Fortune Stick',
                },
              ),

              tabBarButton:
                () => null,

              tabBarItemStyle:
                styles.hiddenTab,
            }}
          />

          <Tab.Screen
            name="BuddhistCalendar"
            component={
              BuddhistCalendarScreen
            }
            options={{
              title: t(
                'astrologyHome.cards.holidayTitle',
                {
                  defaultValue:
                    'Holidays and Observances',
                },
              ),

              tabBarButton:
                () => null,

              tabBarItemStyle:
                styles.hiddenTab,
            }}
          />
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}

const COLORS = {
  navy: '#17243A',
  navySoft: '#22324B',
  gold: '#D7AF5E',
  cream: '#F7F2E8',
  surface: '#FFFDF8',
  border: '#DED4C3',
  tabInactive: '#7D807E',
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor:
      COLORS.cream,
  },

  bottomArea: {
    backgroundColor:
      COLORS.surface,
  },

  bannerContainer: {
    width: '100%',
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      COLORS.surface,
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
      COLORS.surface,

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
      'rgba(215,175,94,0.16)',
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
});
