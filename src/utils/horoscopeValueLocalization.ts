export type HoroscopeLanguage =
  | 'vi'
  | 'en'
  | 'zh'
  | 'ko'
  | 'ja';

type BranchId =
  | 'rat'
  | 'ox'
  | 'tiger'
  | 'rabbit'
  | 'dragon'
  | 'snake'
  | 'horse'
  | 'goat'
  | 'monkey'
  | 'rooster'
  | 'dog'
  | 'pig';

type StemId =
  | 'jia'
  | 'yi'
  | 'bing'
  | 'ding'
  | 'wu'
  | 'ji'
  | 'geng'
  | 'xin'
  | 'ren'
  | 'gui';

const BRANCH_IDS: BranchId[] = [
  'rat',
  'ox',
  'tiger',
  'rabbit',
  'dragon',
  'snake',
  'horse',
  'goat',
  'monkey',
  'rooster',
  'dog',
  'pig',
];

const STEM_IDS: StemId[] = [
  'jia',
  'yi',
  'bing',
  'ding',
  'wu',
  'ji',
  'geng',
  'xin',
  'ren',
  'gui',
];

const BRANCH_ALIASES: Record<
  BranchId,
  string[]
> = {
  rat: [
    'rat',
    'mouse',
    'tý',
    '子',
    '鼠',
    '자',
    '쥐',
    'ねずみ',
  ],
  ox: [
    'ox',
    'buffalo',
    'cow',
    'sửu',
    '丑',
    '牛',
    '축',
    '소',
    'うし',
  ],
  tiger: [
    'tiger',
    'dần',
    '寅',
    '虎',
    '인',
    '호랑이',
    'とら',
  ],
  rabbit: [
    'rabbit',
    'cat',
    'mão',
    '卯',
    '兔',
    '토끼',
    '묘',
    'うさぎ',
  ],
  dragon: [
    'dragon',
    'thìn',
    '辰',
    '龍',
    '龙',
    '진',
    '용',
    'たつ',
    'りゅう',
  ],
  snake: [
    'snake',
    'tỵ',
    '巳',
    '蛇',
    '사',
    '뱀',
    'へび',
  ],
  horse: [
    'horse',
    'ngọ',
    '午',
    '馬',
    '马',
    '오',
    '말',
    'うま',
  ],
  goat: [
    'goat',
    'sheep',
    'mùi',
    '未',
    '羊',
    '미',
    '양',
    'ひつじ',
  ],
  monkey: [
    'monkey',
    'thân',
    '申',
    '猴',
    '신',
    '원숭이',
    'さる',
  ],
  rooster: [
    'rooster',
    'chicken',
    'dậu',
    '酉',
    '雞',
    '鸡',
    '유',
    '닭',
    'とり',
  ],
  dog: [
    'dog',
    'tuất',
    '戌',
    '犬',
    '狗',
    '술',
    '개',
    'いぬ',
  ],
  pig: [
    'pig',
    'boar',
    'hợi',
    '亥',
    '豬',
    '猪',
    '해',
    '돼지',
    'いのしし',
  ],
};

const STEM_ALIASES: Record<
  StemId,
  string[]
> = {
  jia: ['jia', 'giáp', '甲', '갑'],
  yi: ['yi', 'ất', '乙', '을'],
  bing: ['bing', 'bính', '丙', '병'],
  ding: ['ding', 'đinh', '丁', '정'],
  wu: ['wu', 'mậu', '戊', '무'],
  ji: ['ji', 'kỷ', '己', '기'],
  geng: ['geng', 'canh', '庚', '경'],
  xin: ['xin', 'tân', '辛', '신'],
  ren: ['ren', 'nhâm', '壬', '임'],
  gui: ['gui', 'quý', '癸', '계'],
};

const ZODIAC_LABELS: Record<
  HoroscopeLanguage,
  Record<BranchId, string>
