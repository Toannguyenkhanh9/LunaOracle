import {
  buildBirthChart,
  getChartPointLabel,
  type AspectType,
  type BirthChartInput,
  type BirthChartResult,
  type ChartPointId,
} from './astroBirthChart';

import type {
  BirthProfile,
} from './birthProfiles';

export type DailyTransitPointId =
  | 'sun'
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars';

export type DailyFocusId =
  | 'love'
  | 'career'
  | 'money'
  | 'wellness';

export type DailyMoonPhaseId =
  | 'newMoon'
  | 'waxingCrescent'
  | 'firstQuarter'
  | 'waxingGibbous'
  | 'fullMoon'
  | 'waningGibbous'
  | 'lastQuarter'
  | 'waningCrescent';

export type DailyTransitAspect = {
  transitPoint: DailyTransitPointId;
  natalPoint: ChartPointId;
  type: AspectType;
  orb: number;
  tone:
    | 'supportive'
    | 'challenging'
    | 'intense'
    | 'reflective';
};

export type DailyFocusScore = {
  id: DailyFocusId;
  score: number;
};

export type DailyPersonalizedInsight = {
  dateKey: string;
  displayDate: string;
  profileName: string;
  natalChart: BirthChartResult;
  transitChart: BirthChartResult;
  moonPhase: DailyMoonPhaseId;
  moonHouse: number;
  energyScore: number;
  dominantTransitElement: string;
  focusScores: DailyFocusScore[];
  aspects: DailyTransitAspect[];
  journalPromptId: string;
  actionId: string;
};

const TRANSIT_POINTS:
  DailyTransitPointId[] = [
    'sun',
    'moon',
    'mercury',
    'venus',
    'mars',
  ];

const NATAL_POINTS:
  ChartPointId[] = [
    'sun',
    'moon',
    'ascendant',
    'venus',
    'mars',
    'midheaven',
  ];

const ASPECTS: Array<{
  type: AspectType;
  angle: number;
  orb: number;
}> = [
  {
    type: 'conjunction',
    angle: 0,
    orb: 5,
  },
  {
    type: 'sextile',
    angle: 60,
    orb: 4,
  },
  {
    type: 'square',
    angle: 90,
    orb: 4,
  },
  {
    type: 'trine',
    angle: 120,
    orb: 4,
  },
  {
    type: 'opposition',
    angle: 180,
    orb: 5,
  },
];

function normalizeDegrees(
  value: number,
): number {
  return (
    (
      value % 360
    ) +
    360
  ) % 360;
}

function angularDistance(
  first: number,
  second: number,
): number {
  const diff =
    Math.abs(
      normalizeDegrees(first) -
        normalizeDegrees(second),
    );

  return Math.min(
    diff,
    360 - diff,
  );
}

function getTransitHouse(
  transitLongitude: number,
  natalAscendantLongitude: number,
): number {
  const relative =
    normalizeDegrees(
      transitLongitude -
        natalAscendantLongitude,
    );

  return (
    Math.floor(relative / 30) +
    1
  );
}

function createTransitInput(
  natalInput: BirthChartInput,
  now: Date,
): BirthChartInput {
  const offsetMs =
    natalInput.timezoneOffset *
    60 *
    60 *
    1000;

  const local =
    new Date(
      now.getTime() + offsetMs,
    );

  return {
    year:
      local.getUTCFullYear(),
    month:
      local.getUTCMonth() + 1,
    day:
      local.getUTCDate(),
    hour:
      local.getUTCHours(),
    minute:
      local.getUTCMinutes(),
    timezoneOffset:
      natalInput.timezoneOffset,
    latitude:
      natalInput.latitude,
    longitude:
      natalInput.longitude,
  };
}

function dateKeyForInput(
  input: BirthChartInput,
): string {
  return [
    input.year,
    String(input.month).padStart(
      2,
      '0',
    ),
    String(input.day).padStart(
      2,
      '0',
    ),
  ].join('-');
}

function displayDateForInput(
  input: BirthChartInput,
): string {
  return `${input.year}-${String(
    input.month,
  ).padStart(2, '0')}-${String(
    input.day,
  ).padStart(2, '0')}`;
}

function getMoonPhase(
  transitChart: BirthChartResult,
): DailyMoonPhaseId {
  const angle =
    normalizeDegrees(
      transitChart.points.moon.longitude -
        transitChart.points.sun.longitude,
    );

  if (
    angle < 22.5 ||
    angle >= 337.5
  ) {
    return 'newMoon';
  }

  if (angle < 67.5) {
    return 'waxingCrescent';
  }

  if (angle < 112.5) {
    return 'firstQuarter';
  }

  if (angle < 157.5) {
    return 'waxingGibbous';
  }

  if (angle < 202.5) {
    return 'fullMoon';
  }

  if (angle < 247.5) {
    return 'waningGibbous';
  }

  if (angle < 292.5) {
    return 'lastQuarter';
  }

  return 'waningCrescent';
}

function getAspectTone(
  type: AspectType,
): DailyTransitAspect['tone'] {
  switch (type) {
    case 'trine':
    case 'sextile':
      return 'supportive';

    case 'square':
    case 'opposition':
      return 'challenging';

    case 'conjunction':
      return 'intense';

    default:
      return 'reflective';
  }
}

