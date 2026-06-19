export type ZodiacSignId =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces';

export type ZodiacElement =
  | 'fire'
  | 'earth'
  | 'air'
  | 'water';

export type ZodiacModality =
  | 'cardinal'
  | 'fixed'
  | 'mutable';

export type ZodiacProfile = {
  sign: ZodiacSignId;
  element: ZodiacElement;
  modality: ZodiacModality;
  ruler: string;
  symbol: string;
  dateRange: string;
  strengths: string[];
  challenges: string[];
  loveStyle: string;
  careerStyle: string;
};

export const ZODIAC_SIGNS: Record<
  ZodiacSignId,
  ZodiacProfile
> = {
  aries: {
    sign: 'aries',
    element: 'fire',
    modality: 'cardinal',
    ruler: 'Mars',
    symbol: '♈',
    dateRange: 'Mar 21 – Apr 19',
    strengths: [
      'brave',
      'direct',
      'energetic',
    ],
    challenges: [
      'impatient',
      'reactive',
      'restless',
    ],
    loveStyle:
      'Passionate, honest, and action-oriented.',
    careerStyle:
      'Thrives when leading, initiating, and moving quickly.',
  },
  taurus: {
    sign: 'taurus',
    element: 'earth',
    modality: 'fixed',
    ruler: 'Venus',
    symbol: '♉',
    dateRange: 'Apr 20 – May 20',
    strengths: [
      'steady',
      'loyal',
      'grounded',
    ],
    challenges: [
      'stubborn',
      'slow to change',
      'comfort-bound',
    ],
    loveStyle:
      'Loyal, sensual, and consistent.',
    careerStyle:
      'Works best with stability, craft, resources, and long-term value.',
  },
  gemini: {
    sign: 'gemini',
    element: 'air',
    modality: 'mutable',
    ruler: 'Mercury',
    symbol: '♊',
    dateRange: 'May 21 – Jun 20',
    strengths: [
      'curious',
      'adaptable',
      'communicative',
    ],
    challenges: [
      'scattered',
      'restless',
      'overthinking',
    ],
    loveStyle:
      'Playful, conversational, and mentally engaged.',
    careerStyle:
      'Thrives in communication, learning, sales, media, and variety.',
  },
  cancer: {
    sign: 'cancer',
    element: 'water',
    modality: 'cardinal',
    ruler: 'Moon',
    symbol: '♋',
    dateRange: 'Jun 21 – Jul 22',
    strengths: [
      'caring',
      'intuitive',
      'protective',
    ],
    challenges: [
      'moody',
      'guarded',
      'overprotective',
    ],
    loveStyle:
      'Emotionally deep, nurturing, and protective.',
    careerStyle:
      'Works well in care, home, food, family, support, and memory-based work.',
  },
  leo: {
    sign: 'leo',
    element: 'fire',
    modality: 'fixed',
    ruler: 'Sun',
    symbol: '♌',
    dateRange: 'Jul 23 – Aug 22',
    strengths: [
      'confident',
      'warm',
      'creative',
    ],
    challenges: [
      'prideful',
      'dramatic',
      'attention-seeking',
    ],
    loveStyle:
      'Generous, expressive, and devoted when appreciated.',
    careerStyle:
      'Thrives in creative leadership, performance, branding, and visibility.',
  },
  virgo: {
    sign: 'virgo',
    element: 'earth',
    modality: 'mutable',
    ruler: 'Mercury',
    symbol: '♍',
    dateRange: 'Aug 23 – Sep 22',
    strengths: [
      'precise',
      'helpful',
      'practical',
    ],
    challenges: [
      'critical',
      'anxious',
      'perfectionist',
    ],
    loveStyle:
      'Shows love through care, reliability, and thoughtful details.',
    careerStyle:
      'Excels in analysis, health, systems, editing, operations, and service.',
  },
  libra: {
    sign: 'libra',
    element: 'air',
    modality: 'cardinal',
    ruler: 'Venus',
    symbol: '♎',
    dateRange: 'Sep 23 – Oct 22',
    strengths: [
      'diplomatic',
      'fair',
      'charming',
    ],
    challenges: [
      'indecisive',
      'people-pleasing',
      'avoidant',
    ],
    loveStyle:
      'Romantic, balanced, and partnership-oriented.',
    careerStyle:
      'Thrives in design, law, mediation, beauty, relationships, and public roles.',
  },
  scorpio: {
    sign: 'scorpio',
    element: 'water',
    modality: 'fixed',
    ruler: 'Mars / Pluto',
    symbol: '♏',
    dateRange: 'Oct 23 – Nov 21',
    strengths: [
      'intense',
      'loyal',
      'transformative',
    ],
    challenges: [
      'secretive',
      'possessive',
      'all-or-nothing',
    ],
    loveStyle:
      'Deep, committed, and emotionally intense.',
    careerStyle:
      'Works well with research, crisis, psychology, finance, healing, and transformation.',
  },
  sagittarius: {
    sign: 'sagittarius',
    element: 'fire',
    modality: 'mutable',
    ruler: 'Jupiter',
    symbol: '♐',
    dateRange: 'Nov 22 – Dec 21',
    strengths: [
      'optimistic',
      'adventurous',
      'truth-seeking',
    ],
    challenges: [
      'blunt',
      'impatient',
      'overpromising',
    ],
    loveStyle:
      'Free-spirited, honest, and growth-oriented.',
    careerStyle:
      'Thrives in teaching, travel, publishing, philosophy, marketing, and exploration.',
  },
  capricorn: {
    sign: 'capricorn',
    element: 'earth',
    modality: 'cardinal',
    ruler: 'Saturn',
    symbol: '♑',
    dateRange: 'Dec 22 – Jan 19',
    strengths: [
      'disciplined',
      'ambitious',
      'responsible',
    ],
    challenges: [
      'rigid',
      'work-focused',
      'self-critical',
    ],
    loveStyle:
      'Serious, loyal, and commitment-oriented.',
    careerStyle:
      'Excels in management, structure, long-term goals, business, and authority.',
  },
  aquarius: {
    sign: 'aquarius',
    element: 'air',
    modality: 'fixed',
    ruler: 'Saturn / Uranus',
    symbol: '♒',
    dateRange: 'Jan 20 – Feb 18',
    strengths: [
      'original',
      'independent',
      'humanitarian',
    ],
    challenges: [
      'detached',
      'unpredictable',
      'stubborn',
    ],
    loveStyle:
      'Friendship-based, open-minded, and independent.',
    careerStyle:
      'Thrives in technology, systems, social change, communities, and innovation.',
  },
  pisces: {
    sign: 'pisces',
    element: 'water',
    modality: 'mutable',
    ruler: 'Jupiter / Neptune',
    symbol: '♓',
    dateRange: 'Feb 19 – Mar 20',
    strengths: [
      'compassionate',
      'imaginative',
      'spiritual',
    ],
    challenges: [
      'escapist',
      'unclear boundaries',
      'overabsorbing',
    ],
    loveStyle:
      'Tender, intuitive, romantic, and emotionally porous.',
    careerStyle:
      'Works well in art, healing, spirituality, music, film, care, and imagination.',
  },
};