> = {
  vi: {
    rat: 'Tý (Chuột)',
    ox: 'Sửu (Trâu)',
    tiger: 'Dần (Hổ)',
    rabbit: 'Mão (Mèo)',
    dragon: 'Thìn (Rồng)',
    snake: 'Tỵ (Rắn)',
    horse: 'Ngọ (Ngựa)',
    goat: 'Mùi (Dê)',
    monkey: 'Thân (Khỉ)',
    rooster: 'Dậu (Gà)',
    dog: 'Tuất (Chó)',
    pig: 'Hợi (Lợn)',
  },
  en: {
    rat: 'Rat',
    ox: 'Ox',
    tiger: 'Tiger',
    rabbit: 'Rabbit',
    dragon: 'Dragon',
    snake: 'Snake',
    horse: 'Horse',
    goat: 'Goat',
    monkey: 'Monkey',
    rooster: 'Rooster',
    dog: 'Dog',
    pig: 'Pig',
  },
  zh: {
    rat: '鼠',
    ox: '牛',
    tiger: '虎',
    rabbit: '兔',
    dragon: '龙',
    snake: '蛇',
    horse: '马',
    goat: '羊',
    monkey: '猴',
    rooster: '鸡',
    dog: '狗',
    pig: '猪',
  },
  ko: {
    rat: '쥐띠',
    ox: '소띠',
    tiger: '호랑이띠',
    rabbit: '토끼띠',
    dragon: '용띠',
    snake: '뱀띠',
    horse: '말띠',
    goat: '양띠',
    monkey: '원숭이띠',
    rooster: '닭띠',
    dog: '개띠',
    pig: '돼지띠',
  },
  ja: {
    rat: '子（ねずみ）',
    ox: '丑（うし）',
    tiger: '寅（とら）',
    rabbit: '卯（うさぎ）',
    dragon: '辰（たつ）',
    snake: '巳（へび）',
    horse: '午（うま）',
    goat: '未（ひつじ）',
    monkey: '申（さる）',
    rooster: '酉（とり）',
    dog: '戌（いぬ）',
    pig: '亥（いのしし）',
  },
};

const HOUR_BRANCH_LABELS: Record<
  HoroscopeLanguage,
  Record<BranchId, string>
> = {
  vi: {
    rat: 'Giờ Tý',
    ox: 'Giờ Sửu',
    tiger: 'Giờ Dần',
    rabbit: 'Giờ Mão',
    dragon: 'Giờ Thìn',
    snake: 'Giờ Tỵ',
    horse: 'Giờ Ngọ',
    goat: 'Giờ Mùi',
    monkey: 'Giờ Thân',
    rooster: 'Giờ Dậu',
    dog: 'Giờ Tuất',
    pig: 'Giờ Hợi',
  },
  en: {
    rat: 'Rat hour',
    ox: 'Ox hour',
    tiger: 'Tiger hour',
    rabbit: 'Rabbit hour',
    dragon: 'Dragon hour',
    snake: 'Snake hour',
    horse: 'Horse hour',
    goat: 'Goat hour',
    monkey: 'Monkey hour',
    rooster: 'Rooster hour',
    dog: 'Dog hour',
    pig: 'Pig hour',
  },
  zh: {
    rat: '子时',
    ox: '丑时',
    tiger: '寅时',
    rabbit: '卯时',
    dragon: '辰时',
    snake: '巳时',
    horse: '午时',
    goat: '未时',
    monkey: '申时',
    rooster: '酉时',
    dog: '戌时',
    pig: '亥时',
  },
  ko: {
    rat: '자시',
    ox: '축시',
    tiger: '인시',
    rabbit: '묘시',
    dragon: '진시',
    snake: '사시',
    horse: '오시',
    goat: '미시',
    monkey: '신시',
    rooster: '유시',
    dog: '술시',
    pig: '해시',
  },
  ja: {
    rat: '子時',
    ox: '丑時',
    tiger: '寅時',
    rabbit: '卯時',
    dragon: '辰時',
    snake: '巳時',
    horse: '午時',
    goat: '未時',
    monkey: '申時',
    rooster: '酉時',
    dog: '戌時',
    pig: '亥時',
  },
};

const STEM_LABELS: Record<
  HoroscopeLanguage,
  Record<StemId, string>
> = {
  vi: {
    jia: 'Giáp',
    yi: 'Ất',
    bing: 'Bính',
    ding: 'Đinh',
    wu: 'Mậu',
    ji: 'Kỷ',
    geng: 'Canh',
    xin: 'Tân',
    ren: 'Nhâm',
    gui: 'Quý',
  },
  en: {
    jia: 'Jia',
    yi: 'Yi',
    bing: 'Bing',
    ding: 'Ding',
    wu: 'Wu',
    ji: 'Ji',
    geng: 'Geng',
    xin: 'Xin',
    ren: 'Ren',
    gui: 'Gui',
  },
  zh: {
    jia: '甲',
    yi: '乙',
    bing: '丙',
    ding: '丁',
    wu: '戊',
    ji: '己',
    geng: '庚',
    xin: '辛',
    ren: '壬',
    gui: '癸',
  },
  ko: {
    jia: '갑',
    yi: '을',
    bing: '병',
    ding: '정',
    wu: '무',
    ji: '기',
    geng: '경',
    xin: '신',
    ren: '임',
    gui: '계',
  },
  ja: {
    jia: '甲',
    yi: '乙',
    bing: '丙',
    ding: '丁',
    wu: '戊',
    ji: '己',
    geng: '庚',
    xin: '辛',
    ren: '壬',
    gui: '癸',
  },
};

const BRANCH_CAN_CHI_LABELS: Record<
  HoroscopeLanguage,
  Record<BranchId, string>
