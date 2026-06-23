import {
  MAJOR_ARCANA,
  type TarotCard,
  type TarotDraw,
  type TarotOrientation,
} from './tarot';

export type AdvancedTarotSpreadId =
  | 'fiveCardPath'
  | 'relationship'
  | 'celticCross';

export type AdvancedTarotSpread = {
  id: AdvancedTarotSpreadId;
  cardCount: number;
  positions: string[];
};

export const ADVANCED_TAROT_SPREADS:
  Record<
    AdvancedTarotSpreadId,
    AdvancedTarotSpread
  > = {
    fiveCardPath: {
      id: 'fiveCardPath',
      cardCount: 5,
      positions: [
        'Situation',
        'Challenge',
        'Hidden Influence',
        'Advice',
        'Outcome',
      ],
    },
    relationship: {
      id: 'relationship',
      cardCount: 7,
      positions: [
        'You',
        'Them',
        'Connection',
        'Strength',
        'Challenge',
        'Advice',
        'Potential',
      ],
    },
    celticCross: {
      id: 'celticCross',
      cardCount: 10,
      positions: [
        'Present',
        'Crossing',
        'Foundation',
        'Recent Past',
        'Higher Aim',
        'Near Future',
        'Inner Self',
        'Outer World',
        'Hopes & Fears',
        'Outcome',
      ],
    },
  };

function seededRandom(
  seed: string,
): () => number {
  let value = 0;

  for (
    let index = 0;
    index < seed.length;
    index += 1
  ) {
    value =
      (
        value * 31 +
        seed.charCodeAt(index)
      ) %
      2147483647;
  }

  return () => {
    value =
      (
        value * 48271
      ) %
      2147483647;

    return value / 2147483647;
  };
}

function drawFromDeck(
  count: number,
  seed: string,
): Array<{
  card: TarotCard;
  orientation: TarotOrientation;
}> {
  const random =
    seededRandom(seed);

  const deck =
    [...MAJOR_ARCANA];

  const result:
    Array<{
      card: TarotCard;
      orientation: TarotOrientation;
    }> = [];

  for (
    let index = 0;
    index < count;
    index += 1
  ) {
    if (deck.length === 0) {
      break;
    }

    const selectedIndex =
      Math.floor(
        random() * deck.length,
      );

    const [card] =
      deck.splice(
        selectedIndex,
        1,
      );

    result.push({
      card,
      orientation:
        random() > 0.78
          ? 'reversed'
          : 'upright',
    });
  }

  return result;
}

export function drawAdvancedTarotSpread(
  spreadId: AdvancedTarotSpreadId,
  seed = `${Date.now()}`,
): TarotDraw[] {
  const spread =
    ADVANCED_TAROT_SPREADS[
      spreadId
    ];

  return drawFromDeck(
    spread.cardCount,
    seed,
  ).map(
    (
      item,
      index,
    ) => ({
      card:
        item.card,
      orientation:
        item.orientation,
      position:
        spread.positions[index] ??
        `Card ${index + 1}`,
    }),
  );
}
