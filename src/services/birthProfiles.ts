import AsyncStorage
  from '@react-native-async-storage/async-storage';

import type {
  BirthChartInput,
} from './astroBirthChart';

import type {
  BirthPlace,
} from './birthPlaces';

export type BirthProfile = {
  id: string;
  name: string;
  input: BirthChartInput;
  place?: BirthPlace;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type BirthProfilesState = {
  activeProfileId?: string;
  profiles: BirthProfile[];
};

const STORAGE_KEY =
  '@luna_oracle/birth_profiles_v1';

function createId(): string {
  return `birth_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function sortProfiles(
  profiles: BirthProfile[],
): BirthProfile[] {
  return [...profiles].sort(
    (a, b) =>
      new Date(
        b.updatedAt,
      ).getTime() -
      new Date(
        a.updatedAt,
      ).getTime(),
  );
}

function normalizeState(
  value: unknown,
): BirthProfilesState {
  if (
    !value ||
    typeof value !== 'object'
  ) {
    return {
      profiles: [],
    };
  }

  const maybe =
    value as Partial<BirthProfilesState>;

  const profiles =
    Array.isArray(maybe.profiles)
      ? maybe.profiles.filter(
          item =>
            item &&
            typeof item.id ===
              'string' &&
            typeof item.name ===
              'string' &&
            item.input,
        )
      : [];

  const activeProfileId =
    maybe.activeProfileId &&
    profiles.some(
      item =>
        item.id ===
        maybe.activeProfileId,
    )
      ? maybe.activeProfileId
      : profiles[0]?.id;

  return {
    activeProfileId,
    profiles:
      sortProfiles(
        profiles as BirthProfile[],
      ),
  };
}

export async function listBirthProfiles():
Promise<BirthProfilesState> {
  try {
    const raw =
      await AsyncStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return {
        profiles: [],
      };
    }

    return normalizeState(
      JSON.parse(raw),
    );
  } catch (error) {
    console.warn(
      'Unable to load birth profiles:',
      error,
    );

    return {
      profiles: [],
    };
  }
}

export async function writeBirthProfiles(
  state: BirthProfilesState,
): Promise<void> {
  const normalized =
    normalizeState(state);

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(normalized),
  );
}

export async function getActiveBirthProfile():
Promise<BirthProfile | undefined> {
  const state =
    await listBirthProfiles();

  return state.profiles.find(
    item =>
      item.id ===
      state.activeProfileId,
  ) ?? state.profiles[0];
}

export async function getBirthProfileById(
  id: string,
): Promise<BirthProfile | undefined> {
  const state =
    await listBirthProfiles();

  return state.profiles.find(
    item => item.id === id,
  );
}

export async function upsertBirthProfile(
  profile: {
    id?: string;
    name: string;
    input: BirthChartInput;
    place?: BirthPlace;
    note?: string;
    makeActive?: boolean;
  },
): Promise<BirthProfile> {
  const state =
    await listBirthProfiles();

  const now =
    new Date().toISOString();

  const existing =
    profile.id
      ? state.profiles.find(
          item =>
            item.id === profile.id,
        )
      : undefined;

  const nextProfile:
    BirthProfile = {
      id:
        existing?.id ??
        createId(),
      name:
        profile.name.trim() ||
        'Birth Profile',
      input:
        profile.input,
      place:
        profile.place,
      note:
        profile.note?.trim() ||
        undefined,
      createdAt:
        existing?.createdAt ??
        now,
      updatedAt:
        now,
  };

  const nextProfiles =
    existing
      ? state.profiles.map(item =>
          item.id ===
          nextProfile.id
            ? nextProfile
            : item,
        )
      : [
          nextProfile,
          ...state.profiles,
        ];

  const activeProfileId =
    profile.makeActive ||
    !state.activeProfileId
      ? nextProfile.id
      : state.activeProfileId;

  await writeBirthProfiles({
    activeProfileId,
    profiles:
      nextProfiles,
  });

  return nextProfile;
}

export async function setActiveBirthProfile(
  profileId: string,
): Promise<void> {
  const state =
    await listBirthProfiles();

  if (
    !state.profiles.some(
      item => item.id === profileId,
    )
  ) {
    return;
  }

  await writeBirthProfiles({
    ...state,
    activeProfileId:
      profileId,
  });
}

export async function deleteBirthProfile(
  profileId: string,
): Promise<void> {
  const state =
    await listBirthProfiles();

  const profiles =
    state.profiles.filter(
      item => item.id !== profileId,
    );

  const activeProfileId =
    state.activeProfileId ===
    profileId
      ? profiles[0]?.id
      : state.activeProfileId;

  await writeBirthProfiles({
    activeProfileId,
    profiles,
  });
}

export function createDefaultBirthInput():
BirthChartInput {
  return {
    year: 1995,
    month: 3,
    day: 21,
    hour: 12,
    minute: 0,
    timezoneOffset: 7,
    latitude: 10.7769,
    longitude: 106.7009,
  };
}

export async function ensureDefaultBirthProfile():
Promise<BirthProfile> {
  const active =
    await getActiveBirthProfile();

  if (active) {
    return active;
  }

  return upsertBirthProfile({
    name: 'My Birth Chart',
    input:
      createDefaultBirthInput(),
    makeActive: true,
  });
}
