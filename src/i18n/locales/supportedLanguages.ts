export const SUPPORTED_LANGUAGES = [
  {
    code: "en",
    name: "English",
    englishName: "English",
    isRTL: false,
  },
  {
    code: "vi",
    name: "Tiếng Việt",
    englishName: "Vietnamese",
    isRTL: false,
  },
  {
    code: "es",
    name: "Español",
    englishName: "Spanish",
    isRTL: false,
  },
  {
    code: "pt",
    name: "Português",
    englishName: "Portuguese",
    isRTL: false,
  },
  {
    code: "fr",
    name: "Français",
    englishName: "French",
    isRTL: false,
  },
  {
    code: "it",
    name: "Italiano",
    englishName: "Italian",
    isRTL: false,
  },
  {
    code: "de",
    name: "Deutsch",
    englishName: "German",
    isRTL: false,
  },
  {
    code: "nl",
    name: "Nederlands",
    englishName: "Dutch",
    isRTL: false,
  },
  {
    code: "hi",
    name: "हिन्दी",
    englishName: "Hindi",
    isRTL: false,
  },
  {
    code: "id",
    name: "Bahasa Indonesia",
    englishName: "Indonesian",
    isRTL: false,
  },
  {
    code: "ms",
    name: "Bahasa Melayu",
    englishName: "Malay",
    isRTL: false,
  },
  {
    code: "fil",
    name: "Filipino",
    englishName: "Filipino",
    isRTL: false,
  },
  {
    code: "ar",
    name: "العربية",
    englishName: "Arabic",
    isRTL: true,
  },
  {
    code: "zh",
    name: "简体中文",
    englishName: "Chinese Simplified",
    isRTL: false,
  },
  {
    code: "ja",
    name: "日本語",
    englishName: "Japanese",
    isRTL: false,
  },
  {
    code: "ko",
    name: "한국어",
    englishName: "Korean",
    isRTL: false,
  },
  {
    code: "ru",
    name: "Русский",
    englishName: "Russian",
    isRTL: false,
  },
  {
    code: "th",
    name: "ไทย",
    englishName: "Thai",
    isRTL: false,
  },
] as const;

export type AppLanguage =
  (typeof SUPPORTED_LANGUAGES)[number]['code'];

export const SUPPORTED_LANGUAGE_CODES =
  SUPPORTED_LANGUAGES.map(
    language => language.code,
  );

export const DEFAULT_LANGUAGE: AppLanguage = 'en';

export const RTL_LANGUAGE_CODES =
  SUPPORTED_LANGUAGES
    .filter(language => language.isRTL)
    .map(language => language.code);
