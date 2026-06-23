import AsyncStorage
  from '@react-native-async-storage/async-storage';

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

export type DailyRitualMood =
  | 'calm'
  | 'hopeful'
  | 'focused'
  | 'tired'
  | 'anxious'
  | 'grateful';

export type DailyRitualStep =
  | 'breathe'
  | 'readInsight'
  | 'drawCard'
  | 'writeNote';

export type DailyRitualEntry = {
  id: string;
  dateKey: string;
  profileId: string;
  profileName: string;
  mood?: DailyRitualMood;
  completedSteps: DailyRitualStep[];
  tarotDraw: TarotDraw;
  energyScore: number;
  moonHouse: number;
  actionId: string;
  journalPromptId: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type DailyRitualSession = {
  profile: BirthProfile;
  insight: DailyPersonalizedInsight;
  entry: DailyRitualEntry;
};

const STORAGE_KEY =
  '@luna_oracle/daily_ritual_entries_v1';

const DEFAULT_STEPS:
  DailyRitualStep[] = [
    'breathe',
    'readInsight',
    'drawCard',
  ];

function createId(): string {
  return `ritual_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function getDateKey(
  date = new Date(),
): string {
  return date
    .toISOString()
    .slice(0, 10);
}

function normalizeEntries(
  value: unknown,
): DailyRitualEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    item =>
      item &&
      typeof item.id === 'string' &&
      typeof item.dateKey === 'string' &&
      item.tarotDraw,
  ) as DailyRitualEntry[];
}

async function readEntries():
Promise<DailyRitualEntry[]> {
  try {
    const raw =
      await AsyncStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return [];
    }

    return normalizeEntries(
      JSON.parse(raw),
    );
  } catch (error) {
    console.warn(
      'Unable to read daily ritual entries:',
      error,
    );

    return [];
  }
}

async function writeEntries(
  entries: DailyRitualEntry[],
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(entries),
  );
}

function createEntry(
  profile: BirthProfile,
  insight: DailyPersonalizedInsight,
): DailyRitualEntry {
  const now =
    new Date().toISOString();

  const [tarotDraw] =
    drawTarotCards(
      1,
      `${profile.id}-${insight.dateKey}`,
    );

  return {
    id:
      createId(),
    dateKey:
      insight.dateKey ||
      getDateKey(),
    profileId:
      profile.id,
    profileName:
      profile.name,
    completedSteps:
      DEFAULT_STEPS,
    tarotDraw,
    energyScore:
      insight.energyScore,
    moonHouse:
      insight.moonHouse,
    actionId:
      insight.actionId,
    journalPromptId:
      insight.journalPromptId,
    createdAt:
      now,
    updatedAt:
      now,
  };
}

export async function getDailyRitualSession(
  date = new Date(),
): Promise<DailyRitualSession> {
  const profile =
    (await getActiveBirthProfile()) ??
    (await ensureDefaultBirthProfile());

  const insight =
    buildDailyPersonalizedInsight(
      profile,
      date,
    );

  const entries =
    await readEntries();

  const existing =
    entries.find(
      item =>
        item.dateKey ===
          insight.dateKey &&
        item.profileId ===
          profile.id,
    );

  if (existing) {
    return {
      profile,
      insight,
      entry:
        existing,
    };
  }

  const entry =
    createEntry(
      profile,
      insight,
    );

  await writeEntries([
    entry,
    ...entries,
  ]);

  return {
    profile,
    insight,
    entry,
  };
}

export async function saveDailyRitualEntry(
  entry: DailyRitualEntry,
): Promise<DailyRitualEntry> {
  const entries =
    await readEntries();

  const next:
    DailyRitualEntry = {
      ...entry,
      updatedAt:
        new Date().toISOString(),
  };

  const exists =
    entries.some(
      item =>
        item.id === entry.id,
    );

  await writeEntries(
    exists
      ? entries.map(item =>
          item.id === entry.id
            ? next
            : item,
        )
      : [
          next,
          ...entries,
        ],
  );

  return next;
}

export async function listDailyRitualEntries():
Promise<DailyRitualEntry[]> {
  const entries =
    await readEntries();

  return entries.sort(
    (a, b) =>
      new Date(
        b.dateKey,
      ).getTime() -
      new Date(
        a.dateKey,
      ).getTime(),
  );
}

export async function getDailyRitualStreak():
Promise<number> {
  const entries =
    await readEntries();

  const days =
    new Set(
      entries.map(
        item => item.dateKey,
      ),
    );

  let streak = 0;
  const cursor =
    new Date();

  for (
    let index = 0;
    index < 365;
    index += 1
  ) {
    const key =
      cursor
        .toISOString()
        .slice(0, 10);

    if (!days.has(key)) {
      break;
    }

    streak += 1;
    cursor.setUTCDate(
      cursor.getUTCDate() - 1,
    );
  }

  return streak;
}

export function toggleDailyRitualStep(
  entry: DailyRitualEntry,
  step: DailyRitualStep,
): DailyRitualEntry {
  const exists =
    entry.completedSteps.includes(
      step,
    );

  return {
    ...entry,
    completedSteps:
      exists
        ? entry.completedSteps.filter(
            item => item !== step,
          )
        : [
            ...entry.completedSteps,
            step,
          ],
  };
}
