import AsyncStorage
  from '@react-native-async-storage/async-storage';

export type TimelineEventCategory =
  | 'career'
  | 'finance'
  | 'relationship'
  | 'family'
  | 'health'
  | 'education'
  | 'relocation'
  | 'spiritual'
  | 'achievement'
  | 'other';

export type TimelineEventTone =
  | 'positive'
  | 'neutral'
  | 'challenging';

export type TimelineEventImportance =
  | 1
  | 2
  | 3;

export type TimelineEvent = {
  id: string;
  profileId: string;

  title: string;
  description: string;

  date: string;
  year: number;
  month: number;
  day: number;

  category:
    TimelineEventCategory;

  tone:
    TimelineEventTone;

  importance:
    TimelineEventImportance;

  tags: string[];

  createdAt: string;
  updatedAt: string;
};

export type TimelineEventInput = {
  id?: string;
  profileId: string;

  title: string;
  description?: string;

  year: number;
  month: number;
  day: number;

  category:
    TimelineEventCategory;

  tone:
    TimelineEventTone;

  importance:
    TimelineEventImportance;

  tags?: string[];
};

type TimelineEventEnvelope = {
  schemaVersion: 1;
  items: TimelineEvent[];
};

const STORAGE_KEY =
  '@eastern_destiny/timeline_events_v1';

const MAX_EVENTS = 1000;

function createId(): string {
  return [
    'timeline-event',
    Date.now(),
    Math.random()
      .toString(36)
      .slice(2, 9),
  ].join('-');
}

function pad2(
  value: number,
): string {
  return String(value)
    .padStart(2, '0');
}

function buildDate(
  year: number,
  month: number,
  day: number,
): string {
  return [
    year,
    pad2(month),
    pad2(day),
  ].join('-');
}

function isValidDate(
  year: number,
  month: number,
  day: number,
): boolean {
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return false;
  }

  if (
    year < 1800 ||
    year > 2300 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return false;
  }

  const date =
    new Date(
      year,
      month - 1,
      day,
      12,
      0,
      0,
      0,
    );

  return (
    date.getFullYear() === year &&
    date.getMonth() ===
      month - 1 &&
    date.getDate() === day
  );
}

function normalizeTags(
  value: unknown,
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .map(item =>
          String(item).trim(),
        )
        .filter(Boolean),
    ),
  ).slice(0, 12);
}

function normalizeItem(
  value: unknown,
): TimelineEvent | null {
  if (
    !value ||
    typeof value !== 'object'
  ) {
    return null;
  }

  const item =
    value as Partial<
      TimelineEvent
    >;

  if (
    typeof item.id !== 'string' ||
    typeof item.profileId !==
      'string' ||
    typeof item.title !==
      'string' ||
    typeof item.year !==
      'number' ||
    typeof item.month !==
      'number' ||
    typeof item.day !==
      'number' ||
    !isValidDate(
      item.year,
      item.month,
      item.day,
    )
  ) {
    return null;
  }

  const category:
    TimelineEventCategory =
      [
        'career',
        'finance',
        'relationship',
        'family',
        'health',
        'education',
        'relocation',
        'spiritual',
        'achievement',
        'other',
      ].includes(
        String(item.category),
      )
        ? item.category as TimelineEventCategory
        : 'other';

  const tone:
    TimelineEventTone =
      [
        'positive',
        'neutral',
        'challenging',
      ].includes(
        String(item.tone),
      )
        ? item.tone as TimelineEventTone
        : 'neutral';

  const importance:
    TimelineEventImportance =
      item.importance === 3
        ? 3
        : item.importance === 2
          ? 2
          : 1;

  const now =
    new Date().toISOString();

  return {
    id: item.id,
    profileId:
      item.profileId,
    title:
      item.title.trim(),
    description:
      typeof item.description ===
      'string'
        ? item.description.trim()
        : '',
    date:
      typeof item.date ===
      'string'
        ? item.date
        : buildDate(
            item.year,
            item.month,
            item.day,
          ),
    year:
      item.year,
    month:
      item.month,
    day:
      item.day,
    category,
    tone,
    importance,
    tags:
      normalizeTags(
        item.tags,
      ),
    createdAt:
      typeof item.createdAt ===
      'string'
        ? item.createdAt
        : now,
    updatedAt:
      typeof item.updatedAt ===
      'string'
        ? item.updatedAt
        : now,
  };
}

async function readEnvelope(): Promise<
  TimelineEventEnvelope
