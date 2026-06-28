import AsyncStorage
  from '@react-native-async-storage/async-storage';

const PROGRESS_KEY =
  '@luna_oracle/oracle_progress_v1';

const QUEST_KEY =
  '@luna_oracle/daily_quests_v1';

const MOON_DUST_KEY =
  '@luna_oracle/moon_dust_rewards_v1';

export type OracleActivityId =
  | 'drawTarot'
  | 'dailyRitual'
  | 'journal'
  | 'loveMode'
  | 'shareImage'
  | 'askOracle'
  | 'weeklyReport'
  | 'moonCalendar';

export type OracleLevel = {
  level: number;
  titleKey: string;
  titleFallback: string;
  minExp: number;
};

export type DailyQuest = {
  id: string;
  activityId: OracleActivityId;
  titleKey: string;
  titleFallback: string;
  descriptionKey: string;
  descriptionFallback: string;
  routeName: string;
  expReward: number;
  moonDustReward: number;
};

export type OracleProgressState = {
  totalExp: number;
  currentLevel: number;
  activityCounts:
    Partial<Record<OracleActivityId, number>>;
  lastActivityAt?: string;
};

export type DailyQuestState = {
  dateKey: string;
  completedQuestIds: string[];
  claimedQuestIds: string[];
};

export type DailyQuestDashboard = {
  progress: OracleProgressState;
  quests: DailyQuest[];
  questState: DailyQuestState;
  completedCount: number;
  totalCount: number;
  readyToClaimCount: number;
  level: OracleLevel;
  nextLevel?: OracleLevel;
  levelProgress: number;
  expToNextLevel: number;
};

export const ORACLE_LEVELS:
OracleLevel[] = [
  {
    level: 1,
    titleKey: 'oracleLevel.levels.seeker',
    titleFallback: 'Seeker',
    minExp: 0,
  },
  {
    level: 2,
    titleKey: 'oracleLevel.levels.moonStudent',
    titleFallback: 'Moon Student',
    minExp: 60,
  },
  {
    level: 3,
    titleKey: 'oracleLevel.levels.cardReader',
    titleFallback: 'Card Reader',
    minExp: 150,
  },
  {
    level: 4,
    titleKey: 'oracleLevel.levels.starListener',
    titleFallback: 'Star Listener',
    minExp: 280,
  },
  {
    level: 5,
    titleKey: 'oracleLevel.levels.moonReader',
    titleFallback: 'Moon Reader',
    minExp: 450,
  },
  {
    level: 6,
    titleKey: 'oracleLevel.levels.oracleKeeper',
    titleFallback: 'Oracle Keeper',
    minExp: 680,
  },
  {
    level: 7,
    titleKey: 'oracleLevel.levels.shadowGuide',
    titleFallback: 'Shadow Guide',
    minExp: 980,
  },
  {
    level: 8,
    titleKey: 'oracleLevel.levels.starOracle',
    titleFallback: 'Star Oracle',
    minExp: 1350,
  },
  {
    level: 9,
    titleKey: 'oracleLevel.levels.highPriestess',
    titleFallback: 'High Priestess',
    minExp: 1800,
  },
  {
    level: 10,
    titleKey: 'oracleLevel.levels.mysticGuide',
    titleFallback: 'Mystic Guide',
    minExp: 2400,
  },
];

const ACTIVITY_EXP:
Record<OracleActivityId, number> = {
  drawTarot: 5,
  dailyRitual: 20,
  journal: 10,
  loveMode: 8,
  shareImage: 15,
  askOracle: 10,
  weeklyReport: 12,
  moonCalendar: 6,
};

const DEFAULT_PROGRESS:
OracleProgressState = {
  totalExp: 0,
  currentLevel: 1,
  activityCounts: {},
};

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function getQuestDateKey(
  date = new Date(),
): string {
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-');
}

function getDayIndex(
  date = new Date(),
): number {
  return getQuestDateKey(date)
    .replace(/-/g, '')
    .split('')
    .reduce((sum, char) =>
      sum + Number(char),
    0);
}

