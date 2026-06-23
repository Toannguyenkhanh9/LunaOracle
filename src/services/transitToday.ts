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

export type TransitPointId =
  | 'sun'
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn';

export type TransitTone =
  | 'supportive'
  | 'challenging'
  | 'intense'
  | 'reflective';

export type TransitAspect = {
  transitPoint: TransitPointId;
  natalPoint: ChartPointId;
  type: AspectType;
  orb: number;
  tone: TransitTone;
};

export type TransitTodayResult = {
  profile: BirthProfile;
  natalChart: BirthChartResult;
  transitChart: BirthChartResult;
  dateKey: string;
  displayDate: string;
  moonHouse: number;
  keyTransits: TransitAspect[];
  skySummary: Array<{
    point: TransitPointId;
    sign: string;
    degreeText: string;
    house: number;
  }>;
};

const TRANSIT_POINTS:
  TransitPointId[] = [
    'sun',
    'moon',
    'mercury',
    'venus',
    'mars',
    'jupiter',
    'saturn',
  ];

const NATAL_POINTS:
  ChartPointId[] = [
    'sun',
    'moon',
    'ascendant',
    'mercury',
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

function getTone(
  aspect: AspectType,
): TransitTone {
  switch (aspect) {
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

function getHouseFromLongitude(
  longitude: number,
  natalAscendant: number,
): number {
  const relative =
    normalizeDegrees(
      longitude -
        natalAscendant,
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

function formatDateKey(
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

function createAspects(
  transitChart: BirthChartResult,
  natalChart: BirthChartResult,
): TransitAspect[] {
  const result:
    TransitAspect[] = [];

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
              result.push({
                transitPoint,
                natalPoint,
                type:
                  aspect.type,
                orb:
                  Math.round(
                    orb * 10,
                  ) / 10,
                tone:
                  getTone(
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

  return result
    .sort(
      (a, b) => a.orb - b.orb,
    )
    .slice(0, 10);
}

export function buildTransitToday(
  profile: BirthProfile,
  now = new Date(),
): TransitTodayResult {
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

  const natalAscendant =
    natalChart.points.ascendant.longitude;

  const skySummary =
    TRANSIT_POINTS.map(point => ({
      point,
      sign:
        transitChart.points[point].sign,
      degreeText:
        transitChart.points[point].degreeText,
      house:
        getHouseFromLongitude(
          transitChart.points[point].longitude,
          natalAscendant,
        ),
    }));

  return {
    profile,
    natalChart,
    transitChart,
    dateKey:
      formatDateKey(
        transitInput,
      ),
    displayDate:
      formatDateKey(
        transitInput,
      ),
    moonHouse:
      getHouseFromLongitude(
        transitChart.points.moon.longitude,
        natalAscendant,
      ),
    keyTransits:
      createAspects(
        transitChart,
        natalChart,
      ),
    skySummary,
  };
}

export function getTransitPointLabel(
  point: ChartPointId,
): string {
  return getChartPointLabel(point);
}
