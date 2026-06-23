import AsyncStorage
  from '@react-native-async-storage/async-storage';

import {
  upsertBirthProfile,
  type BirthProfile,
} from './birthProfiles';

import type {
  BirthChartInput,
} from './astroBirthChart';

export type OnboardingFocus =
  | 'love'
  | 'career'
  | 'selfGrowth'
  | 'tarot'
  | 'moon';

export type LunaOnboardingState = {
  completed: boolean;
  completedAt?: string;
  focus?: OnboardingFocus[];
  profileId?: string;
};

const STORAGE_KEY =
  '@luna_oracle/onboarding_v1';

export async function getLunaOnboardingState():
Promise<LunaOnboardingState> {
  try {
    const raw =
      await AsyncStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return {
        completed: false,
      };
    }

    const parsed =
      JSON.parse(raw);

    return {
      completed:
        Boolean(parsed.completed),
      completedAt:
        parsed.completedAt,
      focus:
        Array.isArray(parsed.focus)
          ? parsed.focus
          : undefined,
      profileId:
        parsed.profileId,
    };
  } catch (error) {
    console.warn(
      'Unable to read onboarding state:',
      error,
    );

    return {
      completed: false,
    };
  }
}

export async function setLunaOnboardingState(
  state: LunaOnboardingState,
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state),
  );
}

export async function resetLunaOnboarding():
Promise<void> {
  await AsyncStorage.removeItem(
    STORAGE_KEY,
  );
}

function numberOrDefault(
  value: string,
  fallback: number,
): number {
  const parsed =
    Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : fallback;
}

export function createBirthInputFromOnboarding(
  form: {
    year: string;
    month: string;
    day: string;
    hour: string;
    minute: string;
    timezoneOffset: string;
    latitude: string;
    longitude: string;
  },
): BirthChartInput {
  return {
    year:
      numberOrDefault(
        form.year,
        1995,
      ),
    month:
      numberOrDefault(
        form.month,
        3,
      ),
    day:
      numberOrDefault(
        form.day,
        21,
      ),
    hour:
      numberOrDefault(
        form.hour,
        12,
      ),
    minute:
      numberOrDefault(
        form.minute,
        0,
      ),
    timezoneOffset:
      numberOrDefault(
        form.timezoneOffset,
        7,
      ),
    latitude:
      numberOrDefault(
        form.latitude,
        10.7769,
      ),
    longitude:
      numberOrDefault(
        form.longitude,
        106.7009,
      ),
  };
}

export async function completeLunaOnboarding(
  params: {
    name: string;
    input: BirthChartInput;
    focus: OnboardingFocus[];
  },
): Promise<{
  profile: BirthProfile;
  state: LunaOnboardingState;
}> {
  const profile =
    await upsertBirthProfile({
      name:
        params.name.trim() ||
        'My Birth Chart',
      input:
        params.input,
      makeActive:
        true,
    });

  const state:
    LunaOnboardingState = {
      completed:
        true,
      completedAt:
        new Date().toISOString(),
      profileId:
        profile.id,
      focus:
        params.focus,
  };

  await setLunaOnboardingState(
    state,
  );

  return {
    profile,
    state,
  };
}
