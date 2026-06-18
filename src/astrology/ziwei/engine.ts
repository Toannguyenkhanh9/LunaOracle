import {HEAVENLY_STEMS} from './constants';
import {LunarJavascriptZiweiCalendarProvider} from './calendar/lunarJavascriptProvider';
import {placeAuxiliaryStars} from './core/auxiliaryStars';
import {evaluateMainStarBrightness} from './core/brightness';
import {calculateFiveElementBureau} from './core/bureau';
import {calculateLifeAndBodyPalaces} from './core/lifeBody';
import {placeFourteenMainStars} from './core/mainStars';
import {buildTwelvePalaces, getBodyResidencePalaceId} from './core/palaces';
import {calculatePolarityProfile} from './core/polarity';
import {placeTrangSinhCycle} from './core/trangSinh';
import {placeFourTransformations} from './core/transformations';
import {placeVoidMarkers} from './core/voidMarkers';
import {placeMajorCycles} from './core/majorCycles';
import {placeMinorCycles} from './core/minorCycles';
import {buildAnnualCycles} from './core/annualCycles';
import {buildZiweiInterpretation} from './interpretation/interpreter';
import {validateZiweiBirthInput} from './validation/input';
import type {
  ZiweiBirthInput,
  ZiweiCalendarProvider,
  ZiweiChartStage1,
  ZiweiChartStage2,
  ZiweiChartStage3,
  ZiweiChartStage4,
  ZiweiChartStage5,
  ZiweiChartStage6,
  ZiweiDiagnosticCode,
} from './types';

function buildDiagnostics(
  input: ZiweiBirthInput,
  isLeapMonth: boolean,
  stage: 1 | 2 | 3 | 4 | 5 | 6,
): ZiweiDiagnosticCode[] {
  const diagnostics: ZiweiDiagnosticCode[] = ['TIME_ZONE_METADATA_ONLY'];
  const minute = input.localDateTime.minute;

  if (minute <= 10 || minute >= 50) {
    diagnostics.push('BIRTH_NEAR_HOUR_BOUNDARY');
  }

  if (isLeapMonth) {
    diagnostics.push('LEAP_LUNAR_MONTH');
  }

  if (stage >= 2 && stage < 4) {
    diagnostics.push('MAIN_STAR_BRIGHTNESS_NOT_EVALUATED');
  }

  if (stage >= 3) {
    diagnostics.push('AUXILIARY_STAR_RULESET_VIETNAMESE_V1');
    diagnostics.push('FIRE_BELL_RULESET_VARIANT');
  }

  if (stage >= 4) {
    diagnostics.push('FOUR_TRANSFORMATIONS_YEAR_STEM_V1');
    diagnostics.push('VOID_MARKERS_REFERENCE_V1');
    diagnostics.push('TRANG_SINH_REFERENCE_V1');
    diagnostics.push('MAIN_STAR_BRIGHTNESS_REFERENCE_V1');
    diagnostics.push('BRIGHTNESS_TABLE_REQUIRES_EXPERT_REVIEW');
  }

  if (stage >= 5) {
    diagnostics.push('MAJOR_CYCLE_REFERENCE_V1');
    diagnostics.push('MINOR_CYCLE_REFERENCE_V1');
    diagnostics.push('ANNUAL_TRANSIT_REFERENCE_V1');
    diagnostics.push('ANNUAL_BOUNDARY_REFERENCE_ONLY');
    diagnostics.push('CYCLE_AGE_USES_NOMINAL_AGE');
  }

  if (stage >= 6) {
    diagnostics.push('INTERPRETATION_REFERENCE_V1');
    diagnostics.push('INTERPRETATION_REQUIRES_EXPERT_REVIEW');
  }

  return diagnostics;
}

function calculateFoundation(
  calendarProvider: ZiweiCalendarProvider,
  input: ZiweiBirthInput,
) {
  validateZiweiBirthInput(input);

  const lunar = calendarProvider.getLunarBirthProfile(input.localDateTime);
  const yearStemIndex = HEAVENLY_STEMS.findIndex(
    item => item.id === lunar.yearStemId,
  );

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

  const bureau = calculateFiveElementBureau(
    yearStemIndex,
    lifeBody.lifeBranchIndex,
  );

  return {
    lunar,
    yearStemIndex,
    lifeBody,
    palaces,
    bureau,
    polarity: calculatePolarityProfile(yearStemIndex, input.gender),
  };
}

