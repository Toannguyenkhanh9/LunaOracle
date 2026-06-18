import AsyncStorage
  from '@react-native-async-storage/async-storage';

import mobileAds, {
  AdEventType,
  InterstitialAd,
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';

import {
  ADS_CONFIG,
} from '../config/adsConfig';

type ShowInterstitialReason = {
  previousRouteName?: string;
  nextRouteName?: string;
  force?: boolean;
};

let adsInitialized = false;

let interstitialAd:
  InterstitialAd | null = null;

let interstitialLoaded = false;
let interstitialLoading = false;

let rewardedAd:
  RewardedAd | null = null;

let rewardedLoaded = false;
let rewardedLoading = false;

let completedActionCount = 0;
let lastInterstitialShownAt = 0;

function isTruthyFlag(
  value: string | null,
): boolean {
  if (!value) {
    return false;
  }

  const normalized =
    value.trim().toLowerCase();

  return [
    'true',
    '1',
    'yes',
    'y',
    'purchased',
    'premium',
    'active',
  ].includes(normalized);
}

export function areAdsGloballyEnabled(): boolean {
  return ADS_CONFIG.enabled;
}

export async function isUserAdFree(): Promise<boolean> {
  if (!ADS_CONFIG.enabled) {
    return true;
  }

  try {
    const values =
      await AsyncStorage.multiGet(
        [...ADS_CONFIG.premiumStorageKeys],
      );

    return values.some(
      ([, value]) =>
        isTruthyFlag(value),
    );
  } catch (error) {
    console.warn(
      'Unable to read premium ads state:',
      error,
    );

    return false;
  }
}

export async function shouldShowAnyAds(): Promise<boolean> {
  if (!ADS_CONFIG.enabled) {
    return false;
  }

  const adFree =
    await isUserAdFree();

  return !adFree;
}

export async function shouldShowBannerAds(): Promise<boolean> {
  if (
    !ADS_CONFIG.enabled ||
    !ADS_CONFIG.bannerEnabled
  ) {
    return false;
  }

  return shouldShowAnyAds();
}

async function ensureMobileAdsStarted(): Promise<void> {
  if (
    adsInitialized ||
    !ADS_CONFIG.enabled
  ) {
    return;
  }

  try {
    await mobileAds().initialize();
  } catch (error) {
    console.warn(
      'Unable to initialize mobile ads:',
      error,
    );
  } finally {
    adsInitialized = true;
  }
}

function createInterstitial(): void {
  if (
    interstitialAd ||
    !ADS_CONFIG.enabled
  ) {
    return;
  }

  interstitialAd =
    InterstitialAd.createForAdRequest(
      ADS_CONFIG.adUnitIds.interstitial,
      {
        requestNonPersonalizedAdsOnly:
          true,
      },
    );

  interstitialAd.addAdEventListener(
    AdEventType.LOADED,
    () => {
      interstitialLoaded = true;
      interstitialLoading = false;
    },
  );

  interstitialAd.addAdEventListener(
    AdEventType.ERROR,
    error => {
      console.warn(
        'Interstitial ad error:',
        error,
      );

      interstitialLoaded = false;
      interstitialLoading = false;
    },
  );

  interstitialAd.addAdEventListener(
    AdEventType.CLOSED,
    () => {
      interstitialLoaded = false;
      interstitialLoading = false;
      loadInterstitialAd();
    },
  );
}

function createRewarded(): void {
  if (
    rewardedAd ||
    !ADS_CONFIG.enabled
  ) {
    return;
  }

  rewardedAd =
    RewardedAd.createForAdRequest(
      ADS_CONFIG.adUnitIds.rewarded,
      {
        requestNonPersonalizedAdsOnly:
          true,
      },
    );

  rewardedAd.addAdEventListener(
    RewardedAdEventType.LOADED,
    () => {
      rewardedLoaded = true;
      rewardedLoading = false;
    },
  );

  rewardedAd.addAdEventListener(
    AdEventType.ERROR,
    error => {
      console.warn(
        'Rewarded ad error:',
        error,
      );

      rewardedLoaded = false;
      rewardedLoading = false;
    },
  );

  rewardedAd.addAdEventListener(
    AdEventType.CLOSED,
    () => {
      rewardedLoaded = false;
      rewardedLoading = false;
      loadRewardedAd();
    },
  );
}

export async function preloadAds(): Promise<void> {
  if (!ADS_CONFIG.enabled) {
    return;
  }

  const canShow =
    await shouldShowAnyAds();

  if (!canShow) {
    return;
  }

  await ensureMobileAdsStarted();

  createInterstitial();
  createRewarded();

  loadInterstitialAd();
  loadRewardedAd();
}

export function loadInterstitialAd(): void {
  if (
    !ADS_CONFIG.enabled ||
    !ADS_CONFIG.interstitialEnabled ||
    !interstitialAd ||
    interstitialLoaded ||
    interstitialLoading
  ) {
    return;
  }

  interstitialLoading = true;

  try {
    interstitialAd.load();
  } catch (error) {
    interstitialLoading = false;

    console.warn(
      'Unable to load interstitial ad:',
      error,
    );
  }
}

export function loadRewardedAd(): void {
  if (
    !ADS_CONFIG.enabled ||
    !ADS_CONFIG.rewardedEnabled ||
    !rewardedAd ||
    rewardedLoaded ||
    rewardedLoading
  ) {
    return;
  }

  rewardedLoading = true;

  try {
    rewardedAd.load();
  } catch (error) {
    rewardedLoading = false;

    console.warn(
      'Unable to load rewarded ad:',
      error,
    );
  }
}

function canShowInterstitialNow(
  reason: ShowInterstitialReason,
): boolean {
  if (
    !ADS_CONFIG.enabled ||
    !ADS_CONFIG.interstitialEnabled
  ) {
    return false;
  }

  if (
    !reason.force &&
    reason.previousRouteName &&
    !(ADS_CONFIG.interstitialAfterLeavingRoutes as readonly string[]).includes(
      reason.previousRouteName,
    )
  ) {
    return false;
  }

  if (reason.force) {
    return true;
  }

  completedActionCount += 1;

  if (
    completedActionCount <
    ADS_CONFIG.interstitialEveryCompletedActions
  ) {
    return false;
  }

  const now = Date.now();

  const minGap =
    ADS_CONFIG.interstitialMinSeconds *
    1000;

  if (
    now - lastInterstitialShownAt <
    minGap
  ) {
    return false;
  }

  return true;
}

export async function maybeShowInterstitial(
  reason: ShowInterstitialReason = {},
): Promise<boolean> {
  if (
    !canShowInterstitialNow(
      reason,
    )
  ) {
    return false;
  }

  const canShow =
    await shouldShowAnyAds();

  if (!canShow) {
    return false;
  }

  await preloadAds();

  if (
    !interstitialAd ||
    !interstitialLoaded
  ) {
    loadInterstitialAd();
    return false;
  }

  try {
    lastInterstitialShownAt =
      Date.now();

    completedActionCount = 0;

    await interstitialAd.show();

    return true;
  } catch (error) {
    console.warn(
      'Unable to show interstitial ad:',
      error,
    );

    return false;
  }
}

export async function maybeShowInterstitialForRouteChange(
  previousRouteName?: string,
  nextRouteName?: string,
): Promise<boolean> {
  if (
    !previousRouteName ||
    previousRouteName === nextRouteName
  ) {
    return false;
  }

  return maybeShowInterstitial({
    previousRouteName,
    nextRouteName,
  });
}

export async function showRewardedAd(
  placement: string,
): Promise<boolean> {
  if (
    !ADS_CONFIG.enabled ||
    !ADS_CONFIG.rewardedEnabled
  ) {
    return true;
  }

  const canShow =
    await shouldShowAnyAds();

  if (!canShow) {
    return true;
  }

  await preloadAds();

  if (
    !rewardedAd ||
    !rewardedLoaded
  ) {
    loadRewardedAd();
    return false;
  }

  return new Promise(resolve => {
    let earnedReward = false;
    let resolved = false;

    const cleanup: Array<
      () => void
    > = [];

    const finish = (
      value: boolean,
    ) => {
      if (resolved) {
        return;
      }

      resolved = true;

      cleanup.forEach(
        unsubscribe =>
          unsubscribe(),
      );

      resolve(value);
    };

    cleanup.push(
      rewardedAd!.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
          earnedReward = true;
        },
      ),
    );

    cleanup.push(
      rewardedAd!.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          rewardedLoaded = false;
          rewardedLoading = false;
          loadRewardedAd();
          finish(earnedReward);
        },
      ),
    );

    cleanup.push(
      rewardedAd!.addAdEventListener(
        AdEventType.ERROR,
        error => {
          console.warn(
            `Rewarded ad failed at ${placement}:`,
            error,
          );

          rewardedLoaded = false;
          rewardedLoading = false;
          finish(false);
        },
      ),
    );

    try {
      rewardedAd!.show();
    } catch (error) {
      console.warn(
        `Unable to show rewarded ad at ${placement}:`,
        error,
      );

      finish(false);
    }
  });
}
