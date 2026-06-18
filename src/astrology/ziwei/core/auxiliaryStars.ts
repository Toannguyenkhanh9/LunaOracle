import {EARTHLY_BRANCHES, PALACE_ORDER} from '../constants';
import type {
  EarthlyBranchId,
  HeavenlyStemId,
  ZiweiAuxiliaryStarCategory,
  ZiweiAuxiliaryStarId,
  ZiweiAuxiliaryStarPlacement,
  ZiweiAuxiliaryStarSource,
  ZiweiAuxiliaryStarsByPalace,
  ZiweiAuxiliaryStarSummary,
  ZiweiAuxiliaryStarTone,
  ZiweiPalace,
} from '../types';
import {positiveModulo} from './math';

type StarDefinition = {
  id: ZiweiAuxiliaryStarId;
  category: ZiweiAuxiliaryStarCategory;
  tone: ZiweiAuxiliaryStarTone;
  source: ZiweiAuxiliaryStarSource;
  branchIndex: number;
  ruleCode: string;
};

const BRANCH_INDEX: Record<EarthlyBranchId, number> = Object.fromEntries(
  EARTHLY_BRANCHES.map((item, index) => [item.id, index]),
) as Record<EarthlyBranchId, number>;

const LU_CUN_BY_STEM: Record<HeavenlyStemId, EarthlyBranchId> = {
  jia: 'yin',
  yi: 'mao',
  bing: 'si',
  ding: 'wu',
  wu: 'si',
  ji: 'wu',
  geng: 'shen',
  xin: 'you',
  ren: 'hai',
  gui: 'zi',
};

const KUI_YUE_BY_STEM: Record<
  HeavenlyStemId,
  {tianKui: EarthlyBranchId; tianYue: EarthlyBranchId}
> = {
  jia: {tianKui: 'chou', tianYue: 'wei'},
  yi: {tianKui: 'zi', tianYue: 'shen'},
  bing: {tianKui: 'hai', tianYue: 'you'},
  ding: {tianKui: 'hai', tianYue: 'you'},
  wu: {tianKui: 'chou', tianYue: 'wei'},
  ji: {tianKui: 'zi', tianYue: 'shen'},
  geng: {tianKui: 'chou', tianYue: 'wei'},
  xin: {tianKui: 'wu', tianYue: 'yin'},
  ren: {tianKui: 'mao', tianYue: 'si'},
  gui: {tianKui: 'mao', tianYue: 'si'},
};

type BranchGroup = 'water' | 'fire' | 'wood' | 'metal';

function getBranchGroup(branch: EarthlyBranchId): BranchGroup {
  if (['shen', 'zi', 'chen'].includes(branch)) return 'water';
  if (['yin', 'wu', 'xu'].includes(branch)) return 'fire';
  if (['hai', 'mao', 'wei'].includes(branch)) return 'wood';
  return 'metal';
}

const TIAN_MA_BY_GROUP: Record<BranchGroup, EarthlyBranchId> = {
  water: 'yin',
  fire: 'shen',
  wood: 'si',
  metal: 'hai',
};

const TAO_HUA_BY_GROUP: Record<BranchGroup, EarthlyBranchId> = {
  water: 'you',
  fire: 'mao',
  wood: 'zi',
  metal: 'wu',
};

const FIRE_START_BY_GROUP: Record<BranchGroup, EarthlyBranchId> = {
  fire: 'chou',
  water: 'yin',
  metal: 'mao',
  wood: 'you',
};

const BELL_START_BY_GROUP: Record<BranchGroup, EarthlyBranchId> = {
  fire: 'mao',
  water: 'xu',
  metal: 'xu',
  wood: 'xu',
};

function solitaryBranches(
  yearBranch: EarthlyBranchId,
): {guChen: EarthlyBranchId; guaXiu: EarthlyBranchId} {
  if (['hai', 'zi', 'chou'].includes(yearBranch)) {
    return {guChen: 'yin', guaXiu: 'xu'};
  }
  if (['yin', 'mao', 'chen'].includes(yearBranch)) {
    return {guChen: 'si', guaXiu: 'chou'};
  }
  if (['si', 'wu', 'wei'].includes(yearBranch)) {
    return {guChen: 'shen', guaXiu: 'chen'};
  }
  return {guChen: 'hai', guaXiu: 'wei'};
}

function makeDefinition(
  id: ZiweiAuxiliaryStarId,
  category: ZiweiAuxiliaryStarCategory,
  tone: ZiweiAuxiliaryStarTone,
  source: ZiweiAuxiliaryStarSource,
  branchIndex: number,
  ruleCode: string,
): StarDefinition {
  return {
    id,
    category,
    tone,
    source,
    branchIndex: positiveModulo(branchIndex, 12),
    ruleCode,
  };
}

