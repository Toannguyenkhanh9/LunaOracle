import {
  getDailyRitualStreak,
  listDailyRitualEntries,
  type DailyRitualEntry,
  type DailyRitualMood,
} from './dailyRitual';

import {
  listBirthProfiles,
} from './birthProfiles';

export type LunaAchievementId =
  | 'firstRitual'
  | 'threeDayStreak'
  | 'sevenDayStreak'
  | 'fourteenDayStreak'
  | 'thirtyDayStreak'
  | 'sevenRituals'
  | 'thirtyRituals'
  | 'moodExplorer'
  | 'tarotSeeker'
  | 'moonKeeper'
  | 'profileCollector'
  | 'reflectionWriter';

export type LunaAchievement = {
  id: LunaAchievementId;
  icon: string;
  target: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: string;
};

export type LunaStreakStats = {
  currentStreak: number;
  longestStreak: number;
  totalRituals: number;
  totalNotes: number;
  uniqueMoods: number;
  uniqueTarotCards: number;
  uniqueMoonHouses: number;
  profileCount: number;
  lastCheckInDate?: string;
  achievements: LunaAchievement[];
};

const ACHIEVEMENT_META:
  Array<{
    id: LunaAchievementId;
    icon: string;
    target: number;
  }> = [
    {
      id: 'firstRitual',
      icon: '✦',
      target: 1,
    },
    {
      id: 'threeDayStreak',
      icon: '☽',
      target: 3,
    },
    {
      id: 'sevenDayStreak',
      icon: '☾',
      target: 7,
    },
    {
      id: 'fourteenDayStreak',
      icon: '☉',
      target: 14,
    },
    {
      id: 'thirtyDayStreak',
      icon: '◎',
      target: 30,
    },
    {
      id: 'sevenRituals',
      icon: '✧',
      target: 7,
    },
    {
      id: 'thirtyRituals',
      icon: '✹',
      target: 30,
    },
    {
      id: 'moodExplorer',
      icon: '♡',
      target: 4,
    },
    {
      id: 'tarotSeeker',
      icon: '✦',
      target: 10,
    },
    {
      id: 'moonKeeper',
      icon: '☾',
      target: 6,
    },
    {
      id: 'profileCollector',
      icon: '♃',
      target: 2,
    },
    {
      id: 'reflectionWriter',
      icon: '☿',
      target: 5,
    },
  ];

function unique<T>(
  values: T[],
): T[] {
  return Array.from(
    new Set(values),
  );
}

function sortDateKeys(
  entries: DailyRitualEntry[],
): string[] {
  return unique(
    entries.map(
      item => item.dateKey,
    ),
  ).sort();
}

function calculateLongestStreak(
  entries: DailyRitualEntry[],
): number {
  const dates =
    sortDateKeys(entries);

  if (dates.length === 0) {
    return 0;
  }

  let longest = 1;
  let current = 1;

  for (
    let index = 1;
    index < dates.length;
    index += 1
  ) {
    const previous =
      new Date(dates[index - 1]);
    const next =
      new Date(dates[index]);

    const diffDays =
      Math.round(
        (
          next.getTime() -
          previous.getTime()
        ) /
          86400000,
      );

    if (diffDays === 1) {
      current += 1;
    } else {
      current = 1;
    }

    longest =
      Math.max(
        longest,
        current,
      );
  }

  return longest;
}

function getUnlockedAt(
  entries: DailyRitualEntry[],
  unlocked: boolean,
): string | undefined {
  if (!unlocked) {
    return undefined;
  }

  return entries
    .map(item => item.dateKey)
    .sort()[0];
}

function buildAchievement(
  id: LunaAchievementId,
  icon: string,
  target: number,
  progress: number,
  entries: DailyRitualEntry[],
): LunaAchievement {
  const safeProgress =
    Math.max(
      0,
      Math.min(
        progress,
        target,
      ),
    );

  const unlocked =
    progress >= target;

  return {
    id,
    icon,
    target,
    progress:
      safeProgress,
    unlocked,
    unlockedAt:
      getUnlockedAt(
        entries,
        unlocked,
      ),
  };
}

export async function buildLunaStreakStats():
Promise<LunaStreakStats> {
  const [
    entries,
    currentStreak,
    profileState,
  ] =
    await Promise.all([
      listDailyRitualEntries(),
      getDailyRitualStreak(),
      listBirthProfiles().catch(
        () => ({
          profiles: [],
        }),
      ),
    ]);

  const totalRituals =
    entries.length;

  const totalNotes =
    entries.filter(
      item =>
        item.note &&
        item.note.trim().length > 0,
    ).length;

  const uniqueMoods =
    unique(
      entries
        .map(item => item.mood)
        .filter(
          Boolean,
        ) as DailyRitualMood[],
    ).length;

  const uniqueTarotCards =
    unique(
      entries
        .map(
          item =>
            item.tarotDraw?.card?.id ??
            item.tarotDraw?.card?.name,
        )
        .filter(Boolean),
    ).length;

  const uniqueMoonHouses =
    unique(
      entries
        .map(item => item.moonHouse)
        .filter(Boolean),
    ).length;

  const longestStreak =
    Math.max(
      calculateLongestStreak(entries),
      currentStreak,
    );

  const profileCount =
    profileState.profiles.length;

  const lastCheckInDate =
    entries[0]?.dateKey;

  const progressMap:
    Record<LunaAchievementId, number> = {
      firstRitual:
        totalRituals,
      threeDayStreak:
        currentStreak,
      sevenDayStreak:
        currentStreak,
      fourteenDayStreak:
        currentStreak,
      thirtyDayStreak:
        currentStreak,
      sevenRituals:
        totalRituals,
      thirtyRituals:
        totalRituals,
      moodExplorer:
        uniqueMoods,
      tarotSeeker:
        uniqueTarotCards,
      moonKeeper:
        uniqueMoonHouses,
      profileCollector:
        profileCount,
      reflectionWriter:
        totalNotes,
    };

  const achievements =
    ACHIEVEMENT_META.map(meta =>
      buildAchievement(
        meta.id,
        meta.icon,
        meta.target,
        progressMap[meta.id],
        entries,
      ),
    );

  return {
    currentStreak,
    longestStreak,
    totalRituals,
    totalNotes,
    uniqueMoods,
    uniqueTarotCards,
    uniqueMoonHouses,
    profileCount,
    lastCheckInDate,
    achievements,
  };
}
