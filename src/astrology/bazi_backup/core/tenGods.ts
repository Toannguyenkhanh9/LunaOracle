import {
  CONTROLS,
  GENERATED_BY,
  GENERATES,
} from '../constants';
import type {
  StemDefinition,
  TenGod,
} from '../types';

export function getTenGod(
  dayMaster: StemDefinition,
  target: StemDefinition,
): TenGod | 'dayMaster' {
  if (dayMaster.id === target.id) {
    return 'dayMaster';
  }

  const samePolarity = dayMaster.polarity === target.polarity;

  if (dayMaster.element === target.element) {
    return samePolarity ? 'friend' : 'robWealth';
  }

  if (GENERATES[dayMaster.element] === target.element) {
    return samePolarity ? 'eatingGod' : 'hurtingOfficer';
  }

  if (CONTROLS[dayMaster.element] === target.element) {
    return samePolarity ? 'indirectWealth' : 'directWealth';
  }

  if (GENERATED_BY[dayMaster.element] === target.element) {
    return samePolarity ? 'indirectResource' : 'directResource';
  }

  return samePolarity ? 'sevenKillings' : 'directOfficer';
}
