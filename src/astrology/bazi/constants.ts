import type {
  BranchDefinition,
  BranchId,
  Element,
  StemDefinition,
  StemId,
  TenGod,
} from './types';

export const ELEMENTS: Element[] = [
  'wood',
  'fire',
  'earth',
  'metal',
  'water',
];

export const STEMS: StemDefinition[] = [
  {id: 'jia', index: 0, han: '甲', vi: 'Giáp', en: 'Jia', element: 'wood', polarity: 'yang'},
  {id: 'yi', index: 1, han: '乙', vi: 'Ất', en: 'Yi', element: 'wood', polarity: 'yin'},
  {id: 'bing', index: 2, han: '丙', vi: 'Bính', en: 'Bing', element: 'fire', polarity: 'yang'},
  {id: 'ding', index: 3, han: '丁', vi: 'Đinh', en: 'Ding', element: 'fire', polarity: 'yin'},
  {id: 'wu', index: 4, han: '戊', vi: 'Mậu', en: 'Wu', element: 'earth', polarity: 'yang'},
  {id: 'ji', index: 5, han: '己', vi: 'Kỷ', en: 'Ji', element: 'earth', polarity: 'yin'},
  {id: 'geng', index: 6, han: '庚', vi: 'Canh', en: 'Geng', element: 'metal', polarity: 'yang'},
  {id: 'xin', index: 7, han: '辛', vi: 'Tân', en: 'Xin', element: 'metal', polarity: 'yin'},
  {id: 'ren', index: 8, han: '壬', vi: 'Nhâm', en: 'Ren', element: 'water', polarity: 'yang'},
  {id: 'gui', index: 9, han: '癸', vi: 'Quý', en: 'Gui', element: 'water', polarity: 'yin'},
];

export const BRANCHES: BranchDefinition[] = [
  {
    id: 'zi', index: 0, han: '子', vi: 'Tý', en: 'Zi', primaryElement: 'water', polarity: 'yang',
    hiddenStems: [{stemId: 'gui', weight: 1, role: 'main'}],
  },
  {
    id: 'chou', index: 1, han: '丑', vi: 'Sửu', en: 'Chou', primaryElement: 'earth', polarity: 'yin',
    hiddenStems: [
      {stemId: 'ji', weight: 0.6, role: 'main'},
      {stemId: 'gui', weight: 0.3, role: 'middle'},
      {stemId: 'xin', weight: 0.1, role: 'residual'},
    ],
  },
  {
    id: 'yin', index: 2, han: '寅', vi: 'Dần', en: 'Yin', primaryElement: 'wood', polarity: 'yang',
    hiddenStems: [
      {stemId: 'jia', weight: 0.6, role: 'main'},
      {stemId: 'bing', weight: 0.3, role: 'middle'},
      {stemId: 'wu', weight: 0.1, role: 'residual'},
    ],
  },
  {
    id: 'mao', index: 3, han: '卯', vi: 'Mão', en: 'Mao', primaryElement: 'wood', polarity: 'yin',
    hiddenStems: [{stemId: 'yi', weight: 1, role: 'main'}],
  },
  {
    id: 'chen', index: 4, han: '辰', vi: 'Thìn', en: 'Chen', primaryElement: 'earth', polarity: 'yang',
    hiddenStems: [
      {stemId: 'wu', weight: 0.6, role: 'main'},
      {stemId: 'yi', weight: 0.3, role: 'middle'},
      {stemId: 'gui', weight: 0.1, role: 'residual'},
    ],
  },
  {
    id: 'si', index: 5, han: '巳', vi: 'Tỵ', en: 'Si', primaryElement: 'fire', polarity: 'yin',
    hiddenStems: [
      {stemId: 'bing', weight: 0.6, role: 'main'},
      {stemId: 'wu', weight: 0.3, role: 'middle'},
      {stemId: 'geng', weight: 0.1, role: 'residual'},
    ],
  },
  {
    id: 'wu', index: 6, han: '午', vi: 'Ngọ', en: 'Wu', primaryElement: 'fire', polarity: 'yang',
    hiddenStems: [
      {stemId: 'ding', weight: 0.7, role: 'main'},
      {stemId: 'ji', weight: 0.3, role: 'middle'},
    ],
  },
  {
    id: 'wei', index: 7, han: '未', vi: 'Mùi', en: 'Wei', primaryElement: 'earth', polarity: 'yin',
    hiddenStems: [
      {stemId: 'ji', weight: 0.6, role: 'main'},
      {stemId: 'ding', weight: 0.3, role: 'middle'},
      {stemId: 'yi', weight: 0.1, role: 'residual'},
    ],
  },
  {
    id: 'shen', index: 8, han: '申', vi: 'Thân', en: 'Shen', primaryElement: 'metal', polarity: 'yang',
    hiddenStems: [
      {stemId: 'geng', weight: 0.6, role: 'main'},
      {stemId: 'ren', weight: 0.3, role: 'middle'},
      {stemId: 'wu', weight: 0.1, role: 'residual'},
    ],
  },
  {
    id: 'you', index: 9, han: '酉', vi: 'Dậu', en: 'You', primaryElement: 'metal', polarity: 'yin',
    hiddenStems: [{stemId: 'xin', weight: 1, role: 'main'}],
  },
  {
    id: 'xu', index: 10, han: '戌', vi: 'Tuất', en: 'Xu', primaryElement: 'earth', polarity: 'yang',
    hiddenStems: [
      {stemId: 'wu', weight: 0.6, role: 'main'},
      {stemId: 'xin', weight: 0.3, role: 'middle'},
      {stemId: 'ding', weight: 0.1, role: 'residual'},
    ],
  },
  {
    id: 'hai', index: 11, han: '亥', vi: 'Hợi', en: 'Hai', primaryElement: 'water', polarity: 'yin',
    hiddenStems: [
      {stemId: 'ren', weight: 0.7, role: 'main'},
      {stemId: 'jia', weight: 0.3, role: 'middle'},
    ],
  },
];

