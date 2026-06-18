import type {
  EarthlyBranchId,
  FiveElement,
  HeavenlyStemId,
  YinYang,
  ZiweiPalaceId,
} from './types';

export type HeavenlyStemDefinition = {
  id: HeavenlyStemId;
  han: string;
  polarity: YinYang;
  element: FiveElement;
};

export type EarthlyBranchDefinition = {
  id: EarthlyBranchId;
  han: string;
};

export const HEAVENLY_STEMS: HeavenlyStemDefinition[] = [
  {id: 'jia', han: '甲', polarity: 'yang', element: 'wood'},
  {id: 'yi', han: '乙', polarity: 'yin', element: 'wood'},
  {id: 'bing', han: '丙', polarity: 'yang', element: 'fire'},
  {id: 'ding', han: '丁', polarity: 'yin', element: 'fire'},
  {id: 'wu', han: '戊', polarity: 'yang', element: 'earth'},
  {id: 'ji', han: '己', polarity: 'yin', element: 'earth'},
  {id: 'geng', han: '庚', polarity: 'yang', element: 'metal'},
  {id: 'xin', han: '辛', polarity: 'yin', element: 'metal'},
  {id: 'ren', han: '壬', polarity: 'yang', element: 'water'},
  {id: 'gui', han: '癸', polarity: 'yin', element: 'water'},
];

export const EARTHLY_BRANCHES: EarthlyBranchDefinition[] = [
  {id: 'zi', han: '子'},
  {id: 'chou', han: '丑'},
  {id: 'yin', han: '寅'},
  {id: 'mao', han: '卯'},
  {id: 'chen', han: '辰'},
  {id: 'si', han: '巳'},
  {id: 'wu', han: '午'},
  {id: 'wei', han: '未'},
  {id: 'shen', han: '申'},
  {id: 'you', han: '酉'},
  {id: 'xu', han: '戌'},
  {id: 'hai', han: '亥'},
];

export const PALACE_ORDER: ZiweiPalaceId[] = [
  'life',
  'parents',
  'fortune',
  'property',
  'career',
  'friends',
  'travel',
  'health',
  'wealth',
  'children',
  'spouse',
  'siblings',
];

export const STEM_INDEX_BY_HAN: Record<string, number> = Object.fromEntries(
  HEAVENLY_STEMS.map((item, index) => [item.han, index]),
);

export const BRANCH_INDEX_BY_HAN: Record<string, number> = Object.fromEntries(
  EARTHLY_BRANCHES.map((item, index) => [item.han, index]),
);

// Ngũ Hổ Độn: heavenly stem assigned to the Tiger palace from the birth-year stem.
export const TIGER_STEM_INDEX_BY_YEAR_STEM_INDEX = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];

// Na Yin element for each consecutive pair in the 60 Jia-Zi cycle.
const NAYIN_PAIR_ELEMENTS: FiveElement[] = [
  'metal', 'fire', 'wood', 'earth', 'metal',
  'fire', 'water', 'earth', 'metal', 'wood',
  'water', 'earth', 'fire', 'wood', 'water',
  'metal', 'fire', 'wood', 'earth', 'metal',
  'fire', 'water', 'earth', 'fire', 'wood',
  'water', 'earth', 'fire', 'wood', 'water',
];

export const NAYIN_ELEMENT_BY_JIAZI_INDEX: FiveElement[] =
  NAYIN_PAIR_ELEMENTS.flatMap(element => [element, element]);

export const BUREAU_NUMBER_BY_ELEMENT: Record<FiveElement, 2 | 3 | 4 | 5 | 6> = {
  water: 2,
  wood: 3,
  metal: 4,
  earth: 5,
  fire: 6,
};
