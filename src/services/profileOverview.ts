import {
  getBookmarks,
  getPersonalNotes,
  type BookmarkItem,
  type PersonalNote,
} from './bookmarksNotes';

import {
  getRecentlyViewedItems,
  type RecentlyViewedItem,
} from './recentlyViewed';

import {
  getTimelineEventsByProfile,
  type TimelineEvent,
} from './timelineEvents';

import {
  getUserProfile,
  type UserProfile,
} from './userProfiles';

export type ProfileOverviewStats = {
  timelineEventCount: number;
  importantEventCount: number;
  currentYearEventCount: number;
  linkedBookmarkCount: number;
  linkedRecentCount: number;
  bookmarkNoteCount: number;
  personalNoteCount: number;
};

export type ProfileOverviewData = {
  profile: UserProfile;
  stats: ProfileOverviewStats;
  recentEvents: TimelineEvent[];
  recentBookmarks: BookmarkItem[];
  recentViews: RecentlyViewedItem[];
  recentNotes: PersonalNote[];
};

function bookmarkBelongsToProfile(
  item: BookmarkItem,
  profile: UserProfile,
): boolean {
  const params = item.params;

  return (
    params?.profileId === profile.id ||
    params?.profileAId === profile.id ||
    params?.profileBId === profile.id ||
    item.profileName === profile.displayName ||
    item.profileName
      ?.split('×')
      .map(value => value.trim())
      .includes(profile.displayName) === true
  );
}

function recentBelongsToProfile(
  item: RecentlyViewedItem,
  profile: UserProfile,
): boolean {
  const params = item.params;

  return (
    item.profileId === profile.id ||
    params?.profileId === profile.id ||
    params?.profileAId === profile.id ||
    params?.profileBId === profile.id ||
    item.profileName === profile.displayName
  );
}

export async function getProfileOverview(
  profileId: string,
): Promise<ProfileOverviewData> {
  const profile =
    await getUserProfile(
      profileId,
    );

  if (!profile) {
    throw new Error(
      'PROFILE_NOT_FOUND',
    );
  }

  const [
    events,
    bookmarks,
    recentItems,
    notes,
  ] = await Promise.all([
    getTimelineEventsByProfile(
      profileId,
    ),
    getBookmarks(),
    getRecentlyViewedItems(),
    getPersonalNotes(),
  ]);

  const linkedBookmarks =
    bookmarks.filter(item =>
      bookmarkBelongsToProfile(
        item,
        profile,
      ),
    );

  const linkedRecent =
    recentItems.filter(item =>
      recentBelongsToProfile(
        item,
        profile,
      ),
    );

  const currentYear =
    new Date().getFullYear();

  return {
    profile,
    stats: {
      timelineEventCount:
        events.length,
      importantEventCount:
        events.filter(
          item =>
            item.importance === 3,
        ).length,
      currentYearEventCount:
        events.filter(
          item =>
            item.year ===
            currentYear,
        ).length,
      linkedBookmarkCount:
        linkedBookmarks.length,
      linkedRecentCount:
        linkedRecent.length,
      bookmarkNoteCount:
        linkedBookmarks.filter(
          item =>
            Boolean(
              item.note.trim(),
            ),
        ).length,
      personalNoteCount:
        notes.length,
    },
    recentEvents:
      events.slice(0, 5),
    recentBookmarks:
      linkedBookmarks.slice(
        0,
        5,
      ),
    recentViews:
      linkedRecent.slice(0, 5),
    recentNotes:
      notes.slice(0, 3),
  };
}
