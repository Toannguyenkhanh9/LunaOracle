import AsyncStorage
  from '@react-native-async-storage/async-storage';

import type {
  TarotDraw,
} from './tarot';

export type TarotJournalEntry = {
  id: string;
  createdAt: string;
  title: string;
  question?: string;
  spread:
    | 'oneCard'
    | 'threeCard'
    | 'advanced';
  cards: TarotDraw[];
  note?: string;
};

const STORAGE_KEY =
  '@luna_oracle/tarot_journal_v1';

function createId(): string {
  return `tarot_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

async function readEntries():
Promise<TarotJournalEntry[]> {
  try {
    const raw =
      await AsyncStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return [];
    }

    const parsed =
      JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      item =>
        item &&
        typeof item.id ===
          'string' &&
        Array.isArray(item.cards),
    );
  } catch (error) {
    console.warn(
      'Unable to read tarot journal:',
      error,
    );

    return [];
  }
}

async function writeEntries(
  entries: TarotJournalEntry[],
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(entries),
  );
}

export async function listTarotJournalEntries():
Promise<TarotJournalEntry[]> {
  const entries =
    await readEntries();

  return entries.sort(
    (a, b) =>
      new Date(
        b.createdAt,
      ).getTime() -
      new Date(
        a.createdAt,
      ).getTime(),
  );
}

export async function saveTarotJournalEntry(
  entry: Omit<
    TarotJournalEntry,
    'id' | 'createdAt'
  >,
): Promise<TarotJournalEntry> {
  const newEntry:
    TarotJournalEntry = {
      id:
        createId(),
      createdAt:
        new Date().toISOString(),
      ...entry,
  };

  const current =
    await readEntries();

  await writeEntries([
    newEntry,
    ...current,
  ]);

  return newEntry;
}

export async function deleteTarotJournalEntry(
  id: string,
): Promise<void> {
  const current =
    await readEntries();

  await writeEntries(
    current.filter(
      item => item.id !== id,
    ),
  );
}

export async function clearTarotJournal():
Promise<void> {
  await AsyncStorage.removeItem(
    STORAGE_KEY,
  );
}
