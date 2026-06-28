import AsyncStorage
  from '@react-native-async-storage/async-storage';

const STORAGE_KEY =
  '@luna_oracle/moon_dust_rewards_v1';

export type MoonDustUnlockType =
  | 'cardBack'
  | 'theme'
  | 'spread'
  | 'badge'
  | 'oracleGuide';

export type MoonDustUnlock = {
  id: string;
  type: MoonDustUnlockType;
  titleKey: string;
  titleFallback: string;
  descriptionKey: string;
  descriptionFallback: string;
};

export type MoonDustMilestone = {
  day: number;
  moonDust: number;
  unlock?: MoonDustUnlock;
};

export type MoonDustClaimHistory = {
  dateKey: string;
  streakDay: number;
  moonDust: number;
  unlockIds: string[];
  claimedAt: string;
};

export type MoonDustRewardState = {
  balance: number;
  totalEarned: number;
  currentStreak: number;
  bestStreak: number;
  lastClaimDateKey?: string;
  unlockedIds: string[];
  history: MoonDustClaimHistory[];
};

export type MoonDustClaimResult = {
  claimed: boolean;
  alreadyClaimed: boolean;
  state: MoonDustRewardState;
  reward: {
    dateKey: string;
    streakDay: number;
    moonDust: number;
    unlocks: MoonDustUnlock[];
  };
};

export const MOON_DUST_MILESTONES:
  MoonDustMilestone[] = [
    {
      day: 1,
      moonDust: 5,
    },
    {
      day: 2,
      moonDust: 5,
    },
    {
      day: 3,
      moonDust: 10,
      unlock: {
        id: 'card_back_golden_moon',
        type: 'cardBack',
        titleKey:
          'moonDust.unlocks.cardBackGoldenMoon.title',
        titleFallback:
          'Golden Moon Card Back',
        descriptionKey:
          'moonDust.unlocks.cardBackGoldenMoon.description',
        descriptionFallback:
          'A warmer mystical card back for tarot draws.',
      },
    },
    {
      day: 5,
      moonDust: 15,
    },
    {
      day: 7,
      moonDust: 25,
      unlock: {
        id: 'spread_seven_moon_path',
        type: 'spread',
        titleKey:
          'moonDust.unlocks.sevenMoonPath.title',
        titleFallback:
          'Seven Moon Path Spread',
        descriptionKey:
          'moonDust.unlocks.sevenMoonPath.description',
        descriptionFallback:
          'A special 7-card reflective spread for weekly guidance.',
      },
    },
    {
      day: 14,
      moonDust: 35,
      unlock: {
        id: 'theme_love_rose',
        type: 'theme',
        titleKey:
          'moonDust.unlocks.loveRoseTheme.title',
        titleFallback:
          'Love Rose Theme',
        descriptionKey:
          'moonDust.unlocks.loveRoseTheme.description',
        descriptionFallback:
          'A soft rose theme for Love Mode and relationship readings.',
      },
    },
    {
      day: 21,
      moonDust: 50,
      unlock: {
        id: 'guide_moon_priestess',
        type: 'oracleGuide',
        titleKey:
          'moonDust.unlocks.moonPriestess.title',
        titleFallback:
          'Moon Priestess Guide',
        descriptionKey:
          'moonDust.unlocks.moonPriestess.description',
        descriptionFallback:
          'A calmer oracle voice for daily reflections.',
      },
    },
    {
      day: 30,
      moonDust: 80,
      unlock: {
        id: 'badge_lunar_devotee',
        type: 'badge',
        titleKey:
          'moonDust.unlocks.lunarDevotee.title',
        titleFallback:
          'Lunar Devotee Badge',
        descriptionKey:
          'moonDust.unlocks.lunarDevotee.description',
        descriptionFallback:
          'A badge for completing a 30-day ritual streak.',
      },
    },
  ];

const DEFAULT_STATE:
MoonDustRewardState = {
  balance: 0,
  totalEarned: 0,
  currentStreak: 0,
  bestStreak: 0,
  unlockedIds: [],
  history: [],
};

function pad(
  value: number,
): string {
  return String(value).padStart(
    2,
    '0',
  );
}

export function getLocalDateKey(
  date = new Date(),
): string {
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-');
}

function getPreviousDateKey(
  date = new Date(),
): string {
  const previous =
    new Date(date);

  previous.setDate(
    previous.getDate() - 1,
  );

  return getLocalDateKey(
    previous,
  );
}

