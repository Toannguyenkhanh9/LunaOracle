import type {Pillar} from '../astrology/bazi';

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

export function normalizeStage4Language(
  language?: string,
): 'vi' | 'en' | 'zh' | 'ko' | 'ja' {
  const value = language?.toLowerCase() ?? 'en';

  if (value.startsWith('vi')) return 'vi';
  if (value.startsWith('zh')) return 'zh';
  if (value.startsWith('ko')) return 'ko';
  if (value.startsWith('ja')) return 'ja';
  return 'en';
}

export function formatStage4Pillar(
  pillar: Pillar,
  language?: string,
): string {
  const normalized = normalizeStage4Language(language);

  if (normalized === 'vi') {
    return `${pillar.stem.vi} ${pillar.branch.vi}`;
  }

  if (normalized === 'en') {
    return `${pillar.stem.en} ${pillar.branch.en}`;
  }

  if (normalized === 'ko') {
    return `${STEM_KO[pillar.stem.han] ?? pillar.stem.han}${
      BRANCH_KO[pillar.branch.han] ?? pillar.branch.han
    }`;
  }

  if (normalized === 'ja') {
    const stem = STEM_JA[pillar.stem.han] ?? pillar.stem.han;
    const branch = BRANCH_JA[pillar.branch.han] ?? pillar.branch.han;
    return `${pillar.stem.han}${pillar.branch.han} (${stem}${branch})`;
  }

  return `${pillar.stem.han}${pillar.branch.han}`;
}
