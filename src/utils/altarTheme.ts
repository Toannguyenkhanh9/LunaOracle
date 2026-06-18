import type {
  ImageSourcePropType,
} from 'react-native';

import type {
  AltarCultureTheme,
} from '../services/altarPreferences';

export type ResolvedAltarCultureTheme = Exclude<
  AltarCultureTheme,
  'auto'
>;

export function getAutomaticAltarCultureTheme(
  language?: string,
): ResolvedAltarCultureTheme {
  const normalized = (
    language ?? 'en'
  ).toLowerCase();

  if (normalized.startsWith('vi')) {
    return 'vietnam';
  }

  if (normalized.startsWith('zh')) {
    return 'china';
  }

  if (normalized.startsWith('ja')) {
    return 'japan';
  }

  if (normalized.startsWith('ko')) {
    return 'korea';
  }

  return 'western';
}

export function resolveAltarCultureTheme(
  selectedTheme: AltarCultureTheme,
  language?: string,
): ResolvedAltarCultureTheme {
  if (selectedTheme !== 'auto') {
    return selectedTheme;
  }

  return getAutomaticAltarCultureTheme(
    language,
  );
}

export function getAltarBackgroundSource(
  theme: ResolvedAltarCultureTheme,
): ImageSourcePropType {
  switch (theme) {
    case 'vietnam':
      return require(
        '../assets/images/altars/main_hall_vietnam.png',
      );

    case 'china':
      return require(
        '../assets/images/altars/main_hall_china.png',
      );

    case 'japan':
      return require(
        '../assets/images/altars/main_hall_japan.png',
      );

    case 'korea':
      return require(
        '../assets/images/altars/main_hall_korea.png',
      );

    case 'western':
    default:
      return require(
        '../assets/images/altars/main_hall_western.png',
      );
  }
}
