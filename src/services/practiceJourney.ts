import AsyncStorage from '@react-native-async-storage/async-storage';

export type PracticeJourneyLength =
  | 7
  | 21
  | 49;

export type PracticeJourneyTaskType =
  | 'incense'
  | 'meditation'
  | 'chant'
  | 'prayer'
  | 'audio'
  | 'journal'
  | 'breath'
  | 'dailyRitual';

export type PracticeJourneyRoute =
  | 'Temple'
  | 'Meditation'
  | 'ChantCounter'
  | 'Prayer'
  | 'SpiritualAudio'
  | 'PeaceJournal'
  | 'DailyRitual';

export type PracticeJourneyTask = {
  id: string;
  type: PracticeJourneyTaskType;
  titleKey: string;
  descriptionKey: string;
  target: number;
  unitKey: string;
  route: PracticeJourneyRoute;
};

export type PracticeJourneyDay = {
  dayNumber: number;
  weekNumber: number;
  themeKey: string;
  tasks: PracticeJourneyTask[];
};

export type ActivePracticeJourney = {
  id: string;
  length: PracticeJourneyLength;
  startedAt: string;
  startDateKey: string;
  status: 'active' | 'completed';
  completedAt?: string;
  completedTaskIdsByDay: Record<string, string[]>;
  activityCountsByDay: Record<
    string,
    Partial<
      Record<
        PracticeJourneyTaskType,
        number
      >
    >
  >;
};

export type CompletedPracticeJourney = {
  id: string;
  length: PracticeJourneyLength;
  startedAt: string;
  completedAt: string;
};

export type PracticeJourneyState = {
  version: 1;
  activeJourney: ActivePracticeJourney | null;
  completedJourneys: CompletedPracticeJourney[];
};

export type PracticeJourneySummary = {
  totalDays: number;
  unlockedDay: number;
  completedDays: number;
  completedTasks: number;
  totalTasks: number;
  progress: number;
};

const STORAGE_KEY =
  '@online_pagoda/practice_journey_v1';

const DEFAULT_STATE: PracticeJourneyState = {
  version: 1,
  activeJourney: null,
  completedJourneys: [],
};

const CHANT_TARGETS = [
  18,
  21,
  49,
  54,
  108,
  216,
  1080,
];

let mutationQueue: Promise<PracticeJourneyState> =
  Promise.resolve(DEFAULT_STATE);

