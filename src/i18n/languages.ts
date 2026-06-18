export const SUPPORTED_LANGUAGES = [
  {
    code: 'vi',
    name: 'Tiếng Việt',
  },
  {
    code: 'en',
    name: 'English',
  },
   {
    code: 'zh',
    name: '简体中文',
  },
  {
    code: 'ko',
    name: '한국어',
  },
  {
    code: 'ja',
    name: '日本語',
  },
] as const;

export type AppLanguage =
  (typeof SUPPORTED_LANGUAGES)[number]['code'];

export const SUPPORTED_LANGUAGE_CODES =
  SUPPORTED_LANGUAGES.map(language => language.code);