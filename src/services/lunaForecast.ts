import {
  buildBirthChart,
  type BirthChartResult,
  type ChartPoint,
  type ChartPointId,
} from './astroBirthChart';

import {
  getActiveBirthProfile,
  ensureDefaultBirthProfile,
  type BirthProfile,
} from './birthProfiles';

export type ForecastDomain =
  | 'love'
  | 'career'
  | 'money'
  | 'wellness'
  | 'spirit';

export type ForecastScoreMap =
  Record<ForecastDomain, number>;

export type ForecastMonth = {
  month: number;
  monthKey: string;
  dateKey: string;
  scores: ForecastScoreMap;
  overallScore: number;
  themeId: string;
  opportunityId: string;
  challengeId: string;
  actionId: string;
  keyTransit: {
    planet: ChartPointId;
    natalPoint: ChartPointId;
    aspect: ForecastAspectType;
    orb: number;
  };
};

export type ForecastYearResult = {
  year: number;
  profile: BirthProfile;
  natalChart: BirthChartResult;
  months: ForecastMonth[];
  bestMonth: ForecastMonth;
  growthMonth: ForecastMonth;
  yearThemeId: string;
  dominantDomain: ForecastDomain;
};

export type ForecastAspectType =
  | 'conjunction'
  | 'sextile'
  | 'square'
  | 'trine'
  | 'opposition'
  | 'none';

const DOMAINS:
  ForecastDomain[] = [
    'love',
    'career',
    'money',
    'wellness',
    'spirit',
  ];

const MONTH_THEME_IDS = [
  'freshStart',
  'relationshipMirror',
  'visibleProgress',
  'innerReset',
  'creativeFire',
  'practicalFocus',
  'heartOpening',
  'deepRelease',
  'expansion',
  'discipline',
  'community',
  'integration',
] as const;

const OPPORTUNITY_IDS = [
  'sayYes',
  'planClearly',
  'repairBond',
  'shareWork',
  'restDeeply',
  'reviewMoney',
  'learnSkill',
  'chooseJoy',
] as const;

const CHALLENGE_IDS = [
  'overthinking',
  'rushing',
  'mixedSignals',
  'lowEnergy',
  'avoidance',
  'oldPattern',
  'unclearBoundary',
  'scatteredFocus',
] as const;

const ACTION_IDS = [
  'writePlan',
  'startConversation',
  'makeBudget',
  'protectRest',
  'createSmallRitual',
  'finishOneThing',
  'askForHelp',
  'clearSpace',
] as const;

const YEAR_THEME_IDS = [
  'alignment',
  'renewal',
  'visibility',
  'devotion',
  'relationship',
  'creativeGrowth',
  'innerWisdom',
  'foundation',
] as const;

function clamp(
  value: number,
  min = 18,
  max = 96,
): number {
  return Math.max(
    min,
    Math.min(
      max,
      Math.round(value),
    ),
  );
}

function wrap360(
  value: number,
): number {
  return (
    (value % 360) +
    360
  ) % 360;
}

function angularDistance(
  first: number,
  second: number,
): number {
  const diff =
    Math.abs(
      wrap360(first - second),
    );

  return diff > 180
    ? 360 - diff
    : diff;
}

function aspectScore(
  transit: ChartPoint,
  natal: ChartPoint,
): {
  aspect: ForecastAspectType;
  orb: number;
  value: number;
} {
  const aspects:
    Array<{
      aspect: ForecastAspectType;
      angle: number;
      value: number;
    }> = [
      {
        aspect: 'conjunction',
        angle: 0,
        value: 11,
      },
      {
        aspect: 'sextile',
        angle: 60,
        value: 7,
      },
      {
        aspect: 'square',
        angle: 90,
        value: -8,
      },
      {
        aspect: 'trine',
        angle: 120,
        value: 10,
      },
      {
        aspect: 'opposition',
        angle: 180,
        value: -6,
      },
    ];

  const distance =
    angularDistance(
      transit.longitude,
      natal.longitude,
    );

  const nearest =
    aspects
      .map(item => ({
        ...item,
        orb:
          Math.abs(
            distance -
              item.angle,
          ),
      }))
      .sort(
        (a, b) =>
          a.orb - b.orb,
      )[0];

  if (nearest.orb > 8) {
    return {
      aspect:
        'none',
      orb:
        nearest.orb,
      value:
        0,
    };
  }

  const strength =
    Math.max(
      0.25,
      1 - nearest.orb / 8,
    );

  return {
    aspect:
      nearest.aspect,
    orb:
      Number(
        nearest.orb.toFixed(1),
      ),
    value:
      nearest.value *
      strength,
  };
}

