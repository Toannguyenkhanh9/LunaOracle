import AsyncStorage
  from '@react-native-async-storage/async-storage';

import {
  recordRetentionActivity,
} from './retentionProgress';

const STORAGE_KEY =
  '@luna_oracle/mood_tracker_v1';

export type LunaMood =
  | 'calm'
  | 'hopeful'
  | 'focused'
  | 'anxious'
  | 'sad'
  | 'loved'
  | 'tired'
  | 'grateful';

export type MoodEntry = {
  dateKey: string;
  mood: LunaMood;
  energy: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type MoodPatternInsight = {
  totalDays: number;
  dominantMood?: LunaMood;
  averageEnergy: number;
  bestEnergyDay?: MoodEntry;
  lowestEnergyDay?: MoodEntry;
  messageKey: string;
  messageFallback: string;
};

export const LUNA_MOODS:
LunaMood[] = [
  'calm',
  'hopeful',
  'focused',
  'anxious',
  'sad',
  'loved',
  'tired',
  'grateful',
];

function pad(
  value: number,
): string {
  return String(value).padStart(
    2,
    '0',
  );
}

export function getMoodDateKey(
  date = new Date(),
): string {
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-');
}

async function readEntries():
Promise<MoodEntry[]> {
  const raw =
    await AsyncStorage.getItem(
      STORAGE_KEY,
    );

  if (!raw) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

async function writeEntries(
  entries: MoodEntry[],
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(entries),
  );
}

export async function listMoodEntries():
Promise<MoodEntry[]> {
  const entries =
    await readEntries();

  return entries.sort(
    (a, b) =>
      b.dateKey.localeCompare(
        a.dateKey,
      ),
  );
}

export async function getTodayMoodEntry():
Promise<MoodEntry | undefined> {
  const today =
    getMoodDateKey();

  const entries =
    await readEntries();

  return entries.find(
    item =>
      item.dateKey === today,
  );
}

export async function saveMoodEntry(
  mood: LunaMood,
  energy: number,
  note?: string,
): Promise<MoodEntry> {
  const entries =
    await readEntries();

  const today =
    getMoodDateKey();

  const existing =
    entries.find(
      item =>
        item.dateKey === today,
    );

  const now =
    new Date().toISOString();

  const entry:
    MoodEntry = {
      dateKey:
        today,
      mood,
      energy:
        Math.max(
          1,
          Math.min(
            100,
            Math.round(energy),
          ),
        ),
      note:
        note?.trim() || undefined,
      createdAt:
        existing?.createdAt ?? now,
      updatedAt:
        now,
    };

  const next =
    [
      entry,
      ...entries.filter(
        item =>
          item.dateKey !== today,
      ),
    ].slice(0, 370);

  await writeEntries(next);
  await recordRetentionActivity(
    'moodTracker',
  );

  return entry;
}

export function buildMoodPatternInsight(
  entries: MoodEntry[],
  days = 7,
): MoodPatternInsight {
  const recent =
    entries
      .slice()
      .sort(
        (a, b) =>
          b.dateKey.localeCompare(
            a.dateKey,
          ),
      )
      .slice(0, days);

  if (recent.length === 0) {
    return {
      totalDays: 0,
      averageEnergy: 0,
      messageKey:
        'moodTracker.insights.empty',
      messageFallback:
        'Track your mood for a few days to reveal your pattern.',
    };
  }

  const moodCounts =
    recent.reduce(
      (acc, entry) => {
        acc[entry.mood] =
          (acc[entry.mood] ?? 0) + 1;
        return acc;
      },
      {} as Partial<Record<LunaMood, number>>,
    );

  const dominantMood =
    Object.entries(moodCounts)
      .sort(
        (a, b) =>
          Number(b[1]) -
          Number(a[1]),
      )[0]?.[0] as LunaMood | undefined;

  const averageEnergy =
    Math.round(
      recent.reduce(
        (sum, entry) =>
          sum + entry.energy,
        0,
      ) / recent.length,
    );

  const bestEnergyDay =
    [...recent].sort(
      (a, b) =>
        b.energy - a.energy,
    )[0];

  const lowestEnergyDay =
    [...recent].sort(
      (a, b) =>
        a.energy - b.energy,
    )[0];

  let key =
    'moodTracker.insights.balanced';

  let fallback =
    'Your energy is showing a balanced pattern. Keep noticing what supports your calm.';

  if (
    dominantMood === 'anxious' ||
    dominantMood === 'sad' ||
    averageEnergy < 45
  ) {
    key =
      'moodTracker.insights.softness';
    fallback =
      'Your pattern asks for softness, rest, and fewer emotional demands.';
  } else if (
    dominantMood === 'focused' ||
    averageEnergy >= 75
  ) {
    key =
      'moodTracker.insights.momentum';
    fallback =
      'Your pattern shows momentum. Use it carefully and avoid overextending.';
  } else if (
    dominantMood === 'loved' ||
    dominantMood === 'grateful'
  ) {
    key =
      'moodTracker.insights.connection';
    fallback =
      'Connection and gratitude are supporting your energy this week.';
  }

  return {
    totalDays:
      recent.length,
    dominantMood,
    averageEnergy,
    bestEnergyDay,
    lowestEnergyDay,
    messageKey:
      key,
    messageFallback:
      fallback,
  };
}

export async function getMoodDashboard():
Promise<{
  today?: MoodEntry;
  entries: MoodEntry[];
  insight: MoodPatternInsight;
}> {
  const entries =
    await listMoodEntries();

  return {
    today:
      entries.find(
        item =>
          item.dateKey ===
          getMoodDateKey(),
      ),
    entries,
    insight:
      buildMoodPatternInsight(
        entries,
      ),
  };
}

export async function deleteMoodEntry(
  dateKey: string,
): Promise<void> {
  const entries =
    await readEntries();

  await writeEntries(
    entries.filter(
      item =>
        item.dateKey !== dateKey,
    ),
  );
}
