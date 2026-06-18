import AsyncStorage from '@react-native-async-storage/async-storage';

export type PeaceMood =
  | 'peaceful'
  | 'grateful'
  | 'neutral'
  | 'worried'
  | 'sad';

export type PeaceJournalEntry = {
  id: string;
  createdAt: string;
  beforeMood: PeaceMood;
  afterMood: PeaceMood;
  gratitude: string;
  release: string;
  prayer: string;
  note: string;
};

export type CreatePeaceJournalEntryInput = Omit<
  PeaceJournalEntry,
  'id' | 'createdAt'
>;

const STORAGE_KEY =
  '@online_pagoda/peace_journal_v1';

function createId(): string {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

async function readEntries(): Promise<
  PeaceJournalEntry[]
> {
  try {
    const raw = await AsyncStorage.getItem(
      STORAGE_KEY,
    );

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed)
      ? (parsed as PeaceJournalEntry[])
      : [];
  } catch (error) {
    console.warn(
      'Unable to read peace journal:',
      error,
    );

    return [];
  }
}

async function writeEntries(
  entries: PeaceJournalEntry[],
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(entries),
  );
}

export async function getPeaceJournalEntries(): Promise<
  PeaceJournalEntry[]
> {
  const entries = await readEntries();

  return [...entries].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export async function addPeaceJournalEntry(
  input: CreatePeaceJournalEntryInput,
): Promise<PeaceJournalEntry[]> {
  const entry: PeaceJournalEntry = {
    ...input,
    id: createId(),
    createdAt: new Date().toISOString(),
  };

  const current = await readEntries();
  const next = [entry, ...current];

  await writeEntries(next);

  return next;
}

export async function deletePeaceJournalEntry(
  id: string,
): Promise<PeaceJournalEntry[]> {
  const current = await readEntries();
  const next = current.filter(
    entry => entry.id !== id,
  );

  await writeEntries(next);

  return next;
}

export async function clearPeaceJournal(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
