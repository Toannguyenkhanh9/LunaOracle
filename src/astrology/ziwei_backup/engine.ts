import {HEAVENLY_STEMS} from './constants';
import {LunarJavascriptZiweiCalendarProvider} from './calendar/lunarJavascriptProvider';
import {calculateFiveElementBureau} from './core/bureau';
import {calculateLifeAndBodyPalaces} from './core/lifeBody';
import {buildTwelvePalaces, getBodyResidencePalaceId} from './core/palaces';
import {calculatePolarityProfile} from './core/polarity';
import {validateZiweiBirthInput} from './validation/input';
import type {
  ZiweiBirthInput,
  ZiweiCalendarProvider,
  ZiweiChartStage1,
  ZiweiDiagnosticCode,
} from './types';

export class ZiweiStage1Engine {
  constructor(
    private readonly calendarProvider: ZiweiCalendarProvider =
      new LunarJavascriptZiweiCalendarProvider(),
  ) {}

  calculate(input: ZiweiBirthInput): ZiweiChartStage1 {
    validateZiweiBirthInput(input);

    const lunar = this.calendarProvider.getLunarBirthProfile(input.localDateTime);
    const yearStemIndex = HEAVENLY_STEMS.findIndex(item => item.id === lunar.yearStemId);

    if (yearStemIndex < 0) {
      throw new Error('YEAR_STEM_NOT_FOUND');
    }

    const lifeBody = calculateLifeAndBodyPalaces(
      lunar.lunarMonth,
      lunar.birthHourBranchIndex,
    );

    const palaces = buildTwelvePalaces(
      lifeBody.lifeBranchIndex,
      lifeBody.bodyBranchIndex,
    );

    const diagnostics: ZiweiDiagnosticCode[] = ['TIME_ZONE_METADATA_ONLY'];
    const minute = input.localDateTime.minute;

    if (minute <= 10 || minute >= 50) {
      diagnostics.push('BIRTH_NEAR_HOUR_BOUNDARY');
    }

    if (lunar.birthHourBranchId === 'zi') {
      diagnostics.push('BIRTH_AT_ZI_HOUR');
    }

    if (lunar.isLeapMonth) {
      diagnostics.push('LEAP_LUNAR_MONTH');
    }

    return {
      version: '1.0.0',
      ruleset: 'vietnamese-traditional-v1',
      input,
      lunar,
      polarity: calculatePolarityProfile(yearStemIndex, input.gender),
      lifePalaceBranchId: lifeBody.lifeBranchId,
      lifePalaceBranchIndex: lifeBody.lifeBranchIndex,
      bodyPalaceBranchId: lifeBody.bodyBranchId,
      bodyPalaceBranchIndex: lifeBody.bodyBranchIndex,
      bodyResidencePalaceId: getBodyResidencePalaceId(palaces),
      palaces,
      bureau: calculateFiveElementBureau(yearStemIndex, lifeBody.lifeBranchIndex),
      diagnostics,
    };
  }
}

export function createDefaultZiweiEngine(): ZiweiStage1Engine {
  return new ZiweiStage1Engine();
}
