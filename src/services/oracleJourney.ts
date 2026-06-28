import AsyncStorage
  from '@react-native-async-storage/async-storage';

import {
  addMoonDustReward,
  recordRetentionActivity,
} from './retentionProgress';

const STORAGE_KEY =
  '@luna_oracle/oracle_journey_v1';

export type OracleJourneyId =
  | 'selfLove7'
  | 'careerClarity7'
  | 'moonHealing30'
  | 'tarotReflection21';

export type OracleJourneyDay = {
  day: number;
  titleKey: string;
  titleFallback: string;
  promptKey: string;
  promptFallback: string;
  actionKey: string;
  actionFallback: string;
  moonDustReward: number;
};

export type OracleJourney = {
  id: OracleJourneyId;
  days: number;
  titleKey: string;
  titleFallback: string;
  descriptionKey: string;
  descriptionFallback: string;
  color: string;
  accent: string;
};

export type OracleJourneyState = {
  activeJourneyId?: OracleJourneyId;
  startedAt?: string;
  completedDayKeys: string[];
  claimedDayKeys: string[];
};

export type OracleJourneyDashboard = {
  journeys: OracleJourney[];
  activeJourney?: OracleJourney;
  activeDay?: OracleJourneyDay;
  activeDayKey?: string;
  progress: number;
  completedCount: number;
  state: OracleJourneyState;
};

const DEFAULT_STATE:
OracleJourneyState = {
  completedDayKeys: [],
  claimedDayKeys: [],
};

export const ORACLE_JOURNEYS:
OracleJourney[] = [
  {
    id: 'selfLove7',
    days: 7,
    titleKey:
      'journey.items.selfLove7.title',
    titleFallback:
      '7 Days of Self-Love',
    descriptionKey:
      'journey.items.selfLove7.description',
    descriptionFallback:
      'A gentle journey for self-worth, softness, and emotional repair.',
    color: '#351529',
    accent: '#E8A5C3',
  },
  {
    id: 'careerClarity7',
    days: 7,
    titleKey:
      'journey.items.careerClarity7.title',
    titleFallback:
      '7 Days of Career Clarity',
    descriptionKey:
      'journey.items.careerClarity7.description',
    descriptionFallback:
      'A practical journey for focus, direction, and aligned work.',
    color: '#1B1537',
    accent: '#D9B76E',
  },
  {
    id: 'moonHealing30',
    days: 30,
    titleKey:
      'journey.items.moonHealing30.title',
    titleFallback:
      '30 Days Moon Healing',
    descriptionKey:
      'journey.items.moonHealing30.description',
    descriptionFallback:
      'A longer healing path through moon rhythm, release, and renewal.',
    color: '#08071A',
    accent: '#9A8CFF',
  },
  {
    id: 'tarotReflection21',
    days: 21,
    titleKey:
      'journey.items.tarotReflection21.title',
    titleFallback:
      '21 Days Tarot Reflection',
    descriptionKey:
      'journey.items.tarotReflection21.description',
    descriptionFallback:
      'A tarot-based path for noticing patterns and inner guidance.',
    color: '#2B1D12',
    accent: '#E7BE5B',
  },
];

function pad(
  value: number,
): string {
  return String(value).padStart(
    2,
    '0',
  );
}

function dateKey(
  date = new Date(),
): string {
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-');
}

function daysBetween(
  startDate: string,
  end = new Date(),
): number {
  const start =
    new Date(startDate);

  start.setHours(0, 0, 0, 0);

  const current =
    new Date(end);

  current.setHours(0, 0, 0, 0);

  return Math.max(
    0,
    Math.floor(
      (current.getTime() -
        start.getTime()) /
        86400000,
    ),
  );
}

function getDayKey(
  journeyId: OracleJourneyId,
  day: number,
): string {
  return `${journeyId}:${day}`;
}

function getJourney(
  id?: OracleJourneyId,
): OracleJourney | undefined {
  return ORACLE_JOURNEYS.find(
    item => item.id === id,
  );
}

async function readState():
Promise<OracleJourneyState> {
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
      completedDayKeys:
        Array.isArray(
          parsed.completedDayKeys,
        )
          ? parsed.completedDayKeys
          : [],
      claimedDayKeys:
        Array.isArray(
          parsed.claimedDayKeys,
        )
          ? parsed.claimedDayKeys
          : [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

async function writeState(
  state: OracleJourneyState,
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state),
  );
}

