import type {
  UserProfile,
} from './userProfiles';

export type TimelineElement =
  | 'wood'
  | 'fire'
  | 'earth'
  | 'metal'
  | 'water';

export type TimelineTone =
  | 'favorable'
  | 'balanced'
  | 'reflective'
  | 'challenging';

export type TimelineRelation =
  | 'sixHarmony'
  | 'threeHarmony'
  | 'sameBranch'
  | 'supportive'
  | 'neutral'
  | 'harm'
  | 'clash';

export type TimelineYearInsight = {
  year: number;
  age: number;
  stemIndex: number;
  branchIndex: number;
  element: TimelineElement;
  relation: TimelineRelation;
  overallScore: number;
  careerScore: number;
  wealthScore: number;
  relationshipScore: number;
  wellbeingScore: number;
  tone: TimelineTone;
  strengthCodes: string[];
  cautionCodes: string[];
};

const SIX_HARMONY_PAIRS = [
  [0, 1],
  [2, 11],
  [3, 10],
  [4, 9],
  [5, 8],
  [6, 7],
];

const SIX_CLASH_PAIRS = [
  [0, 6],
  [1, 7],
  [2, 8],
  [3, 9],
  [4, 10],
  [5, 11],
];

const HARM_PAIRS = [
  [0, 7],
  [1, 6],
  [2, 5],
  [3, 4],
  [8, 11],
  [9, 10],
];

const THREE_HARMONY_GROUPS = [
  [8, 0, 4],
  [11, 3, 7],
  [2, 6, 10],
  [5, 9, 1],
];

const ELEMENT_BY_STEM: TimelineElement[] = [
  'wood',
  'wood',
  'fire',
  'fire',
  'earth',
  'earth',
  'metal',
  'metal',
  'water',
  'water',
];

const GENERATES: Record<
  TimelineElement,
  TimelineElement
> = {
  wood: 'fire',
  fire: 'earth',
  earth: 'metal',
  metal: 'water',
  water: 'wood',
};

function positiveModulo(
  value: number,
  modulo: number,
): number {
  return (
    (value % modulo) +
    modulo
  ) % modulo;
}

function clamp(
  value: number,
  min = 18,
  max = 92,
): number {
  return Math.min(
    max,
    Math.max(
      min,
      Math.round(value),
    ),
  );
}

function hasPair(
  pairs: number[][],
  first: number,
  second: number,
): boolean {
  return pairs.some(
    pair =>
      (
        pair[0] === first &&
        pair[1] === second
      ) ||
      (
        pair[1] === first &&
        pair[0] === second
      ),
  );
}

function isThreeHarmony(
  first: number,
  second: number,
): boolean {
  return THREE_HARMONY_GROUPS.some(
    group =>
      group.includes(first) &&
      group.includes(second),
  );
}

function relationForBranches(
  birthBranch: number,
  yearBranch: number,
): TimelineRelation {
  if (
    birthBranch ===
    yearBranch
  ) {
    return 'sameBranch';
  }

  if (
    hasPair(
      SIX_HARMONY_PAIRS,
      birthBranch,
      yearBranch,
    )
  ) {
    return 'sixHarmony';
  }

  if (
    isThreeHarmony(
      birthBranch,
      yearBranch,
    )
  ) {
    return 'threeHarmony';
  }

  if (
    hasPair(
      SIX_CLASH_PAIRS,
      birthBranch,
      yearBranch,
    )
  ) {
    return 'clash';
  }

  if (
    hasPair(
      HARM_PAIRS,
      birthBranch,
      yearBranch,
    )
  ) {
    return 'harm';
  }

  const distance =
    positiveModulo(
      yearBranch -
        birthBranch,
      12,
    );

  if (
    distance === 1 ||
    distance === 11
  ) {
    return 'supportive';
  }

  return 'neutral';
}

function relationModifier(
  relation: TimelineRelation,
): number {
  switch (relation) {
    case 'sixHarmony':
      return 15;
    case 'threeHarmony':
      return 11;
    case 'sameBranch':
      return 5;
    case 'supportive':
      return 6;
    case 'harm':
      return -8;
    case 'clash':
      return -16;
    case 'neutral':
    default:
      return 0;
  }
}

function elementModifier(
  birthElement: TimelineElement,
  yearElement: TimelineElement,
): number {
  if (
    birthElement === yearElement
  ) {
    return 7;
  }

  if (
    GENERATES[yearElement] ===
    birthElement
  ) {
    return 10;
  }

  if (
    GENERATES[birthElement] ===
    yearElement
  ) {
    return 3;
  }

  return -3;
}

