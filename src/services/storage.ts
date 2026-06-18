import AsyncStorage from '@react-native-async-storage/async-storage';

const PRAYER_STORAGE_KEY = '@pagoda_online_prayers';

export type PrayerItem = {
  id: string;
  text: string;
  createdAt: string;
};

export async function getPrayers(): Promise<PrayerItem[]> {
  try {
    const savedData = await AsyncStorage.getItem(PRAYER_STORAGE_KEY);

    if (!savedData) {
      return [];
    }

    const parsedData: unknown = JSON.parse(savedData);

    if (!Array.isArray(parsedData)) {
      return [];
    }

    return parsedData as PrayerItem[];
  } catch (error) {
    console.warn('Không thể tải lời cầu nguyện:', error);
    return [];
  }
}

export async function addPrayer(text: string): Promise<PrayerItem[]> {
  const currentPrayers = await getPrayers();

const newPrayer: PrayerItem = {
  id: Date.now().toString(),

  text,

  createdAt:
    new Date().toISOString(),
};

  const updatedPrayers = [newPrayer, ...currentPrayers];

  await AsyncStorage.setItem(
    PRAYER_STORAGE_KEY,
    JSON.stringify(updatedPrayers),
  );

  return updatedPrayers;
}

export async function deletePrayer(
  prayerId: string,
): Promise<PrayerItem[]> {
  const currentPrayers = await getPrayers();

  const updatedPrayers = currentPrayers.filter(
    prayer => prayer.id !== prayerId,
  );

  await AsyncStorage.setItem(
    PRAYER_STORAGE_KEY,
    JSON.stringify(updatedPrayers),
  );

  return updatedPrayers;
}