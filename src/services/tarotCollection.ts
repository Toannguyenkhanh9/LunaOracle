import AsyncStorage
  from '@react-native-async-storage/async-storage';

import {
  TAROT_CARD_IMAGES,
} from './tarotCardImages';

import type {
  TarotDraw,
} from './tarot';

const STORAGE_KEY =
  '@luna_oracle/tarot_collection_v1';

export type TarotCollectionEntry = {
  id: string;
  name: string;
  discovered: boolean;
  firstSeenAt?: string;
  lastSeenAt?: string;
  drawCount: number;
  uprightCount: number;
  reversedCount: number;
  favorite?: boolean;
};

export type TarotCollectionStats = {
  total: number;
  discovered: number;
  completionRate: number;
  totalDraws: number;
  favoriteCount: number;
  mostDrawn?: TarotCollectionEntry;
  newest?: TarotCollectionEntry;
};

function safeImages():
Record<string, unknown> {
  return (
    TAROT_CARD_IMAGES ??
    {}
  ) as Record<string, unknown>;
}

function normalizeTarotId(
  value?: string,
): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/^the\s+/g, 'the_')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function titleize(
  id: string,
): string {
  return id
    .split('_')
    .filter(Boolean)
    .map(part =>
      part.length
        ? part[0].toUpperCase() +
          part.slice(1)
        : part,
    )
    .join(' ')
    .replace(/^Ace Of/g, 'Ace of')
    .replace(/^Two Of/g, 'Two of')
    .replace(/^Three Of/g, 'Three of')
    .replace(/^Four Of/g, 'Four of')
    .replace(/^Five Of/g, 'Five of')
    .replace(/^Six Of/g, 'Six of')
    .replace(/^Seven Of/g, 'Seven of')
    .replace(/^Eight Of/g, 'Eight of')
    .replace(/^Nine Of/g, 'Nine of')
    .replace(/^Ten Of/g, 'Ten of')
    .replace(/^Page Of/g, 'Page of')
    .replace(/^Knight Of/g, 'Knight of')
    .replace(/^Queen Of/g, 'Queen of')
    .replace(/^King Of/g, 'King of');
}

function getAlias(
  id: string,
): string {
  const aliases:
    Record<string, string> = {
      the_fool: 'fool',
      the_magician: 'magician',
      the_high_priestess:
        'high_priestess',
      the_empress: 'empress',
      the_emperor: 'emperor',
      the_hierophant:
        'hierophant',
      the_lovers: 'lovers',
      the_chariot: 'chariot',
      the_hermit: 'hermit',
      wheel:
        'wheel_of_fortune',
      wheel_fortune:
        'wheel_of_fortune',
      wheel_of_fortune:
        'wheel_of_fortune',
      the_devil: 'devil',
      the_tower: 'tower',
      the_star: 'star',
      the_moon: 'moon',
      the_sun: 'sun',
      the_world: 'world',
      hanged_man: 'hanged_man',
      the_hanged_man:
        'hanged_man',
    };

  return aliases[id] ?? id;
}

function normalizeForImage(
  idOrName?: string,
): string {
  const images =
    safeImages();

  const normalized =
    normalizeTarotId(
      idOrName,
    );

  if (images[normalized]) {
    return normalized;
  }

  const withoutThe =
    normalized.replace(
      /^the_/,
      '',
    );

  if (images[withoutThe]) {
    return withoutThe;
  }

  const alias =
    getAlias(normalized);

  if (images[alias]) {
    return alias;
  }

  return alias || normalized || 'unknown_card';
}

function getAllImageIds():
string[] {
  const ids =
    Object.keys(safeImages())
      .filter(
        key =>
          key !==
          'tarot_card_back_luna',
      )
      .sort();

  return ids.length > 0
    ? ids
    : [
        'fool',
        'magician',
        'high_priestess',
        'empress',
        'emperor',
        'hierophant',
        'lovers',
        'chariot',
        'strength',
        'hermit',
        'wheel_of_fortune',
        'justice',
        'hanged_man',
        'death',
        'temperance',
        'devil',
        'tower',
        'star',
        'moon',
        'sun',
        'judgement',
        'world',
      ];
}