function getLevelForExp(
  totalExp: number,
): OracleLevel {
  return (
    [...ORACLE_LEVELS]
      .reverse()
      .find(item =>
        totalExp >= item.minExp,
      ) ?? ORACLE_LEVELS[0]
  );
}

function getNextLevel(
  totalExp: number,
): OracleLevel | undefined {
  return ORACLE_LEVELS.find(
    item => item.minExp > totalExp,
  );
}

function normalizeProgress(
  progress: OracleProgressState,
): OracleProgressState {
  return {
    ...progress,
    currentLevel:
      getLevelForExp(
        progress.totalExp,
      ).level,
  };
}

async function readProgress():
Promise<OracleProgressState> {
  const raw =
    await AsyncStorage.getItem(PROGRESS_KEY);

  if (!raw) {
    return DEFAULT_PROGRESS;
  }

  try {
    return normalizeProgress({
      ...DEFAULT_PROGRESS,
      ...JSON.parse(raw),
    });
  } catch {
    return DEFAULT_PROGRESS;
  }
}

async function writeProgress(
  progress: OracleProgressState,
): Promise<void> {
  await AsyncStorage.setItem(
    PROGRESS_KEY,
    JSON.stringify(
      normalizeProgress(progress),
    ),
  );
}

function buildQuest(
  activityId: OracleActivityId,
  index: number,
): DailyQuest {
  const base:
Record<OracleActivityId, Omit<DailyQuest, 'id'>> = {
    dailyRitual: {
      activityId: 'dailyRitual',
      titleKey: 'dailyQuest.quests.dailyRitual.title',
      titleFallback: 'Complete Daily Ritual',
      descriptionKey: 'dailyQuest.quests.dailyRitual.description',
      descriptionFallback: 'Check in, choose your mood, draw your card, and save your ritual.',
      routeName: 'DailyRitual',
      expReward: 20,
      moonDustReward: 12,
    },
    drawTarot: {
      activityId: 'drawTarot',
      titleKey: 'dailyQuest.quests.drawTarot.title',
      titleFallback: 'Draw a Tarot Card',
      descriptionKey: 'dailyQuest.quests.drawTarot.description',
      descriptionFallback: 'Open Tarot Reading and reveal a card for today.',
      routeName: 'TarotReading',
      expReward: 5,
      moonDustReward: 8,
    },
    journal: {
      activityId: 'journal',
      titleKey: 'dailyQuest.quests.journal.title',
      titleFallback: 'Write a Journal Note',
      descriptionKey: 'dailyQuest.quests.journal.description',
      descriptionFallback: 'Save one short reflection in your tarot journal.',
      routeName: 'AdvancedTarotJournal',
      expReward: 10,
      moonDustReward: 10,
    },
    loveMode: {
      activityId: 'loveMode',
      titleKey: 'dailyQuest.quests.loveMode.title',
      titleFallback: 'Check Love Mode',
      descriptionKey: 'dailyQuest.quests.loveMode.description',
      descriptionFallback: 'Open Love Mode and read today’s relationship signal.',
      routeName: 'LoveModeAdvanced',
      expReward: 8,
      moonDustReward: 10,
    },
    shareImage: {
      activityId: 'shareImage',
      titleKey: 'dailyQuest.quests.shareImage.title',
      titleFallback: 'Create a Share Image',
      descriptionKey: 'dailyQuest.quests.shareImage.description',
      descriptionFallback: 'Open share templates or share one reading image.',
      routeName: 'SocialShareTemplates',
      expReward: 15,
      moonDustReward: 10,
    },
    askOracle: {
      activityId: 'askOracle',
      titleKey: 'dailyQuest.quests.askOracle.title',
      titleFallback: 'Ask the Oracle',
      descriptionKey: 'dailyQuest.quests.askOracle.description',
      descriptionFallback: 'Ask one calm question and receive a reflective answer.',
      routeName: 'AskOracle',
      expReward: 10,
      moonDustReward: 10,
    },
    weeklyReport: {
      activityId: 'weeklyReport',
      titleKey: 'dailyQuest.quests.weeklyReport.title',
      titleFallback: 'Open Weekly Report',
      descriptionKey: 'dailyQuest.quests.weeklyReport.description',
      descriptionFallback: 'Review your weekly energy, tarot pattern, and next action.',
      routeName: 'WeeklyReport',
      expReward: 12,
      moonDustReward: 12,
    },
    moonCalendar: {
      activityId: 'moonCalendar',
      titleKey: 'dailyQuest.quests.moonCalendar.title',
      titleFallback: 'Check Moon Calendar',
      descriptionKey: 'dailyQuest.quests.moonCalendar.description',
      descriptionFallback: 'Open the Moon Calendar and read the lunar focus.',
      routeName: 'MoonCalendar',
      expReward: 6,
      moonDustReward: 8,
    },
  };

  return {
    id: `${activityId}-${index}`,
    ...base[activityId],
  };
}