function createTransitAspects(
  transitChart: BirthChartResult,
  natalChart: BirthChartResult,
): DailyTransitAspect[] {
  const matches:
    DailyTransitAspect[] = [];

  TRANSIT_POINTS.forEach(
    transitPoint => {
      NATAL_POINTS.forEach(
        natalPoint => {
          const transit =
            transitChart.points[
              transitPoint
            ];

          const natal =
            natalChart.points[
              natalPoint
            ];

          const distance =
            angularDistance(
              transit.longitude,
              natal.longitude,
            );

          for (const aspect of ASPECTS) {
            const orb =
              Math.abs(
                distance -
                  aspect.angle,
              );

            if (orb <= aspect.orb) {
              matches.push({
                transitPoint,
                natalPoint,
                type:
                  aspect.type,
                orb:
                  Math.round(
                    orb * 10,
                  ) / 10,
                tone:
                  getAspectTone(
                    aspect.type,
                  ),
              });

              break;
            }
          }
        },
      );
    },
  );

  return matches
    .sort(
      (a, b) => a.orb - b.orb,
    )
    .slice(0, 6);
}

function scoreFromBase(
  base: number,
  add: number,
): number {
  return Math.max(
    30,
    Math.min(
      96,
      Math.round(base + add),
    ),
  );
}

function createFocusScores(
  moonHouse: number,
  aspects: DailyTransitAspect[],
): DailyFocusScore[] {
  let love = 58;
  let career = 58;
  let money = 58;
  let wellness = 58;

  if (
    [
      5,
      7,
      8,
    ].includes(moonHouse)
  ) {
    love += 14;
  }

  if (
    [
      2,
      6,
      10,
    ].includes(moonHouse)
  ) {
    career += 12;
    money += 9;
  }

  if (
    [
      1,
      4,
      12,
    ].includes(moonHouse)
  ) {
    wellness += 14;
  }

  aspects.forEach(aspect => {
    const change =
      aspect.tone === 'supportive'
        ? 5
        : aspect.tone === 'challenging'
          ? -4
          : 2;

    if (
      aspect.natalPoint === 'venus' ||
      aspect.transitPoint === 'venus'
    ) {
      love += change;
    }

    if (
      aspect.natalPoint === 'midheaven' ||
      aspect.transitPoint === 'mars' ||
      aspect.transitPoint === 'mercury'
    ) {
      career += change;
    }

    if (
      [
        2,
        8,
      ].includes(moonHouse)
    ) {
      money += change;
    }

    if (
      aspect.natalPoint === 'moon' ||
      aspect.transitPoint === 'moon'
    ) {
      wellness += change;
    }
  });

  return [
    {
      id: 'love',
      score:
        scoreFromBase(love, 0),
    },
    {
      id: 'career',
      score:
        scoreFromBase(career, 0),
    },
    {
      id: 'money',
      score:
        scoreFromBase(money, 0),
    },
    {
      id: 'wellness',
      score:
        scoreFromBase(wellness, 0),
    },
  ];
}

function createEnergyScore(
  moonHouse: number,
  aspects: DailyTransitAspect[],
): number {
  const base =
    [
      1,
      5,
      9,
      10,
    ].includes(moonHouse)
      ? 72
      : [
          4,
          8,
          12,
        ].includes(moonHouse)
        ? 54
        : 64;

  const aspectBonus =
    aspects.reduce(
      (total, aspect) => {
        if (
          aspect.tone === 'supportive'
        ) {
          return total + 4;
        }

        if (
          aspect.tone === 'challenging'
        ) {
          return total - 5;
        }

        return total + 1;
      },
      0,
    );

  return scoreFromBase(
    base,
    aspectBonus,
  );
}

function getJournalPromptId(
  moonHouse: number,
): string {
  if (
    [
      1,
      4,
      12,
    ].includes(moonHouse)
  ) {
    return 'innerCheck';
  }

  if (
    [
      2,
      6,
      10,
    ].includes(moonHouse)
  ) {
    return 'practicalStep';
  }

  if (
    [
      5,
      7,
      11,
    ].includes(moonHouse)
  ) {
    return 'connection';
  }

  return 'release';
}

function getActionId(
  moonHouse: number,
): string {
  if (
    [
      1,
      6,
    ].includes(moonHouse)
  ) {
    return 'organizeEnergy';
  }

  if (
    [
      2,
      10,
    ].includes(moonHouse)
  ) {
    return 'moneyCareerFocus';
  }

  if (
    [
      5,
      7,
    ].includes(moonHouse)
  ) {
    return 'relationshipCheck';
  }

  if (
    [
      4,
      12,
    ].includes(moonHouse)
  ) {
    return 'quietReset';
  }

  return 'observePattern';
}

export function buildDailyPersonalizedInsight(
  profile: BirthProfile,
  now = new Date(),
): DailyPersonalizedInsight {
  const natalChart =
    buildBirthChart(
      profile.input,
    );

  const transitInput =
    createTransitInput(
      profile.input,
      now,
    );

  const transitChart =
    buildBirthChart(
      transitInput,
    );

  const moonHouse =
    getTransitHouse(
      transitChart.points.moon.longitude,
      natalChart.points.ascendant.longitude,
    );

  const aspects =
    createTransitAspects(
      transitChart,
      natalChart,
    );

  return {
    dateKey:
      dateKeyForInput(
        transitInput,
      ),
    displayDate:
      displayDateForInput(
        transitInput,
      ),
    profileName:
      profile.name,
    natalChart,
    transitChart,
    moonPhase:
      getMoonPhase(
        transitChart,
      ),
    moonHouse,
    energyScore:
      createEnergyScore(
        moonHouse,
        aspects,
      ),
    dominantTransitElement:
      transitChart.dominantElement,
    focusScores:
      createFocusScores(
        moonHouse,
        aspects,
      ),
    aspects,
    journalPromptId:
      getJournalPromptId(
        moonHouse,
      ),
    actionId:
      getActionId(moonHouse),
  };
}

export function getDailyTransitPointLabel(
  point: ChartPointId,
): string {
  return getChartPointLabel(point);
}
