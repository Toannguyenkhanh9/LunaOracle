import AsyncStorage
  from '@react-native-async-storage/async-storage';

import {
  recordRetentionActivity,
} from './retentionProgress';

const STORAGE_KEY =
  '@luna_oracle/dream_journal_v1';

export type DreamSymbol =
  | 'water'
  | 'moon'
  | 'snake'
  | 'house'
  | 'fire'
  | 'door'
  | 'flight'
  | 'ocean'
  | 'forest'
  | 'unknownPerson';

export type DreamMood =
  | 'peaceful'
  | 'strange'
  | 'scared'
  | 'sad'
  | 'excited'
  | 'confused';

export type DreamEntry = {
  id: string;
  title: string;
  dreamText: string;
  mood: DreamMood;
  symbols: DreamSymbol[];
  interpretation: string;
  createdAt: string;
};

export const DREAM_SYMBOLS:
DreamSymbol[] = [
  'water',
  'moon',
  'snake',
  'house',
  'fire',
  'door',
  'flight',
  'ocean',
  'forest',
  'unknownPerson',
];

export const DREAM_MOODS:
DreamMood[] = [
  'peaceful',
  'strange',
  'scared',
  'sad',
  'excited',
  'confused',
];

function createId():
string {
  return `${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

async function readEntries():
Promise<DreamEntry[]> {
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
  entries: DreamEntry[],
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(entries),
  );
}

function symbolMeaning(
  symbol: DreamSymbol,
): string {
  const map:
    Record<DreamSymbol, string> = {
      water:
        'Water points to emotional movement and hidden feeling.',
      moon:
        'The Moon suggests intuition, cycles, and unseen truth.',
      snake:
        'A snake often reflects transformation, fear, or renewal.',
      house:
        'A house can represent the self, safety, memory, or family pattern.',
      fire:
        'Fire shows passion, urgency, anger, or creative life force.',
      door:
        'A door suggests a threshold, choice, or transition.',
      flight:
        'Flying points to freedom, perspective, or escape.',
      ocean:
        'The ocean reflects deep feeling and collective memory.',
      forest:
        'A forest suggests mystery, growth, and the unknown path.',
      unknownPerson:
        'An unknown person may represent an unrecognized part of yourself.',
    };

  return map[symbol];
}

export function buildDreamInterpretation(
  symbols: DreamSymbol[],
  mood: DreamMood,
): string {
  const parts =
    symbols
      .slice(0, 4)
      .map(symbolMeaning);

  const moodLine =
    mood === 'peaceful'
      ? 'The calm tone suggests integration rather than conflict.'
      : mood === 'scared'
        ? 'The fear tone suggests something wants safety before interpretation.'
        : mood === 'sad'
          ? 'The sadness may point to grief, release, or an unmet emotional need.'
          : mood === 'excited'
            ? 'The excitement suggests new energy trying to move through you.'
            : mood === 'confused'
              ? 'The confusion suggests the message may need time, not force.'
              : 'The strange tone suggests symbolic material rising from the unconscious.';

  return [
    moodLine,
    ...parts,
    'Use this as reflection, not certainty. Notice what image stays with you after waking.',
  ].join(' ');
}

export async function listDreamEntries():
Promise<DreamEntry[]> {
  const entries =
    await readEntries();

  return entries.sort(
    (a, b) =>
      b.createdAt.localeCompare(
        a.createdAt,
      ),
  );
}

export async function saveDreamEntry(
  input: {
    title: string;
    dreamText: string;
    mood: DreamMood;
    symbols: DreamSymbol[];
  },
): Promise<DreamEntry> {
  const entries =
    await readEntries();

  const entry:
    DreamEntry = {
      id:
        createId(),
      title:
        input.title.trim() ||
        'Untitled Dream',
      dreamText:
        input.dreamText.trim(),
      mood:
        input.mood,
      symbols:
        input.symbols,
      interpretation:
        buildDreamInterpretation(
          input.symbols,
          input.mood,
        ),
      createdAt:
        new Date().toISOString(),
    };

  await writeEntries([
    entry,
    ...entries,
  ]);

  await recordRetentionActivity(
    'dreamJournal',
  );

  return entry;
}

export async function deleteDreamEntry(
  id: string,
): Promise<void> {
  const entries =
    await readEntries();

  await writeEntries(
    entries.filter(
      entry => entry.id !== id,
    ),
  );
}

export async function buildDreamStats():
Promise<{
  total: number;
  topSymbol?: DreamSymbol;
  latest?: DreamEntry;
}> {
  const entries =
    await listDreamEntries();

  const counts:
    Partial<Record<DreamSymbol, number>> = {};

  entries.forEach(entry => {
    entry.symbols.forEach(symbol => {
      counts[symbol] =
        (counts[symbol] ?? 0) + 1;
    });
  });

  const topSymbol =
    Object.entries(counts)
      .sort(
        (a, b) =>
          Number(b[1]) -
          Number(a[1]),
      )[0]?.[0] as DreamSymbol | undefined;

  return {
    total:
      entries.length,
    topSymbol,
    latest:
      entries[0],
  };
}
