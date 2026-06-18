import {EARTHLY_BRANCHES, PALACE_ORDER} from '../constants';
import type {
  EarthlyBranchId,
  HeavenlyStemId,
  ZiweiPalace,
  ZiweiPalaceId,
  ZiweiVoidMarkerId,
  ZiweiVoidMarkerPlacement,
  ZiweiVoidMarkersByPalace,
} from '../types';

const STEM_INDEX: Record<HeavenlyStemId, number> = {
  jia: 0,
  yi: 1,
  bing: 2,
  ding: 3,
  wu: 4,
  ji: 5,
  geng: 6,
  xin: 7,
  ren: 8,
  gui: 9,
};

const BRANCH_INDEX: Record<EarthlyBranchId, number> = Object.fromEntries(
  EARTHLY_BRANCHES.map((item, index) => [item.id, index]),
) as Record<EarthlyBranchId, number>;

const TUAN_PAIRS_BY_XUN_INDEX: [EarthlyBranchId, EarthlyBranchId][] = [
  ['xu', 'hai'],
  ['shen', 'you'],
  ['wu', 'wei'],
  ['chen', 'si'],
  ['yin', 'mao'],
  ['zi', 'chou'],
];

const TRIET_PAIR_BY_STEM: Record<
  HeavenlyStemId,
  [EarthlyBranchId, EarthlyBranchId]
> = {
  jia: ['shen', 'you'],
  ji: ['shen', 'you'],
  yi: ['wu', 'wei'],
  geng: ['wu', 'wei'],
  bing: ['chen', 'si'],
  xin: ['chen', 'si'],
  ding: ['yin', 'mao'],
  ren: ['yin', 'mao'],
  wu: ['zi', 'chou'],
  gui: ['zi', 'chou'],
};

export function calculateJiaZiIndex(
  yearStemId: HeavenlyStemId,
  yearBranchId: EarthlyBranchId,
): number {
  const stemIndex = STEM_INDEX[yearStemId];
  const branchIndex = BRANCH_INDEX[yearBranchId];

  for (let index = 0; index < 60; index += 1) {
    if (index % 10 === stemIndex && index % 12 === branchIndex) {
      return index;
    }
  }

  throw new Error('INVALID_CAN_CHI_PAIR');
}

export function calculateTuanBranches(
  yearStemId: HeavenlyStemId,
  yearBranchId: EarthlyBranchId,
): [EarthlyBranchId, EarthlyBranchId] {
  const jiaZiIndex = calculateJiaZiIndex(yearStemId, yearBranchId);
  return TUAN_PAIRS_BY_XUN_INDEX[Math.floor(jiaZiIndex / 10)];
}

export function calculateTrietBranches(
  yearStemId: HeavenlyStemId,
): [EarthlyBranchId, EarthlyBranchId] {
  return TRIET_PAIR_BY_STEM[yearStemId];
}

function buildPlacement(
  id: ZiweiVoidMarkerId,
  branches: [EarthlyBranchId, EarthlyBranchId],
  palaces: ZiweiPalace[],
  ruleCode: string,
): ZiweiVoidMarkerPlacement {
  const palaceByBranch = new Map(palaces.map(item => [item.branchId, item]));
  const first = palaceByBranch.get(branches[0]);
  const second = palaceByBranch.get(branches[1]);

  if (!first || !second) {
    throw new Error('PALACE_NOT_FOUND_FOR_VOID_MARKER');
  }

  return {
    id,
    branchIds: branches,
    branchIndexes: [BRANCH_INDEX[branches[0]], BRANCH_INDEX[branches[1]]],
    palaceIds: [first.id, second.id],
    ruleCode,
  };
}

export function placeVoidMarkers(
  palaces: ZiweiPalace[],
  yearStemId: HeavenlyStemId,
  yearBranchId: EarthlyBranchId,
): {
  placements: ZiweiVoidMarkerPlacement[];
  byPalace: ZiweiVoidMarkersByPalace;
} {
  const tuan = buildPlacement(
    'tuan',
    calculateTuanBranches(yearStemId, yearBranchId),
    palaces,
    'TUAN_BY_JIAZI_XUN',
  );

  const triet = buildPlacement(
    'triet',
    calculateTrietBranches(yearStemId),
    palaces,
    'TRIET_BY_YEAR_STEM_PAIR',
  );

  const placements = [tuan, triet];
  const byPalace = Object.fromEntries(
    PALACE_ORDER.map(id => [id, []]),
  ) as unknown as ZiweiVoidMarkersByPalace;

  for (const marker of placements) {
    for (const palaceId of marker.palaceIds) {
      byPalace[palaceId].push(marker.id);
    }
  }

  return {placements, byPalace};
}
