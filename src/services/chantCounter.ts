import AsyncStorage from '@react-native-async-storage/async-storage';

export type ChantPracticeType =
  | 'buddhaName'
  | 'mantra'
  | 'prostration'
  | 'woodenFish'
  | 'breath'
  | 'mala108';

export const CHANT_PRACTICE_TYPES: ChantPracticeType[] = [
  'buddhaName',
  'mantra',
  'prostration',
  'woodenFish',
  'breath',
  'mala108',
];

export const CHANT_TARGETS = [
  18,
  21,
  49,
  54,
  108,
  216,
  1080,
] as const;

export type ChantTarget =
  (typeof CHANT_TARGETS)[number];

export type ChantCounterDraft = {
  dateKey: string;
  selectedType: ChantPracticeType;
  counts: Record<ChantPracticeType, number>;
  targets: Record<ChantPracticeType, ChantTarget>;
  updatedAt: string;
};

export type ChantCounterSession = {
  id: string;
  dateKey: string;
  practiceType: ChantPracticeType;
  count: number;
  target: ChantTarget;
  completedTarget: boolean;
  rounds108: number;
  remainder108: number;
  startedAt?: string;
  completedAt: string;
};

export type ChantDailySummary = {
  dateKey: string;
  totals: Record<ChantPracticeType, number>;
  totalCount: number;
  totalSessions: number;
  completedTargets: number;
  totalRounds108: number;
};

const DRAFT_KEY =
  '@online_pagoda/chant_counter_draft_v1';

const HISTORY_KEY =
  '@online_pagoda/chant_counter_history_v1';

const MAX_HISTORY_ITEMS = 1000;

let draftMutationQueue: Promise<ChantCounterDraft> =
  Promise.resolve(
    createDefaultDraftPlaceholder(),
  );

function createDefaultDraftPlaceholder(): ChantCounterDraft {
  return {
    dateKey: '',
    selectedType: 'buddhaName',
    counts: {
      buddhaName: 0,
      mantra: 0,
      prostration: 0,
      woodenFish: 0,
      breath: 0,
      mala108: 0,
    },
    targets: {
      buddhaName: 108,
      mantra: 108,
      prostration: 108,
      woodenFish: 108,
      breath: 21,
      mala108: 108,
    },
    updatedAt: '',
  };
}

const DEFAULT_COUNTS: Record<
  ChantPracticeType,
  number
> = {
  buddhaName: 0,
  mantra: 0,
  prostration: 0,
  woodenFish: 0,
  breath: 0,
  mala108: 0,
};

const DEFAULT_TARGETS: Record<
  ChantPracticeType,
  ChantTarget
> = {
  buddhaName: 108,
  mantra: 108,
  prostration: 108,
  woodenFish: 108,
  breath: 21,
  mala108: 108,
};

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

export function createDefaultChantDraft(
  selectedType: ChantPracticeType =
    'buddhaName',
): ChantCounterDraft {
  return {
    dateKey: getLocalDateKey(),
    selectedType,
    counts: {...DEFAULT_COUNTS},
    targets: {...DEFAULT_TARGETS},
    updatedAt: new Date().toISOString(),
  };
}

function normalizeCount(value: unknown): number {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value)
  ) {
    return 0;
  }

  return Math.max(0, Math.floor(value));
}

function normalizeTarget(
  value: unknown,
  fallback: ChantTarget,
): ChantTarget {
  return CHANT_TARGETS.includes(
    value as ChantTarget,
  )
    ? (value as ChantTarget)
    : fallback;
}

function normalizeDraft(
  value: Partial<ChantCounterDraft>,
): ChantCounterDraft {
  const today = getLocalDateKey();

  if (value.dateKey !== today) {
    return createDefaultChantDraft(
      value.selectedType,
    );
  }

  const selectedType =
    CHANT_PRACTICE_TYPES.includes(
      value.selectedType as ChantPracticeType,
    )
      ? (value.selectedType as ChantPracticeType)
      : 'buddhaName';

  const counts = {...DEFAULT_COUNTS};
  const targets = {...DEFAULT_TARGETS};

  CHANT_PRACTICE_TYPES.forEach(type => {
    counts[type] = normalizeCount(
      value.counts?.[type],
    );

    targets[type] = normalizeTarget(
      value.targets?.[type],
      DEFAULT_TARGETS[type],
    );
  });

  return {
    dateKey: today,
    selectedType,
    counts,
    targets,
    updatedAt:
      typeof value.updatedAt === 'string'
        ? value.updatedAt
        : new Date().toISOString(),
  };
}

export async function getChantCounterDraft(): Promise<ChantCounterDraft> {
  try {
    const raw = await AsyncStorage.getItem(
      DRAFT_KEY,
    );

    if (!raw) {
      return createDefaultChantDraft();
    }

    return normalizeDraft(
      JSON.parse(
        raw,
      ) as Partial<ChantCounterDraft>,
    );
  } catch (error) {
    console.warn(
      'Unable to read chant counter draft:',
      error,
    );

    return createDefaultChantDraft();
  }
}

