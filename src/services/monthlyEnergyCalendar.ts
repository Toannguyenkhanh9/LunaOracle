import {
  getMoonCalendarMonth,
} from './moonCalendar';

import {
  recordRetentionActivity,
} from './retentionProgress';

export type EnergyDayType =
  | 'love'
  | 'career'
  | 'ritual'
  | 'rest'
  | 'creative';

export type MonthlyEnergyDay = {
  date: string;
  day: number;
  score: number;
  type: EnergyDayType;
  moonEmoji: string;
  titleKey: string;
  titleFallback: string;
  messageKey: string;
  messageFallback: string;
};

export type MonthlyEnergyCalendar = {
  year: number;
  month: number;
  days: MonthlyEnergyDay[];
  bestLoveDay?: MonthlyEnergyDay;
  bestCareerDay?: MonthlyEnergyDay;
  bestRitualDay?: MonthlyEnergyDay;
  lowEnergyDays: MonthlyEnergyDay[];
};

function hashDate(
  year: number,
  month: number,
  day: number,
): number {
  const value =
    year * 10000 +
    (month + 1) * 100 +
    day;

  return Math.abs(
    Math.sin(value) * 10000,
  );
}

function pickType(
  seed: number,
): EnergyDayType {
  const types:
    EnergyDayType[] = [
      'love',
      'career',
      'ritual',
      'rest',
      'creative',
    ];

  return types[
    Math.floor(seed) %
      types.length
  ];
}

function buildDay(
  year: number,
  month: number,
  day: number,
  moonEmoji: string,
): MonthlyEnergyDay {
  const seed =
    hashDate(
      year,
      month,
      day,
    );

  const score =
    35 +
    Math.round(
      seed % 60,
    );

  const type =
    pickType(seed);

  return {
    date:
      `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    day,
    score,
    type,
    moonEmoji,
    titleKey:
      `monthlyEnergy.types.${type}.title`,
    titleFallback:
      type === 'love'
        ? 'Love Day'
        : type === 'career'
          ? 'Career Focus'
          : type === 'ritual'
            ? 'Ritual Day'
            : type === 'creative'
              ? 'Creative Flow'
              : 'Rest Day',
    messageKey:
      `monthlyEnergy.types.${type}.message`,
    messageFallback:
      type === 'love'
        ? 'A good day for honest connection and softer communication.'
        : type === 'career'
          ? 'A useful day for focus, structure, and practical decisions.'
          : type === 'ritual'
            ? 'A supportive day for tarot, moon ritual, and reflection.'
            : type === 'creative'
              ? 'A day for imagination, writing, design, or intuitive play.'
              : 'A lower-pressure day. Protect your energy and simplify.',
  };
}

export async function buildMonthlyEnergyCalendar(
  date = new Date(),
): Promise<MonthlyEnergyCalendar> {
  await recordRetentionActivity(
    'monthlyCalendar',
  ).catch(() => {});

  const year =
    date.getFullYear();

  const month =
    date.getMonth();

  const moonDays =
    getMoonCalendarMonth(
      year,
      month,
    );

  const days =
    moonDays.map(moonDay =>
      buildDay(
        year,
        month,
        moonDay.day,
        moonDay.emoji,
      ),
    );

  const bestLoveDay =
    [...days]
      .filter(
        day => day.type === 'love',
      )
      .sort(
        (a, b) =>
          b.score - a.score,
      )[0];

  const bestCareerDay =
    [...days]
      .filter(
        day => day.type === 'career',
      )
      .sort(
        (a, b) =>
          b.score - a.score,
      )[0];

  const bestRitualDay =
    [...days]
      .filter(
        day => day.type === 'ritual',
      )
      .sort(
        (a, b) =>
          b.score - a.score,
      )[0];

  const lowEnergyDays =
    [...days]
      .filter(
        day => day.score < 48,
      )
      .slice(0, 5);

  return {
    year,
    month,
    days,
    bestLoveDay,
    bestCareerDay,
    bestRitualDay,
    lowEnergyDays,
  };
}
