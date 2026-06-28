import AsyncStorage
  from '@react-native-async-storage/async-storage';

const STORAGE_KEY =
  '@luna_oracle/palm_reading_history_v2_lite';

export type PalmHandSide =
  | 'left'
  | 'right';

export type PalmDominantHand =
  | 'left'
  | 'right';

export type PalmReadingFocus =
  | 'general'
  | 'love'
  | 'career'
  | 'energy'
  | 'spiritual';

export type PalmShape =
  | 'earth'
  | 'air'
  | 'water'
  | 'fire';

export type PalmLineId =
  | 'lifeLine'
  | 'heartLine'
  | 'headLine'
  | 'fateLine'
  | 'sunLine';

export type PalmLineDepth =
  | 'clear'
  | 'medium'
  | 'faint';

export type PalmLineLength =
  | 'short'
  | 'medium'
  | 'long';

export type PalmLineCurve =
  | 'straight'
  | 'balanced'
  | 'curved';

export type PalmFateVisibility =
  | 'clear'
  | 'medium'
  | 'faint'
  | 'absent';

export type PalmFingerShape =
  | 'shortWide'
  | 'balanced'
  | 'longSlim';

export type PalmMount =
  | 'venus'
  | 'jupiter'
  | 'saturn'
  | 'apollo'
  | 'mercury'
  | 'moon'
  | 'mars';

export type PalmReadingObservation = {
  palmShape: PalmShape;
  fingerShape: PalmFingerShape;
  lineClarity: PalmLineDepth;
  lifeLineDepth: PalmLineDepth;
  heartLineLength: PalmLineLength;
  heartLineCurve: PalmLineCurve;
  headLineShape: PalmLineCurve;
  fateLineVisibility: PalmFateVisibility;
  strongestMount: PalmMount;
};

export type PalmReadingInput = {
  imageUri: string;
  handSide: PalmHandSide;
  dominantHand: PalmDominantHand;
  focus: PalmReadingFocus;
  observations?: PalmReadingObservation;
  createdAt?: string;
};

export type PalmLineReading = {
  id: PalmLineId;
  score: number;
  titleKey: string;
  titleFallback: string;
  messageKey: string;
  messageFallback: string;
  actionKey: string;
  actionFallback: string;
};

export type PalmReadingResult = {
  id: string;
  version: 'v1' | 'v2Lite';
  imageUri: string;
  handSide: PalmHandSide;
  dominantHand: PalmDominantHand;
  focus: PalmReadingFocus;
  palmShape: PalmShape;
  observations?: PalmReadingObservation;
  overallScore: number;
  confidenceScore: number;
  createdAt: string;
  summaryKey: string;
  summaryFallback: string;
  focusMessageKey: string;
  focusMessageFallback: string;
  observationSummaryFallback: string;
  lines: PalmLineReading[];
  disclaimerKey: string;
  disclaimerFallback: string;
};

