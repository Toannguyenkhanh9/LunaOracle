import {Solar} from 'lunar-javascript';

import type {
  UserProfile,
} from './userProfiles';

export type TodayElement =
  | 'wood'
  | 'fire'
  | 'earth'
  | 'metal'
  | 'water'
  | 'unknown';

export type TodayRating =
  | 'auspicious'
  | 'balanced'
  | 'caution';

export type TodayActivityCode =
  | 'worship'
  | 'wedding'
  | 'opening'
  | 'construction'
  | 'moving'
  | 'travel'
  | 'signing'
  | 'cleaning'
  | 'study'
  | 'health'
  | 'rest'
  | 'majorDecision'
  | 'overcommitment';

export type TodayProfileRelation =
  | 'sixHarmony'
  | 'threeHarmony'
  | 'supportive'
  | 'neutral'
  | 'clash';

export type TodayObservanceType =
  | 'newMoon'
  | 'fullMoon';

export type TodayHourPeriod = {
  branchIndex: number;
  start: string;
  end: string;
};

export type TodayObservance = {
  type: TodayObservanceType;
  solarDate: Date;
  daysAway: number;
  lunarDay: number;
  lunarMonth: number;
  lunarYear: number;
};

export type TodayProfileInsight = {
  profileId: string;
  profileName: string;
  birthZodiacIndex: number;
  relation: TodayProfileRelation;
};

export type TodayInsight = {
  generatedAt: string;
  solarDate: Date;

  lunarDay: number;
  lunarMonth: number;
  lunarYear: number;
  isLeapMonth: boolean;

  yearCanChiRaw: string;
  monthCanChiRaw: string;
  dayCanChiRaw: string;

  heavenlyStemIndex: number | null;
  earthlyBranchIndex: number | null;
  element: TodayElement;

  rating: TodayRating;
  tianShenLuckRaw: string;

  suitable: TodayActivityCode[];
  cautions: TodayActivityCode[];

  auspiciousHours: TodayHourPeriod[];

  isNewMoon: boolean;
  isFullMoon: boolean;
  nextObservance: TodayObservance | null;

  reflectionIndex: number;
  profileInsight: TodayProfileInsight | null;
};

const CHINESE_STEMS = [
  '甲',
  '乙',
  '丙',
  '丁',
  '戊',
  '己',
  '庚',
  '辛',
  '壬',
  '癸',
];