async function readStored():
Promise<Record<string, TarotCollectionEntry>> {
  try {
    const raw =
      await AsyncStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return {};
    }

    return JSON.parse(raw);
  } catch (error) {
    console.warn(
      'Unable to read tarot collection:',
      error,
    );

    return {};
  }
}

async function writeStored(
  value: Record<string, TarotCollectionEntry>,
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(value),
    );
  } catch (error) {
    console.warn(
      'Unable to write tarot collection:',
      error,
    );
  }
}

export async function listTarotCollection():
Promise<TarotCollectionEntry[]> {
  const stored =
    await readStored();

  return getAllImageIds().map(id => {
    const existing =
      stored[id];

    return {
      id,
      name:
        existing?.name ??
        titleize(id),
      discovered:
        !!existing?.discovered,
      firstSeenAt:
        existing?.firstSeenAt,
      lastSeenAt:
        existing?.lastSeenAt,
      drawCount:
        existing?.drawCount ?? 0,
      uprightCount:
        existing?.uprightCount ?? 0,
      reversedCount:
        existing?.reversedCount ?? 0,
      favorite:
        existing?.favorite ?? false,
    };
  });
}

export async function recordTarotDraws(
  draws: TarotDraw[] = [],
): Promise<void> {
  if (!Array.isArray(draws)) {
    return;
  }

  const stored =
    await readStored();

  const now =
    new Date().toISOString();

  draws.forEach(draw => {
    if (!draw?.card) {
      return;
    }

    const id =
      normalizeForImage(
        draw.card.id ??
        draw.card.name,
      );

    const old =
      stored[id];

    stored[id] = {
      id,
      name:
        old?.name ??
        draw.card.name ??
        titleize(id),
      discovered: true,
      firstSeenAt:
        old?.firstSeenAt ??
        now,
      lastSeenAt:
        now,
      drawCount:
        (old?.drawCount ?? 0) +
        1,
      uprightCount:
        (old?.uprightCount ?? 0) +
        (draw.orientation ===
        'upright'
          ? 1
          : 0),
      reversedCount:
        (old?.reversedCount ?? 0) +
        (draw.orientation ===
        'reversed'
          ? 1
          : 0),
      favorite:
        old?.favorite ?? false,
    };
  });

  await writeStored(stored);
}

export async function toggleTarotCollectionFavorite(
  cardId: string,
): Promise<TarotCollectionEntry | undefined> {
  const id =
    normalizeForImage(cardId);

  const stored =
    await readStored();

  const old =
    stored[id];

  if (!old) {
    return undefined;
  }

  const next = {
    ...old,
    favorite:
      !old.favorite,
  };

  stored[id] = next;

  await writeStored(stored);

  return next;
}

export async function buildTarotCollectionStats():
Promise<TarotCollectionStats> {
  const entries =
    await listTarotCollection();

  const discovered =
    entries.filter(
      item => item.discovered,
    );

  const mostDrawn =
    [...discovered].sort(
      (a, b) =>
        b.drawCount -
        a.drawCount,
    )[0];

  const newest =
    [...discovered].sort(
      (a, b) =>
        String(
          b.lastSeenAt ?? '',
        ).localeCompare(
          String(
            a.lastSeenAt ?? '',
          ),
        ),
    )[0];

  const totalDraws =
    entries.reduce(
      (sum, item) =>
        sum + item.drawCount,
      0,
    );

  return {
    total:
      entries.length,
    discovered:
      discovered.length,
    completionRate:
      entries.length
        ? Math.round(
            (discovered.length /
              entries.length) *
              100,
          )
        : 0,
    totalDraws,
    favoriteCount:
      entries.filter(
        item => item.favorite,
      ).length,
    mostDrawn,
    newest,
  };
}

export async function resetTarotCollection():
Promise<void> {
  await AsyncStorage.removeItem(
    STORAGE_KEY,
  );
}
