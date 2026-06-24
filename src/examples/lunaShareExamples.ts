import type {
  TFunction,
} from 'i18next';

import type {
  LunaShareImageParams,
} from '../types/lunaShare';

type TarotLike = {
  card: {
    id?: string;
    name: string;
    number?: string;
    upright?: string;
    reversed?: string;
    advice?: string;
  };
  orientation?: string;
};

export function buildTarotShareParams(
  t: TFunction,
  draw: TarotLike,
): LunaShareImageParams {
  const reversed =
    draw.orientation === 'reversed' ||
    draw.orientation === 'Reversed';

  return {
    variant: 'tarot',
    title:
      draw.card.name,
    subtitle:
      reversed
        ? t(
            'western.tarot.orientations.reversed',
            {
              defaultValue:
                'Reversed',
            },
          )
        : t(
            'western.tarot.orientations.upright',
            {
              defaultValue:
                'Upright',
            },
          ),
    message:
      reversed
        ? draw.card.reversed ??
          draw.card.upright ??
          ''
        : draw.card.upright ??
          draw.card.reversed ??
          '',
    cardId:
      draw.card.id ??
      draw.card.name,
    cardName:
      draw.card.name,
    reversed,
    badge:
      t(
        'lunaShare.badges.tarot',
        {
          defaultValue:
            'TAROT',
        },
      ),
    tags: [
      'tarot',
      'luna',
      reversed
        ? 'reversed'
        : 'upright',
    ],
  };
}

export function buildDailyInsightShareParams(
  params: {
    title: string;
    message: string;
    score?: number;
    moonHouse?: number;
  },
): LunaShareImageParams {
  return {
    variant: 'dailyInsight',
    title:
      params.title,
    subtitle:
      params.moonHouse
        ? `Moon focus · House ${params.moonHouse}`
        : undefined,
    message:
      params.message,
    score:
      params.score,
    badge:
      'TODAY',
    tags: [
      'daily',
      'moon',
      'oracle',
    ],
  };
}

export function buildLoveShareParams(
  params: {
    score?: number;
    message: string;
    title?: string;
  },
): LunaShareImageParams {
  return {
    variant: 'love',
    title:
      params.title ??
      'Love Center',
    subtitle:
      'Venus · Mars · Moon',
    message:
      params.message,
    score:
      params.score,
    badge:
      'LOVE',
    tags: [
      'love',
      'venus',
      'luna',
    ],
  };
}

export function buildForecastShareParams(
  params: {
    year: number;
    monthLabel?: string;
    score?: number;
    message: string;
  },
): LunaShareImageParams {
  return {
    variant: 'forecast',
    title:
      params.monthLabel
        ? `${params.monthLabel} Forecast`
        : `${params.year} Forecast`,
    subtitle:
      'Year / Monthly Forecast',
    message:
      params.message,
    score:
      params.score,
    badge:
      'FORECAST',
    tags: [
      'forecast',
      'astrology',
      'luna',
    ],
  };
}
