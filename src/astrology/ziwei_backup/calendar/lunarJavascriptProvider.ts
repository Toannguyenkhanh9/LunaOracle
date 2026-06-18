import {Solar} from 'lunar-javascript';
import {
  BRANCH_INDEX_BY_HAN,
  EARTHLY_BRANCHES,
  HEAVENLY_STEMS,
  STEM_INDEX_BY_HAN,
} from '../constants';
import {getBirthHourBranchIndex} from '../core/birthHour';
import {positiveModulo} from '../core/math';
import type {
  LocalDateTimeInput,
  LunarBirthProfile,
  ZiweiCalendarProvider,
} from '../types';

function callNumber(target: any, methodName: string): number | undefined {
  const method = target?.[methodName];
  if (typeof method !== 'function') return undefined;
  const value = Number(method.call(target));
  return Number.isFinite(value) ? value : undefined;
}

function callString(target: any, methodName: string): string {
  const method = target?.[methodName];
  if (typeof method !== 'function') return '';
  const value = method.call(target);
  return value == null ? '' : String(value);
}

export class LunarJavascriptZiweiCalendarProvider implements ZiweiCalendarProvider {
  readonly name = 'lunar-javascript';

  getLunarBirthProfile(input: LocalDateTimeInput): LunarBirthProfile {
    const solar = Solar.fromYmdHms(
      input.year,
      input.month,
      input.day,
      input.hour,
      input.minute,
      input.second ?? 0,
    );

    const lunar = solar.getLunar();
    if (!lunar) throw new Error('LUNAR_PROVIDER_FAILED');

    const rawLunarMonth = callNumber(lunar, 'getMonth');
    const lunarYear = callNumber(lunar, 'getYear');
    const lunarDay = callNumber(lunar, 'getDay');

    if (rawLunarMonth === undefined || lunarYear === undefined || lunarDay === undefined) {
      throw new Error('LUNAR_DATE_UNAVAILABLE');
    }

    const yearStemHan = callString(lunar, 'getYearGan');
    const yearBranchHan = callString(lunar, 'getYearZhi');

    const derivedStemIndex = positiveModulo(lunarYear - 4, 10);
    const derivedBranchIndex = positiveModulo(lunarYear - 4, 12);

    const yearStemIndex = STEM_INDEX_BY_HAN[yearStemHan] ?? derivedStemIndex;
    const yearBranchIndex = BRANCH_INDEX_BY_HAN[yearBranchHan] ?? derivedBranchIndex;
    const birthHourBranchIndex = getBirthHourBranchIndex(input.hour);

    return {
      lunarYear,
      lunarMonth: Math.abs(rawLunarMonth),
      lunarDay,
      isLeapMonth: rawLunarMonth < 0,
      yearStemId: HEAVENLY_STEMS[yearStemIndex].id,
      yearBranchId: EARTHLY_BRANCHES[yearBranchIndex].id,
      yearStemHan: HEAVENLY_STEMS[yearStemIndex].han,
      yearBranchHan: EARTHLY_BRANCHES[yearBranchIndex].han,
      birthHourBranchId: EARTHLY_BRANCHES[birthHourBranchIndex].id,
      birthHourBranchIndex,
    };
  }
}