export function buildJourneyDay(
  journeyId: OracleJourneyId,
  day: number,
): OracleJourneyDay {
  return {
    day,
    titleKey:
      `journey.days.${journeyId}.${day}.title`,
    titleFallback:
      `Day ${day}`,
    promptKey:
      `journey.days.${journeyId}.${day}.prompt`,
    promptFallback:
      journeyId === 'selfLove7'
        ? 'What part of myself needs more kindness today?'
        : journeyId === 'careerClarity7'
          ? 'Which task would create the most clarity today?'
          : journeyId === 'moonHealing30'
            ? 'What am I ready to release gently?'
            : 'What card or pattern is asking for attention today?',
    actionKey:
      `journey.days.${journeyId}.${day}.action`,
    actionFallback:
      journeyId === 'selfLove7'
        ? 'Write one sentence of self-support.'
        : journeyId === 'careerClarity7'
          ? 'Finish one small focused task.'
          : journeyId === 'moonHealing30'
            ? 'Take three slow breaths and name what can soften.'
            : 'Draw one card and write a short note.',
    moonDustReward:
      day % 7 === 0
        ? 25
        : 10,
  };
}

export async function startOracleJourney(
  journeyId: OracleJourneyId,
): Promise<OracleJourneyState> {
  const state:
    OracleJourneyState = {
      activeJourneyId:
        journeyId,
      startedAt:
        dateKey(),
      completedDayKeys: [],
      claimedDayKeys: [],
  };

  await writeState(state);
  await recordRetentionActivity(
    'journey',
  );

  return state;
}

export async function getOracleJourneyDashboard():
Promise<OracleJourneyDashboard> {
  const state =
    await readState();

  const activeJourney =
    getJourney(
      state.activeJourneyId,
    );

  if (!activeJourney || !state.startedAt) {
    return {
      journeys:
        ORACLE_JOURNEYS,
      progress: 0,
      completedCount: 0,
      state,
    };
  }

  const activeDayNumber =
    Math.min(
      activeJourney.days,
      daysBetween(
        state.startedAt,
      ) + 1,
    );

  const activeDay =
    buildJourneyDay(
      activeJourney.id,
      activeDayNumber,
    );

  const activeDayKey =
    getDayKey(
      activeJourney.id,
      activeDayNumber,
    );

  const completedCount =
    state.completedDayKeys.filter(
      key =>
        key.startsWith(
          `${activeJourney.id}:`,
        ),
    ).length;

  return {
    journeys:
      ORACLE_JOURNEYS,
    activeJourney,
    activeDay,
    activeDayKey,
    completedCount,
    progress:
      Math.round(
        (completedCount /
          activeJourney.days) *
          100,
      ),
    state,
  };
}

export async function completeActiveJourneyDay():
Promise<OracleJourneyDashboard> {
  const dashboard =
    await getOracleJourneyDashboard();

  if (
    !dashboard.activeJourney ||
    !dashboard.activeDay ||
    !dashboard.activeDayKey
  ) {
    return dashboard;
  }

  const state =
    dashboard.state;

  const nextState:
    OracleJourneyState = {
      ...state,
      completedDayKeys:
        Array.from(
          new Set([
            ...state.completedDayKeys,
            dashboard.activeDayKey,
          ]),
        ),
    };

  await writeState(nextState);
  await recordRetentionActivity(
    'journey',
  );

  return getOracleJourneyDashboard();
}

export async function claimActiveJourneyDayReward():
Promise<{
  success: boolean;
  reward: number;
  dashboard: OracleJourneyDashboard;
}> {
  const dashboard =
    await getOracleJourneyDashboard();

  if (
    !dashboard.activeDay ||
    !dashboard.activeDayKey ||
    !dashboard.state.completedDayKeys.includes(
      dashboard.activeDayKey,
    ) ||
    dashboard.state.claimedDayKeys.includes(
      dashboard.activeDayKey,
    )
  ) {
    return {
      success: false,
      reward: 0,
      dashboard,
    };
  }

  await addMoonDustReward(
    dashboard.activeDay.moonDustReward,
  );

  await writeState({
    ...dashboard.state,
    claimedDayKeys:
      Array.from(
        new Set([
          ...dashboard.state.claimedDayKeys,
          dashboard.activeDayKey,
        ]),
      ),
  });

  return {
    success: true,
    reward:
      dashboard.activeDay.moonDustReward,
    dashboard:
      await getOracleJourneyDashboard(),
  };
}

export async function resetOracleJourney():
Promise<void> {
  await AsyncStorage.removeItem(
    STORAGE_KEY,
  );
}
