import AsyncStorage
  from '@react-native-async-storage/async-storage';

import type {
  TarotDraw,
} from './tarot';

import {
  listTarotJournalEntries,
  saveTarotJournalEntry,
  type TarotJournalEntry,
} from './tarotJournal';

export type TarotJournalTag =
  | 'love'
  | 'career'
  | 'money'
  | 'healing'
  | 'dream'
  | 'decision'
  | 'shadow'
  | 'gratitude';

export type AdvancedTarotJournalEntry =
  TarotJournalEntry & {
    mood?: string;
    tags?: TarotJournalTag[];
    favorite?: boolean;
    updatedAt?: string;
  };

export type TarotJournalStats = {
  totalReadings: number;
  favoriteCount: number;
  noteCount: number;
  tagCounts: Record<TarotJournalTag, number>;
  mostDrawnCards: Array<{
    cardId: string;
    cardName: string;
    count: number;
  }>;
  spreadCounts: Record<string, number>;
};

const STORAGE_KEY =
  '@luna_oracle/tarot_journal_v1';

export const TAROT_JOURNAL_TAGS:
  TarotJournalTag[] = [
    'love',
    'career',
    'money',
    'healing',
    'dream',
    'decision',
    'shadow',
    'gratitude',
  ];

function normalizeEntry(
  entry: TarotJournalEntry,
): AdvancedTarotJournalEntry {
  return {
    ...entry,
    tags:
      (entry as AdvancedTarotJournalEntry)
        .tags ?? [],
    favorite:
      Boolean(
        (entry as AdvancedTarotJournalEntry)
          .favorite,
      ),
    mood:
      (entry as AdvancedTarotJournalEntry)
        .mood,
    updatedAt:
      (entry as AdvancedTarotJournalEntry)
        .updatedAt ??
      entry.createdAt,
  };
}

async function writeEntries(
  entries: AdvancedTarotJournalEntry[],
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(entries),
  );
}

export async function listAdvancedTarotJournalEntries():
Promise<AdvancedTarotJournalEntry[]> {
  const entries =
    await listTarotJournalEntries();

  return entries.map(
    normalizeEntry,
  );
}

export async function saveAdvancedTarotJournalEntry(
  entry: {
    title: string;
    question?: string;
    spread:
      | 'oneCard'
      | 'threeCard'
      | 'advanced'
      | string;
    cards: TarotDraw[];
    note?: string;
    mood?: string;
    tags?: TarotJournalTag[];
    favorite?: boolean;
  },
): Promise<AdvancedTarotJournalEntry> {
  const saved =
    await saveTarotJournalEntry({
      title:
        entry.title,
      question:
        entry.question,
      spread:
        entry.spread as never,
      cards:
        entry.cards,
      note:
        entry.note,
    });

  const advanced:
    AdvancedTarotJournalEntry = {
      ...saved,
      mood:
        entry.mood,
      tags:
        entry.tags ?? [],
      favorite:
        Boolean(
          entry.favorite,
        ),
      updatedAt:
        new Date().toISOString(),
  };

  const all =
    await listAdvancedTarotJournalEntries();

  await writeEntries(
    all.map(item =>
      item.id === advanced.id
        ? advanced
        : item,
    ),
  );

  return advanced;
}

export async function updateAdvancedTarotJournalEntry(
  entryId: string,
  patch: Partial<
    Pick<
      AdvancedTarotJournalEntry,
      | 'title'
      | 'question'
      | 'note'
      | 'mood'
      | 'tags'
      | 'favorite'
    >
  >,
): Promise<AdvancedTarotJournalEntry | undefined> {
  const entries =
    await listAdvancedTarotJournalEntries();

  let updated:
    AdvancedTarotJournalEntry | undefined;

  const next =
    entries.map(entry => {
      if (entry.id !== entryId) {
        return entry;
      }

      updated = {
        ...entry,
        ...patch,
        updatedAt:
          new Date().toISOString(),
      };

      return updated;
    });

  await writeEntries(next);

  return updated;
}

export async function toggleTarotJournalFavorite(
  entryId: string,
): Promise<AdvancedTarotJournalEntry | undefined> {
  const entries =
    await listAdvancedTarotJournalEntries();

  const current =
    entries.find(
      item => item.id === entryId,
    );

  if (!current) {
    return undefined;
  }

  return updateAdvancedTarotJournalEntry(
    entryId,
    {
      favorite:
        !current.favorite,
    },
  );
}

export async function deleteAdvancedTarotJournalEntry(
  entryId: string,
): Promise<void> {
  const entries =
    await listAdvancedTarotJournalEntries();

  await writeEntries(
    entries.filter(
      item => item.id !== entryId,
    ),
  );
}

export function filterAdvancedTarotJournalEntries(
  entries: AdvancedTarotJournalEntry[],
  options: {
    query?: string;
    tag?: TarotJournalTag | 'all';
    favoriteOnly?: boolean;
  },
): AdvancedTarotJournalEntry[] {
  const normalizedQuery =
    options.query
      ?.trim()
      .toLowerCase() ?? '';

  return entries.filter(entry => {
    if (
      options.favoriteOnly &&
      !entry.favorite
    ) {
      return false;
    }

    if (
      options.tag &&
      options.tag !== 'all' &&
      !(entry.tags ?? []).includes(
        options.tag,
      )
    ) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = [
      entry.title,
      entry.question,
      entry.note,
      entry.spread,
      ...(entry.tags ?? []),
      ...entry.cards.map(
        draw =>
          `${draw.card.name} ${draw.card.keywords.join(
            ' ',
          )}`,
      ),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(
      normalizedQuery,
    );
  });
}

export function buildTarotJournalStats(
  entries: AdvancedTarotJournalEntry[],
): TarotJournalStats {
  const tagCounts =
    TAROT_JOURNAL_TAGS.reduce(
      (acc, tag) => {
        acc[tag] = 0;
        return acc;
      },
      {} as Record<TarotJournalTag, number>,
    );

  const spreadCounts:
    Record<string, number> = {};

  const cardCounts:
    Record<
      string,
      {
        cardId: string;
        cardName: string;
        count: number;
      }
    > = {};

  let favoriteCount = 0;
  let noteCount = 0;

  entries.forEach(entry => {
    if (entry.favorite) {
      favoriteCount += 1;
    }

    if (
      entry.note &&
      entry.note.trim().length > 0
    ) {
      noteCount += 1;
    }

    spreadCounts[entry.spread] =
      (spreadCounts[entry.spread] ?? 0) +
      1;

    (entry.tags ?? []).forEach(tag => {
      tagCounts[tag] =
        (tagCounts[tag] ?? 0) + 1;
    });

    entry.cards.forEach(draw => {
      const cardId =
        draw.card.id ??
        draw.card.name;

      if (!cardCounts[cardId]) {
        cardCounts[cardId] = {
          cardId,
          cardName:
            draw.card.name,
          count: 0,
        };
      }

      cardCounts[cardId].count += 1;
    });
  });

  const mostDrawnCards =
    Object.values(cardCounts)
      .sort(
        (a, b) =>
          b.count - a.count,
      )
      .slice(0, 5);

  return {
    totalReadings:
      entries.length,
    favoriteCount,
    noteCount,
    tagCounts,
    mostDrawnCards,
    spreadCounts,
  };
}
