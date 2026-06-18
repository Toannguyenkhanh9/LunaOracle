import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  FortuneStick,
  LocalizedText,
} from '../data/fortuneSticks';

const STORAGE_KEY =
  '@pagoda_online_fortune_history';

export type SavedFortuneStick = {
  id: string;
  createdAt: string;
  intention: string;
  stick: FortuneStick;
};

export async function getSavedFortuneSticks():
Promise<SavedFortuneStick[]> {
  try {
    const raw =
      await AsyncStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(
      raw,
    ) as SavedFortuneStick[];

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch (error) {
    console.warn(
      'Cannot read saved fortune sticks:',
      error,
    );

    return [];
  }
}

export async function saveFortuneStick(
  stick: FortuneStick,
  intention: string,
): Promise<SavedFortuneStick[]> {
  const current =
    await getSavedFortuneSticks();

  const item: SavedFortuneStick = {
    id: `${Date.now()}-${stick.number}`,
    createdAt: new Date().toISOString(),
    intention: intention.trim(),
    stick,
  };

  const updated = [
    item,
    ...current,
  ].slice(0, 50);

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated),
  );

  return updated;
}

export async function deleteSavedFortuneStick(
  id: string,
): Promise<SavedFortuneStick[]> {
  const current =
    await getSavedFortuneSticks();

  const updated = current.filter(
    item => item.id !== id,
  );

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated),
  );

  return updated;
}

export async function clearSavedFortuneSticks():
Promise<void> {
  await AsyncStorage.removeItem(
    STORAGE_KEY,
  );
}
