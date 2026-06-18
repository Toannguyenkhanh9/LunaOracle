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
  getTimelineEvents,
  type TimelineEvent,
  type TimelineEventCategory,
  type TimelineEventTone,
} from './timelineEvents';

export type MonthlyReviewTool = {
  titleKey: string;
  count: number;
};

export type MonthlyReview = {
  year: number;
  month: number;
  profileId?: string;

  viewedCount: number;
  bookmarkCount: number;
  noteCount: number;
  timelineEventCount: number;
  importantEventCount: number;
  activeDayCount: number;

  categoryCounts:
    Partial<
      Record<
        TimelineEventCategory,
        number
      >
    >;

  toneCounts:
    Record<
      TimelineEventTone,
      number
    >;

  topTools:
    MonthlyReviewTool[];

  recentEvents:
    TimelineEvent[];

  recentBookmarks:
    BookmarkItem[];

  recentNotes:
    PersonalNote[];

  highlightCodes:
    string[];
};

function isInMonth(
  isoValue: string,
  year: number,
  month: number,
): boolean {
  const date =
    new Date(isoValue);

  return (
    date.getFullYear() ===
      year &&
    date.getMonth() + 1 ===
      month
  );
}

function eventBelongs(
  item: TimelineEvent,
  profileId?: string,
): boolean {
  return (
    !profileId ||
    item.profileId ===
      profileId
  );
}

function recentBelongs(
  item: RecentlyViewedItem,
  profileId?: string,
): boolean {
  if (!profileId) {
    return true;
  }

  return (
    item.profileId ===
      profileId ||
    item.params?.profileId ===
      profileId ||
    item.params?.profileAId ===
      profileId ||
    item.params?.profileBId ===
      profileId
  );
}

function bookmarkBelongs(
  item: BookmarkItem,
  profileId?: string,
): boolean {
  if (!profileId) {
    return true;
  }

  return (
    item.params?.profileId ===
      profileId ||
    item.params?.profileAId ===
      profileId ||
    item.params?.profileBId ===
      profileId
  );
}

function buildHighlights(
  viewedCount: number,
  bookmarkCount: number,
  noteCount: number,
  eventCount: number,
  importantEventCount: number,
): string[] {
  const result: string[] = [];

  if (
    importantEventCount > 0
  ) {
    result.push(
      'majorMilestones',
    );
  }

  if (noteCount >= 3) {
    result.push(
      'activeReflection',
    );
  }

  if (
    bookmarkCount >= 3
  ) {
    result.push(
      'knowledgeCollection',
    );
  }

  if (viewedCount >= 8) {
    result.push(
      'consistentExploration',
    );
  }

  if (eventCount === 0) {
    result.push(
      'addRealEvents',
    );
  }

  if (result.length === 0) {
    result.push(
      'steadyMonth',
    );
  }

  return result.slice(0, 4);
}

export async function buildMonthlyReview(input: {
  year: number;
  month: number;
  profileId?: string;
}): Promise<MonthlyReview> {
  const {
    year,
    month,
    profileId,
  } = input;

  const [
    allEvents,
    allRecent,
    allBookmarks,
    allNotes,
  ] = await Promise.all([
    getTimelineEvents(),
    getRecentlyViewedItems(),
    getBookmarks(),
    getPersonalNotes(),
  ]);

  const events =
    allEvents.filter(
      item =>
        eventBelongs(
          item,
          profileId,
        ) &&
        item.year === year &&
        item.month === month,
    );

  const recent =
    allRecent.filter(
      item =>
        recentBelongs(
          item,
          profileId,
        ) &&
        isInMonth(
          item.viewedAt,
          year,
          month,
        ),
    );

  const bookmarks =
    allBookmarks.filter(
      item =>
        bookmarkBelongs(
          item,
          profileId,
        ) &&
        isInMonth(
          item.updatedAt,
          year,
          month,
        ),
    );

  const notes =
    profileId
      ? []
      : allNotes.filter(
          item =>
            isInMonth(
              item.updatedAt,
              year,
              month,
            ),
        );

  const categoryCounts:
    MonthlyReview[
      'categoryCounts'
    ] = {};

  const toneCounts:
    MonthlyReview[
      'toneCounts'
    ] = {
      positive: 0,
      neutral: 0,
      challenging: 0,
    };

  events.forEach(item => {
    categoryCounts[
      item.category
    ] =
      (
        categoryCounts[
          item.category
        ] ?? 0
      ) + 1;

    toneCounts[
      item.tone
    ] += 1;
  });

  const toolMap =
    new Map<
      string,
      number
    >();

  recent.forEach(item => {
    toolMap.set(
      item.titleKey,
      (
        toolMap.get(
          item.titleKey,
        ) ?? 0
      ) + 1,
    );
  });

  const topTools =
    Array.from(
      toolMap.entries(),
    )
      .map(
        ([
          titleKey,
          count,
        ]) => ({
          titleKey,
          count,
        }),
      )
      .sort(
        (first, second) =>
          second.count -
          first.count,
      )
      .slice(0, 5);

  const activeDays =
    new Set<string>();

  events.forEach(item =>
    activeDays.add(
      item.date,
    ),
  );

  recent.forEach(item =>
    activeDays.add(
      item.viewedAt.slice(
        0,
        10,
      ),
    ),
  );

  bookmarks.forEach(item =>
    activeDays.add(
      item.updatedAt.slice(
        0,
        10,
      ),
    ),
  );

  notes.forEach(item =>
    activeDays.add(
      item.updatedAt.slice(
        0,
        10,
      ),
    ),
  );

  const importantEventCount =
    events.filter(
      item =>
        item.importance === 3,
    ).length;

  return {
    year,
    month,
    profileId,

    viewedCount:
      recent.length,
    bookmarkCount:
      bookmarks.length,
    noteCount:
      notes.length,
    timelineEventCount:
      events.length,
    importantEventCount,
    activeDayCount:
      activeDays.size,

    categoryCounts,
    toneCounts,
    topTools,

    recentEvents:
      events.slice(0, 5),
    recentBookmarks:
      bookmarks.slice(0, 5),
    recentNotes:
      notes.slice(0, 3),

    highlightCodes:
      buildHighlights(
        recent.length,
        bookmarks.length,
        notes.length,
        events.length,
        importantEventCount,
      ),
  };
}