function createId(): string {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function getLocalDateKey(
  value = new Date(),
): string {
  const year = value.getFullYear();
  const month = String(
    value.getMonth() + 1,
  ).padStart(2, '0');
  const day = String(
    value.getDate(),
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}


function differenceInCalendarDays(
  fromDateKey: string,
  toDateKey: string,
): number {
  const [fromYear, fromMonth, fromDay] =
    fromDateKey.split('-').map(Number);

  const [toYear, toMonth, toDay] =
    toDateKey.split('-').map(Number);

  const fromUtc = Date.UTC(
    fromYear,
    fromMonth - 1,
    fromDay,
  );

  const toUtc = Date.UTC(
    toYear,
    toMonth - 1,
    toDay,
  );

  const oneDay =
    24 * 60 * 60 * 1000;

  return Math.max(
    0,
    Math.round(
      (toUtc - fromUtc) / oneDay,
    ),
  );
}

function makeTask(
  dayNumber: number,
  index: number,
  type: PracticeJourneyTaskType,
  target: number,
  route: PracticeJourneyRoute,
): PracticeJourneyTask {
  return {
    id: `day-${dayNumber}-${type}-${index}`,
    type,
    titleKey:
      `practiceJourney.tasks.${type}.title`,
    descriptionKey:
      `practiceJourney.tasks.${type}.description`,
    target,
    unitKey:
      `practiceJourney.units.${type}`,
    route,
  };
}

function getWeekTargets(
  weekIndex: number,
): {
  meditationMinutes: number;
  chantCount: number;
  breathCount: number;
} {
  return {
    meditationMinutes: Math.min(
      5 + weekIndex * 2,
      20,
    ),

    chantCount:
      CHANT_TARGETS[
        Math.min(
          weekIndex,
          CHANT_TARGETS.length - 1,
        )
      ],

    breathCount: Math.min(
      12 + weekIndex * 3,
      36,
    ),
  };
}

export function getPracticeJourneyDay(
  length: PracticeJourneyLength,
  dayNumber: number,
): PracticeJourneyDay {
  const safeDay = Math.min(
    Math.max(1, dayNumber),
    length,
  );

  const weekIndex = Math.floor(
    (safeDay - 1) / 7,
  );

  const cycleDay =
    ((safeDay - 1) % 7) + 1;

  const targets =
    getWeekTargets(weekIndex);

  let tasks: PracticeJourneyTask[];

  switch (cycleDay) {
    case 1:
      tasks = [
        makeTask(
          safeDay,
          1,
          'incense',
          1,
          'Temple',
        ),
        makeTask(
          safeDay,
          2,
          'meditation',
          targets.meditationMinutes,
          'Meditation',
        ),
      ];
      break;

    case 2:
      tasks = [
        makeTask(
          safeDay,
          1,
          'chant',
          targets.chantCount,
          'ChantCounter',
        ),
        makeTask(
          safeDay,
          2,
          'prayer',
          1,
          'Prayer',
        ),
      ];
      break;

    case 3:
      tasks = [
        makeTask(
          safeDay,
          1,
          'meditation',
          targets.meditationMinutes,
          'Meditation',
        ),
        makeTask(
          safeDay,
          2,
          'journal',
          1,
          'PeaceJournal',
        ),
      ];
      break;

    case 4:
      tasks = [
        makeTask(
          safeDay,
          1,
          'breath',
          targets.breathCount,
          'ChantCounter',
        ),
        makeTask(
          safeDay,
          2,
          'audio',
          1,
          'SpiritualAudio',
        ),
      ];
      break;

    case 5:
      tasks = [
        makeTask(
          safeDay,
          1,
          'incense',
          1,
          'Temple',
        ),
        makeTask(
          safeDay,
          2,
          'chant',
          targets.chantCount,
          'ChantCounter',
        ),
        makeTask(
          safeDay,
          3,
          'prayer',
          1,
          'Prayer',
        ),
      ];
      break;

    case 6:
      tasks = [
        makeTask(
          safeDay,
          1,
          'meditation',
          targets.meditationMinutes,
          'Meditation',
        ),
        makeTask(
          safeDay,
          2,
          'audio',
          1,
          'SpiritualAudio',
        ),
        makeTask(
          safeDay,
          3,
          'journal',
          1,
          'PeaceJournal',
        ),
      ];
      break;

    case 7:
    default:
      tasks = [
        makeTask(
          safeDay,
          1,
          'dailyRitual',
          1,
          'DailyRitual',
        ),
        makeTask(
          safeDay,
          2,
          'journal',
          1,
          'PeaceJournal',
        ),
      ];
      break;
  }

  return {
    dayNumber: safeDay,
    weekNumber: weekIndex + 1,
    themeKey:
      `practiceJourney.themes.day${cycleDay}`,
    tasks,
  };
}

export function getPracticeJourneyPlan(
  length: PracticeJourneyLength,
): PracticeJourneyDay[] {
  return Array.from(
    {
      length,
    },
    (_, index) =>
      getPracticeJourneyDay(
        length,
        index + 1,
      ),
  );
}

function normalizeState(
  value: unknown,
): PracticeJourneyState {
  if (
    !value ||
    typeof value !== 'object'
  ) {
    return DEFAULT_STATE;
  }

  const raw =
    value as Partial<PracticeJourneyState>;

  const active =
    raw.activeJourney &&
    typeof raw.activeJourney ===
      'object'
      ? {
          ...raw.activeJourney,
          completedTaskIdsByDay:
            raw.activeJourney
              .completedTaskIdsByDay ??
            {},
          activityCountsByDay:
            raw.activeJourney
              .activityCountsByDay ??
            {},
        }
      : null;

  return {
    version: 1,
    activeJourney:
      active as ActivePracticeJourney | null,
    completedJourneys:
      Array.isArray(
        raw.completedJourneys,
      )
        ? raw.completedJourneys
        : [],
  };
}

export async function getPracticeJourneyState(): Promise<
  PracticeJourneyState
> {
  try {
    const raw =
      await AsyncStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return DEFAULT_STATE;
    }

    return normalizeState(
      JSON.parse(raw),
    );
  } catch (error) {
    console.warn(
      'Unable to read practice journey:',
      error,
    );

    return DEFAULT_STATE;
  }
}

async function saveState(
  state: PracticeJourneyState,
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state),
  );
}

