import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserProfileGender =
  | 'male'
  | 'female'
  | 'unspecified';

export type UserProfileRelationship =
  | 'self'
  | 'partner'
  | 'parent'
  | 'child'
  | 'sibling'
  | 'friend'
  | 'client'
  | 'other';

export type BirthTimeAccuracy =
  | 'exact'
  | 'approximate'
  | 'unknown';

export type UserProfile = {
  id: string;
  displayName: string;
  relationship: UserProfileRelationship;
  gender: UserProfileGender;

  birthDate: {
    day: number;
    month: number;
    year: number;
  };

  birthTime: {
    hour: number;
    minute: number;
    accuracy: BirthTimeAccuracy;
  };

  location: {
    placeName: string;
    timeZone: string;
    longitude?: number;
    latitude?: number;
  };

  notes: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserProfileDraft = {
  displayName: string;
  relationship: UserProfileRelationship;
  gender: UserProfileGender;

  day: string;
  month: string;
  year: string;

  hour: string;
  minute: string;
  birthTimeAccuracy: BirthTimeAccuracy;

  placeName: string;
  timeZone: string;
  longitude: string;
  latitude: string;

  notes: string;
  isFavorite: boolean;
};

type UserProfilesEnvelope = {
  schemaVersion: 1;
  profiles: UserProfile[];
};

const STORAGE_KEY =
  '@eastern_destiny/user_profiles_v1';

const SCHEMA_VERSION = 1 as const;

const MAX_PROFILES = 200;

export const DEFAULT_USER_PROFILE_DRAFT: UserProfileDraft = {
  displayName: '',
  relationship: 'self',
  gender: 'unspecified',

  day: '15',
  month: '04',
  year: '1992',

  hour: '08',
  minute: '30',
  birthTimeAccuracy: 'exact',

  placeName: '',
  timeZone: 'Asia/Ho_Chi_Minh',
  longitude: '',
  latitude: '',

  notes: '',
  isFavorite: false,
};

function createId(): string {
  return `profile-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function parseRequiredInteger(
  value: string,
  code: string,
): number {
  const normalized = value.trim();

  if (!/^\d+$/.test(normalized)) {
    throw new Error(code);
  }

  return Number(normalized);
}

function parseOptionalNumber(
  value: string,
  code: string,
): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value.trim());

  if (!Number.isFinite(parsed)) {
    throw new Error(code);
  }

  return parsed;
}

function validateDate(
  year: number,
  month: number,
  day: number,
): void {
  if (year < 1600 || year > 2400) {
    throw new Error('INVALID_YEAR');
  }

  const date = new Date(
    year,
    month - 1,
    day,
  );

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error('INVALID_BIRTH_DATE');
  }
}

function normalizeProfile(
  value: unknown,
): UserProfile | null {
  if (
    !value ||
    typeof value !== 'object'
  ) {
    return null;
  }

  const item =
    value as Partial<UserProfile>;

  if (
    !item.id ||
    !item.displayName ||
    !item.birthDate ||
    !item.birthTime ||
    !item.location
  ) {
    return null;
  }

  const now =
    new Date().toISOString();

  return {
    id: String(item.id),
    displayName:
      String(item.displayName),
    relationship:
      item.relationship ??
      'other',
    gender:
      item.gender ??
      'unspecified',

    birthDate: {
      day: Number(
        item.birthDate.day,
      ),
      month: Number(
        item.birthDate.month,
      ),
      year: Number(
        item.birthDate.year,
      ),
    },

    birthTime: {
      hour: Number(
        item.birthTime.hour ?? 12,
      ),
      minute: Number(
        item.birthTime.minute ?? 0,
      ),
      accuracy:
        item.birthTime.accuracy ??
        'unknown',
    },

    location: {
      placeName: String(
        item.location.placeName ?? '',
      ),
      timeZone: String(
        item.location.timeZone ??
          'Asia/Ho_Chi_Minh',
      ),
      longitude:
        item.location.longitude,
      latitude:
        item.location.latitude,
    },

    notes: String(
      item.notes ?? '',
    ),
    isFavorite:
      Boolean(item.isFavorite),
    createdAt: String(
      item.createdAt ?? now,
    ),
    updatedAt: String(
      item.updatedAt ??
        item.createdAt ??
        now,
    ),
  };
}

async function readEnvelope(): Promise<
  UserProfilesEnvelope
> {
  try {
    const raw =
      await AsyncStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return {
        schemaVersion:
          SCHEMA_VERSION,
        profiles: [],
      };
    }

    const parsed =
      JSON.parse(raw) as unknown;

    const sourceProfiles =
      Array.isArray(parsed)
        ? parsed
        : (
            parsed as Partial<UserProfilesEnvelope>
          )?.profiles;

    const profiles =
      Array.isArray(sourceProfiles)
        ? sourceProfiles
            .map(normalizeProfile)
            .filter(
              (
                item,
              ): item is UserProfile =>
                item !== null,
            )
        : [];

    return {
      schemaVersion:
        SCHEMA_VERSION,
      profiles: profiles
        .sort((first, second) => {
          if (
            first.isFavorite !==
            second.isFavorite
          ) {
            return first.isFavorite
              ? -1
              : 1;
          }

          return second.updatedAt.localeCompare(
            first.updatedAt,
          );
        })
        .slice(0, MAX_PROFILES),
    };
  } catch (error) {
    console.warn(
      'Unable to read shared user profiles:',
      error,
    );

    return {
      schemaVersion:
        SCHEMA_VERSION,
      profiles: [],
    };
  }
}

async function writeEnvelope(
  envelope: UserProfilesEnvelope,
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      schemaVersion:
        SCHEMA_VERSION,
      profiles:
        envelope.profiles.slice(
          0,
          MAX_PROFILES,
        ),
    }),
  );
}

export async function getUserProfiles(): Promise<
  UserProfile[]
> {
  return (
    await readEnvelope()
  ).profiles;
}

export async function getUserProfile(
  id: string,
): Promise<UserProfile | null> {
  const profiles =
    await getUserProfiles();

  return (
    profiles.find(
      item => item.id === id,
    ) ?? null
  );
}

export function userProfileToDraft(
  profile: UserProfile,
): UserProfileDraft {
  return {
    displayName:
      profile.displayName,
    relationship:
      profile.relationship,
    gender:
      profile.gender,

    day: String(
      profile.birthDate.day,
    ).padStart(2, '0'),
    month: String(
      profile.birthDate.month,
    ).padStart(2, '0'),
    year: String(
      profile.birthDate.year,
    ),

    hour: String(
      profile.birthTime.hour,
    ).padStart(2, '0'),
    minute: String(
      profile.birthTime.minute,
    ).padStart(2, '0'),
    birthTimeAccuracy:
      profile.birthTime.accuracy,

    placeName:
      profile.location.placeName,
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

    notes:
      profile.notes,
    isFavorite:
      profile.isFavorite,
  };
}

export function validateUserProfileDraft(
  draft: UserProfileDraft,
): void {
  if (!draft.displayName.trim()) {
    throw new Error(
      'DISPLAY_NAME_REQUIRED',
    );
  }

  const day =
    parseRequiredInteger(
      draft.day,
      'INVALID_DAY',
    );

  const month =
    parseRequiredInteger(
      draft.month,
      'INVALID_MONTH',
    );

  const year =
    parseRequiredInteger(
      draft.year,
      'INVALID_YEAR',
    );

  validateDate(
    year,
    month,
    day,
  );

  if (
    draft.birthTimeAccuracy !==
    'unknown'
  ) {
    const hour =
      parseRequiredInteger(
        draft.hour,
        'INVALID_HOUR',
      );

    const minute =
      parseRequiredInteger(
        draft.minute,
        'INVALID_MINUTE',
      );

    if (
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      throw new Error(
        'INVALID_BIRTH_TIME',
      );
    }
  }

  if (!draft.timeZone.trim()) {
    throw new Error(
      'TIME_ZONE_REQUIRED',
    );
  }

  const longitude =
    parseOptionalNumber(
      draft.longitude,
      'INVALID_LONGITUDE',
    );

  const latitude =
    parseOptionalNumber(
      draft.latitude,
      'INVALID_LATITUDE',
    );

  if (
    longitude !== undefined &&
    (
      longitude < -180 ||
      longitude > 180
    )
  ) {
    throw new Error(
      'INVALID_LONGITUDE',
    );
  }

  if (
    latitude !== undefined &&
    (
      latitude < -90 ||
      latitude > 90
    )
  ) {
    throw new Error(
      'INVALID_LATITUDE',
    );
  }
}

export async function saveUserProfile(
  draft: UserProfileDraft,
  id?: string,
): Promise<UserProfile> {
  validateUserProfileDraft(draft);

  const envelope =
    await readEnvelope();

  const now =
    new Date().toISOString();

  const existingIndex =
    id
      ? envelope.profiles.findIndex(
          item => item.id === id,
        )
      : -1;

  const existing =
    existingIndex >= 0
      ? envelope.profiles[
          existingIndex
        ]
      : null;

  const hour =
    draft.birthTimeAccuracy ===
    'unknown'
      ? 12
      : Number(draft.hour);

  const minute =
    draft.birthTimeAccuracy ===
    'unknown'
      ? 0
      : Number(draft.minute);

  const longitude =
    parseOptionalNumber(
      draft.longitude,
      'INVALID_LONGITUDE',
    );

  const latitude =
    parseOptionalNumber(
      draft.latitude,
      'INVALID_LATITUDE',
    );

  const profile: UserProfile = {
    id:
      existing?.id ??
      id ??
      createId(),

    displayName:
      draft.displayName.trim(),

    relationship:
      draft.relationship,

    gender:
      draft.gender,

    birthDate: {
      day: Number(draft.day),
      month: Number(draft.month),
      year: Number(draft.year),
    },

    birthTime: {
      hour,
      minute,
      accuracy:
        draft.birthTimeAccuracy,
    },

    location: {
      placeName:
        draft.placeName.trim(),
      timeZone:
        draft.timeZone.trim(),
      longitude,
      latitude,
    },

    notes:
      draft.notes.trim(),

    isFavorite:
      draft.isFavorite,

    createdAt:
      existing?.createdAt ??
      now,

    updatedAt:
      now,
  };

  if (existingIndex >= 0) {
    envelope.profiles.splice(
      existingIndex,
      1,
    );
  }

  envelope.profiles.unshift(
    profile,
  );

  await writeEnvelope(
    envelope,
  );

  return profile;
}

export async function deleteUserProfile(
  id: string,
): Promise<UserProfile[]> {
  const envelope =
    await readEnvelope();

  envelope.profiles =
    envelope.profiles.filter(
      item => item.id !== id,
    );

  await writeEnvelope(
    envelope,
  );

  return envelope.profiles;
}

export async function toggleUserProfileFavorite(
  id: string,
): Promise<UserProfile[]> {
  const envelope =
    await readEnvelope();

  const now =
    new Date().toISOString();

  envelope.profiles =
    envelope.profiles.map(
      item =>
        item.id === id
          ? {
              ...item,
              isFavorite:
                !item.isFavorite,
              updatedAt: now,
            }
          : item,
    );

  await writeEnvelope(
    envelope,
  );

  return (
    await readEnvelope()
  ).profiles;
}

export async function duplicateUserProfile(
  id: string,
): Promise<UserProfile | null> {
  const source =
    await getUserProfile(id);

  if (!source) {
    return null;
  }

  return saveUserProfile({
    ...userProfileToDraft(
      source,
    ),
    displayName:
      `${source.displayName} copy`,
    isFavorite: false,
  });
}

export async function clearUserProfiles(): Promise<void> {
  await AsyncStorage.removeItem(
    STORAGE_KEY,
  );
}

export function exportUserProfile(
  profile: UserProfile,
): string {
  return JSON.stringify(
    profile,
    null,
    2,
  );
}

export async function importUserProfile(
  json: string,
): Promise<UserProfile> {
  const parsed =
    normalizeProfile(
      JSON.parse(json),
    );

  if (!parsed) {
    throw new Error(
      'INVALID_PROFILE_FILE',
    );
  }

  return saveUserProfile({
    ...userProfileToDraft(
      parsed,
    ),
    displayName:
      parsed.displayName,
  });
}
