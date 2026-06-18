import {
  Platform,
} from 'react-native';

import {
  TestIds,
} from 'react-native-google-mobile-ads';

/**
 * Bật/tắt toàn bộ quảng cáo tại đây.
 *
 * Hiện tại để false theo yêu cầu:
 * - app không show banner;
 * - không show interstitial;
 * - không khóa Rewarded;
 * - Rewarded gates tự bypass.
 *
 * Khi app có nhiều user, đổi thành true rồi build lại.
 */
export const ENABLE_APP_ADS = true;

/**
 * true: dùng TestIds để test an toàn.
 * false: dùng ID thật bên dưới.
 *
 * Khi release production và đã thay ID thật:
 * - ENABLE_APP_ADS = true
 * - USE_ADMOB_TEST_IDS = false
 */
export const USE_ADMOB_TEST_IDS =
  __DEV__;

/**
 * Đổi các ID thật này thành Ad Unit ID trong AdMob của app Eastern Destiny.
 */
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
  enabled: ENABLE_APP_ADS,

  /**
   * Banner đang có sẵn ở RootNavigator.
   * Khi enabled = false thì banner không hiện.
   */
  bannerEnabled: ENABLE_APP_ADS,

  /**
   * Interstitial đặt nhẹ, chỉ show sau khi rời khỏi màn kết quả/lớn.
   */
  interstitialEnabled:
    ENABLE_APP_ADS,

  /**
   * Rewarded dùng để mở khóa phần phân tích nâng cao.
   */
  rewardedEnabled:
    ENABLE_APP_ADS,

  /**
   * Không show quá dày.
   */
  interstitialMinSeconds:
    120,

  /**
   * Cứ sau 3 hành động lớn mới cho phép show 1 interstitial.
   */
  interstitialEveryCompletedActions:
    3,

  /**
   * Chỉ tính interstitial khi rời khỏi các màn này.
   */
  interstitialAfterLeavingRoutes: [
    'BaziChart',
    'ZiweiChart',
    'AdvancedCompatibility',
    'LifeTimeline',
    'MonthlyReview',
    'ExplainableResult',
    'BaziHistory',
  ],

  /**
   * Rewarded gates.
   * Khi ENABLE_APP_ADS = false thì tất cả tự bypass.
   */
  rewardedGates: {
    explainableResults: true,
    timelineExtendedYears: false,
    compatibilityDetails: false,
    pdfExport: false,
  },

  /**
   * Mở khóa rewarded trong bao lâu.
   * Ví dụ người dùng xem 1 rewarded để mở Explainable Results trong 24h.
   */
  rewardedUnlockHours:
    24,

  /**
   * Các AsyncStorage key nếu sau này bạn có Premium / Remove Ads.
   * Nếu key nào có giá trị: true / 1 / yes / purchased
   * thì app sẽ tự ẩn quảng cáo.
   */
  premiumStorageKeys: [
    '@eastern_destiny/is_premium',
    '@eastern_destiny/remove_ads',
    '@eastern_destiny/remove_ads_purchased',
    '@eastern_destiny/premium_active',
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
