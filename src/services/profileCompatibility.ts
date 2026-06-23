import {
  buildBirthChart,
  type AspectType,
  type BirthChartResult,
  type ChartPointId,
} from './astroBirthChart';

import type {
  BirthProfile,
} from './birthProfiles';

export type ProfileCompatibilityAspect = {
  firstPoint: ChartPointId;
  secondPoint: ChartPointId;
  type: AspectType;
  orb: number;
};

export type ProfileCompatibilityResult = {
  firstProfile: BirthProfile;
  secondProfile: BirthProfile;
  firstChart: BirthChartResult;
  secondChart: BirthChartResult;
  totalScore: number;
  emotionalScore: number;
  loveScore: number;
  dailyLifeScore: number;
  growthScore: number;
  strengths: string[];
  challenges: string[];
  aspects: ProfileCompatibilityAspect[];
};

const ASPECTS: Array<{
  type: AspectType;
  angle: number;
  orb: number;
  score: number;
}> = [
  {
    type: 'conjunction',
    angle: 0,
    orb: 7,
    score: 8,
  },
  {
    type: 'sextile',
    angle: 60,
    orb: 5,
    score: 7,
  },
  {
    type: 'square',
    angle: 90,
    orb: 6,
    score: -5,
  },
  {
    type: 'trine',
    angle: 120,
    orb: 6,
    score: 9,
  },
  {
    type: 'opposition',
    angle: 180,
    orb: 7,
    score: -3,
  },
];

const PAIRS: Array<{
  first: ChartPointId;
  second: ChartPointId;
  weight: number;
  group:
    | 'love'
    | 'emotional'
    | 'daily'
    | 'growth';
}> = [
  {
    first: 'sun',
    second: 'sun',
    weight: 1,
    group: 'daily',
  },
  {
    first: 'moon',
    second: 'moon',
    weight: 1.4,
    group: 'emotional',
  },
  {
    first: 'venus',
    second: 'venus',
    weight: 1.2,
    group: 'love',
  },
  {
    first: 'venus',
    second: 'mars',
    weight: 1.4,
    group: 'love',
  },
  {
    first: 'mars',
    second: 'venus',
    weight: 1.4,
    group: 'love',
  },
  {
    first: 'ascendant',
    second: 'ascendant',
    weight: 1,
    group: 'daily',
  },
  {
    first: 'saturn',
    second: 'sun',
    weight: 1,
    group: 'growth',
  },
  {
    first: 'saturn',
    second: 'moon',
    weight: 1,
    group: 'growth',
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

function clampScore(
  score: number,
): number {
  return Math.max(
    20,
    Math.min(
      96,
      Math.round(score),
    ),
  );
}

function aspectBetween(
  firstLongitude: number,
  secondLongitude: number,
): {
  type: AspectType;
  orb: number;
  score: number;
} | undefined {
  const distance =
    angularDistance(
      firstLongitude,
      secondLongitude,
    );

  for (const aspect of ASPECTS) {
    const orb =
      Math.abs(
        distance -
          aspect.angle,
      );

    if (orb <= aspect.orb) {
      return {
        type:
          aspect.type,
        orb:
          Math.round(
            orb * 10,
          ) / 10,
        score:
          aspect.score,
      };
    }
  }

  return undefined;
}

export function buildProfileCompatibility(
  firstProfile: BirthProfile,
  secondProfile: BirthProfile,
): ProfileCompatibilityResult {
  const firstChart =
    buildBirthChart(
      firstProfile.input,
    );

  const secondChart =
    buildBirthChart(
      secondProfile.input,
    );

  let love = 58;
  let emotional = 58;
  let daily = 58;
  let growth = 58;

  const aspects:
    ProfileCompatibilityAspect[] = [];

  PAIRS.forEach(pair => {
    const firstPoint =
      firstChart.points[pair.first];

    const secondPoint =
      secondChart.points[pair.second];

    const aspect =
      aspectBetween(
        firstPoint.longitude,
        secondPoint.longitude,
      );
    if (aspect) {
      const amount =
        aspect.score *
        pair.weight;

      if (
        pair.group === 'love'
      ) {
        love += amount;
      } else if (
        pair.group === 'emotional'
      ) {
        emotional += amount;
      } else if (
        pair.group === 'daily'
      ) {
        daily += amount;
      } else {
        growth += amount;
      }

      aspects.push({
        firstPoint:
          pair.first,
        secondPoint:
          pair.second,
        type:
          aspect.type,
        orb:
          aspect.orb,
      });
    }
  });

  // Sign-level scoring.
  const firstDominant =
    firstChart.dominantElement;
  const secondDominant =
    secondChart.dominantElement;

  const dominantElementBonus =
    firstDominant ===
    secondDominant
      ? 7
      : 2;

  daily += dominantElementBonus;
  emotional +=
    firstChart.dominantModality ===
    secondChart.dominantModality
      ? 4
      : 1;

  const totalScore =
    clampScore(
      (
        love +
        emotional +
        daily +
        growth
      ) /
        4,
    );

  const strengths:
    string[] = [];

  const challenges:
    string[] = [];

  if (love >= 70) {
    strengths.push(
      'magnetism',
    );
  } else if (love < 50) {
    challenges.push(
      'differentLoveLanguages',
    );
  }

  if (emotional >= 70) {
    strengths.push(
      'emotionalUnderstanding',
    );
  } else if (emotional < 50) {
    challenges.push(
      'emotionalTiming',
    );
  }

  if (daily >= 70) {
    strengths.push(
      'sharedPace',
    );
  } else if (daily < 50) {
    challenges.push(
      'dailyRhythm',
    );
  }

  if (growth >= 70) {
    strengths.push(
      'longTermGrowth',
    );
  } else if (growth < 50) {
    challenges.push(
      'pressurePoints',
    );
  }

  if (strengths.length === 0) {
    strengths.push(
      'curiosity',
    );
  }

  if (challenges.length === 0) {
    challenges.push(
      'honestCommunication',
    );
  }

  return {
    firstProfile,
    secondProfile,
    firstChart,
    secondChart,
    totalScore,
    emotionalScore:
      clampScore(emotional),
    loveScore:
      clampScore(love),
    dailyLifeScore:
      clampScore(daily),
    growthScore:
      clampScore(growth),
    strengths,
    challenges,
    aspects:
      aspects.slice(0, 8),
  };
}
