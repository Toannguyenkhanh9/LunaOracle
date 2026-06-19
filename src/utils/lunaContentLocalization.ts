import type {
  TFunction,
} from 'i18next';

import type {
  ZodiacSignId,
  ZodiacProfile,
} from '../services/zodiac';

import type {
  TarotCard,
} from '../services/tarot';

import type {
  AstroGlossaryTerm,
} from '../services/astroGlossary';

const DAILY_HEADLINES = [
  'A calm choice today creates more space than a dramatic move.',
  'Your intuition is useful, but facts still need a seat at the table.',
  'A small conversation can clear a larger emotional knot.',
  'Focus on one priority and let the rest become background noise.',
  'A practical plan turns inspiration into movement.',
  'Protect your energy before promising more than you can give.',
];

const DAILY_LOVE = [
  'Choose honest warmth over guessing games.',
  'A gentle message can soften distance.',
  'Listen for what is not being said.',
  'Small consistency matters more than grand words.',
  'Give affection without losing your boundaries.',
];

const DAILY_CAREER = [
  'Review the details before committing.',
  'A focused hour can solve what a scattered day cannot.',
  'Ask for clarity instead of carrying confusion.',
  'Your next step is simpler than the whole plan.',
  'Build quietly and let the results speak.',
];

const DAILY_MONEY = [
  'Avoid emotional spending and choose one practical improvement.',
  'Check subscriptions, small leaks, and repeated costs.',
  'A careful decision now prevents cleanup later.',
  'Think long-term value rather than quick comfort.',
];

const DAILY_ENERGY = [
  'Move slowly and breathe before responding.',
  'Your mind needs less noise and more structure.',
  'Take a short reset before the next task.',
  'Protect your sleep and hydration.',
];

const DAILY_MAP = {
  headlines: DAILY_HEADLINES,
  love: DAILY_LOVE,
  career: DAILY_CAREER,
  money: DAILY_MONEY,
  energy: DAILY_ENERGY,
} as const;

type DailyGroup =
  keyof typeof DAILY_MAP;

export function translateDailyText(
  t: TFunction,
  group: DailyGroup,
  value: string,
): string {
  const index =
    DAILY_MAP[group].indexOf(value);

  if (index < 0) {
    return value;
  }

  return t(
    `lunaDynamic.daily.${group}.${index}`,
    {
      defaultValue: value,
    },
  );
}

export function translateAffirmation(
  t: TFunction,
  element: string,
  fallback: string,
): string {
  const localizedElement =
    t(
      `western.elements.${element}`,
      {
        defaultValue:
          element,
      },
    );

  return t(
    'lunaDynamic.daily.affirmation',
    {
      element: localizedElement,
      defaultValue:
        fallback,
    },
  );
}

export function translateZodiacProfileText(
  t: TFunction,
  sign: ZodiacSignId,
  field:
    | 'loveStyle'
    | 'careerStyle',
  fallback: string,
): string {
  return t(
    `lunaDynamic.zodiac.${sign}.${field}`,
    {
      defaultValue:
        fallback,
    },
  );
}

export function translateZodiacKeyword(
  t: TFunction,
  sign: ZodiacSignId,
  type:
    | 'strengths'
    | 'challenges',
  value: string,
): string {
  return t(
    `lunaDynamic.zodiac.${sign}.${type}.${value}`,
    {
      defaultValue:
        value,
    },
  );
}

export function translateTarotCardName(
  t: TFunction,
  card: TarotCard,
): string {
  return t(
    `lunaDynamic.tarotCards.${card.id}.name`,
    {
      defaultValue:
        card.name,
    },
  );
}

export function translateTarotCardMeaning(
  t: TFunction,
  card: TarotCard,
  orientation:
    | 'upright'
    | 'reversed',
): string {
  return t(
    `lunaDynamic.tarotCards.${card.id}.${orientation}`,
    {
      defaultValue:
        orientation === 'upright'
          ? card.upright
          : card.reversed,
    },
  );
}

export function translateTarotCardAdvice(
  t: TFunction,
  card: TarotCard,
): string {
  return t(
    `lunaDynamic.tarotCards.${card.id}.advice`,
    {
      defaultValue:
        card.advice,
    },
  );
}

export function translateGlossaryTerm(
  t: TFunction,
  term: AstroGlossaryTerm,
  field:
    | 'term'
    | 'short'
    | 'description',
): string {
  return t(
    `lunaDynamic.glossaryTerms.${term.id}.${field}`,
    {
      defaultValue:
        term[field],
    },
  );
}

export function translateCompatibilityHeadline(
  t: TFunction,
  level: string,
  fallback: string,
): string {
  return t(
    `lunaDynamic.compatibility.headlines.${level}`,
    {
      defaultValue:
        fallback,
    },
  );
}
