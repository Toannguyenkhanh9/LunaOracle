import {Solar} from 'lunar-javascript';

export type AuspiciousActivity =
  | 'wedding'
  | 'construction'
  | 'opening'
  | 'moving'
  | 'travel';

export type AuspiciousRating =
  | 'excellent'
  | 'good'
  | 'fair'
  | 'caution';

export type BirthGender =
  | 'male'
  | 'female'
  | 'unspecified';

export type InterpretationSchool =
  | 'folk'
  | 'bazi'
  | 'ziwei'
  | 'almanac';

export type LifeInsightRating =
  | 'veryStrong'
  | 'favorable'
  | 'balanced'
  | 'developing';

export type LoveStyle =
  | 'warm'
  | 'steady'
  | 'independent'
  | 'sensitive';

export type CareerStyle =
  | 'leadership'
  | 'creative'
  | 'analytical'
  | 'supportive'
  | 'entrepreneurial';

export type LifeInsight<
  TStyle extends string = string,
> = {
  score: number;
  rating: LifeInsightRating;
  style: TStyle;
  strengths: string[];
  cautions: string[];
  advice: string[];
};

export type HoroscopeLifeInsights = {
  love: LifeInsight<LoveStyle>;
  career: LifeInsight<CareerStyle>;
};

export type BirthProfile = {
  solarDate: Date;
  birthHour: number;
  birthMinute: number;
  gender: BirthGender;
  school: InterpretationSchool;

  lunarDay: number;
  lunarMonth: number;
  lunarYear: number;
  isLeapMonth: boolean;

  zodiacIndex: number;
  zodiacVi: string;
  zodiacEn: string;
  canChiYear: string;

  birthHourBranchIndex: number;
  birthHourBranchVi: string;
  birthHourBranchEn: string;

  yearPolarity: 'yang' | 'yin';
  cycleDirection: 'forward' | 'backward' | 'neutral';
};

export type AuspiciousDateResult = {
  solarDate: Date;
  lunarDay: number;
  lunarMonth: number;
  lunarYear: number;
  isLeapMonth: boolean;
  dayCanChi: string;
  dayBranchIndex: number | null;
  score: number;
  rating: AuspiciousRating;
  reasons: string[];
  avoidReasons: string[];
};

type SchoolWeights = {
  hoangDao: number;
  hacDao: number;
  traditionalSuitable: number;
  traditionalAvoid: number;
  zodiacHarmony: number;
  zodiacThreeHarmony: number;
  zodiacClash: number;
  hourHarmony: number;
  hourThreeHarmony: number;
  hourClash: number;
  nguyetKy: number;
  tamNuong: number;
  preferredLunarDay: number;
  birthLunarDayResonance: number;
};

const HEAVENLY_STEMS = [
  'Giáp',
  'Ất',
  'Bính',
  'Đinh',
  'Mậu',
  'Kỷ',
  'Canh',
  'Tân',
  'Nhâm',
  'Quý',
];

const EARTHLY_BRANCHES = [
  'Tý',
  'Sửu',
  'Dần',
  'Mão',
  'Thìn',
  'Tỵ',
  'Ngọ',
  'Mùi',
  'Thân',
  'Dậu',
  'Tuất',
  'Hợi',
];

const ZODIAC_EN = [
  'Rat',
  'Ox',
  'Tiger',
  'Rabbit',
  'Dragon',
  'Snake',
  'Horse',
  'Goat',
  'Monkey',
  'Rooster',
  'Dog',
  'Pig',
];

const HOUR_BRANCH_EN = [
  'Rat hour',
  'Ox hour',
  'Tiger hour',
  'Rabbit hour',
  'Dragon hour',
  'Snake hour',
  'Horse hour',
  'Goat hour',
  'Monkey hour',
  'Rooster hour',
  'Dog hour',
  'Pig hour',
];

