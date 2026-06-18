import {
  BRANCHES,
  STEMS,
  STEM_BY_ID,
} from '../constants';
import type {
  CalendarPillarResult,
  Pillar,
  PillarKind,
  StemDefinition,
} from '../types';
import {getTenGod} from './tenGods';

export function createPillar(
  kind: PillarKind | 'luck' | 'transit',
  stemIndex: number,
  branchIndex: number,
  dayMaster: StemDefinition,
): Pillar {
  const stem = STEMS[stemIndex];
  const branch = BRANCHES[branchIndex];

  if (!stem || !branch) {
    throw new Error(`INVALID_PILLAR_INDEX:${kind}:${stemIndex}:${branchIndex}`);
  }

  return {
    kind,
    stem,
    branch,
    text: `${stem.vi} ${branch.vi}`,
    stemTenGod: kind === 'day' ? 'dayMaster' : getTenGod(dayMaster, stem),
    hiddenStemTenGods: branch.hiddenStems.map(hidden => {
      const hiddenStem = STEM_BY_ID[hidden.stemId];

      return {
        stem: hiddenStem,
        tenGod: getTenGod(dayMaster, hiddenStem),
        weight: hidden.weight,
        role: hidden.role,
      };
    }),
  };
}

export function createNatalPillars(
  calendar: CalendarPillarResult,
): Record<PillarKind, Pillar> {
  const dayMaster = STEMS[calendar.dayStemIndex];

  if (!dayMaster) {
    throw new Error('INVALID_DAY_MASTER_INDEX');
  }

  return {
    year: createPillar(
      'year',
      calendar.yearStemIndex,
      calendar.yearBranchIndex,
      dayMaster,
    ),
    month: createPillar(
      'month',
      calendar.monthStemIndex,
      calendar.monthBranchIndex,
      dayMaster,
    ),
    day: createPillar(
      'day',
      calendar.dayStemIndex,
      calendar.dayBranchIndex,
      dayMaster,
    ),
    hour: createPillar(
      'hour',
      calendar.hourStemIndex,
      calendar.hourBranchIndex,
      dayMaster,
    ),
  };
}