export const STEM_BY_ID = Object.fromEntries(
  STEMS.map(item => [item.id, item]),
) as Record<StemId, StemDefinition>;

export const BRANCH_BY_ID = Object.fromEntries(
  BRANCHES.map(item => [item.id, item]),
) as Record<BranchId, BranchDefinition>;

export const STEM_INDEX_BY_HAN = Object.fromEntries(
  STEMS.map(item => [item.han, item.index]),
) as Record<string, number>;

export const BRANCH_INDEX_BY_HAN = Object.fromEntries(
  BRANCHES.map(item => [item.han, item.index]),
) as Record<string, number>;

export const EMPTY_TEN_GOD_DISTRIBUTION = (): Record<TenGod, number> => ({
  friend: 0,
  robWealth: 0,
  eatingGod: 0,
  hurtingOfficer: 0,
  indirectWealth: 0,
  directWealth: 0,
  sevenKillings: 0,
  directOfficer: 0,
  indirectResource: 0,
  directResource: 0,
});

export const GENERATES: Record<Element, Element> = {
  wood: 'fire',
  fire: 'earth',
  earth: 'metal',
  metal: 'water',
  water: 'wood',
};

export const CONTROLS: Record<Element, Element> = {
  wood: 'earth',
  fire: 'metal',
  earth: 'water',
  metal: 'wood',
  water: 'fire',
};

export const GENERATED_BY: Record<Element, Element> = {
  wood: 'water',
  fire: 'wood',
  earth: 'fire',
  metal: 'earth',
  water: 'metal',
};

export const CONTROLLED_BY: Record<Element, Element> = {
  wood: 'metal',
  fire: 'water',
  earth: 'wood',
  metal: 'fire',
  water: 'earth',
};

export const SIX_HARMONY_PAIRS: Array<[BranchId, BranchId, Element]> = [
  ['zi', 'chou', 'earth'],
  ['yin', 'hai', 'wood'],
  ['mao', 'xu', 'fire'],
  ['chen', 'you', 'metal'],
  ['si', 'shen', 'water'],
  ['wu', 'wei', 'fire'],
];

export const SIX_CLASH_PAIRS: Array<[BranchId, BranchId]> = [
  ['zi', 'wu'],
  ['chou', 'wei'],
  ['yin', 'shen'],
  ['mao', 'you'],
  ['chen', 'xu'],
  ['si', 'hai'],
];

