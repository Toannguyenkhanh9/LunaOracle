import {
  BUREAU_NUMBER_BY_ELEMENT,
  EARTHLY_BRANCHES,
  HEAVENLY_STEMS,
  NAYIN_ELEMENT_BY_JIAZI_INDEX,
  TIGER_STEM_INDEX_BY_YEAR_STEM_INDEX,
} from '../constants';
import {positiveModulo} from './math';
import type {FiveElementBureau} from '../types';

export function findJiaZiIndex(stemIndex: number, branchIndex: number): number {
  for (let index = 0; index < 60; index += 1) {
    if (index % 10 === stemIndex && index % 12 === branchIndex) {
      return index;
    }
  }

  throw new Error('INVALID_STEM_BRANCH_PAIR');
}

export function calculateFiveElementBureau(
  birthYearStemIndex: number,
  lifePalaceBranchIndex: number,
): FiveElementBureau {
  if (birthYearStemIndex < 0 || birthYearStemIndex > 9) {
    throw new Error('INVALID_YEAR_STEM');
  }

  if (lifePalaceBranchIndex < 0 || lifePalaceBranchIndex > 11) {
    throw new Error('INVALID_LIFE_PALACE');
  }

  const tigerStemIndex = TIGER_STEM_INDEX_BY_YEAR_STEM_INDEX[birthYearStemIndex];
  const distanceFromTiger = positiveModulo(lifePalaceBranchIndex - 2, 12);
  const lifePalaceStemIndex = positiveModulo(tigerStemIndex + distanceFromTiger, 10);
  const jiaZiIndex = findJiaZiIndex(lifePalaceStemIndex, lifePalaceBranchIndex);
  const element = NAYIN_ELEMENT_BY_JIAZI_INDEX[jiaZiIndex];

  return {
    element,
    number: BUREAU_NUMBER_BY_ELEMENT[element],
    lifePalaceStemId: HEAVENLY_STEMS[lifePalaceStemIndex].id,
    lifePalaceStemIndex,
    lifePalaceBranchId: EARTHLY_BRANCHES[lifePalaceBranchIndex].id,
    jiaZiIndex,
  };
}
