import {EARTHLY_BRANCHES, HEAVENLY_STEMS} from '../constants';
import type {
  EarthlyBranchId,
  HeavenlyStemId,
  ZiweiAnnualCycle,
  ZiweiAnnualStarId,
  ZiweiAnnualStarPlacement,
  ZiweiAuxiliaryStarPlacement,
  ZiweiMainStarPlacement,
  ZiweiMajorCyclePlacement,
  ZiweiMinorCyclePlacement,
  ZiweiPalace,
} from '../types';
import {positiveModulo} from './math';
import {placeFourTransformations} from './transformations';
import {findMajorCycleForAge} from './majorCycles';
import {findMinorCycleForAge} from './minorCycles';

const BRANCH_INDEX = Object.fromEntries(
  EARTHLY_BRANCHES.map((item, index) => [item.id, index]),
) as Record<EarthlyBranchId, number>;

const LU_CUN_BY_STEM: Record<HeavenlyStemId, EarthlyBranchId> = {
  jia: 'yin', yi: 'mao', bing: 'si', ding: 'wu', wu: 'si',
  ji: 'wu', geng: 'shen', xin: 'you', ren: 'hai', gui: 'zi',
};

const TIAN_MA_BY_YEAR_GROUP: Record<'water' | 'fire' | 'wood' | 'metal', EarthlyBranchId> = {
  water: 'yin',
  fire: 'shen',
  wood: 'si',
  metal: 'hai',
};

function branchGroup(branch: EarthlyBranchId): 'water' | 'fire' | 'wood' | 'metal' {
  if (['shen', 'zi', 'chen'].includes(branch)) return 'water';
  if (['yin', 'wu', 'xu'].includes(branch)) return 'fire';
  if (['hai', 'mao', 'wei'].includes(branch)) return 'wood';
  return 'metal';
}

export function getYearStemBranch(calendarYear: number): {
  stemId: HeavenlyStemId;
  branchId: EarthlyBranchId;
  stemIndex: number;
  branchIndex: number;
} {
  if (!Number.isInteger(calendarYear)) throw new Error('INVALID_ANNUAL_YEAR');
  const stemIndex = positiveModulo(calendarYear - 4, 10);
  const branchIndex = positiveModulo(calendarYear - 4, 12);
  return {
    stemId: HEAVENLY_STEMS[stemIndex].id,
    branchId: EARTHLY_BRANCHES[branchIndex].id,
    stemIndex,
    branchIndex,
  };
}

function annualStar(
  id: ZiweiAnnualStarId,
  branchIndex: number,
  palacesByBranch: Map<number, ZiweiPalace>,
  calendarYear: number,
  sourceYearStemId: HeavenlyStemId,
  sourceYearBranchId: EarthlyBranchId,
  tone: ZiweiAnnualStarPlacement['tone'],
  ruleCode: string,
): ZiweiAnnualStarPlacement {
  const normalizedIndex = positiveModulo(branchIndex, 12);
  const palace = palacesByBranch.get(normalizedIndex);
  if (!palace) throw new Error('PALACE_NOT_FOUND_FOR_ANNUAL_STAR');
  return {
    id,
    calendarYear,
    sourceYearStemId,
    sourceYearBranchId,
    branchId: palace.branchId,
    branchIndex: normalizedIndex,
    palaceId: palace.id,
    tone,
    ruleCode,
  };
}

export function placeAnnualStars(
  palaces: ZiweiPalace[],
  calendarYear: number,
): ZiweiAnnualStarPlacement[] {
  if (palaces.length !== 12) {
    throw new Error('TWELVE_PALACES_REQUIRED_FOR_ANNUAL_STARS');
  }
  const year = getYearStemBranch(calendarYear);
  const palaceMap = new Map(palaces.map(item => [item.branchIndex, item]));
  const luCunIndex = BRANCH_INDEX[LU_CUN_BY_STEM[year.stemId]];
  const tianMaIndex = BRANCH_INDEX[TIAN_MA_BY_YEAR_GROUP[branchGroup(year.branchId)]];

  return [
    annualStar('taiSui', year.branchIndex, palaceMap, calendarYear, year.stemId, year.branchId, 'neutral', 'ANNUAL_TAI_SUI_AT_YEAR_BRANCH'),
    annualStar('luCun', luCunIndex, palaceMap, calendarYear, year.stemId, year.branchId, 'supportive', 'ANNUAL_LU_CUN_BY_YEAR_STEM'),
    annualStar('qingYang', luCunIndex + 1, palaceMap, calendarYear, year.stemId, year.branchId, 'challenging', 'ANNUAL_QING_YANG_AFTER_LU_CUN'),
    annualStar('tuoLuo', luCunIndex - 1, palaceMap, calendarYear, year.stemId, year.branchId, 'challenging', 'ANNUAL_TUO_LUO_BEFORE_LU_CUN'),
    annualStar('tianMa', tianMaIndex, palaceMap, calendarYear, year.stemId, year.branchId, 'mixed', 'ANNUAL_TIAN_MA_BY_YEAR_TRIAD'),
  ];
}

export function buildAnnualCycles(
  palaces: ZiweiPalace[],
  birthLunarYear: number,
  mainStars: ZiweiMainStarPlacement[],
  auxiliaryStars: ZiweiAuxiliaryStarPlacement[],
  majorCycles: ZiweiMajorCyclePlacement[],
  minorCycles: ZiweiMinorCyclePlacement[],
  totalYears = 120,
): ZiweiAnnualCycle[] {
  if (!Number.isInteger(totalYears) || totalYears < 1 || totalYears > 150) {
    throw new Error('INVALID_ANNUAL_CYCLE_YEAR_COUNT');
  }

  return Array.from({length: totalYears}, (_, offset) => {
    const nominalAge = offset + 1;
    const calendarYear = birthLunarYear + offset;
    const year = getYearStemBranch(calendarYear);
    const majorCycle = findMajorCycleForAge(majorCycles, nominalAge);
    const minorCycle = findMinorCycleForAge(minorCycles, nominalAge);
    if (!minorCycle) throw new Error('MINOR_CYCLE_NOT_FOUND_FOR_ANNUAL_CYCLE');

    const annualStars = placeAnnualStars(palaces, calendarYear);
    const annualTransformations = placeFourTransformations(
      year.stemId,
      mainStars,
      auxiliaryStars,
    ).placements;

    const taiSui = annualStars.find(item => item.id === 'taiSui');
    if (!taiSui) throw new Error('ANNUAL_TAI_SUI_NOT_FOUND');

    return {
      calendarYear,
      nominalAge,
      solarAge: nominalAge - 1,
      yearStemId: year.stemId,
      yearBranchId: year.branchId,
      taiSuiPalaceId: taiSui.palaceId,
      taiSuiBranchId: taiSui.branchId,
      activeMajorCycleIndex: majorCycle?.index ?? null,
      activeMajorPalaceId: majorCycle?.palaceId ?? null,
      minorCyclePalaceId: minorCycle.palaceId,
      minorCycleBranchId: minorCycle.branchId,
      annualStars,
      annualTransformations,
      supportiveStarCount: annualStars.filter(item => item.tone === 'supportive').length,
      challengingStarCount: annualStars.filter(item => item.tone === 'challenging').length,
      ruleCode: 'ANNUAL_TRANSIT_NOMINAL_AGE_REFERENCE_V1',
    } satisfies ZiweiAnnualCycle;
  });
}

export function findAnnualCycleByYear(
  cycles: ZiweiAnnualCycle[],
  calendarYear: number,
): ZiweiAnnualCycle | undefined {
  return cycles.find(item => item.calendarYear === calendarYear);
}
