import {PALACE_ORDER} from '../constants';
import type {
  BureauNumber,
  CycleDirection,
  ZiweiMajorCycleByPalace,
  ZiweiMajorCyclePlacement,
  ZiweiPalace,
} from '../types';
import {positiveModulo} from './math';

function palaceByBranchIndex(palaces: ZiweiPalace[]): Map<number, ZiweiPalace> {
  return new Map(palaces.map(item => [item.branchIndex, item]));
}

export function placeMajorCycles(
  palaces: ZiweiPalace[],
  bureauNumber: BureauNumber,
  direction: CycleDirection,
): {
  placements: ZiweiMajorCyclePlacement[];
  byPalace: ZiweiMajorCycleByPalace;
} {
  if (palaces.length !== 12) {
    throw new Error('TWELVE_PALACES_REQUIRED_FOR_MAJOR_CYCLES');
  }

  const lifePalace = palaces.find(item => item.isLifePalace);
  if (!lifePalace) throw new Error('LIFE_PALACE_REQUIRED_FOR_MAJOR_CYCLES');

  const branchMap = palaceByBranchIndex(palaces);
  const step = direction === 'forward' ? 1 : -1;

  const placements: ZiweiMajorCyclePlacement[] = Array.from(
    {length: 12},
    (_, index) => {
      const branchIndex = positiveModulo(lifePalace.branchIndex + step * index, 12);
      const palace = branchMap.get(branchIndex);
      if (!palace) throw new Error('PALACE_NOT_FOUND_FOR_MAJOR_CYCLE');

      const startAge = bureauNumber + index * 10;
      return {
        index,
        startAge,
        endAge: startAge + 9,
        direction,
        branchId: palace.branchId,
        branchIndex,
        palaceId: palace.id,
        bureauNumber,
        ruleCode: 'MAJOR_CYCLE_START_AT_BUREAU_AGE_FROM_LIFE_PALACE',
      };
    },
  );

  const byPalace = Object.fromEntries(
    PALACE_ORDER.map(id => [id, []]),
  ) as unknown as ZiweiMajorCycleByPalace;

  for (const item of placements) byPalace[item.palaceId].push(item);

  return {placements, byPalace};
}

export function findMajorCycleForAge(
  placements: ZiweiMajorCyclePlacement[],
  nominalAge: number,
): ZiweiMajorCyclePlacement | undefined {
  return placements.find(
    item => nominalAge >= item.startAge && nominalAge <= item.endAge,
  );
}