async function readRawState():
Promise<MoonDustRewardState> {
  const raw =
    await AsyncStorage.getItem(
      STORAGE_KEY,
    );

  if (!raw) {
    return DEFAULT_STATE;
  }

  try {
    const parsed =
      JSON.parse(raw);

    return {
      ...DEFAULT_STATE,
      ...parsed,
      unlockedIds:
        Array.isArray(
          parsed.unlockedIds,
        )
          ? parsed.unlockedIds
          : [],
      history:
        Array.isArray(
          parsed.history,
        )
          ? parsed.history
          : [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

async function writeState(
  state: MoonDustRewardState,
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state),
  );
}

function getMilestoneForStreak(
  streak: number,
): MoonDustMilestone {
  const exact =
    MOON_DUST_MILESTONES.find(
      item => item.day === streak,
    );

  if (exact) {
    return exact;
  }

  if (streak > 30) {
    return {
      day: streak,
      moonDust:
        streak % 10 === 0
          ? 40
          : 12,
    };
  }

  if (streak > 21) {
    return {
      day: streak,
      moonDust: 20,
    };
  }

  if (streak > 14) {
    return {
      day: streak,
      moonDust: 15,
    };
  }

  if (streak > 7) {
    return {
      day: streak,
      moonDust: 12,
    };
  }

  return {
    day: streak,
    moonDust: 8,
  };
}

function getClaimPreview(
  state: MoonDustRewardState,
  date = new Date(),
): {
  alreadyClaimed: boolean;
  nextStreak: number;
  milestone: MoonDustMilestone;
} {
  const today =
    getLocalDateKey(date);

  const alreadyClaimed =
    state.lastClaimDateKey ===
    today;

  const yesterday =
    getPreviousDateKey(date);

  const nextStreak =
    alreadyClaimed
      ? state.currentStreak
      : state.lastClaimDateKey ===
          yesterday
        ? state.currentStreak + 1
        : 1;

  return {
    alreadyClaimed,
    nextStreak,
    milestone:
      getMilestoneForStreak(
        nextStreak,
      ),
  };
}

export async function getMoonDustRewardState():
Promise<MoonDustRewardState> {
  return readRawState();
}

export async function getMoonDustClaimPreview(
  date = new Date(),
): Promise<{
  alreadyClaimed: boolean;
  nextStreak: number;
  moonDust: number;
  unlock?: MoonDustUnlock;
}> {
  const state =
    await readRawState();

  const preview =
    getClaimPreview(
      state,
      date,
    );

  return {
    alreadyClaimed:
      preview.alreadyClaimed,
    nextStreak:
      preview.nextStreak,
    moonDust:
      preview.milestone.moonDust,
    unlock:
      preview.milestone.unlock,
  };
}

export async function claimDailyMoonDust(
  date = new Date(),
): Promise<MoonDustClaimResult> {
  const state =
    await readRawState();

  const today =
    getLocalDateKey(date);

  const preview =
    getClaimPreview(
      state,
      date,
    );

  if (preview.alreadyClaimed) {
    return {
      claimed: false,
      alreadyClaimed: true,
      state,
      reward: {
        dateKey:
          today,
        streakDay:
          state.currentStreak,
        moonDust: 0,
        unlocks: [],
      },
    };
  }

  const milestone =
    preview.milestone;

  const unlocks =
    milestone.unlock &&
    !state.unlockedIds.includes(
      milestone.unlock.id,
    )
      ? [milestone.unlock]
      : [];

  const unlockedIds =
    Array.from(
      new Set([
        ...state.unlockedIds,
        ...unlocks.map(
          item => item.id,
        ),
      ]),
    );

  const nextState:
    MoonDustRewardState = {
      balance:
        state.balance +
        milestone.moonDust,
      totalEarned:
        state.totalEarned +
        milestone.moonDust,
      currentStreak:
        preview.nextStreak,
      bestStreak:
        Math.max(
          state.bestStreak,
          preview.nextStreak,
        ),
      lastClaimDateKey:
        today,
      unlockedIds,
      history: [
        {
          dateKey:
            today,
          streakDay:
            preview.nextStreak,
          moonDust:
            milestone.moonDust,
          unlockIds:
            unlocks.map(
              item => item.id,
            ),
          claimedAt:
            new Date().toISOString(),
        },
        ...state.history,
      ].slice(0, 120),
    };

  await writeState(nextState);

  return {
    claimed: true,
    alreadyClaimed: false,
    state:
      nextState,
    reward: {
      dateKey:
        today,
      streakDay:
        preview.nextStreak,
      moonDust:
        milestone.moonDust,
      unlocks,
    },
  };
}

export async function spendMoonDust(
  amount: number,
): Promise<MoonDustRewardState | undefined> {
  if (amount <= 0) {
    return readRawState();
  }

  const state =
    await readRawState();

  if (state.balance < amount) {
    return undefined;
  }

  const nextState = {
    ...state,
    balance:
      state.balance -
      amount,
  };

  await writeState(nextState);

  return nextState;
}

export async function unlockMoonDustReward(
  unlock: MoonDustUnlock,
): Promise<MoonDustRewardState> {
  const state =
    await readRawState();

  const nextState = {
    ...state,
    unlockedIds:
      Array.from(
        new Set([
          ...state.unlockedIds,
          unlock.id,
        ]),
      ),
  };

  await writeState(nextState);

  return nextState;
}

export async function resetMoonDustRewards():
Promise<void> {
  await AsyncStorage.removeItem(
    STORAGE_KEY,
  );
}
