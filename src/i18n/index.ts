import AsyncStorage
  from '@react-native-async-storage/async-storage';

import i18n
  from 'i18next';

import {
  initReactI18next,
} from 'react-i18next';

import {
  getLocales,
} from 'react-native-localize';

import vi from './locales/vi';
import en from './locales/en';
import es from './locales/es';
import pt from './locales/pt';
import fr from './locales/fr';
import it from './locales/it';
import de from './locales/de';
import nl from './locales/nl';
import hi from './locales/hi';
import id from './locales/id';
import ms from './locales/ms';
import fil from './locales/fil';
import ar from './locales/ar';
import zh from './locales/zh';
import ja from './locales/ja';
import ko from './locales/ko';
import ru from './locales/ru';
import th from './locales/th';

import {
  type AppLanguage,
  SUPPORTED_LANGUAGE_CODES,
} from './languages';

const LANGUAGE_STORAGE_KEY =
  '@luna_oracle_language';

const FALLBACK_LANGUAGE: AppLanguage =
  'en';

const resources = {
  en: {
    translation: en,
  },

  vi: {
    translation: vi,
  },

  es: {
    translation: es,
  },

  pt: {
    translation: pt,
  },

  fr: {
    translation: fr,
  },

  it: {
    translation: it,
  },

  de: {
    translation: de,
  },

  nl: {
    translation: nl,
  },

  hi: {
    translation: hi,
  },

  id: {
    translation: id,
  },

  ms: {
    translation: ms,
  },

  fil: {
    translation: fil,
  },

  ar: {
    translation: ar,
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

  ru: {
    translation: ru,
  },

  th: {
    translation: th,
  },
} as const;

function isSupportedLanguage(
  language: string,
): language is AppLanguage {
  return SUPPORTED_LANGUAGE_CODES.includes(
    language as AppLanguage,
  );
}

function normalizeLanguage(
  languageCode?: string | null,
): AppLanguage {
  if (!languageCode) {
    return FALLBACK_LANGUAGE;
  }

  const normalized =
    languageCode
      .trim()
      .toLowerCase()
      .replace('_', '-');

  if (
    isSupportedLanguage(normalized)
  ) {
    return normalized;
  }

  const baseLanguage =
    normalized.split('-')[0];

  if (
    isSupportedLanguage(
      baseLanguage,
    )
  ) {
    return baseLanguage;
  }

  if (
    normalized.startsWith('zh')
  ) {
    return 'zh';
  }

  if (
    normalized === 'in'
  ) {
    return 'id';
  }

  if (
    normalized === 'iw'
  ) {
    return FALLBACK_LANGUAGE;
  }

  if (
    normalized === 'tl'
  ) {
    return 'fil';
  }

  return FALLBACK_LANGUAGE;
}

async function getInitialLanguage():
Promise<AppLanguage> {
  try {
    const savedLanguage =
      await AsyncStorage.getItem(
        LANGUAGE_STORAGE_KEY,
      );

    const normalizedSavedLanguage =
      normalizeLanguage(savedLanguage);

    if (
      savedLanguage &&
      isSupportedLanguage(
        normalizedSavedLanguage,
      )
    ) {
      return normalizedSavedLanguage;
    }
  } catch (error) {
    console.warn(
      'Unable to read saved language:',
      error,
    );
  }

  const deviceLocales =
    getLocales();

  for (
    const locale of deviceLocales
  ) {
    const language =
      normalizeLanguage(
        locale.languageTag ??
          locale.languageCode,
      );

    if (
      isSupportedLanguage(language)
    ) {
      return language;
    }
  }

  return FALLBACK_LANGUAGE;
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

      fallbackLng:
        FALLBACK_LANGUAGE,

      supportedLngs:
        SUPPORTED_LANGUAGE_CODES,

      compatibilityJSON:
        'v3',

      interpolation: {
        escapeValue: false,
      },

      returnNull: false,
    });
}

export async function changeAppLanguage(
  language: AppLanguage,
): Promise<void> {
  const normalizedLanguage =
    normalizeLanguage(language);

  if (
    !isSupportedLanguage(
      normalizedLanguage,
    )
  ) {
    return;
  }

  await i18n.changeLanguage(
    normalizedLanguage,
  );

  try {
    await AsyncStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      normalizedLanguage,
    );
  } catch (error) {
    console.warn(
      'Unable to save language:',
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

export function getLanguageStorageKey():
string {
  return LANGUAGE_STORAGE_KEY;
}

export default i18n;
