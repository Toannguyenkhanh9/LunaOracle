import {
  drawTarotCards,
  type TarotDraw,
} from './tarot';

import {
  recordTarotDraws,
} from './tarotCollection';

export type OracleQuestionIntent =
  | 'general'
  | 'love'
  | 'career'
  | 'money'
  | 'healing'
  | 'decision';

export type OracleAnswer = {
  question: string;
  intent: OracleQuestionIntent;
  draw: TarotDraw;
  titleId: string;
  messageId: string;
  actionId: string;
  cautionId: string;
  seed: string;
};

const INTENT_KEYWORDS:
Record<OracleQuestionIntent, string[]> = {
  general: [],
  love: [
    'love',
    'relationship',
    'crush',
    'partner',
    'heart',
    'tình yêu',
    'người yêu',
    'mối quan hệ',
  ],
  career: [
    'career',
    'job',
    'work',
    'business',
    'project',
    'công việc',
    'sự nghiệp',
  ],
  money: [
    'money',
    'finance',
    'salary',
    'income',
    'cash',
    'tiền',
    'tài chính',
  ],
  healing: [
    'heal',
    'stress',
    'sad',
    'release',
    'forgive',
    'chữa lành',
    'buông',
  ],
  decision: [
    'should i',
    'choose',
    'decision',
    'option',
    'nên',
    'chọn',
    'quyết định',
  ],
};

function detectIntent(
  question: string,
): OracleQuestionIntent {
  const lower =
    question.toLowerCase();

  const intents:
    OracleQuestionIntent[] = [
      'love',
      'career',
      'money',
      'healing',
      'decision',
    ];

  return (
    intents.find(intent =>
      INTENT_KEYWORDS[intent].some(
        keyword =>
          lower.includes(
            keyword,
          ),
      ),
    ) ?? 'general'
  );
}

function daySeed():
string {
  return new Date()
    .toISOString()
    .slice(0, 10);
}

export async function askOracle(
  question: string,
): Promise<OracleAnswer> {
  const normalized =
    question.trim() ||
    'What should I focus on today?';

  const intent =
    detectIntent(normalized);

  const seed =
    `${daySeed()}-${intent}-${normalized}`;

  const [draw] =
    drawTarotCards(1, seed);

  await recordTarotDraws([
    draw,
  ]).catch(() => {});

  return {
    question:
      normalized,
    intent,
    draw,
    titleId:
      `askOracle.titles.${intent}`,
    messageId:
      `askOracle.messages.${intent}`,
    actionId:
      `askOracle.actions.${intent}`,
    cautionId:
      `askOracle.cautions.${intent}`,
    seed,
  };
}

export function getOracleCardMessage(
  answer: OracleAnswer,
): string {
  const card =
    answer.draw.card;

  return answer.draw.orientation ===
    'reversed'
    ? card.reversed
    : card.upright;
}