function createId():
string {
  return `${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

function hashString(value: string): number {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash =
      (hash << 5) -
      hash +
      value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

function scoreFromSeed(
  seed: string,
  offset: number,
): number {
  const value =
    hashString(`${seed}:${offset}`);

  return 48 + (value % 45);
}

function clampScore(
  value: number,
): number {
  return Math.max(
    32,
    Math.min(
      96,
      Math.round(value),
    ),
  );
}

function pickPalmShape(
  seed: string,
): PalmShape {
  const shapes:
    PalmShape[] = [
      'earth',
      'air',
      'water',
      'fire',
    ];

  return shapes[
    hashString(seed) %
      shapes.length
  ];
}

function depthScore(
  value?: PalmLineDepth,
): number {
  if (value === 'clear') {
    return 84;
  }

  if (value === 'medium') {
    return 68;
  }

  return 52;
}

function fateScore(
  value?: PalmFateVisibility,
): number {
  if (value === 'clear') {
    return 82;
  }

  if (value === 'medium') {
    return 66;
  }

  if (value === 'faint') {
    return 54;
  }

  return 46;
}

function lengthScore(
  value?: PalmLineLength,
): number {
  if (value === 'long') {
    return 82;
  }

  if (value === 'medium') {
    return 68;
  }

  return 55;
}

function curveScore(
  value?: PalmLineCurve,
): number {
  if (value === 'balanced') {
    return 78;
  }

  if (value === 'curved') {
    return 72;
  }

  return 64;
}

function fingerScore(
  value?: PalmFingerShape,
): number {
  if (value === 'longSlim') {
    return 78;
  }

  if (value === 'balanced') {
    return 70;
  }

  return 62;
}

function mountModifier(
  mount: PalmMount | undefined,
  lineId: PalmLineId,
): number {
  if (!mount) {
    return 0;
  }

  const table:
    Record<PalmMount, Partial<Record<PalmLineId, number>>> = {
    venus: {
      heartLine: 8,
      lifeLine: 5,
    },
    jupiter: {
      fateLine: 8,
      headLine: 4,
    },
    saturn: {
      fateLine: 7,
      headLine: 5,
    },
    apollo: {
      sunLine: 10,
      heartLine: 3,
    },
    mercury: {
      headLine: 7,
      sunLine: 4,
    },
    moon: {
      heartLine: 5,
      sunLine: 6,
    },
    mars: {
      lifeLine: 8,
      fateLine: 4,
    },
  };

  return table[mount][lineId] ?? 0;
}

function buildObservationSummary(
  observation: PalmReadingObservation | undefined,
): string {
  if (!observation) {
    return 'This V1-style reading uses your palm photo as a private reference and creates a symbolic local interpretation.';
  }

  return [
    `Palm type: ${observation.palmShape}.`,
    `Main line clarity: ${observation.lineClarity}.`,
    `Heart line: ${observation.heartLineLength} and ${observation.heartLineCurve}.`,
    `Head line: ${observation.headLineShape}.`,
    `Fate line: ${observation.fateLineVisibility}.`,
    `Strongest mount: ${observation.strongestMount}.`,
  ].join(' ');
}

function getLineFallback(
  id: PalmLineId,
  score: number,
  focus: PalmReadingFocus,
  observation?: PalmReadingObservation,
): {
  message: string;
  action: string;
} {
  const high =
    score >= 76;

  const medium =
    score >= 62;

  if (id === 'lifeLine') {
    const depth =
      observation?.lifeLineDepth;

    return {
      message:
        depth === 'clear'
          ? 'Your life line looks clear, suggesting strong recovery energy, grounded vitality, and a natural instinct for protecting your rhythm.'
          : depth === 'medium'
            ? 'Your life line appears balanced, suggesting steady energy that grows best through consistent routines.'
            : depth === 'faint'
              ? 'Your life line appears softer, suggesting your energy may need gentleness, rest, and fewer unnecessary demands.'
              : high
                ? 'Your life line suggests steady vitality, strong recovery energy, and a grounded instinct for protecting your rhythm.'
                : medium
                  ? 'Your life line suggests balanced energy. You may thrive when your routines are simple and consistent.'
                  : 'Your life line suggests your energy needs gentleness, rest, and more protection from unnecessary pressure.',
      action:
        'Choose one small habit that protects your energy today.',
    };
  }

  if (id === 'heartLine') {
    const length =
      observation?.heartLineLength;

    const curve =
      observation?.heartLineCurve;

    return {
      message:
        length === 'long' && curve === 'curved'
          ? 'Your heart line suggests emotional warmth, expressive affection, and a need for love that feels sincere and safe.'
          : length === 'short'
            ? 'Your heart line suggests a private emotional style. You may need time, trust, and clear boundaries before opening fully.'
            : curve === 'straight'
              ? 'Your heart line suggests emotional control and careful loyalty. You may value honesty more than dramatic romance.'
              : high
                ? 'Your heart line reflects emotional warmth, loyalty, and a strong need for sincere connection.'
                : medium
                  ? 'Your heart line suggests a balanced emotional nature that opens slowly when trust is present.'
                  : 'Your heart line asks for softer boundaries and more emotional honesty before overgiving.',
      action:
        focus === 'love'
          ? 'Ask for clarity without chasing control.'
          : 'Name one feeling without judging it.',
    };
  }

  if (id === 'headLine') {
    const shape =
      observation?.headLineShape;

    return {
      message:
        shape === 'straight'
          ? 'Your head line suggests practical thinking, direct decisions, and a mind that prefers structure over confusion.'
          : shape === 'curved'
            ? 'Your head line suggests imagination, intuition, and a mind that understands through symbols and feeling.'
            : shape === 'balanced'
              ? 'Your head line suggests a balanced mind that can move between logic and intuition when calm.'
              : high
                ? 'Your head line points to a focused mind, quick pattern recognition, and strong decision energy.'
                : medium
                  ? 'Your head line suggests practical thinking with intuitive flashes when you slow down.'
                  : 'Your head line asks you to reduce mental noise before making important choices.',
      action:
        'Write the clearest next step in one sentence.',
    };
  }

  if (id === 'fateLine') {
    const fate =
      observation?.fateLineVisibility;

    return {
      message:
        fate === 'clear'
          ? 'Your fate line appears clear, suggesting direction, responsibility, and a path that strengthens through commitment.'
          : fate === 'medium'
            ? 'Your fate line appears moderate, suggesting your direction forms through choices, timing, and steady effort.'
            : fate === 'faint'
              ? 'Your fate line appears subtle, suggesting your life path may be flexible and shaped by personal choices.'
              : fate === 'absent'
                ? 'Your fate line is not strongly visible, suggesting a self-made path where freedom and reinvention matter more than fixed destiny.'
                : high
                  ? 'Your fate line suggests a strong sense of direction and a path that becomes clearer through responsibility.'
                  : medium
                    ? 'Your fate line suggests your direction forms through choices, timing, and steady effort.'
                    : 'Your fate line suggests your path may be self-made rather than fixed. Flexibility is part of your design.',
      action:
        focus === 'career'
          ? 'Choose one practical action that supports your long-term path.'
          : 'Notice where life is asking you to choose with more intention.',
    };
  }

  const mount =
    observation?.strongestMount;

  return {
    message:
      mount === 'apollo'
        ? 'Your Apollo/Sun area suggests creative visibility, confidence, and a gift that becomes stronger when shared.'
        : mount === 'mercury'
          ? 'Your Mercury area suggests communication gifts, adaptability, and a talent for translating ideas clearly.'
          : mount === 'moon'
            ? 'Your Moon area suggests imagination, intuition, dreams, and symbolic sensitivity.'
            : high
              ? 'Your sun line suggests creative visibility, natural charm, and a gift that grows when shared.'
              : medium
                ? 'Your sun line suggests creative potential that strengthens through practice and confidence.'
                : 'Your sun line suggests your gifts may need privacy, patience, and gentle encouragement before they shine.',
    action:
      'Share or practice one small creative gift today.',
  };
}

function getFocusMessage(
  focus: PalmReadingFocus,
  palmShape: PalmShape,
  observation?: PalmReadingObservation,
): string {
  const mount =
    observation?.strongestMount;

  if (focus === 'love') {
    return mount === 'venus'
      ? 'In love, your Venus emphasis points to warmth, affection, and the need for emotional safety rather than dramatic proof.'
      : 'In love, this palm reading points to emotional honesty, clearer boundaries, and connection that feels safe rather than dramatic.';
  }

  if (focus === 'career') {
    return mount === 'jupiter' || mount === 'saturn'
      ? 'For career, your guide pattern points to leadership, discipline, and choosing responsibilities that match your long-term direction.'
      : 'For career, this reading points to steady progress, better timing, and choosing work that respects your natural rhythm.';
  }

  if (focus === 'energy') {
    return observation?.lineClarity === 'faint'
      ? 'For energy, the softer line clarity asks you to reduce pressure, protect rest, and rebuild momentum slowly.'
      : 'For energy, this reading asks you to protect your daily rhythm and stop treating rest as something you must earn.';
  }

  if (focus === 'spiritual') {
    return mount === 'moon'
      ? 'Spiritually, your Moon emphasis suggests strong dream language, symbolic intuition, and messages that arrive when you are quiet.'
      : 'Spiritually, this reading invites a calmer relationship with intuition, symbols, and the quiet messages your body already knows.';
  }

  if (palmShape === 'water') {
    return 'Your palm energy feels emotionally intuitive. Reflection, softness, and creative flow may help you understand yourself better.';
  }

  if (palmShape === 'fire') {
    return 'Your palm energy feels active and expressive. Courage is a strength, but pacing will protect your inner flame.';
  }

  if (palmShape === 'air') {
    return 'Your palm energy feels mental and perceptive. Your growth comes from clarity, communication, and calmer choices.';
  }

  return 'Your palm energy feels grounded and steady. Your path strengthens through patience, routine, and practical self-trust.';
}

function calculateLineScore(
  lineId: PalmLineId,
  seedScore: number,
  observation?: PalmReadingObservation,
): number {
  if (!observation) {
    return seedScore;
  }

  let score =
    seedScore * 0.28;

  if (lineId === 'lifeLine') {
    score += depthScore(
      observation.lifeLineDepth,
    ) * 0.62;
    score += depthScore(
      observation.lineClarity,
    ) * 0.1;
  } else if (lineId === 'heartLine') {
    score += lengthScore(
      observation.heartLineLength,
    ) * 0.34;
    score += curveScore(
      observation.heartLineCurve,
    ) * 0.28;
    score += depthScore(
      observation.lineClarity,
    ) * 0.1;
  } else if (lineId === 'headLine') {
    score += curveScore(
      observation.headLineShape,
    ) * 0.44;
    score += fingerScore(
      observation.fingerShape,
    ) * 0.18;
    score += depthScore(
      observation.lineClarity,
    ) * 0.1;
  } else if (lineId === 'fateLine') {
    score += fateScore(
      observation.fateLineVisibility,
    ) * 0.62;
    score += depthScore(
      observation.lineClarity,
    ) * 0.1;
  } else {
    score += fingerScore(
      observation.fingerShape,
    ) * 0.32;
    score += depthScore(
      observation.lineClarity,
    ) * 0.18;
    score += 8;
  }

  score += mountModifier(
    observation.strongestMount,
    lineId,
  );

  return clampScore(score);
}

function calculateConfidence(
  observation?: PalmReadingObservation,
): number {
  if (!observation) {
    return 48;
  }

  let score = 62;

  if (observation.lineClarity === 'clear') {
    score += 22;
  } else if (observation.lineClarity === 'medium') {
    score += 12;
  } else {
    score += 4;
  }

  if (
    observation.fateLineVisibility !==
    'absent'
  ) {
    score += 6;
  }

  return clampScore(score);
}

export function buildPalmReadingResult(
  input: PalmReadingInput,
): PalmReadingResult {
  const createdAt =
    input.createdAt ??
    new Date().toISOString();

  const seed =
    [
      input.imageUri,
      input.handSide,
      input.dominantHand,
      input.focus,
      createdAt.slice(0, 10),
      input.observations
        ? JSON.stringify(
            input.observations,
          )
        : '',
    ].join(':');

  const palmShape =
    input.observations?.palmShape ??
    pickPalmShape(seed);

  const lineIds:
    PalmLineId[] = [
      'lifeLine',
      'heartLine',
      'headLine',
      'fateLine',
      'sunLine',
    ];

  const lines =
    lineIds.map((id, index) => {
      const seedScore =
        scoreFromSeed(seed, index);

      const score =
        calculateLineScore(
          id,
          seedScore,
          input.observations,
        );

      const fallback =
        getLineFallback(
          id,
          score,
          input.focus,
          input.observations,
        );

      return {
        id,
        score,
        titleKey:
          `palmReading.lines.${id}.title`,
        titleFallback:
          id === 'lifeLine'
            ? 'Life Line'
            : id === 'heartLine'
              ? 'Heart Line'
              : id === 'headLine'
                ? 'Head Line'
                : id === 'fateLine'
                  ? 'Fate Line'
                  : 'Sun Line',
        messageKey:
          `palmReading.lines.${id}.message`,
        messageFallback:
          fallback.message,
        actionKey:
          `palmReading.lines.${id}.action`,
        actionFallback:
          fallback.action,
      };
    });

  const overallScore =
    Math.round(
      lines.reduce(
        (sum, line) =>
          sum + line.score,
        0,
      ) / lines.length,
    );

  const version =
    input.observations
      ? 'v2Lite'
      : 'v1';

  return {
    id:
      createId(),
    version,
    imageUri:
      input.imageUri,
    handSide:
      input.handSide,
    dominantHand:
      input.dominantHand,
    focus:
      input.focus,
    palmShape,
    observations:
      input.observations,
    overallScore,
    confidenceScore:
      calculateConfidence(
        input.observations,
      ),
    createdAt,
    summaryKey:
      'palmReading.result.summary',
    summaryFallback:
      input.observations
        ? `Your V2 Lite palm reading shows ${palmShape} palm energy with an overall score of ${overallScore} and confidence ${calculateConfidence(input.observations)}. This reading is based on your selected palm observations, not server AI.`
        : `Your palm reading shows ${palmShape} palm energy with an overall clarity score of ${overallScore}. This suggests a path shaped by self-awareness, timing, and the way you protect your emotional rhythm.`,
    focusMessageKey:
      `palmReading.focusMessages.${input.focus}`,
    focusMessageFallback:
      getFocusMessage(
        input.focus,
        palmShape,
        input.observations,
      ),
    observationSummaryFallback:
      buildObservationSummary(
        input.observations,
      ),
    lines,
    disclaimerKey:
      'palmReading.disclaimer',
    disclaimerFallback:
      'Palm reading is for entertainment, reflection, and self-awareness only. It should not be used as medical, financial, legal, or professional advice.',
  };
}

async function readHistory():
Promise<PalmReadingResult[]> {
  const raw =
    await AsyncStorage.getItem(
      STORAGE_KEY,
    );

  if (!raw) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

async function writeHistory(
  readings: PalmReadingResult[],
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      readings.slice(0, 80),
    ),
  );
}

export async function savePalmReadingResult(
  result: PalmReadingResult,
): Promise<void> {
  const history =
    await readHistory();

  const exists =
    history.some(
      item => item.id === result.id,
    );

  if (exists) {
    return;
  }

  await writeHistory([
    result,
    ...history,
  ]);
}

export async function listPalmReadingHistory():
Promise<PalmReadingResult[]> {
  const history =
    await readHistory();

  return history.sort(
    (a, b) =>
      b.createdAt.localeCompare(
        a.createdAt,
      ),
  );
}

export async function deletePalmReadingResult(
  id: string,
): Promise<void> {
  const history =
    await readHistory();

  await writeHistory(
    history.filter(
      item => item.id !== id,
    ),
  );
}

export async function clearPalmReadingHistory():
Promise<void> {
  await AsyncStorage.removeItem(
    STORAGE_KEY,
  );
}
