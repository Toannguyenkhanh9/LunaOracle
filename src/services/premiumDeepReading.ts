import AsyncStorage
  from '@react-native-async-storage/async-storage';

import {
  drawTarotCards,
  type TarotDraw,
} from './tarot';

import {
  buildTarotCollectionStats,
} from './tarotCollection';

import {
  getMoonDustRewardState,
  spendMoonDust,
} from './moonDustRewards';

export type PremiumDeepReadingType =
  | 'tarot'
  | 'love'
  | 'year'
  | 'birthChart';

export type PremiumDeepReading = {
  type: PremiumDeepReadingType;
  titleId: string;
  summaryId: string;
  sections: {
    id: string;
    titleId: string;
    bodyId: string;
    locked: boolean;
  }[];
  draw: TarotDraw;
  score: number;
  unlocked: boolean;
};

const UNLOCK_KEY =
  '@luna_oracle/premium_deep_reading_unlocked_v1';

const UNLOCK_COST = 180;

export async function isPremiumDeepReadingUnlocked():
Promise<boolean> {
  const raw =
    await AsyncStorage.getItem(
      UNLOCK_KEY,
    );

  return raw === 'true';
}

export async function unlockPremiumDeepReadingWithMoonDust():
Promise<boolean> {
  const unlocked =
    await isPremiumDeepReadingUnlocked();

  if (unlocked) {
    return true;
  }

  const paid =
    await spendMoonDust(
      UNLOCK_COST,
    );

  if (!paid) {
    return false;
  }

  await AsyncStorage.setItem(
    UNLOCK_KEY,
    'true',
  );

  return true;
}

export function getPremiumDeepReadingCost():
number {
  return UNLOCK_COST;
}

function getTitleId(
  type: PremiumDeepReadingType,
): string {
  return `premiumDeepReading.types.${type}.title`;
}

function getSummaryId(
  type: PremiumDeepReadingType,
): string {
  return `premiumDeepReading.types.${type}.summary`;
}

export async function buildPremiumDeepReading(
  type: PremiumDeepReadingType,
): Promise<PremiumDeepReading> {
  const unlocked =
    await isPremiumDeepReadingUnlocked();

  const tarotStats =
    await buildTarotCollectionStats()
      .catch(() => undefined);

  const moonDust =
    await getMoonDustRewardState()
      .catch(() => undefined);

  const [draw] =
    drawTarotCards(
      1,
      `premium-${type}-${new Date()
        .toISOString()
        .slice(0, 10)}`,
    );

  const baseScore =
    68 +
    Math.min(
      16,
      tarotStats?.discovered ?? 0,
    ) +
    Math.min(
      15,
      moonDust?.currentStreak ?? 0,
    );

  const score =
    Math.max(
      30,
      Math.min(
        99,
        baseScore,
      ),
    );

  return {
    type,
    titleId:
      getTitleId(type),
    summaryId:
      getSummaryId(type),
    draw,
    score,
    unlocked,
    sections: [
      {
        id: 'overview',
        titleId:
          'premiumDeepReading.sections.overview.title',
        bodyId:
          `premiumDeepReading.types.${type}.overview`,
        locked: false,
      },
      {
        id: 'patterns',
        titleId:
          'premiumDeepReading.sections.patterns.title',
        bodyId:
          `premiumDeepReading.types.${type}.patterns`,
        locked:
          !unlocked,
      },
      {
        id: 'shadow',
        titleId:
          'premiumDeepReading.sections.shadow.title',
        bodyId:
          `premiumDeepReading.types.${type}.shadow`,
        locked:
          !unlocked,
      },
      {
        id: 'timing',
        titleId:
          'premiumDeepReading.sections.timing.title',
        bodyId:
          `premiumDeepReading.types.${type}.timing`,
        locked:
          !unlocked,
      },
      {
        id: 'action',
        titleId:
          'premiumDeepReading.sections.action.title',
        bodyId:
          `premiumDeepReading.types.${type}.action`,
        locked:
          !unlocked,
      },
    ],
  };
}
