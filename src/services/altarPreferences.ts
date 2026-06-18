import AsyncStorage from '@react-native-async-storage/async-storage';

export type TempleSceneMode =
  | 'auto'
  | 'dawn'
  | 'day'
  | 'dusk'
  | 'night';

export type AltarCultureTheme =
  | 'auto'
  | 'vietnam'
  | 'china'
  | 'japan'
  | 'korea'
  | 'western';

export type AltarCenterpiece =
  | 'buddha'
  | 'lotus'
  | 'dharmaWheel'
  | 'none';

export type AltarFlower =
  | 'lily'
  | 'lotus'
  | 'orchid'
  | 'none';

export type AltarLamp =
  | 'candle'
  | 'lantern'
  | 'lotusLamp'
  | 'none';

export type AltarAccent =
  | 'amber'
  | 'gold'
  | 'rose'
  | 'jade'
  | 'none';

export type TempleSoundscape =
  | 'none'
  | 'rain'
  | 'forest'
  | 'bell';

export type AltarPreferences = {
  cultureTheme: AltarCultureTheme;
  sceneMode: TempleSceneMode;
  centerpiece: AltarCenterpiece;
  flower: AltarFlower;
  lamp: AltarLamp;
  accent: AltarAccent;
  soundscape: TempleSoundscape;
  showFloatingPetals: boolean;
};

const STORAGE_KEY =
  '@online_pagoda/altar_preferences_v1';

const CULTURE_THEMES: AltarCultureTheme[] = [
  'auto',
  'vietnam',
  'china',
  'japan',
  'korea',
  'western',
];

export const DEFAULT_ALTAR_PREFERENCES: AltarPreferences = {
  cultureTheme: 'auto',
  sceneMode: 'auto',
  centerpiece: 'none',
  flower: 'none',
  lamp: 'none',
  accent: 'none',
  soundscape: 'none',
  showFloatingPetals: true,
};

function normalizeCultureTheme(
  value: unknown,
): AltarCultureTheme {
  return CULTURE_THEMES.includes(
    value as AltarCultureTheme,
  )
    ? (value as AltarCultureTheme)
    : 'auto';
}

export async function getAltarPreferences(): Promise<
  AltarPreferences
> {
  try {
    const raw = await AsyncStorage.getItem(
      STORAGE_KEY,
    );

    if (!raw) {
      return DEFAULT_ALTAR_PREFERENCES;
    }

    const parsed = JSON.parse(
      raw,
    ) as Partial<AltarPreferences>;

    return {
      ...DEFAULT_ALTAR_PREFERENCES,
      ...parsed,
      cultureTheme: normalizeCultureTheme(
        parsed.cultureTheme,
      ),
    };
  } catch (error) {
    console.warn(
      'Unable to read altar preferences:',
      error,
    );

    return DEFAULT_ALTAR_PREFERENCES;
  }
}

export async function saveAltarPreferences(
  preferences: AltarPreferences,
): Promise<void> {
  const normalized: AltarPreferences = {
    ...preferences,
    cultureTheme: normalizeCultureTheme(
      preferences.cultureTheme,
    ),
  };

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(normalized),
  );
}

export async function resetAltarPreferences(): Promise<
  AltarPreferences
> {
  await AsyncStorage.removeItem(STORAGE_KEY);

  return DEFAULT_ALTAR_PREFERENCES;
}