function withZiHourDiagnostic(
  diagnostics: ZiweiDiagnosticCode[],
  birthHourBranchId: string,
): ZiweiDiagnosticCode[] {
  if (birthHourBranchId === 'zi') {
    diagnostics.push('BIRTH_AT_ZI_HOUR');
  }

  return diagnostics;
}

export class ZiweiStage1Engine {
  constructor(
    private readonly calendarProvider: ZiweiCalendarProvider =
      new LunarJavascriptZiweiCalendarProvider(),
  ) {}

  calculate(input: ZiweiBirthInput): ZiweiChartStage1 {
    const foundation = calculateFoundation(this.calendarProvider, input);
    const diagnostics = withZiHourDiagnostic(
      buildDiagnostics(input, foundation.lunar.isLeapMonth, 1),
      foundation.lunar.birthHourBranchId,
    );

    return {
      version: '1.0.0',
      ruleset: 'vietnamese-traditional-v1',
      input,
      lunar: foundation.lunar,
      polarity: foundation.polarity,
      lifePalaceBranchId: foundation.lifeBody.lifeBranchId,
      lifePalaceBranchIndex: foundation.lifeBody.lifeBranchIndex,
      bodyPalaceBranchId: foundation.lifeBody.bodyBranchId,
      bodyPalaceBranchIndex: foundation.lifeBody.bodyBranchIndex,
      bodyResidencePalaceId: getBodyResidencePalaceId(foundation.palaces),
      palaces: foundation.palaces,
      bureau: foundation.bureau,
      diagnostics,
    };
  }
}

export class ZiweiStage2Engine {
  constructor(
    private readonly calendarProvider: ZiweiCalendarProvider =
      new LunarJavascriptZiweiCalendarProvider(),
  ) {}

  calculate(input: ZiweiBirthInput): ZiweiChartStage2 {
    const foundation = calculateFoundation(this.calendarProvider, input);
    const mainStarResult = placeFourteenMainStars(
      foundation.palaces,
      foundation.lunar.lunarDay,
      foundation.bureau.number,
    );
    const diagnostics = withZiHourDiagnostic(
      buildDiagnostics(input, foundation.lunar.isLeapMonth, 2),
      foundation.lunar.birthHourBranchId,
    );

    return {
      version: '2.0.0',
      ruleset: 'vietnamese-traditional-v1',
      input,
      lunar: foundation.lunar,
      polarity: foundation.polarity,
      lifePalaceBranchId: foundation.lifeBody.lifeBranchId,
      lifePalaceBranchIndex: foundation.lifeBody.lifeBranchIndex,
      bodyPalaceBranchId: foundation.lifeBody.bodyBranchId,
      bodyPalaceBranchIndex: foundation.lifeBody.bodyBranchIndex,
      bodyResidencePalaceId: getBodyResidencePalaceId(foundation.palaces),
      palaces: foundation.palaces,
      bureau: foundation.bureau,
      diagnostics,
      mainStarAnchors: mainStarResult.anchors,
      mainStars: mainStarResult.placements,
      mainStarsByPalace: mainStarResult.byPalace,
    };
  }
}

export class ZiweiStage3Engine {
  constructor(
    private readonly calendarProvider: ZiweiCalendarProvider =
      new LunarJavascriptZiweiCalendarProvider(),
  ) {}

  calculate(input: ZiweiBirthInput): ZiweiChartStage3 {
    const foundation = calculateFoundation(this.calendarProvider, input);
    const mainStarResult = placeFourteenMainStars(
      foundation.palaces,
      foundation.lunar.lunarDay,
      foundation.bureau.number,
    );
    const auxiliaryResult = placeAuxiliaryStars(
      foundation.palaces,
      foundation.lunar.lunarMonth,
      foundation.lunar.birthHourBranchIndex,
      foundation.lunar.yearStemId,
      foundation.lunar.yearBranchId,
    );
    const diagnostics = withZiHourDiagnostic(
      buildDiagnostics(input, foundation.lunar.isLeapMonth, 3),
      foundation.lunar.birthHourBranchId,
    );

    return {
      version: '3.0.0',
      ruleset: 'vietnamese-traditional-v1',
      input,
      lunar: foundation.lunar,
      polarity: foundation.polarity,
      lifePalaceBranchId: foundation.lifeBody.lifeBranchId,
      lifePalaceBranchIndex: foundation.lifeBody.lifeBranchIndex,
      bodyPalaceBranchId: foundation.lifeBody.bodyBranchId,
      bodyPalaceBranchIndex: foundation.lifeBody.bodyBranchIndex,
      bodyResidencePalaceId: getBodyResidencePalaceId(foundation.palaces),
      palaces: foundation.palaces,
      bureau: foundation.bureau,
      diagnostics,
      mainStarAnchors: mainStarResult.anchors,
      mainStars: mainStarResult.placements,
      mainStarsByPalace: mainStarResult.byPalace,
      auxiliaryStars: auxiliaryResult.placements,
      auxiliaryStarsByPalace: auxiliaryResult.byPalace,
      auxiliarySummary: auxiliaryResult.summary,
    };
  }
}