const CHINESE_BRANCH_TO_INDEX: Record<string, number> = {
  子: 0,
  丑: 1,
  寅: 2,
  卯: 3,
  辰: 4,
  巳: 5,
  午: 6,
  未: 7,
  申: 8,
  酉: 9,
  戌: 10,
  亥: 11,
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

const THREE_HARMONY_GROUPS = [
  [8, 0, 4],
  [11, 3, 7],
  [2, 6, 10],
  [5, 9, 1],
];

const NGUYET_KY_DAYS = [5, 14, 23];
const TAM_NUONG_DAYS = [3, 7, 13, 18, 22, 27];

const PREFERRED_LUNAR_DAYS: Record<
  AuspiciousActivity,
  number[]
> = {
  wedding: [2, 6, 8, 10, 12, 16, 19, 20, 24, 26, 28],
  construction: [2, 6, 8, 10, 12, 16, 20, 24, 26, 28],
  opening: [1, 6, 8, 10, 12, 16, 18, 24, 26],
  moving: [2, 6, 8, 10, 12, 16, 20, 24, 26],
  travel: [2, 6, 8, 10, 16, 18, 20, 26],
};

const ACTIVITY_YI_KEYWORDS: Record<
  AuspiciousActivity,
  string[]
> = {
  wedding: ['嫁娶', '結婚', '结婚', '納采', '纳采', '訂盟', '订盟'],
  construction: ['動土', '动土', '修造', '起基', '上梁', '破土'],
  opening: ['開市', '开市', '交易', '立券', '開業', '开业'],
  moving: ['入宅', '移徙', '安床', '搬家'],
  travel: ['出行', '赴任', '遠行', '远行'],
};

const SCHOOL_WEIGHTS: Record<
  InterpretationSchool,
  SchoolWeights
> = {
  folk: {
    hoangDao: 14,
    hacDao: -14,
    traditionalSuitable: 25,
    traditionalAvoid: -36,
    zodiacHarmony: 15,
    zodiacThreeHarmony: 10,
    zodiacClash: -25,
    hourHarmony: 7,
    hourThreeHarmony: 5,
    hourClash: -10,
    nguyetKy: -20,
    tamNuong: -15,
    preferredLunarDay: 9,
    birthLunarDayResonance: 3,
  },

  bazi: {
    hoangDao: 8,
    hacDao: -9,
    traditionalSuitable: 16,
    traditionalAvoid: -24,
    zodiacHarmony: 20,
    zodiacThreeHarmony: 14,
    zodiacClash: -31,
    hourHarmony: 16,
    hourThreeHarmony: 11,
    hourClash: -21,
    nguyetKy: -11,
    tamNuong: -9,
    preferredLunarDay: 5,
    birthLunarDayResonance: 7,
  },

  ziwei: {
    hoangDao: 10,
    hacDao: -11,
    traditionalSuitable: 18,
    traditionalAvoid: -27,
    zodiacHarmony: 14,
    zodiacThreeHarmony: 11,
    zodiacClash: -24,
    hourHarmony: 14,
    hourThreeHarmony: 9,
    hourClash: -18,
    nguyetKy: -13,
    tamNuong: -11,
    preferredLunarDay: 7,
    birthLunarDayResonance: 9,
  },

  almanac: {
    hoangDao: 20,
    hacDao: -21,
    traditionalSuitable: 31,
    traditionalAvoid: -44,
    zodiacHarmony: 9,
    zodiacThreeHarmony: 6,
    zodiacClash: -18,
    hourHarmony: 4,
    hourThreeHarmony: 3,
    hourClash: -7,
    nguyetKy: -23,
    tamNuong: -18,
    preferredLunarDay: 12,
    birthLunarDayResonance: 2,
  },
};

function positiveModulo(
  value: number,
  modulo: number,
): number {
  return ((value % modulo) + modulo) % modulo;
}

function callString(
  target: unknown,
  methodName: string,
): string {
  if (!target || typeof target !== 'object') {
    return '';
  }

  const method = (
    target as Record<string, unknown>
  )[methodName];

  if (typeof method !== 'function') {
    return '';
  }

  try {
    return String(
      (
        method as (...args: never[]) => unknown
      ).call(target),
    );
  } catch {
    return '';
  }
}

function callStringArray(
  target: unknown,
  methodName: string,
): string[] {
  if (!target || typeof target !== 'object') {
    return [];
  }

  const method = (
    target as Record<string, unknown>
  )[methodName];

  if (typeof method !== 'function') {
    return [];
  }

  try {
    const value = (
      method as (...args: never[]) => unknown
    ).call(target);

    if (Array.isArray(value)) {
      return value.map(item => String(item));
    }

    return [];
  } catch {
    return [];
  }
}

function getZodiacIndexFromLunarYear(
  lunarYear: number,
): number {
  return positiveModulo(
    lunarYear - 4,
    12,
  );
}

function getCanChiYear(
  lunarYear: number,
): string {
  const stemIndex = positiveModulo(
    lunarYear - 4,
    10,
  );

  const branchIndex =
    getZodiacIndexFromLunarYear(
      lunarYear,
    );

  return `${HEAVENLY_STEMS[stemIndex]} ${EARTHLY_BRANCHES[branchIndex]}`;
}

function getBirthHourBranchIndex(
  hour: number,
): number {
  return Math.floor(
    ((hour + 1) % 24) / 2,
  );
}

function getLunarInfo(date: Date) {
  const solar = Solar.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );

  const lunar = solar.getLunar();
  const rawMonth = lunar.getMonth();

  const dayCanChi =
    callString(
      lunar,
      'getDayInGanZhi',
    );

  const dayZhi =
    callString(
      lunar,
      'getDayZhi',
    ) ||
    dayCanChi.slice(-1);

  return {
    lunar,
    lunarDay: lunar.getDay(),
    lunarMonth: Math.abs(rawMonth),
    lunarYear: lunar.getYear(),
    isLeapMonth: rawMonth < 0,
    dayCanChi,
    dayBranchIndex:
      CHINESE_BRANCH_TO_INDEX[
        dayZhi
      ] ?? null,
  };
}

