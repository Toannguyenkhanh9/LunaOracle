import AsyncStorage
  from '@react-native-async-storage/async-storage';

import {
  recordOracleActivity,
} from './oracleEngagement';

const RETENTION_PROGRESS_KEY =
  '@luna_oracle/retention_progress_v1';

const MOON_DUST_KEY =
  '@luna_oracle/moon_dust_rewards_v1';

export type RetentionActivityId =
  | 'journey'
  | 'moodTracker'
  | 'monthlyCalendar'
  | 'oracleGuide'
  | 'dreamJournal'
  | 'relationshipTimeline'
  | 'userProgress';

export type RetentionProgressState = {
  totalActions: number;
  activityCounts:
    Partial<Record<RetentionActivityId, number>>;
  lastActivityAt?: string;
  lastActivityId?: RetentionActivityId;
};

const DEFAULT_STATE:
RetentionProgressState = {
  totalActions: 0,
  activityCounts: {},
};

const ACTIVITY_TO_ORACLE:
Record<RetentionActivityId, Parameters<typeof recordOracleActivity>[0]> = {
  journey: 'dailyRitual',
  moodTracker: 'journal',
  monthlyCalendar: 'moonCalendar',
  oracleGuide: 'dailyRitual',
  dreamJournal: 'journal',
  relationshipTimeline: 'loveMode',
  userProgress: 'weeklyReport',
};

async function readRetentionProgress():
Promise<RetentionProgressState> {
  const raw =
    await AsyncStorage.getItem(
      RETENTION_PROGRESS_KEY,
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
      activityCounts:
        parsed.activityCounts ?? {},
    };
  } catch {
    return DEFAULT_STATE;
  }
}

async function writeRetentionProgress(
  state: RetentionProgressState,
): Promise<void> {
  await AsyncStorage.setItem(
    RETENTION_PROGRESS_KEY,
    JSON.stringify(state),
  );
}

export async function recordRetentionActivity(
  activityId: RetentionActivityId,
): Promise<RetentionProgressState> {
  const state =
    await readRetentionProgress();

  const nextState:
    RetentionProgressState = {
      totalActions:
        state.totalActions + 1,
      activityCounts: {
        ...state.activityCounts,
        [activityId]:
          (state.activityCounts[
            activityId
          ] ?? 0) + 1,
      },
      lastActivityId:
        activityId,
      lastActivityAt:
        new Date().toISOString(),
    };

  await writeRetentionProgress(nextState);

  await recordOracleActivity(
    ACTIVITY_TO_ORACLE[activityId],
  ).catch(error => {
    console.warn(
      'Unable to record mapped oracle activity:',
      error,
    );
  });

  return nextState;
}

export async function getRetentionProgress():
Promise<RetentionProgressState> {
  return readRetentionProgress();
}

export async function addMoonDustReward(
  amount: number,
): Promise<void> {
  if (amount <= 0) {
    return;
  }

  const raw =
    await AsyncStorage.getItem(
      MOON_DUST_KEY,
    );

  let state:
    Record<string, unknown> = {};

  try {
    state = raw
      ? JSON.parse(raw)
      : {};
  } catch {
    state = {};
  }

  await AsyncStorage.setItem(
    MOON_DUST_KEY,
    JSON.stringify({
      ...state,
      balance:
        Number(state.balance ?? 0) +
        amount,
      totalEarned:
        Number(
          state.totalEarned ?? 0,
        ) + amount,
      unlockedIds:
        Array.isArray(
          state.unlockedIds,
        )
          ? state.unlockedIds
          : [],
      history:
        Array.isArray(
          state.history,
        )
          ? state.history
          : [],
    }),
  );
}

export async function resetRetentionProgress():
Promise<void> {
  await AsyncStorage.removeItem(
    RETENTION_PROGRESS_KEY,
  );
}
