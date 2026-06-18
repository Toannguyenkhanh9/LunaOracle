import {EARTHLY_BRANCHES, PALACE_ORDER} from '../constants';
import type {
  BureauNumber,
  EarthlyBranchId,
  ZiweiMainStarAnchors,
  ZiweiMainStarGroup,
  ZiweiMainStarId,
  ZiweiMainStarPlacement,
  ZiweiMainStarsByPalace,
  ZiweiPalace,
  ZiweiPalaceId,
} from '../types';
import {positiveModulo} from './math';

export type MainStarOffsetDefinition = {
  id: ZiweiMainStarId;
  group: ZiweiMainStarGroup;
  anchorStarId: 'ziWei' | 'tianFu';
  offset: number;
};

// Traditional Zi Wei group: count counter-clockwise from Zi Wei.
export const ZI_WEI_GROUP_OFFSETS: MainStarOffsetDefinition[] = [
  {id: 'ziWei', group: 'ziWeiGroup', anchorStarId: 'ziWei', offset: 0},
  {id: 'tianJi', group: 'ziWeiGroup', anchorStarId: 'ziWei', offset: -1},
  {id: 'taiYang', group: 'ziWeiGroup', anchorStarId: 'ziWei', offset: -3},
  {id: 'wuQu', group: 'ziWeiGroup', anchorStarId: 'ziWei', offset: -4},
  {id: 'tianTong', group: 'ziWeiGroup', anchorStarId: 'ziWei', offset: -5},
  {id: 'lianZhen', group: 'ziWeiGroup', anchorStarId: 'ziWei', offset: -8},
];

// Traditional Tian Fu group: count clockwise from Tian Fu.
export const TIAN_FU_GROUP_OFFSETS: MainStarOffsetDefinition[] = [
  {id: 'tianFu', group: 'tianFuGroup', anchorStarId: 'tianFu', offset: 0},
  {id: 'taiYin', group: 'tianFuGroup', anchorStarId: 'tianFu', offset: 1},
  {id: 'tanLang', group: 'tianFuGroup', anchorStarId: 'tianFu', offset: 2},
  {id: 'juMen', group: 'tianFuGroup', anchorStarId: 'tianFu', offset: 3},
  {id: 'tianXiang', group: 'tianFuGroup', anchorStarId: 'tianFu', offset: 4},
  {id: 'tianLiang', group: 'tianFuGroup', anchorStarId: 'tianFu', offset: 5},
  {id: 'qiSha', group: 'tianFuGroup', anchorStarId: 'tianFu', offset: 6},
  {id: 'poJun', group: 'tianFuGroup', anchorStarId: 'tianFu', offset: 10},
];

function assertLunarDay(lunarDay: number): void {
  if (!Number.isInteger(lunarDay) || lunarDay < 1 || lunarDay > 30) {
    throw new Error('INVALID_LUNAR_DAY_FOR_MAIN_STARS');
  }
}

function assertBureauNumber(bureauNumber: number): asserts bureauNumber is BureauNumber {
  if (![2, 3, 4, 5, 6].includes(bureauNumber)) {
    throw new Error('INVALID_BUREAU_NUMBER_FOR_MAIN_STARS');
  }
}

/**
 * Places Zi Wei by the common Vietnamese traditional arithmetic rule:
 * 1. Find the smallest quotient q for which q * bureau >= lunarDay.
 * 2. Count q positions forward from Yin (Tiger), with Yin counted as 1.
 * 3. Let adjustment = q * bureau - lunarDay.
 * 4. If adjustment is odd, move backward by adjustment; if even, move forward.
 */
export function calculateZiWeiAnchor(
  lunarDay: number,
  bureauNumber: BureauNumber,
): Omit<ZiweiMainStarAnchors, 'tianFuBranchId' | 'tianFuBranchIndex'> {
  assertLunarDay(lunarDay);
  assertBureauNumber(bureauNumber);

  const quotient = Math.ceil(lunarDay / bureauNumber);
  const adjustment = quotient * bureauNumber - lunarDay;

  // Yin has branch index 2 and is counted as position 1.
  const baseIndex = positiveModulo(2 + quotient - 1, 12);
  const direction = adjustment % 2 === 0 ? 1 : -1;
  const ziWeiBranchIndex = positiveModulo(
    baseIndex + direction * adjustment,
    12,
  );

  return {
    ziWeiBranchIndex,
    ziWeiBranchId: EARTHLY_BRANCHES[ziWeiBranchIndex].id,
    lunarDay,
    bureauNumber,
    quotient,
    adjustment,
  };
}

