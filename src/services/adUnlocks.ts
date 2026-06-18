import AsyncStorage
  from '@react-native-async-storage/async-storage';

import {
  ADS_CONFIG,
  type RewardedGateKey,
} from '../config/adsConfig';

import {
  showRewardedAd,
  shouldShowAnyAds,
} from './adController';

type UnlockRecord = {
  featureKey: string;
  unlockedAt: string;
  expiresAt: string;
};

const STORAGE_KEY =
  '@eastern_destiny/rewarded_unlocks_v1';

async function readUnlocks(): Promise<
  UnlockRecord[]
> {
  try {
    const raw =
      await AsyncStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return [];
    }

    const parsed =
      JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const now = Date.now();

    return parsed.filter(
      item =>
        item &&
        typeof item.featureKey ===
          'string' &&
        typeof item.expiresAt ===
          'string' &&
        new Date(
          item.expiresAt,
        ).getTime() > now,
    );
  } catch (error) {
    console.warn(
      'Unable to read rewarded unlocks:',
      error,
    );

    return [];
  }
}

async function writeUnlocks(
  items: UnlockRecord[],
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(items),
  );
}

export function isRewardGateEnabled(
  gateKey: RewardedGateKey,
): boolean {
  return Boolean(
    ADS_CONFIG.enabled &&
      ADS_CONFIG.rewardedEnabled &&
      ADS_CONFIG.rewardedGates[
        gateKey
      ],
  );
}

export async function isRewardedFeatureUnlocked(
  gateKey: RewardedGateKey,
  featureKey: string,
): Promise<boolean> {
  if (
    !isRewardGateEnabled(gateKey)
  ) {
    return true;
  }

  const shouldShow =
    await shouldShowAnyAds();

  if (!shouldShow) {
    return true;
  }

  const items =
    await readUnlocks();

  return items.some(
    item =>
      item.featureKey ===
      featureKey,
  );
}

export async function unlockRewardedFeature(
  featureKey: string,
): Promise<void> {
  const now = new Date();

  const expiresAt =
    new Date(
      now.getTime() +
        ADS_CONFIG.rewardedUnlockHours *
          60 *
          60 *
          1000,
    );

  const items =
    await readUnlocks();

  await writeUnlocks([
    {
      featureKey,
      unlockedAt:
        now.toISOString(),
      expiresAt:
        expiresAt.toISOString(),
    },
    ...items.filter(
      item =>
        item.featureKey !==
        featureKey,
    ),
  ]);
}

export async function watchRewardedAdAndUnlock(
  gateKey: RewardedGateKey,
  featureKey: string,
): Promise<boolean> {
  if (
    !isRewardGateEnabled(gateKey)
  ) {
    await unlockRewardedFeature(
      featureKey,
    );

    return true;
  }

  const success =
    await showRewardedAd(
      `${gateKey}:${featureKey}`,
    );

  if (success) {
    await unlockRewardedFeature(
      featureKey,
    );
  }

  return success;
}
