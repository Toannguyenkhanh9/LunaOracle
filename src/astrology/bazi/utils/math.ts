import type {Element, LocalDateTimeInput} from '../types';

export function positiveModulo(value: number, modulo: number): number {
  return ((value % modulo) + modulo) % modulo;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function round(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function normalizeRecord(
  values: Record<Element, number>,
): Record<Element, number> {
  const total = Object.values(values).reduce((sum, item) => sum + item, 0);

  if (total <= 0) {
    return {
      wood: 0,
      fire: 0,
      earth: 0,
      metal: 0,
      water: 0,
    };
  }

  return {
    wood: round((values.wood / total) * 100, 2),
    fire: round((values.fire / total) * 100, 2),
    earth: round((values.earth / total) * 100, 2),
    metal: round((values.metal / total) * 100, 2),
    water: round((values.water / total) * 100, 2),
  };
}

export function emptyElementRecord(): Record<Element, number> {
  return {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  };
}

export function compareLocalDateTime(
  first: LocalDateTimeInput,
  second: LocalDateTimeInput,
): number {
  return localDateTimeToPseudoUtcMillis(first) - localDateTimeToPseudoUtcMillis(second);
}

export function localDateTimeToPseudoUtcMillis(value: LocalDateTimeInput): number {
  return Date.UTC(
    value.year,
    value.month - 1,
    value.day,
    value.hour,
    value.minute,
    value.second ?? 0,
    0,
  );
}

export function addMinutesToLocalDateTime(
  value: LocalDateTimeInput,
  minutes: number,
): LocalDateTimeInput {
  const date = new Date(localDateTimeToPseudoUtcMillis(value) + minutes * 60_000);

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: date.getUTCSeconds(),
  };
}

export function isValidLocalDateTime(value: LocalDateTimeInput): boolean {
  if (
    !Number.isInteger(value.year) ||
    !Number.isInteger(value.month) ||
    !Number.isInteger(value.day) ||
    !Number.isInteger(value.hour) ||
    !Number.isInteger(value.minute) ||
    !Number.isInteger(value.second ?? 0)
  ) {
    return false;
  }

  if (
    value.year < 1600 ||
    value.year > 2400 ||
    value.month < 1 ||
    value.month > 12 ||
    value.day < 1 ||
    value.day > 31 ||
    value.hour < 0 ||
    value.hour > 23 ||
    value.minute < 0 ||
    value.minute > 59 ||
    (value.second ?? 0) < 0 ||
    (value.second ?? 0) > 59
  ) {
    return false;
  }

  const date = new Date(localDateTimeToPseudoUtcMillis(value));

  return (
    date.getUTCFullYear() === value.year &&
    date.getUTCMonth() + 1 === value.month &&
    date.getUTCDate() === value.day &&
    date.getUTCHours() === value.hour &&
    date.getUTCMinutes() === value.minute &&
    date.getUTCSeconds() === (value.second ?? 0)
  );
}
