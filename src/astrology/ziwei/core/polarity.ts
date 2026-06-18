import {HEAVENLY_STEMS} from '../constants';
import type {ZiweiGender, ZiweiPolarityProfile} from '../types';

export function calculatePolarityProfile(
  birthYearStemIndex: number,
  gender: ZiweiGender,
): ZiweiPolarityProfile {
  const yearPolarity = HEAVENLY_STEMS[birthYearStemIndex].polarity;

  const classification =
    yearPolarity === 'yang'
      ? gender === 'male' ? 'yangMale' : 'yangFemale'
      : gender === 'male' ? 'yinMale' : 'yinFemale';

  const majorCycleDirection =
    (yearPolarity === 'yang' && gender === 'male') ||
    (yearPolarity === 'yin' && gender === 'female')
      ? 'forward'
      : 'reverse';

  return {
    yearPolarity,
    gender,
    classification,
    majorCycleDirection,
  };
}
