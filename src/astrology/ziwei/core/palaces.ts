import {EARTHLY_BRANCHES, PALACE_ORDER} from '../constants';
import {positiveModulo} from './math';
import type {ZiweiPalace, ZiweiPalaceId} from '../types';

export function buildTwelvePalaces(
  lifeBranchIndex: number,
  bodyBranchIndex: number,
): ZiweiPalace[] {
  if (lifeBranchIndex < 0 || lifeBranchIndex > 11) {
    throw new Error('INVALID_LIFE_PALACE');
  }

  if (bodyBranchIndex < 0 || bodyBranchIndex > 11) {
    throw new Error('INVALID_BODY_PALACE');
  }

  return PALACE_ORDER.map((id, offset) => {
    const branchIndex = positiveModulo(lifeBranchIndex + offset, 12);

    return {
      id,
      branchId: EARTHLY_BRANCHES[branchIndex].id,
      branchIndex,
      isLifePalace: id === 'life',
      isBodyPalace: branchIndex === bodyBranchIndex,
    };
  });
}

export function getBodyResidencePalaceId(palaces: ZiweiPalace[]): ZiweiPalaceId {
  const palace = palaces.find(item => item.isBodyPalace);

  if (!palace) {
    throw new Error('BODY_RESIDENCE_NOT_FOUND');
  }

  return palace.id;
}
