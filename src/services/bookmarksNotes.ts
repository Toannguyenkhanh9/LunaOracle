import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  RecentlyViewedItem,
  SerializableRouteParams,
  TrackableRoute,
} from './recentlyViewed';

export type BookmarkItem = {
  id: string;
  route: TrackableRoute;
  params?: SerializableRouteParams;
  titleKey: string;
  icon: string;
  profileName?: string;
  note: string;
  createdAt: string;
  updatedAt: string;
};

export type PersonalNote = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

type LibraryEnvelope = {
  schemaVersion: 1;
  bookmarks: BookmarkItem[];
  notes: PersonalNote[];
};

const STORAGE_KEY =
  '@eastern_destiny/bookmarks_notes_v1';

const MAX_BOOKMARKS = 200;
const MAX_NOTES = 200;

function createId(
  prefix: string,
): string {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

async function readEnvelope(): Promise<
  LibraryEnvelope
> {
  try {
    const raw =
      await AsyncStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return {
        schemaVersion: 1,
        bookmarks: [],
        notes: [],
      };
    }

    const parsed =
      JSON.parse(raw) as Partial<LibraryEnvelope>;

    return {
      schemaVersion: 1,
      bookmarks:
        Array.isArray(
          parsed.bookmarks,
        )
          ? parsed.bookmarks
              .filter(
                (
                  item,
                ): item is BookmarkItem =>
                  Boolean(
                    item &&
                      typeof item.id === 'string' &&
                      typeof item.route === 'string' &&
                      typeof item.updatedAt === 'string',
                  ),
              )
              .sort((a, b) =>
                b.updatedAt.localeCompare(
                  a.updatedAt,
                ),
              )
              .slice(0, MAX_BOOKMARKS)
          : [],
      notes:
        Array.isArray(
          parsed.notes,
        )
          ? parsed.notes
              .filter(
                (
                  item,
                ): item is PersonalNote =>
                  Boolean(
                    item &&
                      typeof item.id === 'string' &&
                      typeof item.title === 'string' &&
                      typeof item.body === 'string' &&
                      typeof item.updatedAt === 'string',
                  ),
              )
              .sort((a, b) =>
                b.updatedAt.localeCompare(
                  a.updatedAt,
                ),
              )
              .slice(0, MAX_NOTES)
          : [],
    };
  } catch (error) {
    console.warn(
      'Unable to read bookmarks and notes:',
      error,
    );

    return {
      schemaVersion: 1,
      bookmarks: [],
      notes: [],
    };
  }
}

async function writeEnvelope(
  envelope: LibraryEnvelope,
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      schemaVersion: 1,
      bookmarks:
        envelope.bookmarks.slice(
          0,
          MAX_BOOKMARKS,
        ),
      notes:
        envelope.notes.slice(
          0,
          MAX_NOTES,
        ),
    }),
  );
}

function bookmarkDedupeKey(
  route: TrackableRoute,
  params?: SerializableRouteParams,
): string {
  return [
    route,
    params?.profileId ?? '',
    params?.savedRecordId ?? '',
    params?.profileAId ?? '',
    params?.profileBId ?? '',
    params?.mode ?? '',
    params?.year ?? '',
  ].join('|');
}

export async function getBookmarks(): Promise<
  BookmarkItem[]
> {
  return (
    await readEnvelope()
  ).bookmarks;
}

export async function saveBookmarkFromRecent(
  recent: RecentlyViewedItem,
  note = '',
): Promise<BookmarkItem> {
  return saveBookmark({
    route: recent.route,
    params: recent.params,
    titleKey: recent.titleKey,
    icon: recent.icon,
    profileName:
      recent.profileName,
    note,
  });
}

export async function saveBookmark(input: {
  route: TrackableRoute;
  params?: SerializableRouteParams;
  titleKey: string;
  icon: string;
  profileName?: string;
  note?: string;
}): Promise<BookmarkItem> {
  const envelope =
    await readEnvelope();

  const now =
    new Date().toISOString();

  const dedupeKey =
    bookmarkDedupeKey(
      input.route,
      input.params,
    );

  const existing =
    envelope.bookmarks.find(
      item =>
        bookmarkDedupeKey(
          item.route,
          item.params,
        ) === dedupeKey,
    );

  const bookmark: BookmarkItem = {
    id:
      existing?.id ??
      createId('bookmark'),
    route: input.route,
    params: input.params,
    titleKey: input.titleKey,
    icon: input.icon,
    profileName:
      input.profileName,
    note:
      input.note ??
      existing?.note ??
      '',
    createdAt:
      existing?.createdAt ??
      now,
    updatedAt: now,
  };

  envelope.bookmarks =
    [
      bookmark,
      ...envelope.bookmarks.filter(
        item =>
          item.id !== bookmark.id,
      ),
    ];

  await writeEnvelope(
    envelope,
  );

  return bookmark;
}

export async function updateBookmarkNote(
  id: string,
  note: string,
): Promise<BookmarkItem[]> {
  const envelope =
    await readEnvelope();

  const now =
    new Date().toISOString();

  envelope.bookmarks =
    envelope.bookmarks.map(
      item =>
        item.id === id
          ? {
              ...item,
              note: note.trim(),
              updatedAt: now,
            }
          : item,
    );

  await writeEnvelope(
    envelope,
  );

  return envelope.bookmarks;
}

export async function removeBookmark(
  id: string,
): Promise<BookmarkItem[]> {
  const envelope =
    await readEnvelope();

  envelope.bookmarks =
    envelope.bookmarks.filter(
      item => item.id !== id,
    );

  await writeEnvelope(
    envelope,
  );

  return envelope.bookmarks;
}

export async function getPersonalNotes(): Promise<
  PersonalNote[]
> {
  return (
    await readEnvelope()
  ).notes;
}

export async function savePersonalNote(input: {
  id?: string;
  title: string;
  body: string;
}): Promise<PersonalNote> {
  const title =
    input.title.trim();

  const body =
    input.body.trim();

  if (!title && !body) {
    throw new Error(
      'EMPTY_NOTE',
    );
  }

  const envelope =
    await readEnvelope();

  const now =
    new Date().toISOString();

  const existing =
    input.id
      ? envelope.notes.find(
          item =>
            item.id === input.id,
        )
      : undefined;

  const note: PersonalNote = {
    id:
      existing?.id ??
      createId('note'),
    title:
      title ||
      existing?.title ||
      'Untitled',
    body,
    createdAt:
      existing?.createdAt ??
      now,
    updatedAt: now,
  };

  envelope.notes = [
    note,
    ...envelope.notes.filter(
      item => item.id !== note.id,
    ),
  ];

  await writeEnvelope(
    envelope,
  );

  return note;
}

export async function removePersonalNote(
  id: string,
): Promise<PersonalNote[]> {
  const envelope =
    await readEnvelope();

  envelope.notes =
    envelope.notes.filter(
      item => item.id !== id,
    );

  await writeEnvelope(
    envelope,
  );

  return envelope.notes;
}