export class ZiweiStage4Engine {
  constructor(
    private readonly calendarProvider: ZiweiCalendarProvider =
      new LunarJavascriptZiweiCalendarProvider(),
  ) {}

  calculate(input: ZiweiBirthInput): ZiweiChartStage4 {
    const foundation = calculateFoundation(this.calendarProvider, input);

    const rawMainStars = placeFourteenMainStars(
      foundation.palaces,
      foundation.lunar.lunarDay,
      foundation.bureau.number,
    );

    const brightness = evaluateMainStarBrightness(rawMainStars.placements);

    const auxiliaryResult = placeAuxiliaryStars(
      foundation.palaces,
      foundation.lunar.lunarMonth,
      foundation.lunar.birthHourBranchIndex,
      foundation.lunar.yearStemId,
      foundation.lunar.yearBranchId,
    );

    const transformations = placeFourTransformations(
      foundation.lunar.yearStemId,
      brightness.placements,
      auxiliaryResult.placements,
    );

    const voidMarkers = placeVoidMarkers(
      foundation.palaces,
      foundation.lunar.yearStemId,
      foundation.lunar.yearBranchId,
    );

    const trangSinh = placeTrangSinhCycle(
      foundation.palaces,
      foundation.bureau.element,
      foundation.polarity.majorCycleDirection,
    );

    const diagnostics = withZiHourDiagnostic(
      buildDiagnostics(input, foundation.lunar.isLeapMonth, 4),
      foundation.lunar.birthHourBranchId,
    );

    return {
      version: '4.0.0',
      ruleset: 'vietnamese-traditional-v1',
      input,
      lunar: foundation.lunar,
      polarity: foundation.polarity,
      lifePalaceBranchId: foundation.lifeBody.lifeBranchId,
      lifePalaceBranchIndex: foundation.lifeBody.lifeBranchIndex,
      bodyPalaceBranchId: foundation.lifeBody.bodyBranchId,
      bodyPalaceBranchIndex: foundation.lifeBody.bodyBranchIndex,
      bodyResidencePalaceId: getBodyResidencePalaceId(foundation.palaces),
      palaces: foundation.palaces,
      bureau: foundation.bureau,
      diagnostics,
      mainStarAnchors: rawMainStars.anchors,
      mainStars: brightness.placements,
      mainStarsByPalace: brightness.byPalace,
      auxiliaryStars: auxiliaryResult.placements,
      auxiliaryStarsByPalace: auxiliaryResult.byPalace,
      auxiliarySummary: auxiliaryResult.summary,
      transformations: transformations.placements,
      transformationsByPalace: transformations.byPalace,
      voidMarkers: voidMarkers.placements,
      voidMarkersByPalace: voidMarkers.byPalace,
      trangSinhCycle: trangSinh.placements,
      trangSinhByPalace: trangSinh.byPalace,
      brightnessSummary: brightness.summary,
    };
  }
}


export class ZiweiStage5Engine {
  constructor(
    private readonly calendarProvider: ZiweiCalendarProvider =
      new LunarJavascriptZiweiCalendarProvider(),
  ) {}

