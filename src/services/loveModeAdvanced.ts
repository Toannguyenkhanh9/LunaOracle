import {
  drawTarotCards,
  type TarotDraw,
} from './tarot';

import {
  buildLoveCenter,
  type LoveCenterResult,
} from './loveCenter';

import {
  recordTarotDraws,
} from './tarotCollection';

export type LoveModeAdvancedResult = {
  love: LoveCenterResult;
  tarot: TarotDraw;
  loveLanguageId: string;
  conversationPromptId: string;
  healingPromptId: string;
  dateIdeaId: string;
  redFlagId: string;
  greenFlagId: string;
};

const LOVE_LANGUAGES = [
  'words',
  'time',
  'touch',
  'acts',
  'gifts',
] as const;

const CONVERSATION_PROMPTS = [
  'needs',
  'future',
  'repair',
  'boundary',
  'gratitude',
  'desire',
] as const;

const HEALING_PROMPTS = [
  'forgiveness',
  'selfWorth',
  'patience',
  'clarity',
  'release',
] as const;

const DATE_IDEAS = [
  'walk',
  'tea',
  'music',
  'museum',
  'cooking',
  'stargazing',
] as const;

const RED_FLAGS = [
  'pressure',
  'avoidance',
  'mixedSignals',
  'control',
  'silence',
] as const;

const GREEN_FLAGS = [
  'consistency',
  'curiosity',
  'kindness',
  'accountability',
  'playfulness',
] as const;

function pick<T>(
  values: readonly T[],
  seed: number,
): T {
  return values[
    Math.abs(seed) %
      values.length
  ];
}

export async function buildLoveModeAdvanced():
Promise<LoveModeAdvancedResult> {
  const love =
    await buildLoveCenter();

  const seed =
    Math.round(
      love.loveScore * 17 +
      love.venusSign.length * 11 +
      new Date().getDate(),
    );

  const [tarot] =
    drawTarotCards(
      1,
      `love-${seed}-${new Date()
        .toISOString()
        .slice(0, 10)}`,
    );

  await recordTarotDraws([
    tarot,
  ]);

  return {
    love,
    tarot,
    loveLanguageId:
      pick(
        LOVE_LANGUAGES,
        seed,
      ),
    conversationPromptId:
      pick(
        CONVERSATION_PROMPTS,
        seed + 3,
      ),
    healingPromptId:
      pick(
        HEALING_PROMPTS,
        seed + 7,
      ),
    dateIdeaId:
      pick(
        DATE_IDEAS,
        seed + 13,
      ),
    redFlagId:
      pick(
        RED_FLAGS,
        seed + 17,
      ),
    greenFlagId:
      pick(
        GREEN_FLAGS,
        seed + 23,
      ),
  };
}
