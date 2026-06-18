import {EARTHLY_BRANCHES} from '../constants';
import {positiveModulo} from './math';
import type {EarthlyBranchId} from '../types';

export type LifeBodyPalaceResult = {
  lifeBranchIndex: number;
  lifeBranchId: EarthlyBranchId;
  bodyBranchIndex: number;
  bodyBranchId: EarthlyBranchId;
};

export function calculateLifeAndBodyPalaces(
  lunarMonth: number,
  birthHourBranchIndex: number,
): LifeBodyPalaceResult {
  if (!Number.isInteger(lunarMonth) || lunarMonth < 1 || lunarMonth > 12) {
    throw new Error('INVALID_LUNAR_MONTH');
  }

  if (
    !Number.isInteger(birthHourBranchIndex) ||
    birthHourBranchIndex < 0 ||
    birthHourBranchIndex > 11
  ) {
    throw new Error('INVALID_HOUR_BRANCH');
  }

  // Start at Tiger for lunar month 1. Count months forward.
  const monthPosition = positiveModulo(2 + lunarMonth - 1, 12);

  // Life palace counts the birth hour backward; Body palace counts it forward.
  const lifeBranchIndex = positiveModulo(monthPosition - birthHourBranchIndex, 12);
  const bodyBranchIndex = positiveModulo(monthPosition + birthHourBranchIndex, 12);

  return {
    lifeBranchIndex,
    lifeBranchId: EARTHLY_BRANCHES[lifeBranchIndex].id,
    bodyBranchIndex,
    bodyBranchId: EARTHLY_BRANCHES[bodyBranchIndex].id,
  };
}
