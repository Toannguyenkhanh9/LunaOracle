import {
  ZODIAC_SIGNS,
  type ZodiacElement,
  type ZodiacModality,
  type ZodiacSignId,
} from './zodiac';

export type CompatibilityMode =
  | 'love'
  | 'friendship'
  | 'career';

export type CompatibilitySection = {
  title: string;
  text: string;
  score: number;
};

export type ZodiacCompatibilityResult = {
  firstSign: ZodiacSignId;
  secondSign: ZodiacSignId;
  score: number;
  level:
    | 'excellent'
    | 'strong'
    | 'balanced'
    | 'growth';
  headline: string;
  summary: string;
  elementFlow: string;
  modalityFlow: string;
  sections: CompatibilitySection[];
};

const FRIENDLY_ELEMENTS: Record<
  ZodiacElement,
  ZodiacElement[]
> = {
  fire: ['air', 'fire'],
  air: ['fire', 'air'],
  earth: ['water', 'earth'],
  water: ['earth', 'water'],
};

const ELEMENT_LABELS: Record<
  ZodiacElement,
  string
> = {
  fire: 'Fire',
  earth: 'Earth',
  air: 'Air',
  water: 'Water',
};

const MODALITY_LABELS: Record<
  ZodiacModality,
  string
> = {
  cardinal: 'Cardinal',
  fixed: 'Fixed',
  mutable: 'Mutable',
};

function getElementScore(
  first: ZodiacElement,
  second: ZodiacElement,
): number {
  if (first === second) {
    return 38;
  }

  if (
    FRIENDLY_ELEMENTS[first].includes(
      second,
    )
  ) {
    return 30;
  }

  return 20;
}

function getModalityScore(
  first: ZodiacModality,
  second: ZodiacModality,
): number {
  if (first === second) {
    return 18;
  }

  if (
    first === 'mutable' ||
    second === 'mutable'
  ) {
    return 22;
  }

  return 16;
}

function getLevel(
  score: number,
): ZodiacCompatibilityResult['level'] {
  if (score >= 84) {
    return 'excellent';
  }

  if (score >= 74) {
    return 'strong';
  }

  if (score >= 62) {
    return 'balanced';
  }

  return 'growth';
}

function getHeadline(
  level: ZodiacCompatibilityResult['level'],
): string {
  switch (level) {
    case 'excellent':
      return 'Natural chemistry with strong mutual understanding.';

    case 'strong':
      return 'A supportive match with good long-term potential.';

    case 'balanced':
      return 'A workable connection that grows through communication.';

    case 'growth':
    default:
      return 'A learning connection that needs patience and clear boundaries.';
  }
}

export function buildZodiacCompatibility(
  firstSign: ZodiacSignId,
  secondSign: ZodiacSignId,
  mode: CompatibilityMode = 'love',
): ZodiacCompatibilityResult {
  const first =
    ZODIAC_SIGNS[firstSign];

  const second =
    ZODIAC_SIGNS[secondSign];

  const elementScore =
    getElementScore(
      first.element,
      second.element,
    );

  const modalityScore =
    getModalityScore(
      first.modality,
      second.modality,
    );

  const rulerBonus =
    first.ruler === second.ruler
      ? 8
      : first.element === second.element
        ? 6
        : 3;

  const modeBonus =
    mode === 'love'
      ? first.element === second.element
        ? 10
        : 6
      : mode === 'friendship'
        ? first.modality === 'mutable' ||
          second.modality === 'mutable'
          ? 9
          : 6
        : 6;

  const score =
    Math.min(
      96,
      Math.max(
        42,
        28 +
          elementScore +
          modalityScore +
          rulerBonus +
          modeBonus,
      ),
    );

  const level =
    getLevel(score);

  const sameElement =
    first.element === second.element;

  const friendlyElement =
    FRIENDLY_ELEMENTS[
      first.element
    ].includes(
      second.element,
    );

  const elementFlow =
    sameElement
      ? `${ELEMENT_LABELS[first.element]} + ${ELEMENT_LABELS[second.element]}: the emotional language is familiar and easy to recognize.`
      : friendlyElement
        ? `${ELEMENT_LABELS[first.element]} + ${ELEMENT_LABELS[second.element]}: the elements can support each other when both people stay honest.`
        : `${ELEMENT_LABELS[first.element]} + ${ELEMENT_LABELS[second.element]}: the rhythm is different, so patience and translation matter.`;

  const modalityFlow =
    first.modality === second.modality
      ? `${MODALITY_LABELS[first.modality]} + ${MODALITY_LABELS[second.modality]}: both may approach timing in a similar way, but can also mirror each other’s habits.`
      : `${MODALITY_LABELS[first.modality]} + ${MODALITY_LABELS[second.modality]}: the connection benefits from balancing initiative, stability, and flexibility.`;

  return {
    firstSign,
    secondSign,
    score,
    level,
    headline:
      getHeadline(level),
    summary:
      `${first.symbol} ${first.sign} and ${second.symbol} ${second.sign} can build connection through awareness of element, modality, and communication style.`,
    elementFlow,
    modalityFlow,
    sections: [
      {
        title: 'Love rhythm',
        text:
          `${first.loveStyle} ${second.loveStyle} The relationship works best when affection is shown in ways both people can understand.`,
        score:
          Math.min(
            100,
            score + 2,
          ),
      },
      {
        title: 'Communication',
        text:
          sameElement
            ? 'The two signs often understand each other quickly, but they still need direct words instead of assumptions.'
            : 'Different elements can create attraction, but clear language helps prevent misunderstanding.',
        score:
          Math.max(
            40,
            score - 4,
          ),
      },
      {
        title: 'Growth lesson',
        text:
          'Use the score as a reflection tool, not a fixed verdict. Awareness, timing, honesty, and real actions matter more than sign matching.',
        score:
          score,
      },
    ],
  };
}
