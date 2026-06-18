// @ts-ignore -- lunar-javascript is supplied as a runtime dependency by this package.
import {Solar} from 'lunar-javascript';

import {
  BRANCH_INDEX_BY_HAN,
  STEM_INDEX_BY_HAN,
} from '../constants';
import type {
  CalendarPillarResult,
  CalendarProvider,
  DayBoundaryMode,
  LocalDateTimeInput,
  SolarTermPoint,
} from '../types';

function call(target: unknown, methodName: string, ...args: unknown[]): unknown {
  if (!target || typeof target !== 'object') {
    return undefined;
  }

  const method = (target as Record<string, unknown>)[methodName];

  if (typeof method !== 'function') {
    return undefined;
  }

  return (method as (...parameters: unknown[]) => unknown).apply(target, args);
}

function readString(target: unknown, methods: string[]): string {
  for (const method of methods) {
    const value = call(target, method);

    if (value !== undefined && value !== null && String(value).length > 0) {
      return String(value);
    }
  }

  return '';
}

function readNumber(target: unknown, methods: string[]): number | undefined {
  for (const method of methods) {
    const value = call(target, method);
    const numberValue = Number(value);

    if (Number.isFinite(numberValue)) {
      return numberValue;
    }
  }

  return undefined;
}

function parseSolarTerm(term: unknown): SolarTermPoint | undefined {
  if (!term) {
    return undefined;
  }

  const solar = call(term, 'getSolar') ?? term;

  const year = readNumber(solar, ['getYear']);
  const month = readNumber(solar, ['getMonth']);
  const day = readNumber(solar, ['getDay']);
  const hour = readNumber(solar, ['getHour']) ?? 0;
  const minute = readNumber(solar, ['getMinute']) ?? 0;
  const second = readNumber(solar, ['getSecond']) ?? 0;

  if (
    year === undefined ||
    month === undefined ||
    day === undefined
  ) {
    return undefined;
  }

  return {
    name: readString(term, ['getName']) || 'Jie',
    localDateTime: {
      year,
      month,
      day,
      hour,
      minute,
      second,
    },
  };
}

function stemIndex(value: string, label: string): number {
  const result = STEM_INDEX_BY_HAN[value];

  if (result === undefined) {
    throw new Error(`UNKNOWN_STEM:${label}:${value}`);
  }

  return result;
}

function branchIndex(value: string, label: string): number {
  const result = BRANCH_INDEX_BY_HAN[value];

  if (result === undefined) {
    throw new Error(`UNKNOWN_BRANCH:${label}:${value}`);
  }

  return result;
}

export class LunarJavascriptCalendarProvider implements CalendarProvider {
  readonly name = 'lunar-javascript';

  calculate(
    localDateTime: LocalDateTimeInput,
    dayBoundary: DayBoundaryMode,
  ): CalendarPillarResult {
    const warnings: string[] = [];

    const solar = Solar.fromYmdHms(
      localDateTime.year,
      localDateTime.month,
      localDateTime.day,
      localDateTime.hour,
      localDateTime.minute,
      localDateTime.second ?? 0,
    );

    const lunar = call(solar, 'getLunar');

    if (!lunar) {
      throw new Error('LUNAR_PROVIDER_FAILED');
    }

    const eightChar = call(lunar, 'getEightChar');

    if (!eightChar) {
      throw new Error('EIGHT_CHAR_PROVIDER_FAILED');
    }

    if (typeof (eightChar as Record<string, unknown>).setSect === 'function') {
      call(eightChar, 'setSect', dayBoundary === 'ziHour' ? 2 : 1);
    } else {
      warnings.push('PROVIDER_DAY_BOUNDARY_SECT_UNAVAILABLE');
    }

    const yearGan = readString(eightChar, ['getYearGan']) ||
      readString(lunar, ['getYearGanExact', 'getYearGan']);
    const yearZhi = readString(eightChar, ['getYearZhi']) ||
      readString(lunar, ['getYearZhiExact', 'getYearZhi']);

    const monthGan = readString(eightChar, ['getMonthGan']) ||
      readString(lunar, ['getMonthGanExact', 'getMonthGan']);
    const monthZhi = readString(eightChar, ['getMonthZhi']) ||
      readString(lunar, ['getMonthZhiExact', 'getMonthZhi']);

    const dayGan = readString(eightChar, ['getDayGan']) ||
      readString(lunar, ['getDayGanExact2', 'getDayGanExact', 'getDayGan']);
    const dayZhi = readString(eightChar, ['getDayZhi']) ||
      readString(lunar, ['getDayZhiExact2', 'getDayZhiExact', 'getDayZhi']);

    const hourGan = readString(eightChar, ['getTimeGan', 'getHourGan']) ||
      readString(lunar, ['getTimeGan']);
    const hourZhi = readString(eightChar, ['getTimeZhi', 'getHourZhi']) ||
      readString(lunar, ['getTimeZhi']);

    const rawLunarMonth = readNumber(lunar, ['getMonth']);

    const lunarYear = readNumber(lunar, ['getYear']);
    const lunarDay = readNumber(lunar, ['getDay']);

    if (
      rawLunarMonth === undefined ||
      lunarYear === undefined ||
      lunarDay === undefined
    ) {
      throw new Error('LUNAR_DATE_UNAVAILABLE');
    }

    const previousJie = parseSolarTerm(
      call(lunar, 'getPrevJie', true) ?? call(lunar, 'getPrevJie'),
    );

    const nextJie = parseSolarTerm(
      call(lunar, 'getNextJie', true) ?? call(lunar, 'getNextJie'),
    );

    if (!previousJie || !nextJie) {
      warnings.push('ADJACENT_JIE_UNAVAILABLE');
    }

    return {
      yearStemIndex: stemIndex(yearGan, 'year'),
      yearBranchIndex: branchIndex(yearZhi, 'year'),
      monthStemIndex: stemIndex(monthGan, 'month'),
      monthBranchIndex: branchIndex(monthZhi, 'month'),
      dayStemIndex: stemIndex(dayGan, 'day'),
      dayBranchIndex: branchIndex(dayZhi, 'day'),
      hourStemIndex: stemIndex(hourGan, 'hour'),
      hourBranchIndex: branchIndex(hourZhi, 'hour'),
      lunarDate: {
        year: lunarYear,
        month: Math.abs(rawLunarMonth),
        day: lunarDay,
        isLeapMonth: rawLunarMonth < 0,
      },
      previousJie,
      nextJie,
      providerName: this.name,
      providerWarnings: warnings,
    };
  }
}
