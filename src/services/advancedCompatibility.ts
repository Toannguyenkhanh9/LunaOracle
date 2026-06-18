import type {
  UserProfile,
} from './userProfiles';

export type CompatibilityMode =
  | 'love'
  | 'marriage'
  | 'friendship'
  | 'business'
  | 'parentChild';

export type CompatibilityTone =
  | 'strong'
  | 'supportive'
  | 'mixed'
  | 'challenging';

export type CompatibilityDimensionCode =
  | 'elementFlow'
  | 'zodiacRelation'
  | 'communication'
  | 'emotionalRhythm'
  | 'sharedDirection'
  | 'longTermStability';

export type CompatibilityDimension = {
  code: CompatibilityDimensionCode;
  score: number;
};

export type AdvancedCompatibilityResult = {
  profileAId: string;
  profileBId: string;
  mode: CompatibilityMode;
  overallScore: number;
  tone: CompatibilityTone;
  dimensions: CompatibilityDimension[];
  strengthCodes: string[];
  cautionCodes: string[];
  suggestionCodes: string[];
  modelVersion: string;
};

type Element =
  | 'wood'
  | 'fire'
  | 'earth'
  | 'metal'
  | 'water';

const ELEMENT_BY_STEM: Element[] = [
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
  Element,
  Element
> = {
  wood: 'fire',
  fire: 'earth',
  earth: 'metal',
  metal: 'water',
  water: 'wood',
};

const CONTROLS: Record<
  Element,
  Element
> = {
  wood: 'earth',
  fire: 'metal',
  earth: 'water',
  metal: 'wood',
  water: 'fire',
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

const MODE_WEIGHTS: Record<
  CompatibilityMode,
  Record<
    CompatibilityDimensionCode,
    number
  >
> = {
  love: {
    elementFlow: 0.16,
    zodiacRelation: 0.16,
    communication: 0.18,
    emotionalRhythm: 0.24,
    sharedDirection: 0.11,
    longTermStability: 0.15,
  },
  marriage: {
    elementFlow: 0.15,
    zodiacRelation: 0.15,
    communication: 0.17,
    emotionalRhythm: 0.18,
    sharedDirection: 0.15,
    longTermStability: 0.20,
  },
  friendship: {
    elementFlow: 0.12,
    zodiacRelation: 0.14,
    communication: 0.25,
    emotionalRhythm: 0.18,
    sharedDirection: 0.16,
    longTermStability: 0.15,
  },
  business: {
    elementFlow: 0.17,
    zodiacRelation: 0.12,
    communication: 0.18,
    emotionalRhythm: 0.08,
    sharedDirection: 0.28,
    longTermStability: 0.17,
  },
  parentChild: {
    elementFlow: 0.18,
    zodiacRelation: 0.12,
    communication: 0.20,
    emotionalRhythm: 0.22,
    sharedDirection: 0.10,
    longTermStability: 0.18,
  },
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
): number {
  return Math.min(
    95,
    Math.max(
      20,
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

function hashNumber(
  input: string,
): number {
  let hash = 2166136261;

  for (
    let index = 0;
    index < input.length;
    index += 1
  ) {
    hash ^= input.charCodeAt(
      index,
    );

    hash =
      Math.imul(
        hash,
        16777619,
      ) >>> 0;
  }

  return hash;
}

function stableVariation(
  seed: number,
  offset: number,
  amplitude = 10,
): number {
  const value =
    (
      seed +
      offset * 2654435761
    ) >>> 0;

  return (
    value %
      (
        amplitude * 2 +
        1
      )
  ) - amplitude;
}

function elementScore(
  first: Element,
  second: Element,
): number {
  if (first === second) {
    return 78;
  }

  if (
    GENERATES[first] ===
      second ||
    GENERATES[second] ===
      first
  ) {
    return 88;
  }

  if (
    CONTROLS[first] ===
      second ||
    CONTROLS[second] ===
      first
  ) {
    return 46;
  }

  return 63;
}

function zodiacScore(
  first: number,
  second: number,
): number {
  if (first === second) {
    return 70;
  }

  if (
    hasPair(
      SIX_HARMONY_PAIRS,
      first,
      second,
    )
  ) {
    return 92;
  }

  if (
    isThreeHarmony(
      first,
      second,
    )
  ) {
    return 86;
  }

  if (
    hasPair(
      SIX_CLASH_PAIRS,
      first,
      second,
    )
  ) {
    return 38;
  }

  if (
    hasPair(
      HARM_PAIRS,
      first,
      second,
    )
  ) {
    return 47;
  }

  return 64;
}

function toneForScore(
  score: number,
): CompatibilityTone {
  if (score >= 80) {
    return 'strong';
  }

  if (score >= 66) {
    return 'supportive';
  }

  if (score >= 50) {
    return 'mixed';
  }

  return 'challenging';
}

function profileSignature(
  profile: UserProfile,
): string {
  return [
    profile.id,
    profile.birthDate.year,
    profile.birthDate.month,
    profile.birthDate.day,
    profile.birthTime.hour,
    profile.birthTime.minute,
  ].join('|');
}

function buildCodes(
  dimensions: CompatibilityDimension[],
): {
  strengths: string[];
  cautions: string[];
  suggestions: string[];
} {
  const sorted =
    [...dimensions].sort(
      (a, b) =>
        b.score - a.score,
    );

  const strengths =
    sorted
      .filter(
        item =>
          item.score >= 68,
      )
      .slice(0, 3)
      .map(
        item =>
          `dimension_${item.code}`,
      );

  const cautions =
    [...dimensions]
      .sort(
        (a, b) =>
          a.score - b.score,
      )
      .filter(
        item =>
          item.score < 62,
      )
      .slice(0, 3)
      .map(
        item =>
          `dimension_${item.code}`,
      );

  const suggestions: string[] = [];

  if (
    dimensions.find(
      item =>
        item.code ===
          'communication' &&
        item.score < 65,
    )
  ) {
    suggestions.push(
      'clearCommunication',
    );
  }

  if (
    dimensions.find(
      item =>
        item.code ===
          'sharedDirection' &&
        item.score < 65,
    )
  ) {
    suggestions.push(
      'alignExpectations',
    );
  }

  if (
    dimensions.find(
      item =>
        item.code ===
          'emotionalRhythm' &&
        item.score < 65,
    )
  ) {
    suggestions.push(
      'respectDifferentPaces',
    );
  }

  if (
    suggestions.length === 0
  ) {
    suggestions.push(
      'maintainStrengths',
      'reviewTogether',
    );
  }

  return {
    strengths:
      strengths.length > 0
        ? strengths
        : [
            'dimension_longTermStability',
          ],
    cautions:
      cautions.length > 0
        ? cautions
        : [
            'generalBalance',
          ],
    suggestions:
      suggestions.slice(0, 3),
  };
}

export function getCompatibilityWeights(
  mode: CompatibilityMode,
): Record<
  CompatibilityDimensionCode,
  number
> {
  return {
    ...MODE_WEIGHTS[mode],
  };
}

export function calculateAdvancedCompatibility(
  first: UserProfile,
  second: UserProfile,
  mode: CompatibilityMode,
): AdvancedCompatibilityResult {
  const firstStem =
    positiveModulo(
      first.birthDate.year -
        4,
      10,
    );

  const secondStem =
    positiveModulo(
      second.birthDate.year -
        4,
      10,
    );

  const firstBranch =
    positiveModulo(
      first.birthDate.year -
        4,
      12,
    );

  const secondBranch =
    positiveModulo(
      second.birthDate.year -
        4,
      12,
    );

  const seed =
    hashNumber(
      [
        profileSignature(
          first,
        ),
        profileSignature(
          second,
        ),
        mode,
      ].sort().join('::'),
    );

  const elementFlow =
    clamp(
      elementScore(
        ELEMENT_BY_STEM[
          firstStem
        ],
        ELEMENT_BY_STEM[
          secondStem
        ],
      ) +
        stableVariation(
          seed,
          1,
          5,
        ),
    );

  const zodiacRelation =
    clamp(
      zodiacScore(
        firstBranch,
        secondBranch,
      ) +
        stableVariation(
          seed,
          2,
          4,
        ),
    );

  const dayDistance =
    Math.abs(
      first.birthDate.day -
        second.birthDate.day,
    );

  const monthDistance =
    Math.min(
      Math.abs(
        first.birthDate.month -
          second.birthDate.month,
      ),
      12 -
        Math.abs(
          first.birthDate.month -
            second.birthDate.month,
        ),
    );

  const communication =
    clamp(
      75 -
        monthDistance * 3 +
        stableVariation(
          seed,
          3,
        ),
    );

  const emotionalRhythm =
    clamp(
      76 -
        dayDistance * 1.3 +
        stableVariation(
          seed,
          4,
        ),
    );

  const sharedDirection =
    clamp(
      (
        elementFlow +
        communication
      ) / 2 +
        stableVariation(
          seed,
          5,
          7,
        ),
    );

  const longTermStability =
    clamp(
      (
        zodiacRelation +
        emotionalRhythm +
        sharedDirection
      ) / 3 +
        stableVariation(
          seed,
          6,
          6,
        ),
    );

  const dimensions: CompatibilityDimension[] = [
    {
      code: 'elementFlow',
      score:
        elementFlow,
    },
    {
      code: 'zodiacRelation',
      score:
        zodiacRelation,
    },
    {
      code: 'communication',
      score:
        communication,
    },
    {
      code: 'emotionalRhythm',
      score:
        emotionalRhythm,
    },
    {
      code: 'sharedDirection',
      score:
        sharedDirection,
    },
    {
      code: 'longTermStability',
      score:
        longTermStability,
    },
  ];

  const weights =
    MODE_WEIGHTS[mode];

  const overallScore =
    clamp(
      dimensions.reduce(
        (sum, item) =>
          sum +
          item.score *
            weights[item.code],
        0,
      ),
    );

  const codes =
    buildCodes(
      dimensions,
    );

  return {
    profileAId:
      first.id,
    profileBId:
      second.id,
    mode,
    overallScore,
    tone:
      toneForScore(
        overallScore,
      ),
    dimensions,
    strengthCodes:
      codes.strengths,
    cautionCodes:
      codes.cautions,
    suggestionCodes:
      codes.suggestions,
    modelVersion:
      'profile-compatibility-v1',
  };
}
