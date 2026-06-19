export type TarotOrientation =
  | 'upright'
  | 'reversed';

export type TarotCard = {
  id: string;
  name: string;
  number: string;
  arcana: 'major' | 'minor';
  suit?: 'cups' | 'wands' | 'swords' | 'pentacles';
  keywords: string[];
  upright: string;
  reversed: string;
  advice: string;
};

export type TarotDraw = {
  card: TarotCard;
  orientation: TarotOrientation;
  position: string;
};

export const MAJOR_ARCANA: TarotCard[] = [
  {
    id: 'fool',
    name: 'The Fool',
    number: '0',
    arcana: 'major',
    keywords: ['beginning', 'trust', 'freedom'],
    upright:
      'A fresh start asks for openness, curiosity, and a lighter heart.',
    reversed:
      'Pause before leaping. Freedom still needs awareness.',
    advice:
      'Begin, but keep your eyes open.',
  },
  {
    id: 'magician',
    name: 'The Magician',
    number: 'I',
    arcana: 'major',
    keywords: ['skill', 'focus', 'manifestation'],
    upright:
      'You already have useful tools. Bring attention and action together.',
    reversed:
      'Energy may be scattered or used without clear intention.',
    advice:
      'Choose one intention and act on it deliberately.',
  },
  {
    id: 'high-priestess',
    name: 'The High Priestess',
    number: 'II',
    arcana: 'major',
    keywords: ['intuition', 'mystery', 'inner voice'],
    upright:
      'The answer may be quiet. Listen before explaining.',
    reversed:
      'You may be ignoring your inner knowing or confusing fear with intuition.',
    advice:
      'Make space for silence before deciding.',
  },
  {
    id: 'empress',
    name: 'The Empress',
    number: 'III',
    arcana: 'major',
    keywords: ['nurture', 'growth', 'beauty'],
    upright:
      'Growth comes through care, patience, and nourishment.',
    reversed:
      'Overgiving or neglecting your needs can drain the source.',
    advice:
      'Feed what you want to grow.',
  },
  {
    id: 'emperor',
    name: 'The Emperor',
    number: 'IV',
    arcana: 'major',
    keywords: ['structure', 'authority', 'stability'],
    upright:
      'Clear boundaries and steady structure create safety.',
    reversed:
      'Control may be too rigid or responsibility may be avoided.',
    advice:
      'Create order without losing warmth.',
  },
  {
    id: 'lovers',
    name: 'The Lovers',
    number: 'VI',
    arcana: 'major',
    keywords: ['choice', 'union', 'values'],
    upright:
      'A meaningful choice should align with your values, not just desire.',
    reversed:
      'Mixed signals or divided values need honest conversation.',
    advice:
      'Choose what your whole self can stand behind.',
  },
  {
    id: 'strength',
    name: 'Strength',
    number: 'VIII',
    arcana: 'major',
    keywords: ['courage', 'patience', 'inner power'],
    upright:
      'Gentle courage is stronger than force today.',
    reversed:
      'Self-doubt or pressure may be louder than your real strength.',
    advice:
      'Respond softly without abandoning your power.',
  },
  {
    id: 'hermit',
    name: 'The Hermit',
    number: 'IX',
    arcana: 'major',
    keywords: ['solitude', 'wisdom', 'reflection'],
    upright:
      'Step back to hear your own guidance clearly.',
    reversed:
      'Isolation may be turning into avoidance.',
    advice:
      'Seek quiet, not disappearance.',
  },
  {
    id: 'wheel-of-fortune',
    name: 'Wheel of Fortune',
    number: 'X',
    arcana: 'major',
    keywords: ['change', 'cycle', 'turning point'],
    upright:
      'A cycle is turning. Adaptability matters more than control.',
    reversed:
      'Resistance to change may make the transition harder.',
    advice:
      'Move with the turn, then choose your direction.',
  },
  {
    id: 'death',
    name: 'Death',
    number: 'XIII',
    arcana: 'major',
    keywords: ['ending', 'release', 'transformation'],
    upright:
      'An ending clears the path for a more honest beginning.',
    reversed:
      'Something outdated may be kept alive through fear.',
    advice:
      'Release what no longer carries life.',
  },
  {
    id: 'temperance',
    name: 'Temperance',
    number: 'XIV',
    arcana: 'major',
    keywords: ['balance', 'healing', 'integration'],
    upright:
      'Blend patience with action. Healing happens through rhythm.',
    reversed:
      'Extremes may be pulling you away from center.',
    advice:
      'Choose moderation before momentum.',
  },
  {
    id: 'star',
    name: 'The Star',
    number: 'XVII',
    arcana: 'major',
    keywords: ['hope', 'renewal', 'guidance'],
    upright:
      'Hope returns when you reconnect with what is true and simple.',
    reversed:
      'You may need rest before inspiration can return.',
    advice:
      'Let a small hope become a daily practice.',
  },
  {
    id: 'moon',
    name: 'The Moon',
    number: 'XVIII',
    arcana: 'major',
    keywords: ['dreams', 'uncertainty', 'subconscious'],
    upright:
      'Not everything is clear yet. Move carefully through uncertainty.',
    reversed:
      'Confusion begins to lift when you name what you fear.',
    advice:
      'Do not rush to certainty. Look for patterns.',
  },
  {
    id: 'sun',
    name: 'The Sun',
    number: 'XIX',
    arcana: 'major',
    keywords: ['clarity', 'joy', 'vitality'],
    upright:
      'Clarity and warmth can open what felt complicated.',
    reversed:
      'Joy may be available, but you may need to let it in.',
    advice:
      'Choose the path that brings honest light.',
  },
];

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
      (value * 31 +
        seed.charCodeAt(index)) %
      2147483647;
  }

  return () => {
    value =
      (value * 48271) %
      2147483647;

    return value / 2147483647;
  };
}

export function drawTarotCards(
  count: 1 | 3 = 1,
  seed = new Date()
    .toISOString()
    .slice(0, 10),
): TarotDraw[] {
  const random =
    seededRandom(seed);

  const deck = [...MAJOR_ARCANA];
  const result: TarotDraw[] = [];

  const positions =
    count === 1
      ? ['Daily Guidance']
      : [
          'Past',
          'Present',
          'Future',
        ];

  for (
    let index = 0;
    index < count;
    index += 1
  ) {
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
      position:
        positions[index],
    });
  }

  return result;
}
