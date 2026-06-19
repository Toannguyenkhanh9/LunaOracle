import AsyncStorage
  from '@react-native-async-storage/async-storage';

import type {
  BirthChartInput,
} from './astroBirthChart';

import type {
  BirthPlace,
} from './birthPlaces';

export type SavedBirthChartProfile = {
  input: BirthChartInput;
  place?: BirthPlace;
  updatedAt: string;
};

const STORAGE_KEY =
  '@luna_oracle/birth_chart_profile_v1';

export async function saveBirthChartProfile(
  profile: Omit<
    SavedBirthChartProfile,
    'updatedAt'
  >,
): Promise<void> {
  const payload:
    SavedBirthChartProfile = {
      ...profile,
      updatedAt:
        new Date().toISOString(),
  };

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(payload),
  );
}

export async function loadBirthChartProfile():
Promise<SavedBirthChartProfile | null> {
  try {
    const raw =
      await AsyncStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return null;
    }

    const parsed =
      JSON.parse(raw);

    if (
      !parsed ||
      !parsed.input
    ) {
      return null;
    }

    return parsed as SavedBirthChartProfile;
  } catch (error) {
    console.warn(
      'Unable to load birth chart profile:',
      error,
    );

    return null;
  }
}

export async function clearBirthChartProfile():
Promise<void> {
  await AsyncStorage.removeItem(
    STORAGE_KEY,
  );
}
