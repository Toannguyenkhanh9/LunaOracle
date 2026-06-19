export type MoonPhaseId =
  | 'newMoon'
  | 'waxingCrescent'
  | 'firstQuarter'
  | 'waxingGibbous'
  | 'fullMoon'
  | 'waningGibbous'
  | 'lastQuarter'
  | 'waningCrescent';

export type MoonDayInfo = {
  date: string;
  day: number;
  phaseId: MoonPhaseId;
  phaseName: string;
  emoji: string;
  illumination: number;
  age: number;
  ritualTitle: string;
  ritualText: string;
  isMajorPhase: boolean;
};

const SYNODIC_MONTH =
  29.530588853;

const KNOWN_NEW_MOON_UTC =
  Date.UTC(
    2000,
    0,
    6,
    18,
    14,
    0,
  );

function toDateKey(
  date: Date,
): string {
  return date
    .toISOString()
    .slice(0, 10);
}

function getAge(
  date: Date,
): number {
  const days =
    (
      date.getTime() -
      KNOWN_NEW_MOON_UTC
    ) /
    86400000;

  return (
    (
      days % SYNODIC_MONTH
    ) +
    SYNODIC_MONTH
  ) % SYNODIC_MONTH;
}

function getIllumination(
  age: number,
): number {
  return Math.round(
    (
      1 -
      Math.cos(
        (2 *
          Math.PI *
          age) /
          SYNODIC_MONTH,
      )
    ) *
      50,
  );
}

function getPhaseId(
  age: number,
): MoonPhaseId {
  if (
    age < 1.3 ||
    age >= 28.2
  ) {
    return 'newMoon';
  }

  if (age < 6.4) {
    return 'waxingCrescent';
  }

  if (age < 8.4) {
    return 'firstQuarter';
  }

  if (age < 13.6) {
    return 'waxingGibbous';
  }

  if (age < 16.4) {
    return 'fullMoon';
  }

  if (age < 21.1) {
    return 'waningGibbous';
  }

  if (age < 23.6) {
    return 'lastQuarter';
  }

  return 'waningCrescent';
}

const PHASE_META: Record<
  MoonPhaseId,
  {
    name: string;
    emoji: string;
    ritualTitle: string;
    ritualText: string;
  }
> = {
  newMoon: {
    name: 'New Moon',
    emoji: '🌑',
    ritualTitle: 'Set an intention',
    ritualText:
      'Write one clear intention and one small action you can take this week.',
  },
  waxingCrescent: {
    name: 'Waxing Crescent',
    emoji: '🌒',
    ritualTitle: 'Begin gently',
    ritualText:
      'Choose a simple step that supports your intention without forcing progress.',
  },
  firstQuarter: {
    name: 'First Quarter',
    emoji: '🌓',
    ritualTitle: 'Take action',
    ritualText:
      'Make one decisive move and remove one obstacle from your path.',
  },
  waxingGibbous: {
    name: 'Waxing Gibbous',
    emoji: '🌔',
    ritualTitle: 'Refine',
    ritualText:
      'Adjust your plan, improve the details, and keep building with patience.',
  },
  fullMoon: {
    name: 'Full Moon',
    emoji: '🌕',
    ritualTitle: 'Release and reflect',
    ritualText:
      'Name what is complete, what is heavy, and what you are ready to release.',
  },
  waningGibbous: {
    name: 'Waning Gibbous',
    emoji: '🌖',
    ritualTitle: 'Share wisdom',
    ritualText:
      'Notice what the last cycle taught you and share gratitude where it is due.',
  },
  lastQuarter: {
    name: 'Last Quarter',
    emoji: '🌗',
    ritualTitle: 'Clear space',
    ritualText:
      'Let go of one habit, task, or belief that no longer supports you.',
  },
  waningCrescent: {
    name: 'Waning Crescent',
    emoji: '🌘',
    ritualTitle: 'Rest',
    ritualText:
      'Slow down, protect your energy, and prepare for a new beginning.',
  },
};

export function getMoonDayInfo(
  date = new Date(),
): MoonDayInfo {
  const age =
    getAge(date);

  const phaseId =
    getPhaseId(age);

  const meta =
    PHASE_META[phaseId];

  return {
    date:
      toDateKey(date),
    day:
      date.getDate(),
    phaseId,
    phaseName:
      meta.name,
    emoji:
      meta.emoji,
    illumination:
      getIllumination(age),
    age:
      Math.round(age * 10) /
      10,
    ritualTitle:
      meta.ritualTitle,
    ritualText:
      meta.ritualText,
    isMajorPhase:
      [
        'newMoon',
        'firstQuarter',
        'fullMoon',
        'lastQuarter',
      ].includes(phaseId),
  };
}

export function getMoonCalendarMonth(
  year: number,
  monthIndex: number,
): MoonDayInfo[] {
  const daysInMonth =
    new Date(
      year,
      monthIndex + 1,
      0,
    ).getDate();

  return Array.from(
    {
      length: daysInMonth,
    },
    (_, index) =>
      getMoonDayInfo(
        new Date(
          Date.UTC(
            year,
            monthIndex,
            index + 1,
            12,
            0,
            0,
          ),
        ),
      ),
  );
}