export function buildDailyQuests(
  date = new Date(),
): DailyQuest[] {
  const dayIndex = getDayIndex(date);

  const rotating:
OracleActivityId[] = [
    'askOracle',
    'loveMode',
    'journal',
    'shareImage',
    'weeklyReport',
    'moonCalendar',
  ];

  const activityIds:
OracleActivityId[] = [
    'dailyRitual',
    'drawTarot',
    rotating[dayIndex % rotating.length],
    rotating[(dayIndex + 2) % rotating.length],
  ];

  return Array.from(new Set(activityIds))
    .slice(0, 3)
    .map((activityId, index) =>
      buildQuest(activityId, index),
    );
}

async function readQuestState(
  date = new Date(),
): Promise<DailyQuestState> {
  const dateKey = getQuestDateKey(date);
  const raw = await AsyncStorage.getItem(QUEST_KEY);

  if (!raw) {
    return {
      dateKey,
      completedQuestIds: [],
      claimedQuestIds: [],
    };
  }

  try {
    const parsed = JSON.parse(raw);

    if (parsed.dateKey !== dateKey) {
      return {
        dateKey,
        completedQuestIds: [],
        claimedQuestIds: [],
      };
    }

    return {
      dateKey,
      completedQuestIds:
        Array.isArray(parsed.completedQuestIds)
          ? parsed.completedQuestIds
          : [],
      claimedQuestIds:
        Array.isArray(parsed.claimedQuestIds)
          ? parsed.claimedQuestIds
          : [],
    };
  } catch {
    return {
      dateKey,
      completedQuestIds: [],
      claimedQuestIds: [],
    };
  }
}

async function writeQuestState(
  state: DailyQuestState,
): Promise<void> {
  await AsyncStorage.setItem(
    QUEST_KEY,
    JSON.stringify(state),
  );
}

async function awardMoonDust(
  amount: number,
): Promise<void> {
  if (amount <= 0) {
    return;
  }

  const raw =
    await AsyncStorage.getItem(MOON_DUST_KEY);

  let state:
Record<string, unknown> = {};

  try {
    state = raw ? JSON.parse(raw) : {};
  } catch {
    state = {};
  }

  const balance =
    Number(state.balance ?? 0);

  const totalEarned =
    Number(state.totalEarned ?? 0);

  await AsyncStorage.setItem(
    MOON_DUST_KEY,
    JSON.stringify({
      ...state,
      balance: balance + amount,
      totalEarned:
        totalEarned + amount,
      unlockedIds:
        Array.isArray(state.unlockedIds)
          ? state.unlockedIds
          : [],
      history:
        Array.isArray(state.history)
          ? state.history
          : [],
    }),
  );
}

export async function getOracleProgress():
Promise<OracleProgressState> {
  return readProgress();
}

export async function recordOracleActivity(
  activityId: OracleActivityId,
  customExp?: number,
): Promise<OracleProgressState> {
  const progress =
    await readProgress();

  const exp =
    customExp ??
    ACTIVITY_EXP[activityId] ??
    5;

  const nextProgress:
OracleProgressState = normalizeProgress({
    ...progress,
    totalExp:
      progress.totalExp + exp,
    activityCounts: {
      ...progress.activityCounts,
      [activityId]:
        (progress.activityCounts[activityId] ?? 0) + 1,
    },
    lastActivityAt:
      new Date().toISOString(),
  });

  await writeProgress(nextProgress);

  const matchingQuestIds =
    buildDailyQuests()
      .filter(quest =>
        quest.activityId === activityId,
      )
      .map(quest => quest.id);

  if (matchingQuestIds.length) {
    const questState =
      await readQuestState();

    await writeQuestState({
      ...questState,
      completedQuestIds:
        Array.from(
          new Set([
            ...questState.completedQuestIds,
            ...matchingQuestIds,
          ]),
        ),
    });
  }

  return nextProgress;
}

