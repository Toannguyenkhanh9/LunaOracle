import {
  Platform,
} from 'react-native';

import {
  TestIds,
} from 'react-native-google-mobile-ads';

/**
 * Bật/tắt toàn bộ quảng cáo Luna Oracle tại đây.
 *
 * Hiện tại nên để false khi app còn ít user:
 * - không show banner;
 * - không show interstitial;
 * - rewarded gates tự bypass.
 *
 * Khi muốn bật quảng cáo:
 * - ENABLE_APP_ADS = true
 * - thay AdMob ID thật;
 * - release build.
 */
export const ENABLE_APP_ADS = false;

export const USE_ADMOB_TEST_IDS =
  __DEV__;

const ANDROID_AD_UNITS = {
  banner:
    'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
  interstitial:
    'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
  rewarded:
    'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
};

const IOS_AD_UNITS = {
  banner:
    'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
  interstitial:
    'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
  rewarded:
    'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
};

export const ADS_CONFIG = {
  enabled:
    ENABLE_APP_ADS,

  bannerEnabled:
    ENABLE_APP_ADS,

  interstitialEnabled:
    ENABLE_APP_ADS,

  rewardedEnabled:
    ENABLE_APP_ADS,

  interstitialMinSeconds:
    120,

  interstitialEveryCompletedActions:
    3,

  interstitialAfterLeavingRoutes: [
    'DailyHoroscope',
    'TarotReading',
    'ZodiacCompatibility',
    'MoonCalendar',
    'AstroGlossary',
    'AstroJournal',
    'TarotJournal',
  ],

  rewardedGates: {
    tarotAdvanced: true,
    tarotCelticCross: true,
    tarotJournalExport: true,
    compatibilityDetails: true,
    moonAdvanced: false,
    pdfExport: false,
  },

  rewardedUnlockHours:
    24,

  premiumStorageKeys: [
    '@luna_oracle/is_premium',
    '@luna_oracle/remove_ads',
    '@luna_oracle/remove_ads_purchased',
    '@luna_oracle/premium_active',
  ],

  adUnitIds: {
    banner:
      USE_ADMOB_TEST_IDS
        ? TestIds.BANNER
        : Platform.OS === 'ios'
          ? IOS_AD_UNITS.banner
          : ANDROID_AD_UNITS.banner,

    interstitial:
      USE_ADMOB_TEST_IDS
        ? TestIds.INTERSTITIAL
        : Platform.OS === 'ios'
          ? IOS_AD_UNITS.interstitial
          : ANDROID_AD_UNITS.interstitial,

    rewarded:
      USE_ADMOB_TEST_IDS
        ? TestIds.REWARDED
        : Platform.OS === 'ios'
          ? IOS_AD_UNITS.rewarded
          : ANDROID_AD_UNITS.rewarded,
  },
} as const;

export type RewardedGateKey =
  keyof typeof ADS_CONFIG.rewardedGates;