function signHarmony(
  transitSign: string,
  natalSign: string,
): number {
  const signOrder = [
    'aries',
    'taurus',
    'gemini',
    'cancer',
    'leo',
    'virgo',
    'libra',
    'scorpio',
    'sagittarius',
    'capricorn',
    'aquarius',
    'pisces',
  ];

  const first =
    signOrder.indexOf(
      transitSign,
    );

  const second =
    signOrder.indexOf(
      natalSign,
    );

  if (
    first < 0 ||
    second < 0
  ) {
    return 0;
  }

  const diff =
    Math.abs(first - second) % 12;

  const normalized =
    Math.min(
      diff,
      12 - diff,
    );

  if (
    normalized === 0 ||
    normalized === 4
  ) {
    return 6;
  }

  if (
    normalized === 2 ||
    normalized === 6
  ) {
    return 3;
  }

  if (normalized === 3) {
    return -4;
  }

  return 0;
}

function baseForDomain(
  domain: ForecastDomain,
  natalChart: BirthChartResult,
): number {
  const element =
    natalChart.dominantElement;

  const modality =
    natalChart.dominantModality;

  let score = 58;

  if (
    domain === 'love' &&
    (element === 'water' ||
      element === 'air')
  ) {
    score += 5;
  }

  if (
    domain === 'career' &&
    (element === 'earth' ||
      modality === 'cardinal')
  ) {
    score += 5;
  }

  if (
    domain === 'money' &&
    element === 'earth'
  ) {
    score += 6;
  }

  if (
    domain === 'wellness' &&
    modality === 'mutable'
  ) {
    score += 4;
  }

  if (
    domain === 'spirit' &&
    (element === 'water' ||
      element === 'fire')
  ) {
    score += 4;
  }

  return score;
}

function domainPlanetPairs(
  domain: ForecastDomain,
): Array<{
  transit: ChartPointId;
  natal: ChartPointId;
  weight: number;
}> {
  switch (domain) {
    case 'love':
      return [
        {
          transit: 'venus',
          natal: 'venus',
          weight: 1.3,
        },
        {
          transit: 'venus',
          natal: 'moon',
          weight: 1.1,
        },
        {
          transit: 'mars',
          natal: 'venus',
          weight: 0.9,
        },
      ];

    case 'career':
      return [
        {
          transit: 'sun',
          natal: 'midheaven',
          weight: 1.1,
        },
        {
          transit: 'jupiter',
          natal: 'midheaven',
          weight: 1.2,
        },
        {
          transit: 'saturn',
          natal: 'sun',
          weight: 1,
        },
      ];

    case 'money':
      return [
        {
          transit: 'venus',
          natal: 'jupiter',
          weight: 1,
        },
        {
          transit: 'jupiter',
          natal: 'venus',
          weight: 1.2,
        },
        {
          transit: 'saturn',
          natal: 'venus',
          weight: 0.9,
        },
      ];

    case 'wellness':
      return [
        {
          transit: 'moon',
          natal: 'moon',
          weight: 1,
        },
        {
          transit: 'saturn',
          natal: 'moon',
          weight: 0.9,
        },
        {
          transit: 'mars',
          natal: 'moon',
          weight: 0.7,
        },
      ];

    case 'spirit':
    default:
      return [
        {
          transit: 'neptune',
          natal: 'moon',
          weight: 1.1,
        },
        {
          transit: 'jupiter',
          natal: 'sun',
          weight: 1,
        },
        {
          transit: 'moon',
          natal: 'ascendant',
          weight: 0.7,
        },
      ];
  }
}