export async function saveChantCounterDraft(
  draft: ChantCounterDraft,
): Promise<void> {
  const normalized = normalizeDraft({
    ...draft,
    dateKey: getLocalDateKey(),
    updatedAt: new Date().toISOString(),
  });

  await AsyncStorage.setItem(
    DRAFT_KEY,
    JSON.stringify(normalized),
  );
}

export function incrementChantDraft(
  practiceType: ChantPracticeType,
  amount = 1,
): Promise<ChantCounterDraft> {
  const safeAmount = Math.max(
    1,
    Math.floor(amount),
  );

  draftMutationQueue =
    draftMutationQueue
      .catch(() =>
        getChantCounterDraft(),
      )
      .then(async () => {
        const current =
          await getChantCounterDraft();

      const updated: ChantCounterDraft = {
        ...current,
        selectedType: practiceType,
        counts: {
          ...current.counts,
          [practiceType]:
            current.counts[practiceType] +
            safeAmount,
        },
        updatedAt:
          new Date().toISOString(),
      };

        await saveChantCounterDraft(updated);

        return updated;
      });

  return draftMutationQueue;
}

export async function clearChantCounterDraft(): Promise<void> {
  await AsyncStorage.removeItem(
    DRAFT_KEY,
  );
}

export async function resetChantDraftType(
  practiceType: ChantPracticeType,
): Promise<ChantCounterDraft> {
  const draft =
    await getChantCounterDraft();

  const updated: ChantCounterDraft = {
    ...draft,
    counts: {
      ...draft.counts,
      [practiceType]: 0,
    },
    updatedAt: new Date().toISOString(),
  };

  await saveChantCounterDraft(updated);

  return updated;
}

async function readHistory(): Promise<
  ChantCounterSession[]
> {
  try {
    const raw = await AsyncStorage.getItem(
      HISTORY_KEY,
    );

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed)
      ? (parsed as ChantCounterSession[])
      : [];
  } catch (error) {
    console.warn(
      'Unable to read chant counter history:',
      error,
    );

    return [];
  }
}

async function writeHistory(
  items: ChantCounterSession[],
): Promise<void> {
  const sorted = [...items]
    .sort((a, b) =>
      b.completedAt.localeCompare(
        a.completedAt,
      ),
    )
    .slice(0, MAX_HISTORY_ITEMS);

  await AsyncStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(sorted),
  );
}

export async function getChantCounterHistory(
  limit = 200,
): Promise<ChantCounterSession[]> {
  const history = await readHistory();

  return history.slice(
    0,
    Math.max(1, limit),
  );
}

export async function saveChantCounterSession(input: {
  practiceType: ChantPracticeType;
  count: number;
  target: ChantTarget;
  startedAt?: string;
}): Promise<ChantCounterSession[]> {
  const count = normalizeCount(
    input.count,
  );

  if (count <= 0) {
    throw new Error(
      'CHANT_COUNT_MUST_BE_GREATER_THAN_ZERO',
    );
  }

  const completedAt =
    new Date().toISOString();

  const session: ChantCounterSession = {
    id: createId(),
    dateKey: getLocalDateKey(),
    practiceType: input.practiceType,
    count,
    target: input.target,
    completedTarget:
      count >= input.target,
    rounds108: Math.floor(count / 108),
    remainder108: count % 108,
    startedAt: input.startedAt,
    completedAt,
  };

  const current = await readHistory();
  const next = [session, ...current];

  await writeHistory(next);

  return next;
}

export async function deleteChantCounterSession(
  id: string,
): Promise<ChantCounterSession[]> {
  const current = await readHistory();

  const next = current.filter(
    item => item.id !== id,
  );

  await writeHistory(next);

  return next;
}

export async function clearChantCounterHistory(): Promise<void> {
  await AsyncStorage.removeItem(
    HISTORY_KEY,
  );
}

export function buildChantDailySummary(
  dateKey: string,
  history: ChantCounterSession[],
): ChantDailySummary {
  const totals = {...DEFAULT_COUNTS};

  const items = history.filter(
    item => item.dateKey === dateKey,
  );

  items.forEach(item => {
    totals[item.practiceType] +=
      item.count;
  });

  return {
    dateKey,
    totals,
    totalCount: items.reduce(
      (sum, item) => sum + item.count,
      0,
    ),
    totalSessions: items.length,
    completedTargets: items.filter(
      item => item.completedTarget,
    ).length,
    totalRounds108: items.reduce(
      (sum, item) =>
        sum + item.rounds108,
      0,
    ),
  };
}

export async function getTodayChantSummary(): Promise<ChantDailySummary> {
  const history = await readHistory();

  return buildChantDailySummary(
    getLocalDateKey(),
    history,
  );
}
