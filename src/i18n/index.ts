import AsyncStorage from '@react-native-async-storage/async-storage';

import i18n from 'i18next';

import {
  initReactI18next,
} from 'react-i18next';

import {
  getLocales,
} from 'react-native-localize';

import vi from './locales/vi';
import en from './locales/en';
import zh from './locales/zh';
import ja from './locales/ja';
import ko from './locales/ko';

import {
  AppLanguage,
  SUPPORTED_LANGUAGE_CODES,
} from './languages';

const LANGUAGE_STORAGE_KEY =
  '@pagoda_online_language';

const resources = {
  vi: {
    translation: vi,
  },

  en: {
    translation: en,
  },

  zh: {
    translation: zh,
  },

  ja: {
    translation: ja,
  },

  ko: {
    translation: ko,
  },
};

function normalizeLanguage(
  languageCode?: string,
): AppLanguage {
  const normalized =
    languageCode?.toLowerCase();

  if (
    normalized &&
    SUPPORTED_LANGUAGE_CODES.includes(
      normalized as AppLanguage,
    )
  ) {
    return normalized as AppLanguage;
  }

  // Ngôn ngữ không hỗ trợ sẽ dùng English.
  return 'en';
}

async function getInitialLanguage():
Promise<AppLanguage> {
  try {
    const savedLanguage =
      await AsyncStorage.getItem(
        LANGUAGE_STORAGE_KEY,
      );

    if (
      savedLanguage &&
      SUPPORTED_LANGUAGE_CODES.includes(
        savedLanguage as AppLanguage,
      )
    ) {
      return savedLanguage as AppLanguage;
    }
  } catch (error) {
    console.warn(
      'Không thể đọc ngôn ngữ đã lưu:',
      error,
    );
  }

  const deviceLanguage =
    getLocales()[0]?.languageCode;

  return normalizeLanguage(deviceLanguage);
}

export async function initializeI18n():
Promise<void> {
  if (i18n.isInitialized) {
    return;
  }

  const initialLanguage =
    await getInitialLanguage();

  await i18n
    .use(initReactI18next)
    .init({
      resources,

      lng: initialLanguage,

      fallbackLng: 'en',

      interpolation: {
        escapeValue: false,
      },

      returnNull: false,
    });
}

export async function changeAppLanguage(
  language: AppLanguage,
): Promise<void> {
  if (
    !SUPPORTED_LANGUAGE_CODES.includes(
      language,
    )
  ) {
    return;
  }

  await i18n.changeLanguage(language);

  try {
    await AsyncStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      language,
    );
  } catch (error) {
    console.warn(
      'Không thể lưu ngôn ngữ:',
      error,
    );
  }
}

export function getCurrentLanguage():
AppLanguage {
  return normalizeLanguage(
    i18n.resolvedLanguage ??
      i18n.language,
  );
}

export default i18n;