export async function markDailyQuestCompleted(
  questId: string,
): Promise<DailyQuestState> {
  const state =
    await readQuestState();

  const nextState = {
    ...state,
    completedQuestIds:
      Array.from(
        new Set([
          ...state.completedQuestIds,
          questId,
        ]),
      ),
  };

  await writeQuestState(nextState);

  const quest =
    buildDailyQuests().find(
      item => item.id === questId,
    );

  if (quest) {
    await recordOracleActivity(
      quest.activityId,
      quest.expReward,
    );
  }

  return nextState;
}

export async function claimDailyQuestReward(
  questId: string,
): Promise<{
  success: boolean;
  moonDust: number;
  questState: DailyQuestState;
}> {
  const state =
    await readQuestState();

  if (
    !state.completedQuestIds.includes(questId) ||
    state.claimedQuestIds.includes(questId)
  ) {
    return {
      success: false,
      moonDust: 0,
      questState: state,
    };
  }

  const quest =
    buildDailyQuests().find(
      item => item.id === questId,
    );

  const moonDust =
    quest?.moonDustReward ?? 0;

  await awardMoonDust(moonDust);

  const nextState = {
    ...state,
    claimedQuestIds:
      Array.from(
        new Set([
          ...state.claimedQuestIds,
          questId,
        ]),
      ),
  };

  await writeQuestState(nextState);

  return {
    success: true,
    moonDust,
    questState: nextState,
  };
}

export async function claimAllDailyQuestRewards():
Promise<{
  claimedCount: number;
  moonDust: number;
  questState: DailyQuestState;
}> {
  let state =
    await readQuestState();

  let claimedCount = 0;
  let moonDust = 0;

  for (const quest of buildDailyQuests()) {
    if (
      state.completedQuestIds.includes(quest.id) &&
      !state.claimedQuestIds.includes(quest.id)
    ) {
      const result =
        await claimDailyQuestReward(quest.id);

      if (result.success) {
        claimedCount += 1;
        moonDust += result.moonDust;
        state = result.questState;
      }
    }
  }

  return {
    claimedCount,
    moonDust,
    questState: state,
  };
}

export async function getDailyQuestDashboard():
Promise<DailyQuestDashboard> {
  const [
    progress,
    questState,
  ] = await Promise.all([
    readProgress(),
    readQuestState(),
  ]);

  const quests =
    buildDailyQuests();

  const completedCount =
    quests.filter(quest =>
      questState.completedQuestIds.includes(quest.id),
    ).length;

  const readyToClaimCount =
    quests.filter(quest =>
      questState.completedQuestIds.includes(quest.id) &&
      !questState.claimedQuestIds.includes(quest.id),
    ).length;

  const level =
    getLevelForExp(progress.totalExp);

  const nextLevel =
    getNextLevel(progress.totalExp);

  const previousMin =
    level.minExp;

  const nextMin =
    nextLevel?.minExp ??
    Math.max(
      previousMin + 1,
      progress.totalExp,
    );

  const levelProgress =
    nextLevel
      ? Math.round(
          ((progress.totalExp - previousMin) /
            (nextMin - previousMin)) *
            100,
        )
      : 100;

  return {
    progress,
    quests,
    questState,
    completedCount,
    totalCount: quests.length,
    readyToClaimCount,
    level,
    nextLevel,
    levelProgress,
    expToNextLevel:
      nextLevel
        ? nextLevel.minExp - progress.totalExp
        : 0,
  };
}

export async function resetOracleProgress():
Promise<void> {
  await AsyncStorage.multiRemove([
    PROGRESS_KEY,
    QUEST_KEY,
  ]);
}
