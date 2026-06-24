import {
  drawTarotCards,
  type TarotDraw,
} from './tarot';

import {
  buildDailyPersonalizedInsight,
  type DailyPersonalizedInsight,
} from './dailyPersonalizedInsight';

import {
  ensureDefaultBirthProfile,
  getActiveBirthProfile,
  type BirthProfile,
} from './birthProfiles';

import {
  buildLoveCenter,
  type LoveCenterResult,
} from './loveCenter';

import {
  buildTarotCollectionStats,
  type TarotCollectionStats,
} from './tarotCollection';

export type MysticHomeFeedResult = {
  profile: BirthProfile;
  dailyInsight: DailyPersonalizedInsight;
  love: LoveCenterResult;
  dailyCard: TarotDraw;
  collection: TarotCollectionStats;
  greetingId: string;
};

function pickGreeting(
  energyScore: number,
): string {
  if (energyScore >= 82) {
    return 'radiant';
  }

  if (energyScore >= 68) {
    return 'steady';
  }

  if (energyScore >= 50) {
    return 'gentle';
  }

  return 'rest';
}

export async function buildMysticHomeFeed():
Promise<MysticHomeFeedResult> {
  const profile =
    (await getActiveBirthProfile()) ??
    (await ensureDefaultBirthProfile());

  const dailyInsight =
    await buildDailyPersonalizedInsight(
      profile,
    );

  const love =
    await buildLoveCenter();

  const seed =
    `${profile.id}-${new Date()
      .toISOString()
      .slice(0, 10)}-home`;

  const [dailyCard] =
    drawTarotCards(
      1,
      seed,
    );

  const collection =
    await buildTarotCollectionStats();

  return {
    profile,
    dailyInsight,
    love,
    dailyCard,
    collection,
    greetingId:
      pickGreeting(
        dailyInsight.energyScore,
      ),
  };
}