function hashNumber(
  input: string,
): number {
  let hash = 0;

  for (
    let index = 0;
    index < input.length;
    index += 1
  ) {
    hash =
      (
        hash * 31 +
        input.charCodeAt(index)
      ) >>> 0;
  }

  return hash;
}

function variation(
  seed: number,
  offset: number,
  amplitude = 9,
): number {
  const value =
    (
      seed *
        (
          1103515245 +
          offset * 97
        ) +
      12345 +
      offset * 7919
    ) >>> 0;

  return (
    value %
      (
        amplitude * 2 +
        1
      )
  ) - amplitude;
}

function toneForScore(
  score: number,
): TimelineTone {
  if (score >= 75) {
    return 'favorable';
  }

  if (score >= 58) {
    return 'balanced';
  }

  if (score >= 42) {
    return 'reflective';
  }

  return 'challenging';
}

function strengthCodes(
  relation: TimelineRelation,
  elementModifierValue: number,
  overall: number,
): string[] {
  const codes: string[] = [];

  if (
    relation === 'sixHarmony' ||
    relation === 'threeHarmony'
  ) {
    codes.push(
      'relationshipHarmony',
    );
  }

  if (
    elementModifierValue >= 8
  ) {
    codes.push(
      'elementSupport',
    );
  }

  if (overall >= 72) {
    codes.push(
      'momentum',
    );
  }

  if (codes.length === 0) {
    codes.push(
      'steadyProgress',
    );
  }

  return codes.slice(0, 3);
}

function cautionCodes(
  relation: TimelineRelation,
  overall: number,
): string[] {
  const codes: string[] = [];

  if (
    relation === 'clash'
  ) {
    codes.push(
      'avoidRushing',
    );
  }

  if (
    relation === 'harm'
  ) {
    codes.push(
      'communicationCare',
    );
  }

  if (overall < 50) {
    codes.push(
      'protectEnergy',
    );
  }

  if (codes.length === 0) {
    codes.push(
      'reviewPriorities',
    );
  }

  return codes.slice(0, 3);
}

export function buildLifeTimeline(
  profile: UserProfile,
  startYear: number,
  endYear: number,
): TimelineYearInsight[] {
  const birthStem =
    positiveModulo(
      profile.birthDate.year -
        4,
      10,
    );

  const birthBranch =
    positiveModulo(
      profile.birthDate.year -
        4,
      12,
    );

  const birthElement =
    ELEMENT_BY_STEM[
      birthStem
    ];

  const profileSeed =
    hashNumber(
      [
        profile.id,
        profile.displayName,
        profile.birthDate.year,
        profile.birthDate.month,
        profile.birthDate.day,
      ].join('|'),
    );

  const result: TimelineYearInsight[] =
    [];

  for (
    let year = startYear;
    year <= endYear;
    year += 1
  ) {
    const stemIndex =
      positiveModulo(
        year - 4,
        10,
      );

    const branchIndex =
      positiveModulo(
        year - 4,
        12,
      );

    const element =
      ELEMENT_BY_STEM[
        stemIndex
      ];

    const relation =
      relationForBranches(
        birthBranch,
        branchIndex,
      );

    const relationValue =
      relationModifier(
        relation,
      );

    const elementValue =
      elementModifier(
        birthElement,
        element,
      );

    const yearSeed =
      profileSeed +
      year * 131;

    const base =
      58 +
      relationValue +
      elementValue;

    const careerScore =
      clamp(
        base +
          variation(
            yearSeed,
            1,
          ),
      );

    const wealthScore =
      clamp(
        base - 2 +
          variation(
            yearSeed,
            2,
          ),
      );

    const relationshipScore =
      clamp(
        base +
          (
            relation ===
              'sixHarmony' ||
            relation ===
              'threeHarmony'
              ? 7
              : 0
          ) +
          variation(
            yearSeed,
            3,
          ),
      );

    const wellbeingScore =
      clamp(
        base +
          (
            relation ===
            'clash'
              ? -7
              : 2
          ) +
          variation(
            yearSeed,
            4,
          ),
      );

    const overallScore =
      clamp(
        (
          careerScore +
          wealthScore +
          relationshipScore +
          wellbeingScore
        ) / 4,
      );

    result.push({
      year,
      age:
        year -
        profile.birthDate.year,
      stemIndex,
      branchIndex,
      element,
      relation,
      overallScore,
      careerScore,
      wealthScore,
      relationshipScore,
      wellbeingScore,
      tone:
        toneForScore(
          overallScore,
        ),
      strengthCodes:
        strengthCodes(
          relation,
          elementValue,
          overallScore,
        ),
      cautionCodes:
        cautionCodes(
          relation,
          overallScore,
        ),
    });
  }

  return result;
}
