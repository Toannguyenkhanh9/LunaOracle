import type {
  BaziFormValues,
} from './baziEngine';

import type {
  ZiweiFormValues,
} from './ziweiEngine';

import type {
  BirthGender,
} from './auspiciousDates';

import type {
  UserProfile,
} from './userProfiles';

export type HoroscopeProfileFields = {
  day: string;
  month: string;
  year: string;
  birthHour: string;
  birthMinute: string;
  gender: BirthGender;
};

function twoDigits(
  value: number,
): string {
  return String(value).padStart(
    2,
    '0',
  );
}

function engineTime(
  profile: UserProfile,
): {
  hour: string;
  minute: string;
} {
  if (
    profile.birthTime.accuracy ===
    'unknown'
  ) {
    return {
      hour: '12',
      minute: '00',
    };
  }

  return {
    hour: twoDigits(
      profile.birthTime.hour,
    ),
    minute: twoDigits(
      profile.birthTime.minute,
    ),
  };
}

export function userProfileToBaziForm(
  profile: UserProfile,
): BaziFormValues {
  const time =
    engineTime(profile);

  return {
    displayName:
      profile.displayName,

    day: twoDigits(
      profile.birthDate.day,
    ),
    month: twoDigits(
      profile.birthDate.month,
    ),
    year: String(
      profile.birthDate.year,
    ),

    hour: time.hour,
    minute: time.minute,

    gender:
      profile.gender,

    timeZone:
      profile.location.timeZone,

    longitude:
      profile.location.longitude ===
      undefined
        ? ''
        : String(
            profile.location.longitude,
          ),

    latitude:
      profile.location.latitude ===
      undefined
        ? ''
        : String(
            profile.location.latitude,
          ),

    placeName:
      profile.location.placeName,

    useTrueSolarTime:
      false,
  };
}

export function userProfileToZiweiForm(
  profile: UserProfile,
): ZiweiFormValues {
  if (
    profile.gender ===
    'unspecified'
  ) {
    throw new Error(
      'ZIWEI_GENDER_REQUIRED',
    );
  }

  const time =
    engineTime(profile);

  return {
    displayName:
      profile.displayName,

    day: twoDigits(
      profile.birthDate.day,
    ),
    month: twoDigits(
      profile.birthDate.month,
    ),
    year: String(
      profile.birthDate.year,
    ),

    hour: time.hour,
    minute: time.minute,

    gender:
      profile.gender,

    timeZone:
      profile.location.timeZone,

    placeName:
      profile.location.placeName,

    longitude:
      profile.location.longitude ===
      undefined
        ? ''
        : String(
            profile.location.longitude,
          ),

    latitude:
      profile.location.latitude ===
      undefined
        ? ''
        : String(
            profile.location.latitude,
          ),
  };
}

export function userProfileToHoroscopeFields(
  profile: UserProfile,
): HoroscopeProfileFields {
  const time =
    engineTime(profile);

  return {
    day: twoDigits(
      profile.birthDate.day,
    ),
    month: twoDigits(
      profile.birthDate.month,
    ),
    year: String(
      profile.birthDate.year,
    ),
    birthHour:
      time.hour,
    birthMinute:
      time.minute,
    gender:
      profile.gender,
  };
}

export function getUserProfileTimeWarningCode(
  profile: UserProfile,
):
  | 'unknown'
  | 'approximate'
  | null {
  if (
    profile.birthTime.accuracy ===
    'unknown'
  ) {
    return 'unknown';
  }

  if (
    profile.birthTime.accuracy ===
    'approximate'
  ) {
    return 'approximate';
  }

  return null;
}