export function getSunSign(
  month: number,
  day: number,
): ZodiacSignId {
  const value = month * 100 + day;

  if (value >= 321 && value <= 419) return 'aries';
  if (value >= 420 && value <= 520) return 'taurus';
  if (value >= 521 && value <= 620) return 'gemini';
  if (value >= 621 && value <= 722) return 'cancer';
  if (value >= 723 && value <= 822) return 'leo';
  if (value >= 823 && value <= 922) return 'virgo';
  if (value >= 923 && value <= 1022) return 'libra';
  if (value >= 1023 && value <= 1121) return 'scorpio';
  if (value >= 1122 && value <= 1221) return 'sagittarius';
  if (value >= 1222 || value <= 119) return 'capricorn';
  if (value >= 120 && value <= 218) return 'aquarius';

  return 'pisces';
}

export function buildZodiacProfile(
  month: number,
  day: number,
): ZodiacProfile {
  return ZODIAC_SIGNS[
    getSunSign(
      month,
      day,
    )
  ];
}

export function getZodiacCompatibilityScore(
  first: ZodiacSignId,
  second: ZodiacSignId,
): {
  score: number;
  summary: string;
  elementFlow: string;
} {
  const a = ZODIAC_SIGNS[first];
  const b = ZODIAC_SIGNS[second];

  const sameElement =
    a.element === b.element;

  const friendly =
    (
      a.element === 'fire' &&
      b.element === 'air'
    ) ||
    (
      a.element === 'air' &&
      b.element === 'fire'
    ) ||
    (
      a.element === 'earth' &&
      b.element === 'water'
    ) ||
    (
      a.element === 'water' &&
      b.element === 'earth'
    );

  const score =
    sameElement
      ? 86
      : friendly
        ? 78
        : a.modality === b.modality
          ? 66
          : 58;

  return {
    score,
    elementFlow: sameElement
      ? 'sameElement'
      : friendly
        ? 'supportiveElements'
        : 'differentRhythm',
    summary:
      sameElement
        ? 'Both signs share the same element, creating a natural energetic language.'
        : friendly
          ? 'The elements can support each other when both people communicate clearly.'
          : 'The relationship may need more patience because the basic rhythm is different.',
  };
}
