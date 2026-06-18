import type {
  BaziInterpretation,
  ChartDiagnostics,
  DiagnosticConfidence,
  InputValidationResult,
  LuckStart,
  SolarTermPoint,
  TimeNormalizationResult,
  UsefulElementAnalysis,
} from '../types';
import {localDateTimeToPseudoUtcMillis} from '../utils/math';

function confidence(score: number): DiagnosticConfidence {
  if (score >= 82) {
    return 'high';
  }

  if (score >= 58) {
    return 'medium';
  }

  return 'low';
}

function distanceMinutes(
  first: TimeNormalizationResult['correctedLocalDateTime'],
  second?: SolarTermPoint,
): number | null {
  if (!second) {
    return null;
  }

  return Math.abs(
    localDateTimeToPseudoUtcMillis(first) -
      localDateTimeToPseudoUtcMillis(second.localDateTime),
  ) / 60_000;
}

export function birthNearSolarTerm(
  normalizedTime: TimeNormalizationResult,
  previousJie?: SolarTermPoint,
  nextJie?: SolarTermPoint,
  thresholdMinutes = 180,
): boolean {
  const previousDistance = distanceMinutes(
    normalizedTime.correctedLocalDateTime,
    previousJie,
  );
  const nextDistance = distanceMinutes(
    normalizedTime.correctedLocalDateTime,
    nextJie,
  );

  return [previousDistance, nextDistance].some(
    value => value !== null && value <= thresholdMinutes,
  );
}

export function buildChartDiagnostics(params: {
  validation: InputValidationResult;
  normalizedTime: TimeNormalizationResult;
  previousJie?: SolarTermPoint;
  nextJie?: SolarTermPoint;
  luckStart: LuckStart;
  usefulElements: UsefulElementAnalysis;
  interpretation: BaziInterpretation;
  warnings: string[];
}): ChartDiagnostics {
  const {
    validation,
    normalizedTime,
    previousJie,
    nextJie,
    luckStart,
    usefulElements,
    interpretation,
    warnings,
  } = params;

  const timeCodes: string[] = [];
  let timeScore = 100;

  if (warnings.includes('AMBIGUOUS_LOCAL_TIME_EARLIER_INSTANT_SELECTED')) {
    timeScore -= 28;
    timeCodes.push('DIAGNOSTIC_AMBIGUOUS_LOCAL_TIME');
  }

  if (warnings.includes('NONEXISTENT_LOCAL_TIME_NORMALIZED')) {
    timeScore -= 38;
    timeCodes.push('DIAGNOSTIC_NONEXISTENT_LOCAL_TIME');
  }

  if (warnings.includes('TRUE_SOLAR_TIME_LONGITUDE_MISSING')) {
    timeScore -= 35;
    timeCodes.push('DIAGNOSTIC_TRUE_SOLAR_LONGITUDE_MISSING');
  }

  if (warnings.includes('TRUE_SOLAR_TIME_CROSSED_DATE_BOUNDARY')) {
    timeScore -= 12;
    timeCodes.push('DIAGNOSTIC_TRUE_SOLAR_CROSSED_DATE');
  }

  if (Math.abs(normalizedTime.totalCorrectionMinutes) >= 45) {
    timeScore -= 8;
    timeCodes.push('DIAGNOSTIC_LARGE_SOLAR_TIME_CORRECTION');
  }

  let pillarScore = 96;
  const pillarCodes: string[] = [];

  if (birthNearSolarTerm(normalizedTime, previousJie, nextJie)) {
    pillarScore -= 35;
    pillarCodes.push('DIAGNOSTIC_BIRTH_NEAR_SOLAR_TERM');
  }

  if (
    validation.warnings.some(item =>
      ['BIRTH_NEAR_ZI_HOUR_DAY_BOUNDARY', 'BIRTH_NEAR_MIDNIGHT_DAY_BOUNDARY'].includes(
        item.code,
      ),
    )
  ) {
    pillarScore -= 24;
    pillarCodes.push('DIAGNOSTIC_BIRTH_NEAR_DAY_BOUNDARY');
  }

  if (warnings.includes('PROVIDER_DAY_BOUNDARY_SECT_UNAVAILABLE')) {
    pillarScore -= 20;
    pillarCodes.push('DIAGNOSTIC_PROVIDER_DAY_BOUNDARY_LIMITATION');
  }

  let luckScore = 94;
  const luckCodes: string[] = [];

  if (luckStart.direction === 'undetermined') {
    luckScore -= 55;
    luckCodes.push('DIAGNOSTIC_LUCK_DIRECTION_UNDETERMINED');
  }

  if (luckStart.method === 'providerFallback') {
    luckScore -= 32;
    luckCodes.push('DIAGNOSTIC_LUCK_START_PROVIDER_FALLBACK');
  }

  if (luckStart.method === 'undetermined') {
    luckScore -= 25;
  }

  const interpretationScores = Object.values(interpretation).map(item => item.score);
  const interpretationSpread = Math.max(...interpretationScores) - Math.min(...interpretationScores);
  let interpretationScore = 82;
  const interpretationCodes: string[] = [];

  if (usefulElements.confidence === 'low') {
    interpretationScore -= 24;
    interpretationCodes.push('DIAGNOSTIC_USEFUL_ELEMENT_LOW_CONFIDENCE');
  } else if (usefulElements.confidence === 'medium') {
    interpretationScore -= 10;
  }

  if (interpretationSpread >= 55) {
    interpretationScore -= 8;
    interpretationCodes.push('DIAGNOSTIC_INTERPRETATION_SCORE_SPREAD_HIGH');
  }

  interpretationCodes.push('DIAGNOSTIC_TRADITIONAL_REFERENCE_ONLY');

  const scores = [timeScore, pillarScore, luckScore, interpretationScore].map(value =>
    Math.max(0, Math.min(100, Math.round(value))),
  );
  const overallScore = Math.round(
    scores[0] * 0.3 + scores[1] * 0.32 + scores[2] * 0.2 + scores[3] * 0.18,
  );
  const codes = Array.from(
    new Set([
      ...timeCodes,
      ...pillarCodes,
      ...luckCodes,
      ...interpretationCodes,
    ]),
  );

  return {
    overallScore,
    overallConfidence: confidence(overallScore),
    time: {
      score: scores[0],
      confidence: confidence(scores[0]),
      codes: timeCodes,
    },
    pillars: {
      score: scores[1],
      confidence: confidence(scores[1]),
      codes: pillarCodes,
    },
    luck: {
      score: scores[2],
      confidence: confidence(scores[2]),
      codes: luckCodes,
    },
    interpretation: {
      score: scores[3],
      confidence: confidence(scores[3]),
      codes: interpretationCodes,
    },
    codes,
  };
}
