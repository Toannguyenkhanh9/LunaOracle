export type BaziLanguage =
  | 'vi'
  | 'en'
  | 'zh'
  | 'ko'
  | 'ja';

export function normalizeBaziLanguage(
  language?: string,
): BaziLanguage {
  const value =
    language?.toLowerCase() ?? 'en';

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

const STEM_KO: Record<string, string> = {
  甲: '갑',
  乙: '을',
  丙: '병',
  丁: '정',
  戊: '무',
  己: '기',
  庚: '경',
  辛: '신',
  壬: '임',
  癸: '계',
};

const BRANCH_KO: Record<string, string> = {
  子: '자',
  丑: '축',
  寅: '인',
  卯: '묘',
  辰: '진',
  巳: '사',
  午: '오',
  未: '미',
  申: '신',
  酉: '유',
  戌: '술',
  亥: '해',
};

const STEM_JA: Record<string, string> = {
  甲: 'きのえ',
  乙: 'きのと',
  丙: 'ひのえ',
  丁: 'ひのと',
  戊: 'つちのえ',
  己: 'つちのと',
  庚: 'かのえ',
  辛: 'かのと',
  壬: 'みずのえ',
  癸: 'みずのと',
};

const BRANCH_JA: Record<string, string> = {
  子: 'ね',
  丑: 'うし',
  寅: 'とら',
  卯: 'う',
  辰: 'たつ',
  巳: 'み',
  午: 'うま',
  未: 'ひつじ',
  申: 'さる',
  酉: 'とり',
  戌: 'いぬ',
  亥: 'い',
};

type LocalizedBaziTerm = {
  vi: string;
  en: string;
  han: string;
};

export function localizeStem(
  stem: LocalizedBaziTerm,
  language?: string,
): string {
  const normalized =
    normalizeBaziLanguage(language);

  switch (normalized) {
    case 'vi':
      return stem.vi;

    case 'zh':
      return stem.han;

    case 'ko':
      return STEM_KO[stem.han] ?? stem.han;

    case 'ja':
      return STEM_JA[stem.han] ?? stem.han;

    default:
      return stem.en;
  }
}

export function localizeBranch(
  branch: LocalizedBaziTerm,
  language?: string,
): string {
  const normalized =
    normalizeBaziLanguage(language);

  switch (normalized) {
    case 'vi':
      return branch.vi;

    case 'zh':
      return branch.han;

    case 'ko':
      return BRANCH_KO[branch.han] ?? branch.han;

    case 'ja':
      return BRANCH_JA[branch.han] ?? branch.han;

    default:
      return branch.en;
  }
}

export function formatLocalizedPillar(
  pillar: {
    stem: LocalizedBaziTerm;
    branch: LocalizedBaziTerm;
  },
  language?: string,
): string {
  const normalized =
    normalizeBaziLanguage(language);

  const stem = localizeStem(
    pillar.stem,
    normalized,
  );

  const branch = localizeBranch(
    pillar.branch,
    normalized,
  );

  if (normalized === 'zh') {
    return `${stem}${branch}`;
  }

  if (normalized === 'ko') {
    return `${stem}${branch}`;
  }

  if (normalized === 'ja') {
    return `${pillar.stem.han}${pillar.branch.han} (${stem}${branch})`;
  }

  return `${stem} ${branch}`;
}