function withMutation(
  operation: (
    state: PracticeJourneyState,
  ) => Promise<PracticeJourneyState>,
): Promise<PracticeJourneyState> {
  mutationQueue = mutationQueue
    .catch(() =>
      getPracticeJourneyState(),
    )
    .then(async () => {
      const current =
        await getPracticeJourneyState();

      const next =
        await operation(current);

      await saveState(next);

      return next;
    });

  return mutationQueue;
}

export async function startPracticeJourney(
  length: PracticeJourneyLength,
): Promise<PracticeJourneyState> {
  return withMutation(async state => {
    const now = new Date();

    return {
      ...state,
      activeJourney: {
        id: createId(),
        length,
        startedAt:
          now.toISOString(),
        startDateKey:
          getLocalDateKey(now),
        status: 'active',
        completedTaskIdsByDay: {},
        activityCountsByDay: {},
      },
    };
  });
}

export async function resetActivePracticeJourney(): Promise<
  PracticeJourneyState
> {
  return withMutation(async state => ({
    ...state,
    activeJourney: null,
  }));
}

export function getUnlockedJourneyDay(
  journey: ActivePracticeJourney,
  dateKey = getLocalDateKey(),
): number {
  return Math.min(
    journey.length,
    differenceInCalendarDays(
      journey.startDateKey,
      dateKey,
    ) + 1,
  );
}

function getCompletedTaskIds(
  journey: ActivePracticeJourney,
  dayNumber: number,
): string[] {
  return (
    journey.completedTaskIdsByDay[
      String(dayNumber)
    ] ?? []
  );
}

export function isJourneyTaskCompleted(
  journey: ActivePracticeJourney,
  dayNumber: number,
  taskId: string,
): boolean {
  return getCompletedTaskIds(
    journey,
    dayNumber,
  ).includes(taskId);
}

export function isJourneyDayCompleted(
  journey: ActivePracticeJourney,
  dayNumber: number,
): boolean {
  const day = getPracticeJourneyDay(
    journey.length,
    dayNumber,
  );

  const completed =
    getCompletedTaskIds(
      journey,
      dayNumber,
    );

  return day.tasks.every(task =>
    completed.includes(task.id),
  );
}

function finalizeIfComplete(
  state: PracticeJourneyState,
  journey: ActivePracticeJourney,
): PracticeJourneyState {
  const allComplete =
    getPracticeJourneyPlan(
      journey.length,
    ).every(day =>
      isJourneyDayCompleted(
        journey,
        day.dayNumber,
      ),
    );

  if (!allComplete) {
    return {
      ...state,
      activeJourney: journey,
    };
  }

  const completedAt =
    new Date().toISOString();

  return {
    ...state,
    activeJourney: {
      ...journey,
      status: 'completed',
      completedAt,
    },
    completedJourneys: [
      {
        id: journey.id,
        length: journey.length,
        startedAt:
          journey.startedAt,
        completedAt,
      },
      ...state.completedJourneys.filter(
        item =>
          item.id !== journey.id,
      ),
    ].slice(0, 20),
  };
}