function palaceByBranchIndex(palaces: ZiweiPalace[]): Map<number, ZiweiPalace> {
  const map = new Map<number, ZiweiPalace>();
  for (const palace of palaces) map.set(palace.branchIndex, palace);
  return map;
}

function placementFromDefinition(
  definition: StarDefinition,
  palaceMap: Map<number, ZiweiPalace>,
): ZiweiAuxiliaryStarPlacement {
  const palace = palaceMap.get(definition.branchIndex);
  if (!palace) throw new Error('PALACE_NOT_FOUND_FOR_AUXILIARY_STAR');

  return {
    id: definition.id,
    category: definition.category,
    tone: definition.tone,
    source: definition.source,
    branchId: EARTHLY_BRANCHES[definition.branchIndex].id,
    branchIndex: definition.branchIndex,
    palaceId: palace.id,
    ruleCode: definition.ruleCode,
  };
}

export function calculateAuxiliaryStarDefinitions(
  lunarMonth: number,
  birthHourBranchIndex: number,
  yearStemId: HeavenlyStemId,
  yearBranchId: EarthlyBranchId,
): StarDefinition[] {
  if (!Number.isInteger(lunarMonth) || lunarMonth < 1 || lunarMonth > 12) {
    throw new Error('INVALID_LUNAR_MONTH_FOR_AUXILIARY_STARS');
  }
  if (
    !Number.isInteger(birthHourBranchIndex) ||
    birthHourBranchIndex < 0 ||
    birthHourBranchIndex > 11
  ) {
    throw new Error('INVALID_BIRTH_HOUR_FOR_AUXILIARY_STARS');
  }

  const monthOffset = lunarMonth - 1;
  const yearBranchIndex = BRANCH_INDEX[yearBranchId];
  const group = getBranchGroup(yearBranchId);

  const luCunIndex = BRANCH_INDEX[LU_CUN_BY_STEM[yearStemId]];
  const kuiYue = KUI_YUE_BY_STEM[yearStemId];
  const solitary = solitaryBranches(yearBranchId);

  const hongLuanIndex = positiveModulo(BRANCH_INDEX.mao - yearBranchIndex, 12);
  const tianXiIndex = positiveModulo(hongLuanIndex + 6, 12);

  const fireIndex = positiveModulo(
    BRANCH_INDEX[FIRE_START_BY_GROUP[group]] + birthHourBranchIndex,
    12,
  );
  const bellIndex = positiveModulo(
    BRANCH_INDEX[BELL_START_BY_GROUP[group]] - birthHourBranchIndex,
    12,
  );

  return [
    makeDefinition('zuoFu', 'assistant', 'supportive', 'lunarMonth', BRANCH_INDEX.chen + monthOffset, 'AUX_ZUO_FU_MONTH_FORWARD_FROM_CHEN'),
    makeDefinition('youBi', 'assistant', 'supportive', 'lunarMonth', BRANCH_INDEX.xu - monthOffset, 'AUX_YOU_BI_MONTH_REVERSE_FROM_XU'),

    makeDefinition('wenChang', 'literary', 'supportive', 'birthHour', BRANCH_INDEX.xu - birthHourBranchIndex, 'AUX_WEN_CHANG_HOUR_REVERSE_FROM_XU'),
    makeDefinition('wenQu', 'literary', 'supportive', 'birthHour', BRANCH_INDEX.chen + birthHourBranchIndex, 'AUX_WEN_QU_HOUR_FORWARD_FROM_CHEN'),

    makeDefinition('tianKui', 'noble', 'supportive', 'yearStem', BRANCH_INDEX[kuiYue.tianKui], 'AUX_TIAN_KUI_BY_YEAR_STEM'),
    makeDefinition('tianYue', 'noble', 'supportive', 'yearStem', BRANCH_INDEX[kuiYue.tianYue], 'AUX_TIAN_YUE_BY_YEAR_STEM'),

    makeDefinition('luCun', 'wealth', 'supportive', 'yearStem', luCunIndex, 'AUX_LU_CUN_BY_YEAR_STEM'),
    makeDefinition('qingYang', 'malefic', 'challenging', 'derivedFromLuCun', luCunIndex + 1, 'AUX_QING_YANG_AFTER_LU_CUN'),
    makeDefinition('tuoLuo', 'malefic', 'challenging', 'derivedFromLuCun', luCunIndex - 1, 'AUX_TUO_LUO_BEFORE_LU_CUN'),

    makeDefinition('diKong', 'malefic', 'challenging', 'birthHour', BRANCH_INDEX.hai - birthHourBranchIndex, 'AUX_DI_KONG_HOUR_REVERSE_FROM_HAI'),
    makeDefinition('diJie', 'malefic', 'challenging', 'birthHour', BRANCH_INDEX.hai + birthHourBranchIndex, 'AUX_DI_JIE_HOUR_FORWARD_FROM_HAI'),

    makeDefinition('huoXing', 'malefic', 'challenging', 'yearBranch', fireIndex, 'AUX_HUO_XING_GROUP_START_HOUR_FORWARD'),
    makeDefinition('lingXing', 'malefic', 'challenging', 'yearBranch', bellIndex, 'AUX_LING_XING_GROUP_START_HOUR_REVERSE'),

    makeDefinition('tianMa', 'mobility', 'mixed', 'yearBranch', BRANCH_INDEX[TIAN_MA_BY_GROUP[group]], 'AUX_TIAN_MA_BY_YEAR_TRIAD'),
    makeDefinition('taoHua', 'romance', 'mixed', 'yearBranch', BRANCH_INDEX[TAO_HUA_BY_GROUP[group]], 'AUX_TAO_HUA_BY_YEAR_TRIAD'),
    makeDefinition('hongLuan', 'romance', 'supportive', 'yearBranch', hongLuanIndex, 'AUX_HONG_LUAN_REVERSE_FROM_MAO'),
    makeDefinition('tianXi', 'romance', 'supportive', 'yearBranch', tianXiIndex, 'AUX_TIAN_XI_OPPOSITE_HONG_LUAN'),

    makeDefinition('guChen', 'solitary', 'mixed', 'yearBranch', BRANCH_INDEX[solitary.guChen], 'AUX_GU_CHEN_BY_YEAR_SEASON'),
    makeDefinition('guaXiu', 'solitary', 'mixed', 'yearBranch', BRANCH_INDEX[solitary.guaXiu], 'AUX_GUA_XIU_BY_YEAR_SEASON'),

    makeDefinition('longChi', 'ceremonial', 'supportive', 'yearBranch', BRANCH_INDEX.chen + yearBranchIndex, 'AUX_LONG_CHI_FORWARD_FROM_CHEN'),
    makeDefinition('fengGe', 'ceremonial', 'supportive', 'yearBranch', BRANCH_INDEX.xu - yearBranchIndex, 'AUX_FENG_GE_REVERSE_FROM_XU'),
  ];
}