/**
 * Tian Fu is reflected from Zi Wei across the Yin-Shen axis.
 * Branch indexes use Zi=0, Chou=1, Yin=2, ... Hai=11.
 */
export function calculateTianFuBranchIndex(ziWeiBranchIndex: number): number {
  return positiveModulo(4 - ziWeiBranchIndex, 12);
}

export function calculateMainStarAnchors(
  lunarDay: number,
  bureauNumber: BureauNumber,
): ZiweiMainStarAnchors {
  const ziWei = calculateZiWeiAnchor(lunarDay, bureauNumber);
  const tianFuBranchIndex = calculateTianFuBranchIndex(
    ziWei.ziWeiBranchIndex,
  );

  return {
    ...ziWei,
    tianFuBranchIndex,
    tianFuBranchId: EARTHLY_BRANCHES[tianFuBranchIndex].id,
  };
}

function palaceByBranchIndex(palaces: ZiweiPalace[]): Map<number, ZiweiPalace> {
  const result = new Map<number, ZiweiPalace>();

  for (const palace of palaces) {
    result.set(palace.branchIndex, palace);
  }

  return result;
}

function buildPlacement(
  definition: MainStarOffsetDefinition,
  anchorIndex: number,
  palaces: Map<number, ZiweiPalace>,
): ZiweiMainStarPlacement {
  const branchIndex = positiveModulo(anchorIndex + definition.offset, 12);
  const palace = palaces.get(branchIndex);

  if (!palace) {
    throw new Error('PALACE_NOT_FOUND_FOR_MAIN_STAR');
  }

  return {
    id: definition.id,
    group: definition.group,
    anchorStarId: definition.anchorStarId,
    offsetFromAnchor: definition.offset,
    branchId: EARTHLY_BRANCHES[branchIndex].id,
    branchIndex,
    palaceId: palace.id,
    brightness: 'notEvaluated',
  };
}

export function placeFourteenMainStars(
  palaces: ZiweiPalace[],
  lunarDay: number,
  bureauNumber: BureauNumber,
): {
  anchors: ZiweiMainStarAnchors;
  placements: ZiweiMainStarPlacement[];
  byPalace: ZiweiMainStarsByPalace;
} {
  if (palaces.length !== 12) {
    throw new Error('TWELVE_PALACES_REQUIRED_FOR_MAIN_STARS');
  }

  const anchors = calculateMainStarAnchors(lunarDay, bureauNumber);
  const palaceMap = palaceByBranchIndex(palaces);

  const placements = [
    ...ZI_WEI_GROUP_OFFSETS.map(definition =>
      buildPlacement(definition, anchors.ziWeiBranchIndex, palaceMap),
    ),
    ...TIAN_FU_GROUP_OFFSETS.map(definition =>
      buildPlacement(definition, anchors.tianFuBranchIndex, palaceMap),
    ),
  ];

  const byPalace = Object.fromEntries(
    PALACE_ORDER.map(id => [id, []]),
  ) as unknown as ZiweiMainStarsByPalace;

  for (const placement of placements) {
    byPalace[placement.palaceId].push(placement);
  }

  return {
    anchors,
    placements,
    byPalace,
  };
}

export function getMainStarsInPalace(
  byPalace: ZiweiMainStarsByPalace,
  palaceId: ZiweiPalaceId,
): ZiweiMainStarPlacement[] {
  return byPalace[palaceId] ?? [];
}

export function getMainStarPlacement(
  placements: ZiweiMainStarPlacement[],
  starId: ZiweiMainStarId,
): ZiweiMainStarPlacement | undefined {
  return placements.find(item => item.id === starId);
}

export function branchIdAt(index: number): EarthlyBranchId {
  return EARTHLY_BRANCHES[positiveModulo(index, 12)].id;
}