const VIETNAMESE_STEMS = [
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

const PINYIN_STEMS = [
  'Jia',
  'Yi',
  'Bing',
  'Ding',
  'Wu',
  'Ji',
  'Geng',
  'Xin',
  'Ren',
  'Gui',
];

const KOREAN_STEMS = [
  '갑',
  '을',
  '병',
  '정',
  '무',
  '기',
  '경',
  '신',
  '임',
  '계',
];

const CHINESE_BRANCHES = [
  '子',
  '丑',
  '寅',
  '卯',
  '辰',
  '巳',
  '午',
  '未',
  '申',
  '酉',
  '戌',
  '亥',
];

const VIETNAMESE_BRANCHES = [
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

const PINYIN_BRANCHES = [
  'Zi',
  'Chou',
  'Yin',
  'Mao',
  'Chen',
  'Si',
  'Wu',
  'Wei',
  'Shen',
  'You',
  'Xu',
  'Hai',
];

const KOREAN_BRANCHES = [
  '자',
  '축',
  '인',
  '묘',
  '진',
  '사',
  '오',
  '미',
  '신',
  '유',
  '술',
  '해',
];

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

const AUSPICIOUS_HOUR_BRANCHES: Record<
  number,
  number[]
> = {
  0: [0, 1, 3, 6, 8, 9],
  6: [0, 1, 3, 6, 8, 9],

  1: [2, 3, 5, 8, 10, 11],
  7: [2, 3, 5, 8, 10, 11],

  2: [0, 1, 4, 5, 7, 10],
  8: [0, 1, 4, 5, 7, 10],

  3: [0, 2, 3, 6, 7, 9],
  9: [0, 2, 3, 6, 7, 9],

  4: [2, 4, 5, 8, 9, 11],
  10: [2, 4, 5, 8, 9, 11],

  5: [1, 4, 6, 7, 10, 11],
  11: [1, 4, 6, 7, 10, 11],
};

const HOUR_RANGES: Record<
  number,
  {
    start: string;
    end: string;
  }
> = {
  0: {
    start: '23:00',
    end: '00:59',
  },
  1: {
    start: '01:00',
    end: '02:59',
  },
  2: {
    start: '03:00',
    end: '04:59',
  },
  3: {
    start: '05:00',
    end: '06:59',
  },
  4: {
    start: '07:00',
    end: '08:59',
  },
  5: {
    start: '09:00',
    end: '10:59',
  },
  6: {
    start: '11:00',
    end: '12:59',
  },
  7: {
    start: '13:00',
    end: '14:59',
  },
  8: {
    start: '15:00',
    end: '16:59',
  },
  9: {
    start: '17:00',
    end: '18:59',
  },
  10: {
    start: '19:00',
    end: '20:59',
  },
  11: {
    start: '21:00',
    end: '22:59',
  },
};

const ACTIVITY_KEYWORDS: Array<{
  code: TodayActivityCode;
  keywords: string[];
}> = [
  {
    code: 'worship',
    keywords: [
      '祭祀',
      '祈福',
      '求嗣',
      '齋醮',
      '斋醮',
      '礼佛',
      '禮佛',
    ],
  },
  {
    code: 'wedding',
    keywords: [
      '嫁娶',
      '結婚',
      '结婚',
      '納采',
      '纳采',
      '訂盟',
      '订盟',
    ],
  },
  {
    code: 'opening',
    keywords: [
      '開市',
      '开市',
      '開業',
      '开业',
      '交易',
      '立券',
    ],
  },
  {
    code: 'construction',
    keywords: [
      '動土',
      '动土',
      '修造',
      '起基',
      '上梁',
      '破土',
    ],
  },
  {
    code: 'moving',
    keywords: [
      '入宅',
      '移徙',
      '安床',
      '搬家',
    ],
  },
  {
    code: 'travel',
    keywords: [
      '出行',
      '赴任',
      '遠行',
      '远行',
    ],
  },
  {
    code: 'signing',
    keywords: [
      '交易',
      '立券',
      '納財',
      '纳财',
      '簽約',
      '签约',
    ],
  },
  {
    code: 'cleaning',
    keywords: [
      '掃舍',
      '扫舍',
      '沐浴',
      '解除',
      '整手足甲',
    ],
  },
  {
    code: 'study',
    keywords: [
      '入學',
      '入学',
      '求學',
      '求学',
    ],
  },
  {
    code: 'health',
    keywords: [
      '求醫',
      '求医',
      '治病',
      '療病',
      '疗病',
    ],
  },
];

function positiveModulo(
  value: number,
  modulo: number,
): number {
  return (
    (value % modulo) +
    modulo
  ) % modulo;
}

function callString(
  target: unknown,
  methodName: string,
): string {
  if (
    !target ||
    typeof target !== 'object'
  ) {
    return '';
  }

  const method = (
    target as Record<
      string,
      unknown
    >
  )[methodName];

  if (
    typeof method !== 'function'
  ) {
    return '';
  }

  try {
    return String(
      (
        method as (
          ...args: never[]
        ) => unknown
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
  if (
    !target ||
    typeof target !== 'object'
  ) {
    return [];
  }

  const method = (
    target as Record<
      string,
      unknown
    >
  )[methodName];

  if (
    typeof method !== 'function'
  ) {
    return [];
  }

  try {
    const value = (
      method as (
        ...args: never[]
      ) => unknown
    ).call(target);

    return Array.isArray(value)
      ? value.map(item =>
          String(item),
        )
      : [];
  } catch {
    return [];
  }
}

function getStemIndex(
  raw: string,
): number | null {
  const normalized =
    raw.trim();

  for (
    let index = 0;
    index < CHINESE_STEMS.length;
    index += 1
  ) {
    const aliases = [
      CHINESE_STEMS[index],
      VIETNAMESE_STEMS[index],
      PINYIN_STEMS[index],
      KOREAN_STEMS[index],
    ];

    if (
      aliases.some(alias =>
        normalized
          .toLowerCase()
          .includes(
            alias.toLowerCase(),
          ),
      )
    ) {
      return index;
    }
  }

  return null;
}

function getBranchIndex(
  raw: string,
): number | null {
  const normalized =
    raw.trim();

  for (
    let index = 0;
    index < CHINESE_BRANCHES.length;
    index += 1
  ) {
    const aliases = [
      CHINESE_BRANCHES[index],
      VIETNAMESE_BRANCHES[index],
      PINYIN_BRANCHES[index],
      KOREAN_BRANCHES[index],
    ];

    if (
      aliases.some(alias =>
        normalized
          .toLowerCase()
          .includes(
            alias.toLowerCase(),
          ),
      )
    ) {
      return index;
    }
  }

  return null;
}

function elementFromStem(
  stemIndex: number | null,
): TodayElement {
  if (stemIndex === null) {
    return 'unknown';
  }

  if (
    stemIndex === 0 ||
    stemIndex === 1
  ) {
    return 'wood';
  }

  if (
    stemIndex === 2 ||
    stemIndex === 3
  ) {
    return 'fire';
  }

  if (
    stemIndex === 4 ||
    stemIndex === 5
  ) {
    return 'earth';
  }

  if (
    stemIndex === 6 ||
    stemIndex === 7
  ) {
    return 'metal';
  }

  return 'water';
}

function activityCodesFromRaw(
  items: string[],
): TodayActivityCode[] {
  const result: TodayActivityCode[] =
    [];

  ACTIVITY_KEYWORDS.forEach(
    entry => {
      const matches =
        items.some(item =>
          entry.keywords.some(
            keyword =>
              item.includes(
                keyword,
              ),
          ),
        );

      if (matches) {
        result.push(
          entry.code,
        );
      }
    },
  );

  return Array.from(
    new Set(result),
  );
}

function buildRating(
  tianShenLuckRaw: string,
): TodayRating {
  if (
    tianShenLuckRaw.includes(
      '吉',
    )
  ) {
    return 'auspicious';
  }

  if (
    tianShenLuckRaw.includes(
      '凶',
    )
  ) {
    return 'caution';
  }

  return 'balanced';
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
        pair[0] === second &&
        pair[1] === first
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

function buildProfileRelation(
  birthZodiacIndex: number,
  dayBranchIndex: number,
): TodayProfileRelation {
  if (
    hasPair(
      SIX_CLASH_PAIRS,
      birthZodiacIndex,
      dayBranchIndex,
    )
  ) {
    return 'clash';
  }

  if (
    hasPair(
      SIX_HARMONY_PAIRS,
      birthZodiacIndex,
      dayBranchIndex,
    )
  ) {
    return 'sixHarmony';
  }

  if (
    isThreeHarmony(
      birthZodiacIndex,
      dayBranchIndex,
    )
  ) {
    return 'threeHarmony';
  }

  const distance =
    positiveModulo(
      dayBranchIndex -
        birthZodiacIndex,
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

function buildAuspiciousHours(
  dayBranchIndex: number | null,
): TodayHourPeriod[] {
  if (dayBranchIndex === null) {
    return [];
  }

  const branches =
    AUSPICIOUS_HOUR_BRANCHES[
      dayBranchIndex
    ] ?? [];

  return branches.map(
    branchIndex => ({
      branchIndex,
      start:
        HOUR_RANGES[
          branchIndex
        ].start,
      end:
        HOUR_RANGES[
          branchIndex
        ].end,
    }),
  );
}

function startOfLocalDay(
  value: Date,
): Date {
  return new Date(
    value.getFullYear(),
    value.getMonth(),
    value.getDate(),
    12,
    0,
    0,
    0,
  );
}

function addDays(
  value: Date,
  days: number,
): Date {
  return new Date(
    value.getFullYear(),
    value.getMonth(),
    value.getDate() + days,
    12,
    0,
    0,
    0,
  );
}

function findNextObservance(
  date: Date,
): TodayObservance | null {
  for (
    let offset = 1;
    offset <= 18;
    offset += 1
  ) {
    const candidate =
      addDays(date, offset);

    const solar =
      Solar.fromYmd(
        candidate.getFullYear(),
        candidate.getMonth() + 1,
        candidate.getDate(),
      );

    const lunar =
      solar.getLunar();

    const lunarDay =
      lunar.getDay();

    if (
      lunarDay !== 1 &&
      lunarDay !== 15
    ) {
      continue;
    }

    const rawMonth =
      lunar.getMonth();

    return {
      type:
        lunarDay === 1
          ? 'newMoon'
          : 'fullMoon',
      solarDate:
        candidate,
      daysAway:
        offset,
      lunarDay,
      lunarMonth:
        Math.abs(rawMonth),
      lunarYear:
        lunar.getYear(),
    };
  }

  return null;
}

function buildProfileInsight(
  profile: UserProfile | null,
  dayBranchIndex: number | null,
): TodayProfileInsight | null {
  if (
    !profile ||
    dayBranchIndex === null
  ) {
    return null;
  }

  const birthSolar =
    Solar.fromYmd(
      profile.birthDate.year,
      profile.birthDate.month,
      profile.birthDate.day,
    );

  const birthLunar =
    birthSolar.getLunar();

  const birthZodiacIndex =
    positiveModulo(
      birthLunar.getYear() - 4,
      12,
    );

  return {
    profileId:
      profile.id,
    profileName:
      profile.displayName,
    birthZodiacIndex,
    relation:
      buildProfileRelation(
        birthZodiacIndex,
        dayBranchIndex,
      ),
  };
}

export function getTodayInsight(
  inputDate = new Date(),
  profile: UserProfile | null = null,
): TodayInsight {
  const date =
    startOfLocalDay(inputDate);

  const solar =
    Solar.fromYmd(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    );

  const lunar =
    solar.getLunar();

  const rawMonth =
    lunar.getMonth();

  const yearCanChiRaw =
    callString(
      lunar,
      'getYearInGanZhi',
    );

  const monthCanChiRaw =
    callString(
      lunar,
      'getMonthInGanZhi',
    );

  const dayCanChiRaw =
    callString(
      lunar,
      'getDayInGanZhi',
    );

  const dayStemRaw =
    callString(
      lunar,
      'getDayGan',
    ) ||
    dayCanChiRaw.slice(0, 1);

  const dayBranchRaw =
    callString(
      lunar,
      'getDayZhi',
    ) ||
    dayCanChiRaw.slice(-1);

  const stemIndex =
    getStemIndex(dayStemRaw);

  const branchIndex =
    getBranchIndex(dayBranchRaw);

  const tianShenLuckRaw =
    callString(
      lunar,
      'getDayTianShenLuck',
    );

  const dayYi =
    callStringArray(
      lunar,
      'getDayYi',
    );

  const dayJi =
    callStringArray(
      lunar,
      'getDayJi',
    );

  const rating =
    buildRating(
      tianShenLuckRaw,
    );

  let suitable =
    activityCodesFromRaw(
      dayYi,
    );

  let cautions =
    activityCodesFromRaw(
      dayJi,
    );

  if (
    suitable.length === 0
  ) {
    suitable = [
      'worship',
      'cleaning',
    ];
  }

  if (
    cautions.length === 0 &&
    rating === 'caution'
  ) {
    cautions = [
      'majorDecision',
      'overcommitment',
    ];
  }

  const lunarDay =
    lunar.getDay();

  return {
    generatedAt:
      new Date().toISOString(),
    solarDate:
      date,

    lunarDay,
    lunarMonth:
      Math.abs(rawMonth),
    lunarYear:
      lunar.getYear(),
    isLeapMonth:
      rawMonth < 0,

    yearCanChiRaw,
    monthCanChiRaw,
    dayCanChiRaw,

    heavenlyStemIndex:
      stemIndex,
    earthlyBranchIndex:
      branchIndex,
    element:
      elementFromStem(
        stemIndex,
      ),

    rating,
    tianShenLuckRaw,

    suitable:
      suitable.slice(0, 5),
    cautions:
      cautions.slice(0, 5),

    auspiciousHours:
      buildAuspiciousHours(
        branchIndex,
      ),

    isNewMoon:
      lunarDay === 1,
    isFullMoon:
      lunarDay === 15,
    nextObservance:
      findNextObservance(
        date,
      ),

    reflectionIndex:
      positiveModulo(
        date.getFullYear() *
          372 +
          (
            date.getMonth() +
            1
          ) *
            31 +
          date.getDate(),
        12,
      ),

    profileInsight:
      buildProfileInsight(
        profile,
        branchIndex,
      ),
  };
}

export function localizeCanChiForToday(
  raw: string,
  language?: string,
): string {
  const locale =
    (
      language ??
      'en'
    ).toLowerCase();

  const stemIndex =
    getStemIndex(raw);

  const branchIndex =
    getBranchIndex(raw);

  if (
    stemIndex === null ||
    branchIndex === null
  ) {
    return raw;
  }

  if (
    locale.startsWith('vi')
  ) {
    return `${VIETNAMESE_STEMS[stemIndex]} ${VIETNAMESE_BRANCHES[branchIndex]}`;
  }

  if (
    locale.startsWith('zh') ||
    locale.startsWith('ja')
  ) {
    return `${CHINESE_STEMS[stemIndex]}${CHINESE_BRANCHES[branchIndex]}`;
  }

  if (
    locale.startsWith('ko')
  ) {
    return `${KOREAN_STEMS[stemIndex]}${KOREAN_BRANCHES[branchIndex]}`;
  }

  return `${PINYIN_STEMS[stemIndex]} ${PINYIN_BRANCHES[branchIndex]}`;
}