export function placeAuxiliaryStars(
  palaces: ZiweiPalace[],
  lunarMonth: number,
  birthHourBranchIndex: number,
  yearStemId: HeavenlyStemId,
  yearBranchId: EarthlyBranchId,
): {
  placements: ZiweiAuxiliaryStarPlacement[];
  byPalace: ZiweiAuxiliaryStarsByPalace;
  summary: ZiweiAuxiliaryStarSummary;
} {
  if (palaces.length !== 12) {
    throw new Error('TWELVE_PALACES_REQUIRED_FOR_AUXILIARY_STARS');
  }

  const definitions = calculateAuxiliaryStarDefinitions(
    lunarMonth,
    birthHourBranchIndex,
    yearStemId,
    yearBranchId,
  );
  const palaceMap = palaceByBranchIndex(palaces);
  const placements = definitions.map(item =>
    placementFromDefinition(item, palaceMap),
  );

  const byPalace = Object.fromEntries(
    PALACE_ORDER.map(id => [id, []]),
  ) as unknown as ZiweiAuxiliaryStarsByPalace;

  for (const placement of placements) {
    byPalace[placement.palaceId].push(placement);
  }

  const byCategory: ZiweiAuxiliaryStarSummary['byCategory'] = {
    assistant: 0,
    literary: 0,
    noble: 0,
    wealth: 0,
    malefic: 0,
    mobility: 0,
    romance: 0,
    solitary: 0,
    ceremonial: 0,
  };

  for (const placement of placements) {
    byCategory[placement.category] += 1;
  }

  const getBranchId = (id: ZiweiAuxiliaryStarId): EarthlyBranchId => {
    const star = placements.find(item => item.id === id);
    if (!star) throw new Error(`AUXILIARY_STAR_NOT_FOUND_${id}`);
    return star.branchId;
  };

  return {
    placements,
    byPalace,
    summary: {
      total: placements.length,
      supportiveCount: placements.filter(item => item.tone === 'supportive').length,
      challengingCount: placements.filter(item => item.tone === 'challenging').length,
      mixedCount: placements.filter(item => item.tone === 'mixed').length,
      byCategory,
      luCunBranchId: getBranchId('luCun'),
      qingYangBranchId: getBranchId('qingYang'),
      tuoLuoBranchId: getBranchId('tuoLuo'),
    },
  };
}

export function getAuxiliaryStarsInPalace(
  byPalace: ZiweiAuxiliaryStarsByPalace,
  palaceId: keyof ZiweiAuxiliaryStarsByPalace,
): ZiweiAuxiliaryStarPlacement[] {
  return byPalace[palaceId] ?? [];
}

export function getAuxiliaryStarPlacement(
  placements: ZiweiAuxiliaryStarPlacement[],
  starId: ZiweiAuxiliaryStarId,
): ZiweiAuxiliaryStarPlacement | undefined {
  return placements.find(item => item.id === starId);
}
