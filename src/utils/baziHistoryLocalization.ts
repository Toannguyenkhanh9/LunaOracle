export type BaziHistoryLanguage =
  | 'vi'
  | 'en'
  | 'zh'
  | 'ko'
  | 'ja';

type LocalizedPlace = Record<
  BaziHistoryLanguage,
  string
>;

const PLACE_ALIASES: Array<{
  aliases: string[];
  labels: LocalizedPlace;
}> = [
  {
    aliases: [
      'tp. hồ chí minh',
      'tp hồ chí minh',
      'thành phố hồ chí minh',
      'ho chi minh city',
      'ho chi minh',
      'hồ chí minh',
      'hcmc',
      'sài gòn',
      'saigon',
      'asia/ho_chi_minh',
    ],
    labels: {
      vi: 'TP. Hồ Chí Minh',
      en: 'Ho Chi Minh City',
      zh: '胡志明市',
      ko: '호찌민시',
      ja: 'ホーチミン市',
    },
  },
  {
    aliases: [
      'hà nội',
      'ha noi',
      'hanoi',
      'thành phố hà nội',
    ],
    labels: {
      vi: 'Hà Nội',
      en: 'Hanoi',
      zh: '河内',
      ko: '하노이',
      ja: 'ハノイ',
    },
  },
  {
    aliases: [
      'đà nẵng',
      'da nang',
      'danang',
      'thành phố đà nẵng',
    ],
    labels: {
      vi: 'Đà Nẵng',
      en: 'Da Nang',
      zh: '岘港',
      ko: '다낭',
      ja: 'ダナン',
    },
  },
  {
    aliases: [
      'cần thơ',
      'can tho',
      'thành phố cần thơ',
    ],
    labels: {
      vi: 'Cần Thơ',
      en: 'Can Tho',
      zh: '芹苴',
      ko: '껀터',
      ja: 'カントー',
    },
  },
  {
    aliases: [
      'hải phòng',
      'hai phong',
      'haiphong',
      'thành phố hải phòng',
    ],
    labels: {
      vi: 'Hải Phòng',
      en: 'Hai Phong',
      zh: '海防',
      ko: '하이퐁',
      ja: 'ハイフォン',
    },
  },
  {
    aliases: [
      'huế',
      'hue',
      'thừa thiên huế',
      'thua thien hue',
    ],
    labels: {
      vi: 'Huế',
      en: 'Hue',
      zh: '顺化',
      ko: '후에',
      ja: 'フエ',
    },
  },
];

function normalizeLanguage(
  language?: string,
): BaziHistoryLanguage {
  const value = (
    language ?? 'en'
  ).toLowerCase();

  if (value.startsWith('vi')) {
    return 'vi';
  }

  if (value.startsWith('zh')) {
    return 'zh';
  }

  if (value.startsWith('ko')) {
    return 'ko';
  }

  if (value.startsWith('ja')) {
    return 'ja';
  }

  return 'en';
}

function normalizePlace(
  value: string,
): string {
  return value
    .trim()
    .toLocaleLowerCase()
    .replace(/[.,]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Translates only known place names.
 *
 * Unknown user-entered locations are returned unchanged so the app
 * never invents an incorrect translation.
 */
export function localizeBaziPlaceName(
  value: string,
  language?: string,
): string {
  if (!value.trim()) {
    return value;
  }

  const normalized =
    normalizePlace(value);

  const match = PLACE_ALIASES.find(
    item =>
      item.aliases.some(
        alias =>
          normalizePlace(alias) ===
          normalized,
      ),
  );

  if (!match) {
    return value;
  }

  return match.labels[
    normalizeLanguage(language)
  ];
}
