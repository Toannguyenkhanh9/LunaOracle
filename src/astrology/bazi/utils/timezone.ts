import type {
  BirthInput,
  LocalDateTimeInput,
  TimeNormalizationResult,
  LocalTimeResolution,
} from '../types';
import {
  addMinutesToLocalDateTime,
  isValidLocalDateTime,
  localDateTimeToPseudoUtcMillis,
  round,
} from './math';

function getFormatter(timeZone: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });
}

function formatParts(date: Date, timeZone: string): LocalDateTimeInput {
  const parts = getFormatter(timeZone).formatToParts(date);
  const map = Object.fromEntries(
    parts
      .filter(item => item.type !== 'literal')
      .map(item => [item.type, item.value]),
  );

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    second: Number(map.second),
  };
}

function sameLocalDateTime(
  first: LocalDateTimeInput,
  second: LocalDateTimeInput,
): boolean {
  return (
    first.year === second.year &&
    first.month === second.month &&
    first.day === second.day &&
    first.hour === second.hour &&
    first.minute === second.minute &&
    (first.second ?? 0) === (second.second ?? 0)
  );
}

function iterativeUtcGuess(
  local: LocalDateTimeInput,
  timeZone: string,
): Date {
  const desiredPseudoUtc = localDateTimeToPseudoUtcMillis(local);
  let guess = desiredPseudoUtc;

  for (let index = 0; index < 6; index += 1) {
    const rendered = formatParts(new Date(guess), timeZone);
    const renderedPseudoUtc = localDateTimeToPseudoUtcMillis(rendered);
    const delta = desiredPseudoUtc - renderedPseudoUtc;

    if (delta === 0) {
      break;
    }

    guess += delta;
  }

  return new Date(guess);
}

export function resolveLocalDateTime(
  local: LocalDateTimeInput,
  timeZone: string,
): LocalTimeResolution {
  if (!isValidLocalDateTime(local)) {
    throw new Error('INVALID_LOCAL_DATE_TIME');
  }

  try {
    getFormatter(timeZone).format(new Date());
  } catch {
    throw new Error('INVALID_TIME_ZONE');
  }

  const desiredPseudoUtc = localDateTimeToPseudoUtcMillis(local);
  const offsets = new Set<number>();

  // Sampling both sides of the requested wall time captures historical
  // offset changes, daylight-saving gaps, folds, and half-hour zones.
  for (let hour = -48; hour <= 48; hour += 6) {
    const sample = new Date(desiredPseudoUtc + hour * 3_600_000);
    offsets.add(getTimeZoneOffsetMinutes(sample, timeZone));
  }

  const candidates = Array.from(offsets)
    .map(offset => new Date(desiredPseudoUtc - offset * 60_000))
    .filter(candidate => sameLocalDateTime(formatParts(candidate, timeZone), local))
    .sort((first, second) => first.getTime() - second.getTime());

  const uniqueCandidates = candidates.filter(
    (candidate, index) =>
      index === 0 || candidate.getTime() !== candidates[index - 1].getTime(),
  );

  const selected = uniqueCandidates[0] ?? iterativeUtcGuess(local, timeZone);

  return {
    status:
      uniqueCandidates.length === 0
        ? 'nonexistent'
        : uniqueCandidates.length > 1
          ? 'ambiguous'
          : 'valid',
    candidatesUtcIso: uniqueCandidates.map(item => item.toISOString()),
    selectedUtcIso: selected.toISOString(),
  };
}

export function zonedLocalDateTimeToUtc(
  local: LocalDateTimeInput,
  timeZone: string,
): Date {
  return new Date(resolveLocalDateTime(local, timeZone).selectedUtcIso);
}

export function getTimeZoneOffsetMinutes(
  utcInstant: Date,
  timeZone: string,
): number {
  const rendered = formatParts(utcInstant, timeZone);
  const renderedPseudoUtc = localDateTimeToPseudoUtcMillis(rendered);
  return Math.round((renderedPseudoUtc - utcInstant.getTime()) / 60_000);
}

function getDayOfYear(value: LocalDateTimeInput): number {
  const start = Date.UTC(value.year, 0, 1);
  const current = Date.UTC(value.year, value.month - 1, value.day);
  return Math.floor((current - start) / 86_400_000) + 1;
}

export function equationOfTimeMinutes(value: LocalDateTimeInput): number {
  const dayOfYear = getDayOfYear(value);
  const radians = (2 * Math.PI * (dayOfYear - 81)) / 364;

  return (
    9.87 * Math.sin(2 * radians) -
    7.53 * Math.cos(radians) -
    1.5 * Math.sin(radians)
  );
}

export function normalizeBirthTime(input: BirthInput): TimeNormalizationResult {
  const civil = {
    ...input.localDateTime,
    second: input.localDateTime.second ?? 0,
  };

  const warnings: string[] = [];
  const localResolution = resolveLocalDateTime(civil, input.location.timeZone);
  const utc = new Date(localResolution.selectedUtcIso);
  const offsetMinutes = getTimeZoneOffsetMinutes(utc, input.location.timeZone);

  if (localResolution.status === 'ambiguous') {
    warnings.push('AMBIGUOUS_LOCAL_TIME_EARLIER_INSTANT_SELECTED');
  } else if (localResolution.status === 'nonexistent') {
    warnings.push('NONEXISTENT_LOCAL_TIME_NORMALIZED');
  }

  let equationMinutes = 0;
  let longitudeMinutes = 0;
  let totalCorrection = 0;

  if (input.options?.timeCorrection === 'trueSolar') {
    if (typeof input.location.longitude !== 'number') {
      warnings.push('TRUE_SOLAR_TIME_LONGITUDE_MISSING');
    } else {
      equationMinutes = equationOfTimeMinutes(civil);
      const standardMeridian = (offsetMinutes / 60) * 15;
      longitudeMinutes = 4 * (input.location.longitude - standardMeridian);
      totalCorrection = equationMinutes + longitudeMinutes;
    }
  }

  const corrected = addMinutesToLocalDateTime(civil, totalCorrection);

  if (
    corrected.year !== civil.year ||
    corrected.month !== civil.month ||
    corrected.day !== civil.day
  ) {
    warnings.push('TRUE_SOLAR_TIME_CROSSED_DATE_BOUNDARY');
  }

  return {
    civilLocalDateTime: civil,
    correctedLocalDateTime: corrected,
    utcInstantIso: utc.toISOString(),
    timeZoneOffsetMinutes: offsetMinutes,
    equationOfTimeMinutes: round(equationMinutes, 2),
    longitudeCorrectionMinutes: round(longitudeMinutes, 2),
    totalCorrectionMinutes: round(totalCorrection, 2),
    warnings,
  };
}