> {
  try {
    const raw =
      await AsyncStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return {
        schemaVersion: 1,
        items: [],
      };
    }

    const parsed =
      JSON.parse(raw) as Partial<
        TimelineEventEnvelope
      >;

    const items =
      Array.isArray(
        parsed.items,
      )
        ? parsed.items
            .map(normalizeItem)
            .filter(
              (
                item,
              ): item is TimelineEvent =>
                item !== null,
            )
        : [];

    return {
      schemaVersion: 1,
      items:
        sortTimelineEvents(
          items,
        ).slice(
          0,
          MAX_EVENTS,
        ),
    };
  } catch (error) {
    console.warn(
      'Unable to read timeline events:',
      error,
    );

    return {
      schemaVersion: 1,
      items: [],
    };
  }
}

async function writeEnvelope(
  envelope:
    TimelineEventEnvelope,
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      schemaVersion: 1,
      items:
        sortTimelineEvents(
          envelope.items,
        ).slice(
          0,
          MAX_EVENTS,
        ),
    }),
  );
}

export function sortTimelineEvents(
  items: TimelineEvent[],
): TimelineEvent[] {
  return [...items].sort(
    (first, second) => {
      const dateCompare =
        second.date.localeCompare(
          first.date,
        );

      if (dateCompare !== 0) {
        return dateCompare;
      }

      if (
        first.importance !==
        second.importance
      ) {
        return (
          second.importance -
          first.importance
        );
      }

      return second.updatedAt.localeCompare(
        first.updatedAt,
      );
    },
  );
}

export async function getTimelineEvents(): Promise<
  TimelineEvent[]
> {
  return (
    await readEnvelope()
  ).items;
}

export async function getTimelineEventsByProfile(
  profileId: string,
): Promise<TimelineEvent[]> {
  const items =
    await getTimelineEvents();

  return items.filter(
    item =>
      item.profileId ===
      profileId,
  );
}

export async function getTimelineEventsByProfileAndYear(
  profileId: string,
  year: number,
): Promise<TimelineEvent[]> {
  const items =
    await getTimelineEventsByProfile(
      profileId,
    );

  return items.filter(
    item =>
      item.year === year,
  );
}

export async function getTimelineEvent(
  id: string,
): Promise<
  TimelineEvent | null
> {
  const items =
    await getTimelineEvents();

  return (
    items.find(
      item => item.id === id,
    ) ?? null
  );
}

export async function saveTimelineEvent(
  input: TimelineEventInput,
): Promise<TimelineEvent> {
  const title =
    input.title.trim();

  if (!title) {
    throw new Error(
      'TITLE_REQUIRED',
    );
  }

  if (!input.profileId) {
    throw new Error(
      'PROFILE_REQUIRED',
    );
  }

  if (
    !isValidDate(
      input.year,
      input.month,
      input.day,
    )
  ) {
    throw new Error(
      'INVALID_DATE',
    );
  }

  const envelope =
    await readEnvelope();

  const existing =
    input.id
      ? envelope.items.find(
          item =>
            item.id === input.id,
        )
      : undefined;

  const now =
    new Date().toISOString();

  const item:
    TimelineEvent = {
      id:
        existing?.id ??
        createId(),
      profileId:
        input.profileId,
      title,
      description:
        input.description
          ?.trim() ?? '',
      date:
        buildDate(
          input.year,
          input.month,
          input.day,
        ),
      year:
        input.year,
      month:
        input.month,
      day:
        input.day,
      category:
        input.category,
      tone:
        input.tone,
      importance:
        input.importance,
      tags:
        normalizeTags(
          input.tags,
        ),
      createdAt:
        existing?.createdAt ??
        now,
      updatedAt: now,
    };

  envelope.items = [
    item,
    ...envelope.items.filter(
      event =>
        event.id !== item.id,
    ),
  ];

  await writeEnvelope(
    envelope,
  );

  return item;
}

export async function deleteTimelineEvent(
  id: string,
): Promise<TimelineEvent[]> {
  const envelope =
    await readEnvelope();

  envelope.items =
    envelope.items.filter(
      item => item.id !== id,
    );

  await writeEnvelope(
    envelope,
  );

  return envelope.items;
}

export async function deleteTimelineEventsForProfile(
  profileId: string,
): Promise<void> {
  const envelope =
    await readEnvelope();

  envelope.items =
    envelope.items.filter(
      item =>
        item.profileId !==
        profileId,
    );

  await writeEnvelope(
    envelope,
  );
}

export function buildTimelineEventCounts(
  items: TimelineEvent[],
): Record<
  number,
  number
> {
  return items.reduce<
    Record<number, number>
  >(
    (result, item) => {
      result[item.year] =
        (
          result[item.year] ??
          0
        ) + 1;

      return result;
    },
    {},
  );
}

export function parseTimelineEventTags(
  value: string,
): string[] {
  return normalizeTags(
    value
      .split(/[,;#]/g)
      .map(item =>
        item.trim(),
      ),
  );
}
