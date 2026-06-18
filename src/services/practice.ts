import AsyncStorage from '@react-native-async-storage/async-storage';

export type PracticeActivityId =
  | 'incense'
  | 'meditation'
  | 'listening'
  | 'gratitude';

export type DailyPracticeRecord = {
  date: string;
  activities: Record<PracticeActivityId, boolean>;
  meditationMinutes: number;
  listeningStarts: number;
  ritualCompletedAt?: string;
  updatedAt: string;
};

export type PracticeStats = {
  currentStreak: number;
  longestStreak: number;
  totalPracticeDays: number;
  totalCompletedRituals: number;
  totalMeditationMinutes: number;
};

const HISTORY_KEY = '@online_pagoda/practice_history_v1';
const MAX_HISTORY_DAYS = 730;

const EMPTY_ACTIVITIES: Record<PracticeActivityId, boolean> = {
  incense: false,
  meditation: false,
  listening: false,
  gratitude: false,
};

function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function dateFromKey(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);

  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function differenceInCalendarDays(
  later: string,
  earlier: string,
): number {
  const milliseconds =
    dateFromKey(later).getTime() -
    dateFromKey(earlier).getTime();

  return Math.round(milliseconds / 86_400_000);
}

function isActiveDay(record: DailyPracticeRecord): boolean {
  return (
    Object.values(record.activities).some(Boolean) ||
    record.meditationMinutes > 0 ||
    record.listeningStarts > 0
  );
}

function isRitualComplete(
  activities: Record<PracticeActivityId, boolean>,
): boolean {
  return Object.values(activities).every(Boolean);
}

async function readHistory(): Promise<DailyPracticeRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as DailyPracticeRecord[];

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Unable to read practice history:', error);
    return [];
  }
}

async function writeHistory(
  history: DailyPracticeRecord[],
): Promise<void> {
  const sorted = [...history]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, MAX_HISTORY_DAYS);

  await AsyncStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(sorted),
  );
}

function createEmptyRecord(date: string): DailyPracticeRecord {
  return {
    date,
    activities: {...EMPTY_ACTIVITIES},
    meditationMinutes: 0,
    listeningStarts: 0,
    updatedAt: new Date().toISOString(),
  };
}

async function updateToday(
  updater: (
    current: DailyPracticeRecord,
  ) => DailyPracticeRecord,
): Promise<DailyPracticeRecord> {
  const today = localDateKey();
  const history = await readHistory();

  const existing =
    history.find(item => item.date === today) ??
    createEmptyRecord(today);

  const updated = updater({
    ...existing,
    activities: {
      ...EMPTY_ACTIVITIES,
      ...existing.activities,
    },
  });

  const completed =
    updated.ritualCompletedAt ??
    (isRitualComplete(updated.activities)
      ? new Date().toISOString()
      : undefined);

  const normalized: DailyPracticeRecord = {
    ...updated,
    ritualCompletedAt: completed,
    updatedAt: new Date().toISOString(),
  };

  const nextHistory = [
    normalized,
    ...history.filter(item => item.date !== today),
  ];

  await writeHistory(nextHistory);

  return normalized;
}

export async function getTodayPractice(): Promise<DailyPracticeRecord> {
  const today = localDateKey();
  const history = await readHistory();

  return (
    history.find(item => item.date === today) ??
    createEmptyRecord(today)
  );
}

export async function setPracticeActivity(
  activity: PracticeActivityId,
  completed: boolean,
): Promise<DailyPracticeRecord> {
  return updateToday(current => ({
    ...current,
    activities: {
      ...current.activities,
      [activity]: completed,
    },
    ritualCompletedAt: completed
      ? current.ritualCompletedAt
      : undefined,
  }));
}

export async function recordPracticeActivity(
  activity: PracticeActivityId,
): Promise<DailyPracticeRecord> {
  return setPracticeActivity(activity, true);
}

export async function recordMeditationSession(
  minutes: number,
): Promise<DailyPracticeRecord> {
  const safeMinutes = Number.isFinite(minutes)
    ? Math.max(0, Math.round(minutes))
    : 0;

  return updateToday(current => ({
    ...current,
    activities: {
      ...current.activities,
      meditation: true,
    },
    meditationMinutes:
      current.meditationMinutes + safeMinutes,
  }));
}

export async function recordAudioStart(): Promise<DailyPracticeRecord> {
  return updateToday(current => ({
    ...current,
    activities: {
      ...current.activities,
      listening: true,
    },
    listeningStarts: current.listeningStarts + 1,
  }));
}

export async function resetTodayPractice(): Promise<void> {
  const today = localDateKey();
  const history = await readHistory();

  await writeHistory(
    history.filter(item => item.date !== today),
  );
}

export async function getPracticeStats(): Promise<PracticeStats> {
  const history = (await readHistory())
    .filter(isActiveDay)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (history.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalPracticeDays: 0,
      totalCompletedRituals: 0,
      totalMeditationMinutes: 0,
    };
  }

  const activeDates = history.map(item => item.date);
  const today = localDateKey();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = localDateKey(yesterdayDate);

  let currentStreak = 0;

  if (
    activeDates[0] === today ||
    activeDates[0] === yesterday
  ) {
    currentStreak = 1;

    for (let index = 1; index < activeDates.length; index += 1) {
      if (
        differenceInCalendarDays(
          activeDates[index - 1],
          activeDates[index],
        ) === 1
      ) {
        currentStreak += 1;
      } else {
        break;
      }
    }
  }

  let longestStreak = 1;
  let runningStreak = 1;

  for (let index = 1; index < activeDates.length; index += 1) {
    if (
      differenceInCalendarDays(
        activeDates[index - 1],
        activeDates[index],
      ) === 1
    ) {
      runningStreak += 1;
      longestStreak = Math.max(
        longestStreak,
        runningStreak,
      );
    } else {
      runningStreak = 1;
    }
  }

  return {
    currentStreak,
    longestStreak,
    totalPracticeDays: history.length,
    totalCompletedRituals: history.filter(
      item => Boolean(item.ritualCompletedAt),
    ).length,
    totalMeditationMinutes: history.reduce(
      (total, item) =>
        total + (item.meditationMinutes ?? 0),
      0,
    ),
  };
}

export {localDateKey};
