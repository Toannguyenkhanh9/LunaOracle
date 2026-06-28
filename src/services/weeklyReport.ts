import {
  drawTarotCards,
  type TarotDraw,
} from './tarot';

import {
  buildTarotCollectionStats,
  type TarotCollectionStats,
} from './tarotCollection';

import {
  getMoonDustRewardState,
  type MoonDustRewardState,
} from './moonDustRewards';

export type WeeklyReport = {
  weekKey: string;
  startDate: string;
  endDate: string;
  tarot: TarotCollectionStats;
  moonDust: MoonDustRewardState;
  themeId: string;
  weeklyCard: TarotDraw;
  energyAverage: number;
  loveTrend: number;
  reflectionPromptId: string;
  actionId: string;
};

function startOfWeek(
  date = new Date(),
): Date {
  const next =
    new Date(date);

  const day =
    next.getDay();

  const diff =
    day === 0
      ? -6
      : 1 - day;

  next.setDate(
    next.getDate() + diff,
  );

  next.setHours(
    0,
    0,
    0,
    0,
  );

  return next;
}

function dateKey(
  date: Date,
): string {
  return date
    .toISOString()
    .slice(0, 10);
}

function calculateEnergyAverage(
  tarot: TarotCollectionStats,
  moonDust: MoonDustRewardState,
): number {
  const base =
    54 +
    Math.min(
      28,
      moonDust.currentStreak * 3,
    ) +
    Math.min(
      18,
      tarot.discovered,
    );

  return Math.max(
    35,
    Math.min(
      99,
      Math.round(base),
    ),
  );
}

function calculateLoveTrend(
  energy: number,
  tarot: TarotCollectionStats,
): number {
  const modifier =
    tarot.mostDrawn?.name
      .toLowerCase()
      .includes('lover')
      ? 8
      : 0;

  return Math.max(
    20,
    Math.min(
      99,
      Math.round(
        energy * 0.78 +
          10 +
          modifier,
      ),
    ),
  );
}

function pickTheme(
  energy: number,
): string {
  if (energy >= 82) {
    return 'expansion';
  }

  if (energy >= 68) {
    return 'alignment';
  }

  if (energy >= 52) {
    return 'healing';
  }

  return 'rest';
}

export async function buildWeeklyReport():
Promise<WeeklyReport> {
  const start =
    startOfWeek();

  const end =
    new Date(start);

  end.setDate(
    start.getDate() + 6,
  );

  const [
    tarot,
    moonDust,
  ] =
    await Promise.all([
      buildTarotCollectionStats(),
      getMoonDustRewardState(),
    ]);

  const weekKey =
    dateKey(start);

  const [weeklyCard] =
    drawTarotCards(
      1,
      `weekly-${weekKey}`,
    );

  const energyAverage =
    calculateEnergyAverage(
      tarot,
      moonDust,
    );

  const loveTrend =
    calculateLoveTrend(
      energyAverage,
      tarot,
    );

  const themeId =
    pickTheme(
      energyAverage,
    );

  return {
    weekKey,
    startDate:
      dateKey(start),
    endDate:
      dateKey(end),
    tarot,
    moonDust,
    themeId,
    weeklyCard,
    energyAverage,
    loveTrend,
    reflectionPromptId:
      `weeklyReport.prompts.${themeId}`,
    actionId:
      `weeklyReport.actions.${themeId}`,
  };
}