> = {
  vi: {
    rat: 'Tý',
    ox: 'Sửu',
    tiger: 'Dần',
    rabbit: 'Mão',
    dragon: 'Thìn',
    snake: 'Tỵ',
    horse: 'Ngọ',
    goat: 'Mùi',
    monkey: 'Thân',
    rooster: 'Dậu',
    dog: 'Tuất',
    pig: 'Hợi',
  },
  en: {
    rat: 'Zi',
    ox: 'Chou',
    tiger: 'Yin',
    rabbit: 'Mao',
    dragon: 'Chen',
    snake: 'Si',
    horse: 'Wu',
    goat: 'Wei',
    monkey: 'Shen',
    rooster: 'You',
    dog: 'Xu',
    pig: 'Hai',
  },
  zh: {
    rat: '子',
    ox: '丑',
    tiger: '寅',
    rabbit: '卯',
    dragon: '辰',
    snake: '巳',
    horse: '午',
    goat: '未',
    monkey: '申',
    rooster: '酉',
    dog: '戌',
    pig: '亥',
  },
  ko: {
    rat: '자',
    ox: '축',
    tiger: '인',
    rabbit: '묘',
    dragon: '진',
    snake: '사',
    horse: '오',
    goat: '미',
    monkey: '신',
    rooster: '유',
    dog: '술',
    pig: '해',
  },
  ja: {
    rat: '子',
    ox: '丑',
    tiger: '寅',
    rabbit: '卯',
    dragon: '辰',
    snake: '巳',
    horse: '午',
    goat: '未',
    monkey: '申',
    rooster: '酉',
    dog: '戌',
    pig: '亥',
  },
};

export function normalizeHoroscopeLanguage(
  language?: string,
): HoroscopeLanguage {
  const normalized = (
    language ?? 'en'
  ).toLowerCase();

  if (normalized.startsWith('vi')) {
    return 'vi';
  }

  if (normalized.startsWith('zh')) {
    return 'zh';
  }

  if (normalized.startsWith('ko')) {
    return 'ko';
  }

  if (normalized.startsWith('ja')) {
    return 'ja';
  }

  return 'en';
}

function cleanValue(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(
      /\b(hour|hours)\b/gi,
      '',
    )
    .replace(/giờ/gi, '')
    .replace(/[时時]/g, '')
    .replace(/시$/g, '')
    .replace(/[()（）]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findBranchId(
  value: string,
): BranchId | null {
  const cleaned = cleanValue(value);

  for (const id of BRANCH_IDS) {
    if (
      BRANCH_ALIASES[id].some(
        alias =>
          cleanValue(alias) === cleaned,
      )
    ) {
      return id;
    }
  }

  return null;
}

function findStemId(
  value: string,
): StemId | null {
  const cleaned = cleanValue(value);

  for (const id of STEM_IDS) {
    if (
      STEM_ALIASES[id].some(
        alias =>
          cleanValue(alias) === cleaned,
      )
    ) {
      return id;
    }
  }

  return null;
}

export function localizeZodiac(
  value: string,
  language?: string,
): string {
  const id = findBranchId(value);

  if (!id) {
    return value;
  }

  const locale =
    normalizeHoroscopeLanguage(language);

  return ZODIAC_LABELS[locale][id];
}

export function localizeBirthHourBranch(
  value: string,
  language?: string,
): string {
  const id = findBranchId(value);

  if (!id) {
    return value;
  }

  const locale =
    normalizeHoroscopeLanguage(language);

  return HOUR_BRANCH_LABELS[locale][id];
}

export function localizeCanChi(
  value: string,
  language?: string,
): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return value;
  }

  const locale =
    normalizeHoroscopeLanguage(language);

  /*
   * Common engine output:
   * "Bính Tý", "Bing Zi", "丙子", "병자".
   */
  const separatedParts = trimmed
    .replace(/[-–—/]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  let stemId: StemId | null = null;
  let branchId: BranchId | null = null;

  if (separatedParts.length >= 2) {
    stemId = findStemId(
      separatedParts[0],
    );

    branchId = findBranchId(
      separatedParts[1],
    );
  }

  /*
   * Handle compact forms such as 丙子 and 병자.
   */
  if (!stemId || !branchId) {
    const characters = Array.from(
      trimmed.replace(/\s+/g, ''),
    );

    if (characters.length >= 2) {
      stemId =
        stemId ??
        findStemId(characters[0]);

      branchId =
        branchId ??
        findBranchId(characters[1]);
    }
  }

  if (!stemId || !branchId) {
    return value;
  }

  const stem =
    STEM_LABELS[locale][stemId];

  const branch =
    BRANCH_CAN_CHI_LABELS[locale][
      branchId
    ];

  /*
   * Vietnamese and English conventionally use a space.
   * Chinese, Korean, and Japanese write the pair together.
   */
  if (
    locale === 'vi' ||
    locale === 'en'
  ) {
    return `${stem} ${branch}`;
  }

  return `${stem}${branch}`;
}