export const HARM_PAIRS: Array<[BranchId, BranchId]> = [
  ['zi', 'wei'],
  ['chou', 'wu'],
  ['yin', 'si'],
  ['mao', 'chen'],
  ['shen', 'hai'],
  ['you', 'xu'],
];

export const BREAK_PAIRS: Array<[BranchId, BranchId]> = [
  ['zi', 'you'],
  ['chou', 'chen'],
  ['yin', 'hai'],
  ['mao', 'wu'],
  ['si', 'shen'],
  ['wei', 'xu'],
];

export const STEM_COMBINATIONS: Array<[StemId, StemId, Element]> = [
  ['jia', 'ji', 'earth'],
  ['yi', 'geng', 'metal'],
  ['bing', 'xin', 'water'],
  ['ding', 'ren', 'wood'],
  ['wu', 'gui', 'fire'],
];

export const STEM_CLASHES: Array<[StemId, StemId]> = [
  ['jia', 'geng'],
  ['yi', 'xin'],
  ['bing', 'ren'],
  ['ding', 'gui'],
];

export const THREE_HARMONY_GROUPS: Array<{branches: [BranchId, BranchId, BranchId]; element: Element}> = [
  {branches: ['shen', 'zi', 'chen'], element: 'water'},
  {branches: ['hai', 'mao', 'wei'], element: 'wood'},
  {branches: ['yin', 'wu', 'xu'], element: 'fire'},
  {branches: ['si', 'you', 'chou'], element: 'metal'},
];

export const THREE_MEETING_GROUPS: Array<{branches: [BranchId, BranchId, BranchId]; element: Element}> = [
  {branches: ['yin', 'mao', 'chen'], element: 'wood'},
  {branches: ['si', 'wu', 'wei'], element: 'fire'},
  {branches: ['shen', 'you', 'xu'], element: 'metal'},
  {branches: ['hai', 'zi', 'chou'], element: 'water'},
];

export const PUNISHMENT_GROUPS: Array<[BranchId, BranchId, BranchId]> = [
  ['yin', 'si', 'shen'],
  ['chou', 'wei', 'xu'],
];

export const MUTUAL_PUNISHMENT_PAIR: [BranchId, BranchId] = ['zi', 'mao'];
export const SELF_PUNISHMENT_BRANCHES: BranchId[] = ['chen', 'wu', 'you', 'hai'];

export const MONTH_ELEMENT_MULTIPLIERS: Array<Record<Element, number>> = [
  {wood: 1.0, fire: 0.4, earth: 0.5, metal: 0.8, water: 1.8},
  {wood: 0.6, fire: 0.6, earth: 1.5, metal: 0.9, water: 1.2},
  {wood: 1.6, fire: 1.15, earth: 0.8, metal: 0.6, water: 0.9},
  {wood: 1.8, fire: 1.1, earth: 0.7, metal: 0.5, water: 0.8},
  {wood: 1.2, fire: 0.9, earth: 1.5, metal: 0.8, water: 0.8},
  {wood: 1.0, fire: 1.6, earth: 1.1, metal: 0.7, water: 0.5},
  {wood: 0.8, fire: 1.8, earth: 1.2, metal: 0.6, water: 0.4},
  {wood: 0.8, fire: 1.2, earth: 1.5, metal: 0.8, water: 0.6},
  {wood: 0.5, fire: 0.6, earth: 1.0, metal: 1.6, water: 1.1},
  {wood: 0.4, fire: 0.5, earth: 0.9, metal: 1.8, water: 1.0},
  {wood: 0.6, fire: 0.8, earth: 1.5, metal: 1.2, water: 0.7},
  {wood: 1.1, fire: 0.5, earth: 0.6, metal: 0.9, water: 1.6},
];

export const DEFAULT_OPTIONS = {
  timeCorrection: 'civil' as const,
  dayBoundary: 'ziHour' as const,
  luckSect: 1 as const,
  luckPillarCount: 8,
  includeAnnualTransits: true,
  annualTransitYears: 12,
};
