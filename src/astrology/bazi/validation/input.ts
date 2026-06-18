import type {
  BirthInput,
  InputValidationIssue,
  InputValidationResult,
} from '../types';
import {isValidLocalDateTime} from '../utils/math';
import {resolveLocalDateTime} from '../utils/timezone';

function issue(
  code: string,
  severity: InputValidationIssue['severity'],
  field?: InputValidationIssue['field'],
  details?: InputValidationIssue['details'],
): InputValidationIssue {
  return {code, severity, field, details};
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function validateBirthInput(input: BirthInput): InputValidationResult {
  const issues: InputValidationIssue[] = [];
  const local = {
    ...input.localDateTime,
    second: input.localDateTime.second ?? 0,
  };

  if (!isValidLocalDateTime(local)) {
    issues.push(issue('INVALID_LOCAL_DATE_TIME', 'error', 'localDateTime'));
  }

  if (!input.location.timeZone?.trim()) {
    issues.push(issue('TIME_ZONE_REQUIRED', 'error', 'timeZone'));
  } else if (isValidLocalDateTime(local)) {
    try {
      const resolution = resolveLocalDateTime(local, input.location.timeZone);

      if (resolution.status === 'ambiguous') {
        issues.push(
          issue('AMBIGUOUS_LOCAL_TIME', 'warning', 'localDateTime', {
            candidateCount: resolution.candidatesUtcIso.length,
          }),
        );
      } else if (resolution.status === 'nonexistent') {
        issues.push(issue('NONEXISTENT_LOCAL_TIME', 'warning', 'localDateTime'));
      }
    } catch (error) {
      const code = error instanceof Error ? error.message : 'INVALID_TIME_ZONE';
      issues.push(issue(code, 'error', 'timeZone'));
    }
  }

  const longitude = input.location.longitude;
  const latitude = input.location.latitude;

  if (longitude !== undefined && (!isFiniteNumber(longitude) || longitude < -180 || longitude > 180)) {
    issues.push(issue('INVALID_LONGITUDE', 'error', 'longitude'));
  }

  if (latitude !== undefined && (!isFiniteNumber(latitude) || latitude < -90 || latitude > 90)) {
    issues.push(issue('INVALID_LATITUDE', 'error', 'latitude'));
  }

  if (input.options?.timeCorrection === 'trueSolar' && longitude === undefined) {
    issues.push(issue('TRUE_SOLAR_LONGITUDE_REQUIRED', 'error', 'longitude'));
  }

  if (input.gender === 'unspecified') {
    issues.push(issue('GENDER_UNSPECIFIED_LUCK_DIRECTION_UNAVAILABLE', 'warning', 'gender'));
  }

  const hour = local.hour;
  const minute = local.minute;
  const minutesFromMidnight = hour * 60 + minute;

  if (input.options?.dayBoundary === 'ziHour') {
    if (minutesFromMidnight >= 22 * 60 + 30 || minutesFromMidnight <= 30) {
      issues.push(issue('BIRTH_NEAR_ZI_HOUR_DAY_BOUNDARY', 'warning', 'localDateTime'));
    }
  } else if (minutesFromMidnight <= 30 || minutesFromMidnight >= 23 * 60 + 30) {
    issues.push(issue('BIRTH_NEAR_MIDNIGHT_DAY_BOUNDARY', 'warning', 'localDateTime'));
  }

  if (local.year < 1900) {
    issues.push(
      issue('PRE_1900_TIME_ZONE_DATA_MAY_VARY_BY_RUNTIME', 'warning', 'localDateTime', {
        year: local.year,
      }),
    );
  }

  if ((input.options?.luckPillarCount ?? 8) > 12) {
    issues.push(issue('LUCK_PILLAR_COUNT_WILL_BE_CLAMPED', 'info', 'options'));
  }

  if ((input.options?.annualTransitYears ?? 12) > 60) {
    issues.push(issue('ANNUAL_TRANSIT_COUNT_WILL_BE_CLAMPED', 'info', 'options'));
  }

  const errors = issues.filter(item => item.severity === 'error');
  const warnings = issues.filter(item => item.severity === 'warning');

  return {
    valid: errors.length === 0,
    issues,
    errors,
    warnings,
  };
}

export function assertValidBirthInput(input: BirthInput): InputValidationResult {
  const result = validateBirthInput(input);

  if (!result.valid) {
    throw new Error(result.errors[0]?.code ?? 'INVALID_BIRTH_INPUT');
  }

  return result;
}