function scoreDomain(
  domain: ForecastDomain,
  natalChart: BirthChartResult,
  transitChart: BirthChartResult,
  month: number,
): {
  score: number;
  key:
    ForecastMonth['keyTransit'];
} {
  let score =
    baseForDomain(
      domain,
      natalChart,
    );

  let bestKey:
    ForecastMonth['keyTransit'] = {
      planet: 'sun',
      natalPoint: 'sun',
      aspect: 'none',
      orb: 99,
    };

  let strongest =
    0;

  domainPlanetPairs(
    domain,
  ).forEach(pair => {
    const aspect =
      aspectScore(
        transitChart.points[
          pair.transit
        ],
        natalChart.points[
          pair.natal
        ],
      );

    const harmony =
      signHarmony(
        transitChart.points[
          pair.transit
        ].sign,
        natalChart.points[
          pair.natal
        ].sign,
      );

    const contribution =
      aspect.value *
        pair.weight +
      harmony * 0.35;

    score +=
      contribution;

    if (
      Math.abs(contribution) >
      strongest
    ) {
      strongest =
        Math.abs(contribution);
      bestKey = {
        planet:
          pair.transit,
        natalPoint:
          pair.natal,
        aspect:
          aspect.aspect,
        orb:
          aspect.orb,
      };
    }
  });

  // Mild seasonal rhythm so reports do not feel flat.
  score +=
    Math.sin(
      ((month + 1) / 12) *
        Math.PI *
        2,
    ) * 4;

  return {
    score:
      clamp(score),
    key:
      bestKey,
  };
}

function buildTransitChartForMonth(
  profile: BirthProfile,
  year: number,
  month: number,
): BirthChartResult {
  return buildBirthChart({
    ...profile.input,
    year,
    month,
    day: 15,
    hour: 12,
    minute: 0,
  });
}

function monthKey(
  month: number,
): string {
  return `m${month}`;
}

function pick<T>(
  values: readonly T[],
  seed: number,
): T {
  return values[
    Math.abs(seed) %
      values.length
  ];
}

export function buildForecastForProfile(
  profile: BirthProfile,
  year = new Date().getFullYear(),
): ForecastYearResult {
  const natalChart =
    buildBirthChart(
      profile.input,
    );

  const months:
    ForecastMonth[] = [];

  for (
    let month = 1;
    month <= 12;
    month += 1
  ) {
    const transitChart =
      buildTransitChartForMonth(
        profile,
        year,
        month,
      );

    const scores =
      DOMAINS.reduce(
        (acc, domain) => {
          acc[domain] =
            scoreDomain(
              domain,
              natalChart,
              transitChart,
              month,
            ).score;

          return acc;
        },
        {} as ForecastScoreMap,
      );

    const domainResults =
      DOMAINS.map(domain => ({
        domain,
        ...scoreDomain(
          domain,
          natalChart,
          transitChart,
          month,
        ),
      })).sort(
        (a, b) =>
          b.score - a.score,
      );

    const overallScore =
      clamp(
        DOMAINS.reduce(
          (sum, domain) =>
            sum + scores[domain],
          0,
        ) / DOMAINS.length,
      );

    const seed =
      year +
      month * 17 +
      Math.round(
        natalChart.points.sun.longitude,
      );

    months.push({
      month,
      monthKey:
        monthKey(month),
      dateKey:
        `${year}-${String(month).padStart(
          2,
          '0',
        )}`,
      scores,
      overallScore,
      themeId:
        pick(
          MONTH_THEME_IDS,
          seed,
        ),
      opportunityId:
        pick(
          OPPORTUNITY_IDS,
          seed + 5,
        ),
      challengeId:
        pick(
          CHALLENGE_IDS,
          seed + 11,
        ),
      actionId:
        pick(
          ACTION_IDS,
          seed + 19,
        ),
      keyTransit:
        domainResults[0].key,
    });
  }

  const bestMonth =
    [...months].sort(
      (a, b) =>
        b.overallScore -
        a.overallScore,
    )[0];

  const growthMonth =
    [...months].sort(
      (a, b) =>
        a.overallScore -
        b.overallScore,
    )[0];

  const domainAverage =
    DOMAINS.map(domain => ({
      domain,
      score:
        months.reduce(
          (sum, item) =>
            sum + item.scores[domain],
          0,
        ) / months.length,
    })).sort(
      (a, b) =>
        b.score - a.score,
    );

  const yearSeed =
    year +
    Math.round(
      natalChart.points.ascendant.longitude,
    );

  return {
    year,
    profile,
    natalChart,
    months,
    bestMonth,
    growthMonth,
    yearThemeId:
      pick(
        YEAR_THEME_IDS,
        yearSeed,
      ),
    dominantDomain:
      domainAverage[0].domain,
  };
}

export async function buildActiveYearForecast(
  year = new Date().getFullYear(),
): Promise<ForecastYearResult> {
  const profile =
    (await getActiveBirthProfile()) ??
    (await ensureDefaultBirthProfile());

  return buildForecastForProfile(
    profile,
    year,
  );
}
