import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  getUserProfile,
} from './userProfiles';

export type TrackableRoute =
  | 'Today'
  | 'LunarCalendar'
  | 'BaziChart'
  | 'ZiweiChart'
  | 'Horoscope'
  | 'BaziHistory'
  | 'BaziStage4'
  | 'FortuneStick'
  | 'BuddhistCalendar'
  | 'UserProfiles'
  | 'LifeTimeline'
  | 'AdvancedCompatibility'
  | 'ProfileOverview'
  | 'DailyBrief'
  | 'MonthlyReview'
  | 'Glossary';

export type SerializableRouteParams = Record<
  string,
  string | number | boolean | undefined
>;

export type RecentlyViewedItem = {
  id: string;
  route: TrackableRoute;
  params?: SerializableRouteParams;
  profileId?: string;
  profileName?: string;
  titleKey: string;
  icon: string;
  viewedAt: string;
};

type RecentlyViewedEnvelope = {
  schemaVersion: 1;
  items: RecentlyViewedItem[];
};

const STORAGE_KEY =
  '@eastern_destiny/recently_viewed_v1';

const MAX_ITEMS = 60;

const ROUTE_META: Record<
  TrackableRoute,
  {
    titleKey: string;
    icon: string;
  }
> = {
  Today: {
    titleKey: 'today.title',
    icon: '☀',
  },
  LunarCalendar: {
    titleKey: 'astrologyHome.cards.lunarTitle',
    icon: '月',
  },
  BaziChart: {
    titleKey: 'astrologyHome.cards.baziTitle',
    icon: '☯',
  },
  ZiweiChart: {
    titleKey: 'astrologyHome.cards.ziweiTitle',
    icon: '紫',
  },
  Horoscope: {
    titleKey: 'astrologyHome.cards.auspiciousTitle',
    icon: '✦',
  },
  BaziHistory: {
    titleKey: 'astrologyHome.cards.savedTitle',
    icon: '冊',
  },
  BaziStage4: {
    titleKey: 'astrologyHome.cards.compatibilityTitle',
    icon: '∞',
  },
  FortuneStick: {
    titleKey: 'astrologyHome.cards.fortuneTitle',
    icon: '籤',
  },
  BuddhistCalendar: {
    titleKey: 'astrologyHome.cards.holidayTitle',
    icon: '日',
  },
  UserProfiles: {
    titleKey: 'userProfiles.title',
    icon: '◎',
  },
  LifeTimeline: {
    titleKey: 'insightFeatures.timeline.title',
    icon: '⌁',
  },
  AdvancedCompatibility: {
    titleKey: 'insightFeatures.compatibility.title',
    icon: '◉',
  },
  ProfileOverview: {
    titleKey: 'profileOverview.title',
    icon: '◎',
  },
  DailyBrief: {
    titleKey: 'dailyBrief.title',
    icon: '☀',
  },
  MonthlyReview: {
    titleKey: 'monthlyReview.title',
    icon: '◫',
  },
  Glossary: {
    titleKey: 'glossary.title',
    icon: '字',
  },
};

function createId(): string {
  return `recent-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function isTrackableRoute(
  value: string,
): value is TrackableRoute {
  return Object.prototype.hasOwnProperty.call(
    ROUTE_META,
    value,
  );
}

function normalizeParams(
  params: unknown,
): SerializableRouteParams | undefined {
  if (
    !params ||
    typeof params !== 'object' ||
    Array.isArray(params)
  ) {
    return undefined;
  }

  const result: SerializableRouteParams = {};

  Object.entries(
    params as Record<string, unknown>,
  ).forEach(([key, value]) => {
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      result[key] = value;
    }
  });

  return Object.keys(result).length > 0
    ? result
    : undefined;
}

async function readEnvelope(): Promise<
  RecentlyViewedEnvelope
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
      JSON.parse(raw) as Partial<RecentlyViewedEnvelope>;

    const items =
      Array.isArray(parsed.items)
        ? parsed.items.filter(
            (
              item,
            ): item is RecentlyViewedItem =>
              Boolean(
                item &&
                  typeof item.id === 'string' &&
                  typeof item.route === 'string' &&
                  isTrackableRoute(item.route) &&
                  typeof item.viewedAt === 'string',
              ),
          )
        : [];

    return {
      schemaVersion: 1,
      items: items
        .sort((first, second) =>
          second.viewedAt.localeCompare(
            first.viewedAt,
          ),
        )
        .slice(0, MAX_ITEMS),
    };
  } catch (error) {
    console.warn(
      'Unable to read recently viewed items:',
      error,
    );

    return {
      schemaVersion: 1,
      items: [],
    };
  }
}

async function writeEnvelope(
  envelope: RecentlyViewedEnvelope,
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      schemaVersion: 1,
      items: envelope.items.slice(
        0,
        MAX_ITEMS,
      ),
    }),
  );
}

function buildDedupeKey(
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
  ].join('|');
}

export async function recordRecentlyViewedRoute(
  routeName: string,
  rawParams?: unknown,
): Promise<void> {
  if (!isTrackableRoute(routeName)) {
    return;
  }

  const params =
    normalizeParams(rawParams);

  const profileId =
    typeof params?.profileId === 'string'
      ? params.profileId
      : undefined;

  let profileName: string | undefined;

  if (profileId) {
    try {
      profileName =
        (
          await getUserProfile(
            profileId,
          )
        )?.displayName;
    } catch {
      profileName = undefined;
    }
  }

  const envelope =
    await readEnvelope();

  const key =
    buildDedupeKey(
      routeName,
      params,
    );

  const remaining =
    envelope.items.filter(
      item =>
        buildDedupeKey(
          item.route,
          item.params,
        ) !== key,
    );

  const meta =
    ROUTE_META[routeName];

  remaining.unshift({
    id: createId(),
    route: routeName,
    params,
    profileId,
    profileName,
    titleKey: meta.titleKey,
    icon: meta.icon,
    viewedAt:
      new Date().toISOString(),
  });

  await writeEnvelope({
    schemaVersion: 1,
    items: remaining,
  });
}

export async function getRecentlyViewedItems(): Promise<
  RecentlyViewedItem[]
> {
  return (
    await readEnvelope()
  ).items;
}

export async function removeRecentlyViewedItem(
  id: string,
): Promise<RecentlyViewedItem[]> {
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

export async function clearRecentlyViewedItems(): Promise<void> {
  await AsyncStorage.removeItem(
    STORAGE_KEY,
  );
}
