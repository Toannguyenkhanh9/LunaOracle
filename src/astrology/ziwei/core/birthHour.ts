import {EARTHLY_BRANCHES} from '../constants';
import type {EarthlyBranchId} from '../types';

export function getBirthHourBranchIndex(hour: number): number {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    throw new Error('INVALID_BIRTH_HOUR');
  }

  // Zi hour spans 23:00-00:59; every following branch spans two hours.
  return Math.floor(((hour + 1) % 24) / 2);
}

export function getBirthHourBranchId(hour: number): EarthlyBranchId {
  return EARTHLY_BRANCHES[getBirthHourBranchIndex(hour)].id;
}