export async function togglePracticeJourneyTask(
  dayNumber: number,
  taskId: string,
): Promise<PracticeJourneyState> {
  return withMutation(async state => {
    const journey =
      state.activeJourney;

    if (
      !journey ||
      journey.status !== 'active'
    ) {
      return state;
    }

    const unlockedDay =
      getUnlockedJourneyDay(journey);

    if (
      dayNumber < 1 ||
      dayNumber > unlockedDay
    ) {
      return state;
    }

    const key = String(dayNumber);

    const current =
      journey.completedTaskIdsByDay[
        key
      ] ?? [];

    const nextIds =
      current.includes(taskId)
        ? current.filter(
            id => id !== taskId,
          )
        : [...current, taskId];

    const updatedJourney: ActivePracticeJourney =
      {
        ...journey,
        completedTaskIdsByDay: {
          ...journey.completedTaskIdsByDay,
          [key]: nextIds,
        },
      };

    return finalizeIfComplete(
      state,
      updatedJourney,
    );
  });
}

export async function recordPracticeJourneyActivity(
  type: PracticeJourneyTaskType,
  amount = 1,
): Promise<PracticeJourneyState> {
  const safeAmount = Math.max(
    1,
    Number.isFinite(amount)
      ? amount
      : 1,
  );

  return withMutation(async state => {
    const journey =
      state.activeJourney;

    if (
      !journey ||
      journey.status !== 'active'
    ) {
      return state;
    }

    const dayNumber =
      getUnlockedJourneyDay(journey);

    const day = getPracticeJourneyDay(
      journey.length,
      dayNumber,
    );

    const matchingTasks =
      day.tasks.filter(
        task => task.type === type,
      );

    if (matchingTasks.length === 0) {
      return state;
    }

    const key = String(dayNumber);

    const currentCounts =
      journey.activityCountsByDay[
        key
      ] ?? {};

    const nextCount =
      (currentCounts[type] ?? 0) +
      safeAmount;

    const completedIds = new Set(
      journey.completedTaskIdsByDay[
        key
      ] ?? [],
    );

    matchingTasks.forEach(task => {
      if (nextCount >= task.target) {
        completedIds.add(task.id);
      }
    });

    const updatedJourney: ActivePracticeJourney =
      {
        ...journey,
        activityCountsByDay: {
          ...journey.activityCountsByDay,
          [key]: {
            ...currentCounts,
            [type]: nextCount,
          },
        },
        completedTaskIdsByDay: {
          ...journey.completedTaskIdsByDay,
          [key]:
            Array.from(completedIds),
        },
      };

    return finalizeIfComplete(
      state,
      updatedJourney,
    );
  });
}

export function getPracticeJourneyTaskProgress(
  journey: ActivePracticeJourney,
  dayNumber: number,
  task: PracticeJourneyTask,
): number {
  if (
    isJourneyTaskCompleted(
      journey,
      dayNumber,
      task.id,
    )
  ) {
    return task.target;
  }

  return (
    journey.activityCountsByDay[
      String(dayNumber)
    ]?.[task.type] ?? 0
  );
}

export function buildPracticeJourneySummary(
  journey: ActivePracticeJourney,
): PracticeJourneySummary {
  const plan =
    getPracticeJourneyPlan(
      journey.length,
    );

  const totalTasks =
    plan.reduce(
      (sum, day) =>
        sum + day.tasks.length,
      0,
    );

  const completedTasks =
    plan.reduce(
      (sum, day) =>
        sum +
        day.tasks.filter(task =>
          isJourneyTaskCompleted(
            journey,
            day.dayNumber,
            task.id,
          ),
        ).length,
      0,
    );

  const completedDays =
    plan.filter(day =>
      isJourneyDayCompleted(
        journey,
        day.dayNumber,
      ),
    ).length;

  return {
    totalDays: journey.length,
    unlockedDay:
      getUnlockedJourneyDay(
        journey,
      ),
    completedDays,
    completedTasks,
    totalTasks,
    progress:
      totalTasks > 0
        ? completedTasks /
          totalTasks
        : 0,
  };
}
