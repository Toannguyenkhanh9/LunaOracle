import {EARTHLY_BRANCHES, PALACE_ORDER} from '../constants';
import type {
  CycleDirection,
  FiveElement,
  ZiweiPalace,
  ZiweiTrangSinhByPalace,
  ZiweiTrangSinhPlacement,
  ZiweiTrangSinhStageId,
} from '../types';
import {positiveModulo} from './math';

export const TRANG_SINH_STAGE_ORDER: ZiweiTrangSinhStageId[] = [
  'trangSinh',
  'mocDuc',
  'quanDoi',
  'lamQuan',
  'deVuong',
  'suy',
  'benh',
  'tu',
  'mo',
  'tuyet',
  'thai',
  'duong',
];

const START_BRANCH_BY_BUREAU_ELEMENT: Record<FiveElement, number> = {
  water: 8, // Thân
  wood: 11, // Hợi
  metal: 5, // Tỵ
  earth: 8, // Thân
  fire: 2, // Dần
};

export function placeTrangSinhCycle(
  palaces: ZiweiPalace[],
  bureauElement: FiveElement,
  direction: CycleDirection,
): {
  placements: ZiweiTrangSinhPlacement[];
  byPalace: ZiweiTrangSinhByPalace;
} {
  const palaceByBranchIndex = new Map(
    palaces.map(item => [item.branchIndex, item]),
  );

  const startIndex = START_BRANCH_BY_BUREAU_ELEMENT[bureauElement];
  const step = direction === 'forward' ? 1 : -1;

  const placements = TRANG_SINH_STAGE_ORDER.map((stageId, sequenceIndex) => {
    const branchIndex = positiveModulo(startIndex + step * sequenceIndex, 12);
    const palace = palaceByBranchIndex.get(branchIndex);

    if (!palace) {
      throw new Error('PALACE_NOT_FOUND_FOR_TRANG_SINH');
    }

    return {
      stageId,
      sequenceIndex,
      branchId: EARTHLY_BRANCHES[branchIndex].id,
      branchIndex,
      palaceId: palace.id,
      direction,
      ruleCode: `TRANG_SINH_${bureauElement}_${direction}_${stageId}`,
    };
  });

  const byPalace = Object.fromEntries(
    PALACE_ORDER.map(id => [id, undefined]),
  ) as unknown as ZiweiTrangSinhByPalace;

  for (const placement of placements) {
    byPalace[placement.palaceId] = placement;
  }

  return {placements, byPalace};
}
