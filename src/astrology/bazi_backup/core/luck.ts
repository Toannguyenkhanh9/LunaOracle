import {BRANCHES, STEMS} from '../constants';
import type {
  BirthInput,
  CalendarPillarResult,
  LuckPillar,
  LuckStart,
  Pillar,
  PillarKind,
} from '../types';
import {
  localDateTimeToPseudoUtcMillis,
  positiveModulo,
  round,
} from '../utils/math';
import {createPillar} from './pillars';
import {analyzeExternalPillarRelations} from './relations';

export interface LuckCalculationResult {
  start: LuckStart;
  pillars: LuckPillar[];
  warnings: string[];
}

function getDirection(
  input: BirthInput,
  yearStemIndex: number,
): LuckStart['direction'] {
  if (input.gender === 'unspecified') {
    return 'undetermined';
  }

  const yearStem = STEMS[yearStemIndex];
  const forward =
    (yearStem.polarity === 'yang' && input.gender === 'male') ||
    (yearStem.polarity === 'yin' && input.gender === 'female');

  return forward ? 'forward' : 'backward';
}

function breakdownAge(decimalYears: number): {
  years: number;
  months: number;
  days: number;
} {
  const years = Math.floor(decimalYears);
  const remainingMonths = (decimalYears - years) * 12;
  const months = Math.floor(remainingMonths);
  const days = Math.round((remainingMonths - months) * 30);

  return {years, months, days};
}

export function calculateLuck(
  input: BirthInput,
  correctedBirthDateTime: BirthInput['localDateTime'],
  calendar: CalendarPillarResult,
  natalPillars: Record<PillarKind, Pillar>,
  count: number,
  luckSect: 1 | 2,
): LuckCalculationResult {
  const warnings: string[] = [];
  const direction = getDirection(input, calendar.yearStemIndex);

  if (direction === 'undetermined') {
    warnings.push('LUCK_DIRECTION_REQUIRES_GENDER');

    return {
      start: {
        direction,
        years: 0,
        months: 0,
        days: 0,
        decimalYears: 0,
        method: 'undetermined',
      },
      pillars: [],
      warnings,
    };
  }

  const referenceTerm =
    direction === 'forward' ? calendar.nextJie : calendar.previousJie;

  let decimalYears = 5;
  let method: LuckStart['method'] = 'providerFallback';

  if (referenceTerm) {
    const birthMillis = localDateTimeToPseudoUtcMillis(correctedBirthDateTime);
    const termMillis = localDateTimeToPseudoUtcMillis(referenceTerm.localDateTime);
    const differenceMinutes = Math.abs(termMillis - birthMillis) / 60_000;
    const differenceDays = differenceMinutes / 1_440;

    if (luckSect === 2) {
      // Traditional discrete conversion:
      // 3 real days = 1 age year, 6 real hours = 1 age month,
      // 2 real hours = 10 age days.
      const wholeDays = Math.floor(differenceDays);
      const remainingMinutes = differenceMinutes - wholeDays * 1_440;
      const years = Math.floor(wholeDays / 3);
      const remainingRealDays = wholeDays % 3;
      const totalHours = remainingRealDays * 24 + remainingMinutes / 60;
      const months = Math.floor(totalHours / 6);
      const ageDays = ((totalHours % 6) / 2) * 10;

      decimalYears = years + months / 12 + ageDays / 365;
    } else {
      // Continuous conversion keeps minute precision.
      decimalYears = differenceDays / 3;
    }

    method = 'solarTermInterval';
  } else {
    warnings.push('LUCK_START_USED_FIVE_YEAR_FALLBACK');
  }

  const age = breakdownAge(decimalYears);
  const start: LuckStart = {
    direction,
    years: age.years,
    months: age.months,
    days: age.days,
    decimalYears: round(decimalYears, 3),
    referenceTerm,
    method,
  };

  const sign = direction === 'forward' ? 1 : -1;
  const dayMaster = natalPillars.day.stem;
  const pillars: LuckPillar[] = [];

  for (let index = 1; index <= count; index += 1) {
    const stemIndex = positiveModulo(calendar.monthStemIndex + sign * index, 10);
    const branchIndex = positiveModulo(calendar.monthBranchIndex + sign * index, 12);
    const pillar = createPillar('luck', stemIndex, branchIndex, dayMaster);
    const startAge = decimalYears + (index - 1) * 10;
    const endAge = startAge + 9.999;

    pillars.push({
      index,
      pillar,
      startAge: round(startAge, 2),
      endAge: round(endAge, 2),
      approximateStartYear: Math.floor(input.localDateTime.year + startAge),
      approximateEndYear: Math.floor(input.localDateTime.year + endAge),
      relationsToNatal: analyzeExternalPillarRelations(
        pillar,
        'luck',
        natalPillars,
      ),
    });
  }

  return {
    start,
    pillars,
    warnings,
  };
}
