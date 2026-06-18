import {
  createDefaultBaziEngine,
  translateInterpretationCode,
  type BaziChart,
  type BirthInput,
  type Gender,
  type InterpretationLanguage,
} from '../astrology/bazi';

const engine = createDefaultBaziEngine();

export type BaziFormValues = {
  displayName?: string;
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  gender: Gender;
  timeZone: string;
  longitude?: string;
  latitude?: string;
  placeName?: string;
  useTrueSolarTime: boolean;
};

function parseRequiredInteger(value: string, fieldName: string): number {
  const normalized = value.trim();

  if (!/^\d+$/.test(normalized)) {
    throw new Error(`INVALID_${fieldName.toUpperCase()}`);
  }

  return Number(normalized);
}

function parseOptionalNumber(value?: string): number | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  const parsed = Number(value.trim());

  if (!Number.isFinite(parsed)) {
    throw new Error('INVALID_COORDINATE');
  }

  return parsed;
}

function validateForm(values: BaziFormValues): void {
  const year = parseRequiredInteger(values.year, 'year');
  const month = parseRequiredInteger(values.month, 'month');
  const day = parseRequiredInteger(values.day, 'day');
  const hour = parseRequiredInteger(values.hour, 'hour');
  const minute = parseRequiredInteger(values.minute, 'minute');

  if (year < 1600 || year > 2400) {
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

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    throw new Error('INVALID_BIRTH_TIME');
  }

  if (!values.timeZone.trim()) {
    throw new Error('TIME_ZONE_REQUIRED');
  }

  const longitude = parseOptionalNumber(values.longitude);
  const latitude = parseOptionalNumber(values.latitude);

  if (longitude !== undefined && (longitude < -180 || longitude > 180)) {
    throw new Error('INVALID_LONGITUDE');
  }

  if (latitude !== undefined && (latitude < -90 || latitude > 90)) {
    throw new Error('INVALID_LATITUDE');
  }

  if (values.useTrueSolarTime && longitude === undefined) {
    throw new Error('TRUE_SOLAR_LONGITUDE_REQUIRED');
  }
}

export function birthInputFromBaziForm(values: BaziFormValues): BirthInput {
  validateForm(values);

  return {
    displayName: values.displayName?.trim() || undefined,
    localDateTime: {
      year: Number(values.year),
      month: Number(values.month),
      day: Number(values.day),
      hour: Number(values.hour),
      minute: Number(values.minute),
      second: 0,
    },
    location: {
      timeZone: values.timeZone.trim(),
      longitude: parseOptionalNumber(values.longitude),
      latitude: parseOptionalNumber(values.latitude),
      placeName: values.placeName?.trim() || undefined,
    },
    gender: values.gender,
    options: {
      timeCorrection: values.useTrueSolarTime ? 'trueSolar' : 'civil',
      dayBoundary: 'ziHour',
      luckSect: 1,
      luckPillarCount: 8,
      includeAnnualTransits: true,
      annualTransitYears: 12,
    },
  };
}

export function baziFormFromBirthInput(input: BirthInput): BaziFormValues {
  return {
    displayName: input.displayName ?? '',
    day: String(input.localDateTime.day).padStart(2, '0'),
    month: String(input.localDateTime.month).padStart(2, '0'),
    year: String(input.localDateTime.year),
    hour: String(input.localDateTime.hour).padStart(2, '0'),
    minute: String(input.localDateTime.minute).padStart(2, '0'),
    gender: input.gender,
    timeZone: input.location.timeZone,
    longitude:
      input.location.longitude === undefined
        ? ''
        : String(input.location.longitude),
    latitude:
      input.location.latitude === undefined
        ? ''
        : String(input.location.latitude),
    placeName: input.location.placeName ?? '',
    useTrueSolarTime: input.options?.timeCorrection === 'trueSolar',
  };
}

export function calculateBaziFromInput(input: BirthInput): BaziChart {
  return engine.calculate(input);
}

export function calculateBaziFromForm(values: BaziFormValues): BaziChart {
  return calculateBaziFromInput(birthInputFromBaziForm(values));
}

export function getBaziInterpretationLanguage(
  language?: string,
): InterpretationLanguage {
  const value =
    language?.toLowerCase() ?? 'en';

  if (value.startsWith('vi')) {
    return 'vi';
  }

  if (value.startsWith('zh')) {
    return 'zh';
  }

  if (value.startsWith('ko')) {
    return 'ko';
  }

  if (value.startsWith('ja')) {
    return 'ja';
  }

  return 'en';
}

export function translateBaziCode(code: string, language?: string): string {
  return translateInterpretationCode(
    code,
    getBaziInterpretationLanguage(language),
  );
}
