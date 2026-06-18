import type {BirthInput} from '../types';

function stableSerialize(input: BirthInput): string {
  const value = {
    localDateTime: {
      year: input.localDateTime.year,
      month: input.localDateTime.month,
      day: input.localDateTime.day,
      hour: input.localDateTime.hour,
      minute: input.localDateTime.minute,
      second: input.localDateTime.second ?? 0,
    },
    location: {
      timeZone: input.location.timeZone,
      longitude: input.location.longitude ?? null,
      latitude: input.location.latitude ?? null,
      placeName: input.location.placeName ?? '',
    },
    gender: input.gender,
    options: {
      timeCorrection: input.options?.timeCorrection ?? 'civil',
      dayBoundary: input.options?.dayBoundary ?? 'ziHour',
      luckSect: input.options?.luckSect ?? 1,
      luckPillarCount: input.options?.luckPillarCount ?? 8,
      includeAnnualTransits: input.options?.includeAnnualTransits ?? true,
      annualTransitYears: input.options?.annualTransitYears ?? 12,
    },
  };

  return JSON.stringify(value);
}

export function fingerprintBirthInput(input: BirthInput): string {
  const text = stableSerialize(input);
  let hash = 0x811c9dc5;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return `bazi_${(hash >>> 0).toString(16).padStart(8, '0')}`;
}