function hasPair(
  pairs: number[][],
  first: number,
  second: number,
): boolean {
  return pairs.some(
    pair =>
      (pair[0] === first &&
        pair[1] === second) ||
      (pair[0] === second &&
        pair[1] === first),
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

function containsActivityKeyword(
  items: string[],
  activity: AuspiciousActivity,
): boolean {
  const keywords =
    ACTIVITY_YI_KEYWORDS[
      activity
    ];

  return items.some(item =>
    keywords.some(keyword =>
      item.includes(keyword),
    ),
  );
}

function getRating(
  score: number,
): AuspiciousRating {
  if (score >= 78) {
    return 'excellent';
  }

  if (score >= 64) {
    return 'good';
  }

  if (score >= 50) {
    return 'fair';
  }

  return 'caution';
}

function getCycleDirection(
  lunarYear: number,
  gender: BirthGender,
): {
  yearPolarity: 'yang' | 'yin';
  cycleDirection: 'forward' | 'backward' | 'neutral';
} {
  const stemIndex = positiveModulo(
    lunarYear - 4,
    10,
  );

  const yearPolarity =
    stemIndex % 2 === 0
      ? 'yang'
      : 'yin';

  if (gender === 'unspecified') {
    return {
      yearPolarity,
      cycleDirection: 'neutral',
    };
  }

  const isForward =
    (yearPolarity === 'yang' &&
      gender === 'male') ||
    (yearPolarity === 'yin' &&
      gender === 'female');

  return {
    yearPolarity,
    cycleDirection: isForward
      ? 'forward'
      : 'backward',
  };
}

function scoreDate(
  date: Date,
  birthProfile: BirthProfile,
  activity: AuspiciousActivity,
): AuspiciousDateResult {
  const info = getLunarInfo(date);
  const weights =
    SCHOOL_WEIGHTS[
      birthProfile.school
    ];

  const reasons: string[] = [];
  const avoidReasons: string[] = [];

  let score = 50;

  const dayYi = callStringArray(
    info.lunar,
    'getDayYi',
  );

  const dayJi = callStringArray(
    info.lunar,
    'getDayJi',
  );

  const tianShenLuck =
    callString(
      info.lunar,
      'getDayTianShenLuck',
    );

  if (
    tianShenLuck.includes('吉')
  ) {
    score += weights.hoangDao;
    reasons.push('hoangDao');
  } else if (
    tianShenLuck.includes('凶')
  ) {
    score += weights.hacDao;
    avoidReasons.push('hacDao');
  }

  if (
    containsActivityKeyword(
      dayYi,
      activity,
    )
  ) {
    score +=
      weights.traditionalSuitable;

    reasons.push(
      'traditionalSuitable',
    );
  }

  if (
    containsActivityKeyword(
      dayJi,
      activity,
    )
  ) {
    score +=
      weights.traditionalAvoid;

    avoidReasons.push(
      'traditionalAvoid',
    );
  }

  if (
    info.dayBranchIndex !== null
  ) {
    if (
      hasPair(
        SIX_CLASH_PAIRS,
        birthProfile.zodiacIndex,
        info.dayBranchIndex,
      )
    ) {
      score +=
        weights.zodiacClash;

      avoidReasons.push(
        'zodiacClash',
      );
    } else if (
      hasPair(
        SIX_HARMONY_PAIRS,
        birthProfile.zodiacIndex,
        info.dayBranchIndex,
      )
    ) {
      score +=
        weights.zodiacHarmony;

      reasons.push(
        'sixHarmony',
      );
    } else if (
      isThreeHarmony(
        birthProfile.zodiacIndex,
        info.dayBranchIndex,
      )
    ) {
      score +=
        weights.zodiacThreeHarmony;

      reasons.push(
        'threeHarmony',
      );
    }

    if (
      hasPair(
        SIX_CLASH_PAIRS,
        birthProfile.birthHourBranchIndex,
        info.dayBranchIndex,
      )
    ) {
      score +=
        weights.hourClash;

      avoidReasons.push(
        'birthHourClash',
      );
    } else if (
      hasPair(
        SIX_HARMONY_PAIRS,
        birthProfile.birthHourBranchIndex,
        info.dayBranchIndex,
      )
    ) {
      score +=
        weights.hourHarmony;

      reasons.push(
        'birthHourHarmony',
      );
    } else if (
      isThreeHarmony(
        birthProfile.birthHourBranchIndex,
        info.dayBranchIndex,
      )
    ) {
      score +=
        weights.hourThreeHarmony;

      reasons.push(
        'birthHourThreeHarmony',
      );
    }
  }

  if (
    NGUYET_KY_DAYS.includes(
      info.lunarDay,
    )
  ) {
    score +=
      weights.nguyetKy;

    avoidReasons.push(
      'nguyetKy',
    );
  }

  if (
    TAM_NUONG_DAYS.includes(
      info.lunarDay,
    )
  ) {
    score +=
      weights.tamNuong;

    avoidReasons.push(
      'tamNuong',
    );
  }

  if (
    PREFERRED_LUNAR_DAYS[
      activity
    ].includes(
      info.lunarDay,
    )
  ) {
    score +=
      weights.preferredLunarDay;

    reasons.push(
      'preferredLunarDay',
    );
  }

  if (
    info.lunarDay ===
      birthProfile.lunarDay ||
    Math.abs(
      info.lunarDay -
        birthProfile.lunarDay,
    ) === 15
  ) {
    score +=
      weights.birthLunarDayResonance;

    reasons.push(
      'birthLunarDayResonance',
    );
  }

  const weekday = date.getDay();

  if (
    activity === 'wedding' &&
    (weekday === 0 ||
      weekday === 6)
  ) {
    score += 3;
    reasons.push(
      'weekendConvenient',
    );
  }

  reasons.push(
    `school_${birthProfile.school}`,
  );

  const normalizedScore =
    Math.max(
      0,
      Math.min(100, score),
    );

  return {
    solarDate: date,
    lunarDay:
      info.lunarDay,
    lunarMonth:
      info.lunarMonth,
    lunarYear:
      info.lunarYear,
    isLeapMonth:
      info.isLeapMonth,
    dayCanChi:
      info.dayCanChi,
    dayBranchIndex:
      info.dayBranchIndex,
    score: normalizedScore,
    rating:
      getRating(
        normalizedScore,
      ),
    reasons: Array.from(
      new Set(reasons),
    ),
    avoidReasons: Array.from(
      new Set(avoidReasons),
    ),
  };
}

export function isValidSolarDate(
  day: number,
  month: number,
  year: number,
): boolean {
  if (
    year < 1900 ||
    year > 2100 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return false;
  }

  const date = new Date(
    year,
    month - 1,
    day,
  );

  return (
    date.getFullYear() === year &&
    date.getMonth() ===
      month - 1 &&
    date.getDate() === day
  );
}

export function isValidBirthTime(
  hour: number,
  minute: number,
): boolean {
  return (
    Number.isInteger(hour) &&
    Number.isInteger(minute) &&
    hour >= 0 &&
    hour <= 23 &&
    minute >= 0 &&
    minute <= 59
  );
}

export function createBirthProfile(
  day: number,
  month: number,
  year: number,
  hour: number,
  minute: number,
  gender: BirthGender,
  school: InterpretationSchool,
): BirthProfile {
  if (
    !isValidSolarDate(
      day,
      month,
      year,
    )
  ) {
    throw new Error(
      'INVALID_BIRTH_DATE',
    );
  }

  if (
    !isValidBirthTime(
      hour,
      minute,
    )
  ) {
    throw new Error(
      'INVALID_BIRTH_TIME',
    );
  }

  const solarDate = new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    0,
    0,
  );

  const lunarInfo =
    getLunarInfo(solarDate);

  const zodiacIndex =
    getZodiacIndexFromLunarYear(
      lunarInfo.lunarYear,
    );

  const birthHourBranchIndex =
    getBirthHourBranchIndex(
      hour,
    );

  const direction =
    getCycleDirection(
      lunarInfo.lunarYear,
      gender,
    );

  return {
    solarDate,
    birthHour: hour,
    birthMinute: minute,
    gender,
    school,

    lunarDay:
      lunarInfo.lunarDay,
    lunarMonth:
      lunarInfo.lunarMonth,
    lunarYear:
      lunarInfo.lunarYear,
    isLeapMonth:
      lunarInfo.isLeapMonth,

    zodiacIndex,
    zodiacVi:
      EARTHLY_BRANCHES[
        zodiacIndex
      ],
    zodiacEn:
      ZODIAC_EN[
        zodiacIndex
      ],
    canChiYear:
      getCanChiYear(
        lunarInfo.lunarYear,
      ),

    birthHourBranchIndex,
    birthHourBranchVi:
      `Giờ ${EARTHLY_BRANCHES[birthHourBranchIndex]}`,
    birthHourBranchEn:
      HOUR_BRANCH_EN[
        birthHourBranchIndex
      ],

    yearPolarity:
      direction.yearPolarity,
    cycleDirection:
      direction.cycleDirection,
  };
}

function getLifeInsightRating(
  score: number,
): LifeInsightRating {
  if (score >= 80) {
    return 'veryStrong';
  }

  if (score >= 68) {
    return 'favorable';
  }

  if (score >= 55) {
    return 'balanced';
  }

  return 'developing';
}

export function buildHoroscopeLifeInsights(
  profile: BirthProfile,
): HoroscopeLifeInsights {
  const loveStyles: LoveStyle[] = [
    'warm',
    'steady',
    'independent',
    'sensitive',
  ];

  const careerStyles: CareerStyle[] = [
    'leadership',
    'creative',
    'analytical',
    'supportive',
    'entrepreneurial',
  ];

  const loveStyle =
    loveStyles[
      positiveModulo(
        profile.zodiacIndex +
          profile.birthHourBranchIndex +
          profile.lunarDay,
        loveStyles.length,
      )
    ];

  const careerStyle =
    careerStyles[
      positiveModulo(
        profile.zodiacIndex * 2 +
          profile.birthHourBranchIndex +
          profile.lunarMonth,
        careerStyles.length,
      )
    ];

  let loveScore = 60;

  const loveStrengths: string[] = [];
  const loveCautions: string[] = [];
  const loveAdvice: string[] = [];

  if (
    hasPair(
      SIX_HARMONY_PAIRS,
      profile.zodiacIndex,
      profile.birthHourBranchIndex,
    )
  ) {
    loveScore += 12;
    loveStrengths.push(
      'loveHarmony',
    );
  } else if (
    isThreeHarmony(
      profile.zodiacIndex,
      profile.birthHourBranchIndex,
    )
  ) {
    loveScore += 8;
    loveStrengths.push(
      'loveThreeHarmony',
    );
  } else if (
    hasPair(
      SIX_CLASH_PAIRS,
      profile.zodiacIndex,
      profile.birthHourBranchIndex,
    )
  ) {
    loveScore -= 8;
    loveCautions.push(
      'loveInnerConflict',
    );
  }

  if (
    profile.lunarDay === 1 ||
    profile.lunarDay === 15
  ) {
    loveScore += 4;
    loveStrengths.push(
      'loveSelfAwareness',
    );
  }

  if (
    profile.cycleDirection ===
    'forward'
  ) {
    loveScore += 3;
  } else if (
    profile.cycleDirection ===
    'backward'
  ) {
    loveScore += 2;
  }

  switch (loveStyle) {
    case 'warm':
      loveScore += 5;
      loveStrengths.push(
        'loveWarmHeart',
        'loveExpressive',
      );
      loveCautions.push(
        'loveOvergiving',
      );
      loveAdvice.push(
        'loveSetBoundaries',
        'loveReceiveCare',
      );
      break;

    case 'steady':
      loveScore += 6;
      loveStrengths.push(
        'loveLoyal',
        'lovePatient',
      );
      loveCautions.push(
        'loveReserved',
      );
      loveAdvice.push(
        'loveSpeakClearly',
        'loveCreateRituals',
      );
      break;

    case 'independent':
      loveScore += 2;
      loveStrengths.push(
        'loveRespectsSpace',
        'loveHonest',
      );
      loveCautions.push(
        'loveNeedsFreedom',
      );
      loveAdvice.push(
        'loveBalanceFreedom',
        'loveSharePlans',
      );
      break;

    case 'sensitive':
      loveScore += 4;
      loveStrengths.push(
        'loveEmpathetic',
        'loveIntuitive',
      );
      loveCautions.push(
        'loveOverthinking',
      );
      loveAdvice.push(
        'loveTrustSlowly',
        'loveAskDirectly',
      );
      break;
  }

  let careerScore = 59;

  const careerStrengths: string[] = [];
  const careerCautions: string[] = [];
  const careerAdvice: string[] = [];

  if (
    profile.cycleDirection ===
    'forward'
  ) {
    careerScore += 7;
    careerStrengths.push(
      'careerPersistent',
    );
  } else if (
    profile.cycleDirection ===
    'backward'
  ) {
    careerScore += 4;
    careerStrengths.push(
      'careerReflective',
    );
  } else {
    careerScore += 2;
  }

  if (
    profile.yearPolarity ===
    'yang'
  ) {
    careerScore += 3;
    careerStrengths.push(
      'careerActionOriented',
    );
  } else {
    careerScore += 3;
    careerStrengths.push(
      'careerObservant',
    );
  }

  if (
    profile.school === 'bazi'
  ) {
    careerScore += 4;
  } else if (
    profile.school ===
    'ziwei'
  ) {
    careerScore += 3;
  } else {
    careerScore += 2;
  }

  switch (careerStyle) {
    case 'leadership':
      careerScore += 6;
      careerStrengths.push(
        'careerLeadership',
        'careerResponsibility',
      );
      careerCautions.push(
        'careerOvercontrol',
      );
      careerAdvice.push(
        'careerDelegate',
        'careerListenBeforeDeciding',
      );
      break;

    case 'creative':
      careerScore += 5;
      careerStrengths.push(
        'careerCreative',
        'careerExpression',
      );
      careerCautions.push(
        'careerScattered',
      );
      careerAdvice.push(
        'careerBuildPortfolio',
        'careerFinishOneThing',
      );
      break;

    case 'analytical':
      careerScore += 7;
      careerStrengths.push(
        'careerAnalytical',
        'careerPlanning',
      );
      careerCautions.push(
        'careerPerfectionism',
      );
      careerAdvice.push(
        'careerSetMilestones',
        'careerDecideWithEnoughData',
      );
      break;

    case 'supportive':
      careerScore += 5;
      careerStrengths.push(
        'careerTeamwork',
        'careerService',
      );
      careerCautions.push(
        'careerPeoplePleasing',
      );
      careerAdvice.push(
        'careerProtectEnergy',
        'careerShowYourContribution',
      );
      break;

    case 'entrepreneurial':
      careerScore += 6;
      careerStrengths.push(
        'careerInitiative',
        'careerAdaptability',
      );
      careerCautions.push(
        'careerRiskTaking',
      );
      careerAdvice.push(
        'careerValidateRisk',
        'careerKeepCashReserve',
      );
      break;
  }

  const normalizedLoveScore =
    Math.max(
      0,
      Math.min(100, loveScore),
    );

  const normalizedCareerScore =
    Math.max(
      0,
      Math.min(100, careerScore),
    );

  return {
    love: {
      score:
        normalizedLoveScore,
      rating:
        getLifeInsightRating(
          normalizedLoveScore,
        ),
      style: loveStyle,
      strengths: Array.from(
        new Set(loveStrengths),
      ),
      cautions: Array.from(
        new Set(loveCautions),
      ),
      advice: Array.from(
        new Set(loveAdvice),
      ),
    },

    career: {
      score:
        normalizedCareerScore,
      rating:
        getLifeInsightRating(
          normalizedCareerScore,
        ),
      style: careerStyle,
      strengths: Array.from(
        new Set(careerStrengths),
      ),
      cautions: Array.from(
        new Set(careerCautions),
      ),
      advice: Array.from(
        new Set(careerAdvice),
      ),
    },
  };
}

export function findAuspiciousDates(
  birthProfile: BirthProfile,
  activity: AuspiciousActivity,
  monthsAhead = 6,
  limit = 12,
): AuspiciousDateResult[] {
  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0,
  );

  const endDate = new Date(
    today.getFullYear(),
    today.getMonth() +
      monthsAhead,
    today.getDate(),
  );

  const results: AuspiciousDateResult[] =
    [];

  const cursor = new Date(today);

  cursor.setDate(
    cursor.getDate() + 1,
  );

  while (
    cursor.getTime() <=
    endDate.getTime()
  ) {
    results.push(
      scoreDate(
        new Date(cursor),
        birthProfile,
        activity,
      ),
    );

    cursor.setDate(
      cursor.getDate() + 1,
    );
  }

  return results
    .sort((first, second) => {
      if (
        second.score !==
        first.score
      ) {
        return (
          second.score -
          first.score
        );
      }

      return (
        first.solarDate.getTime() -
        second.solarDate.getTime()
      );
    })
    .slice(0, limit);
}
