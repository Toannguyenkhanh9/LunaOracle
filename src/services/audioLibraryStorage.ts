import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY =
  '@online_pagoda/audio_favorites_v1';
const RECENTS_KEY =
  '@online_pagoda/audio_recents_v1';
const MAX_RECENTS = 20;

async function readStringArray(
  key: string,
): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(key);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed.filter(
          (value): value is string =>
            typeof value === 'string',
        )
      : [];
  } catch (error) {
    console.warn(`Unable to read ${key}:`, error);
    return [];
  }
}

export async function getFavoriteTrackIds(): Promise<string[]> {
  return readStringArray(FAVORITES_KEY);
}

export async function toggleFavoriteTrack(
  trackId: string,
): Promise<string[]> {
  const current = await getFavoriteTrackIds();

  const next = current.includes(trackId)
    ? current.filter(id => id !== trackId)
    : [trackId, ...current];

  await AsyncStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(next),
  );

  return next;
}

export async function getRecentTrackIds(): Promise<string[]> {
  return readStringArray(RECENTS_KEY);
}

export async function addRecentTrack(
  trackId: string,
): Promise<string[]> {
  const current = await getRecentTrackIds();

  const next = [
    trackId,
    ...current.filter(id => id !== trackId),
  ].slice(0, MAX_RECENTS);

  await AsyncStorage.setItem(
    RECENTS_KEY,
    JSON.stringify(next),
  );

  return next;
}
