import {
  createDefaultZiweiEngine,
  type ZiweiBirthInput,
  type ZiweiChartStage6,
  type ZiweiGender,
} from '../astrology/ziwei';

const engine = createDefaultZiweiEngine();

export type ZiweiFormValues = {
  displayName: string;
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  gender: ZiweiGender;
  timeZone: string;
  placeName: string;
  longitude: string;
  latitude: string;
};

function parseInteger(value: string, code: string): number {
  if (!/^\d+$/.test(value.trim())) throw new Error(code);
  return Number(value.trim());
}

function parseOptionalNumber(value: string): number | undefined {
  if (!value.trim()) return undefined;
  const parsed = Number(value.trim());
  if (!Number.isFinite(parsed)) throw new Error('INVALID_COORDINATE');
  return parsed;
}

export function calculateZiweiFromForm(
  values: ZiweiFormValues,
): ZiweiChartStage6 {
  const input: ZiweiBirthInput = {
    displayName: values.displayName.trim() || undefined,
    localDateTime: {
      year: parseInteger(values.year, 'INVALID_YEAR'),
      month: parseInteger(values.month, 'INVALID_MONTH'),
      day: parseInteger(values.day, 'INVALID_DAY'),
      hour: parseInteger(values.hour, 'INVALID_BIRTH_HOUR'),
      minute: parseInteger(values.minute, 'INVALID_BIRTH_MINUTE'),
      second: 0,
    },
    gender: values.gender,
    location: {
      timeZone: values.timeZone.trim(),
      placeName: values.placeName.trim() || undefined,
      longitude: parseOptionalNumber(values.longitude),
      latitude: parseOptionalNumber(values.latitude),
    },
  };

  return engine.calculate(input);
}
