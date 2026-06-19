import {
  ZODIAC_SIGNS,
  type ZodiacSignId,
} from './zodiac';

export type DailyHoroscope = {
  sign: ZodiacSignId;
  dateKey: string;
  headline: string;
  love: string;
  career: string;
  money: string;
  energy: string;
  luckyColor: string;
  luckyNumber: number;
  affirmation: string;
};

const HEADLINES = [
  'A calm choice today creates more space than a dramatic move.',
  'Your intuition is useful, but facts still need a seat at the table.',
  'A small conversation can clear a larger emotional knot.',
  'Focus on one priority and let the rest become background noise.',
  'A practical plan turns inspiration into movement.',
  'Protect your energy before promising more than you can give.',
];

const LOVE = [
  'Choose honest warmth over guessing games.',
  'A gentle message can soften distance.',
  'Listen for what is not being said.',
  'Small consistency matters more than grand words.',
  'Give affection without losing your boundaries.',
];

const CAREER = [
  'Review the details before committing.',
  'A focused hour can solve what a scattered day cannot.',
  'Ask for clarity instead of carrying confusion.',
  'Your next step is simpler than the whole plan.',
  'Build quietly and let the results speak.',
];

const MONEY = [
  'Avoid emotional spending and choose one practical improvement.',
  'Check subscriptions, small leaks, and repeated costs.',
  'A careful decision now prevents cleanup later.',
  'Think long-term value rather than quick comfort.',
];

const ENERGY = [
  'Move slowly and breathe before responding.',
  'Your mind needs less noise and more structure.',
  'Take a short reset before the next task.',
  'Protect your sleep and hydration.',
];

const COLORS = [
  'Midnight Blue',
  'Moon Silver',
  'Rose Gold',
  'Deep Violet',
  'Sage Green',
  'Ivory',
];

function hash(
  value: string,
): number {
  let result = 0;

  for (
    let index = 0;
    index < value.length;
    index += 1
  ) {
    result =
      (result * 31 +
        value.charCodeAt(index)) %
      100000;
  }

  return result;
}

function pick<T>(
  items: T[],
  seed: number,
): T {
  return items[
    Math.abs(seed) %
      items.length
  ];
}

export function getDateKey(
  date = new Date(),
): string {
  return date
    .toISOString()
    .slice(0, 10);
}

export function buildDailyHoroscope(
  sign: ZodiacSignId,
  date = new Date(),
): DailyHoroscope {
  const dateKey =
    getDateKey(date);

  const seed =
    hash(`${dateKey}:${sign}`);

  const profile =
    ZODIAC_SIGNS[sign];

  return {
    sign,
    dateKey,
    headline:
      pick(
        HEADLINES,
        seed,
      ),
    love:
      pick(
        LOVE,
        seed + 7,
      ),
    career:
      pick(
        CAREER,
        seed + 13,
      ),
    money:
      pick(
        MONEY,
        seed + 19,
      ),
    energy:
      pick(
        ENERGY,
        seed + 23,
      ),
    luckyColor:
      pick(
        COLORS,
        seed + 29,
      ),
    luckyNumber:
      (seed % 9) + 1,
    affirmation:
      `I honor my ${profile.element} nature while choosing a grounded next step.`,
  };
}
