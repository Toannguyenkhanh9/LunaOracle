import {EARTHLY_BRANCHES, PALACE_ORDER} from '../constants';
import type {
  CycleDirection,
  EarthlyBranchId,
  ZiweiGender,
  ZiweiMinorCycleByPalace,
  ZiweiMinorCyclePlacement,
  ZiweiPalace,
} from '../types';
import {positiveModulo} from './math';

const BRANCH_INDEX = Object.fromEntries(
  EARTHLY_BRANCHES.map((item, index) => [item.id, index]),
) as Record<EarthlyBranchId, number>;

export const MINOR_CYCLE_START_BY_YEAR_BRANCH: Record<
  EarthlyBranchId,
  EarthlyBranchId
> = {
  zi: 'xu',
  chou: 'wei',
  yin: 'chen',
  mao: 'chou',
  chen: 'xu',
  si: 'wei',
  wu: 'chen',
  wei: 'chou',
  shen: 'xu',
  you: 'wei',
  xu: 'chen',
  hai: 'chou',
};

function minorCycleDirection(gender: ZiweiGender): CycleDirection {
  return gender === 'male' ? 'forward' : 'reverse';
}

export function placeMinorCycles(
  palaces: ZiweiPalace[],
  birthLunarYear: number,
  birthYearBranchId: EarthlyBranchId,
  gender: ZiweiGender,
  totalAges = 120,
): {
  placements: ZiweiMinorCyclePlacement[];
  byPalace: ZiweiMinorCycleByPalace;
  startBranchId: EarthlyBranchId;
  direction: CycleDirection;
} {
  if (palaces.length !== 12) {
    throw new Error('TWELVE_PALACES_REQUIRED_FOR_MINOR_CYCLES');
  }
  if (!Number.isInteger(totalAges) || totalAges < 1 || totalAges > 150) {
    throw new Error('INVALID_MINOR_CYCLE_AGE_COUNT');
  }

  const branchMap = new Map(palaces.map(item => [item.branchIndex, item]));
  const startBranchId = MINOR_CYCLE_START_BY_YEAR_BRANCH[birthYearBranchId];
  const startIndex = BRANCH_INDEX[startBranchId];
  const direction = minorCycleDirection(gender);
  const step = direction === 'forward' ? 1 : -1;

  const placements = Array.from({length: totalAges}, (_, offset) => {
    const nominalAge = offset + 1;
    const branchIndex = positiveModulo(startIndex + step * offset, 12);
    const palace = branchMap.get(branchIndex);
    if (!palace) throw new Error('PALACE_NOT_FOUND_FOR_MINOR_CYCLE');

    return {
      nominalAge,
      solarAge: nominalAge - 1,
      calendarYear: birthLunarYear + nominalAge - 1,
      direction,
      startBranchId,
      branchId: palace.branchId,
      branchIndex,
      palaceId: palace.id,
      ruleCode: 'MINOR_CYCLE_YEAR_TRIAD_START_MALE_FORWARD_FEMALE_REVERSE',
    } satisfies ZiweiMinorCyclePlacement;
  });

  const byPalace = Object.fromEntries(
    PALACE_ORDER.map(id => [id, []]),
  ) as unknown as ZiweiMinorCycleByPalace;
  for (const item of placements) byPalace[item.palaceId].push(item);

  return {placements, byPalace, startBranchId, direction};
}

export function findMinorCycleForAge(
  placements: ZiweiMinorCyclePlacement[],
  nominalAge: number,
): ZiweiMinorCyclePlacement | undefined {
  return placements.find(item => item.nominalAge === nominalAge);
}
