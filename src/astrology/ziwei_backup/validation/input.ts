import type {ZiweiBirthInput} from '../types';

export function isValidIanaTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', {timeZone}).format(new Date());
    return true;
  } catch {
    return false;
  }
}

export function validateZiweiBirthInput(input: ZiweiBirthInput): void {
  const {year, month, day, hour, minute} = input.localDateTime;

  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    throw new Error('INVALID_YEAR');
  }

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error('INVALID_BIRTH_DATE');
  }

  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    throw new Error('INVALID_BIRTH_HOUR');
  }

  if (!Number.isInteger(minute) || minute < 0 || minute > 59) {
    throw new Error('INVALID_BIRTH_MINUTE');
  }

  if (!input.location.timeZone || !isValidIanaTimeZone(input.location.timeZone)) {
    throw new Error('INVALID_TIME_ZONE');
  }

  if (
    input.location.longitude !== undefined &&
    (input.location.longitude < -180 || input.location.longitude > 180)
  ) {
    throw new Error('INVALID_LONGITUDE');
  }

  if (
    input.location.latitude !== undefined &&
    (input.location.latitude < -90 || input.location.latitude > 90)
  ) {
    throw new Error('INVALID_LATITUDE');
  }
}