  calculate(input: ZiweiBirthInput): ZiweiChartStage5 {
    const foundation = calculateFoundation(this.calendarProvider, input);

    const rawMainStars = placeFourteenMainStars(
      foundation.palaces,
      foundation.lunar.lunarDay,
      foundation.bureau.number,
    );
    const brightness = evaluateMainStarBrightness(rawMainStars.placements);
    const auxiliaryResult = placeAuxiliaryStars(
      foundation.palaces,
      foundation.lunar.lunarMonth,
      foundation.lunar.birthHourBranchIndex,
      foundation.lunar.yearStemId,
      foundation.lunar.yearBranchId,
    );
    const transformations = placeFourTransformations(
      foundation.lunar.yearStemId,
      brightness.placements,
      auxiliaryResult.placements,
    );
    const voidMarkers = placeVoidMarkers(
      foundation.palaces,
      foundation.lunar.yearStemId,
      foundation.lunar.yearBranchId,
    );
    const trangSinh = placeTrangSinhCycle(
      foundation.palaces,
      foundation.bureau.element,
      foundation.polarity.majorCycleDirection,
    );
    const majorCycles = placeMajorCycles(
      foundation.palaces,
      foundation.bureau.number,
      foundation.polarity.majorCycleDirection,
    );
    const minorCycles = placeMinorCycles(
      foundation.palaces,
      foundation.lunar.lunarYear,
      foundation.lunar.yearBranchId,
      input.gender,
      120,
    );
    const annualCycles = buildAnnualCycles(
      foundation.palaces,
      foundation.lunar.lunarYear,
      brightness.placements,
      auxiliaryResult.placements,
      majorCycles.placements,
      minorCycles.placements,
      120,
    );
    const diagnostics = withZiHourDiagnostic(
      buildDiagnostics(input, foundation.lunar.isLeapMonth, 5),
      foundation.lunar.birthHourBranchId,
    );

    return {
      version: '5.0.0',
      ruleset: 'vietnamese-traditional-v1',
      cycleRuleset: 'vietnamese-cycle-reference-v1',
      input,
      lunar: foundation.lunar,
      polarity: foundation.polarity,
      lifePalaceBranchId: foundation.lifeBody.lifeBranchId,
      lifePalaceBranchIndex: foundation.lifeBody.lifeBranchIndex,
      bodyPalaceBranchId: foundation.lifeBody.bodyBranchId,
      bodyPalaceBranchIndex: foundation.lifeBody.bodyBranchIndex,
      bodyResidencePalaceId: getBodyResidencePalaceId(foundation.palaces),
      palaces: foundation.palaces,
      bureau: foundation.bureau,
      diagnostics,
      mainStarAnchors: rawMainStars.anchors,
      mainStars: brightness.placements,
      mainStarsByPalace: brightness.byPalace,
      auxiliaryStars: auxiliaryResult.placements,
      auxiliaryStarsByPalace: auxiliaryResult.byPalace,
      auxiliarySummary: auxiliaryResult.summary,
      transformations: transformations.placements,
      transformationsByPalace: transformations.byPalace,
      voidMarkers: voidMarkers.placements,
      voidMarkersByPalace: voidMarkers.byPalace,
      trangSinhCycle: trangSinh.placements,
      trangSinhByPalace: trangSinh.byPalace,
      brightnessSummary: brightness.summary,
      majorCycles: majorCycles.placements,
      majorCyclesByPalace: majorCycles.byPalace,
      minorCycles: minorCycles.placements,
      minorCyclesByPalace: minorCycles.byPalace,
      annualCycles,
      annualCycleRange: {
        startYear: annualCycles[0].calendarYear,
        endYear: annualCycles[annualCycles.length - 1].calendarYear,
        totalYears: annualCycles.length,
      },
    };
  }
}

export function createStage1ZiweiEngine(): ZiweiStage1Engine {
  return new ZiweiStage1Engine();
}

export function createStage2ZiweiEngine(): ZiweiStage2Engine {
  return new ZiweiStage2Engine();
}

export function createStage3ZiweiEngine(): ZiweiStage3Engine {
  return new ZiweiStage3Engine();
}

export function createStage4ZiweiEngine(): ZiweiStage4Engine {
  return new ZiweiStage4Engine();
}

export function createStage5ZiweiEngine(): ZiweiStage5Engine {
  return new ZiweiStage5Engine();
}

export class ZiweiStage6Engine {
  constructor(
    private readonly calendarProvider: ZiweiCalendarProvider =
      new LunarJavascriptZiweiCalendarProvider(),
  ) {}

  calculate(input: ZiweiBirthInput): ZiweiChartStage6 {
    const stage5 = new ZiweiStage5Engine(this.calendarProvider).calculate(input);
    const interpretation = buildZiweiInterpretation(stage5);
    const diagnostics = withZiHourDiagnostic(
      buildDiagnostics(input, stage5.lunar.isLeapMonth, 6),
      stage5.lunar.birthHourBranchId,
    );
    const {version: _version, diagnostics: _diagnostics, ...base} = stage5;

    return {
      ...base,
      version: '6.0.0',
      diagnostics,
      interpretationRuleset: 'ziwei-interpretation-reference-v1',
      interpretation,
    };
  }
}

export function createStage6ZiweiEngine(): ZiweiStage6Engine {
  return new ZiweiStage6Engine();
}

export function createDefaultZiweiEngine(): ZiweiStage6Engine {
  return new ZiweiStage6Engine();
}
