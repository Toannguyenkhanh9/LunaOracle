export type AstroGlossaryCategory =
  | 'zodiac'
  | 'planets'
  | 'houses'
  | 'aspects'
  | 'tarot'
  | 'moon';

export type AstroGlossaryTerm = {
  id: string;
  term: string;
  category: AstroGlossaryCategory;
  short: string;
  description: string;
  keywords: string[];
};

export const ASTRO_GLOSSARY_CATEGORIES:
  AstroGlossaryCategory[] = [
    'zodiac',
    'planets',
    'houses',
    'aspects',
    'tarot',
    'moon',
  ];

export const ASTRO_GLOSSARY_TERMS:
  AstroGlossaryTerm[] = [
    {
      id: 'sun-sign',
      term: 'Sun Sign',
      category: 'zodiac',
      short:
        'Your core zodiac identity based on the Sun.',
      description:
        'The Sun Sign represents vitality, identity, confidence, and the way a person expresses their essential self.',
      keywords: [
        'zodiac',
        'identity',
        'birthday',
      ],
    },
    {
      id: 'moon-sign',
      term: 'Moon Sign',
      category: 'zodiac',
      short:
        'Your emotional nature and inner world.',
      description:
        'The Moon Sign describes emotional needs, instincts, memory, comfort, and how a person responds when they feel safe or vulnerable.',
      keywords: [
        'emotion',
        'inner',
        'moon',
      ],
    },
    {
      id: 'rising-sign',
      term: 'Rising Sign',
      category: 'zodiac',
      short:
        'The style you show when meeting life.',
      description:
        'Also called the Ascendant, the Rising Sign describes first impressions, appearance, approach to life, and the doorway into the birth chart.',
      keywords: [
        'ascendant',
        'birth chart',
        'first impression',
      ],
    },
    {
      id: 'mercury',
      term: 'Mercury',
      category: 'planets',
      short:
        'Communication, thought, learning, and messages.',
      description:
        'Mercury represents language, logic, study, trade, writing, speaking, and how the mind organizes information.',
      keywords: [
        'communication',
        'mind',
        'learning',
      ],
    },
    {
      id: 'venus',
      term: 'Venus',
      category: 'planets',
      short:
        'Love, beauty, attraction, and values.',
      description:
        'Venus describes affection, aesthetics, money values, pleasure, relationship style, and what a person finds beautiful or desirable.',
      keywords: [
        'love',
        'beauty',
        'money',
      ],
    },
    {
      id: 'mars',
      term: 'Mars',
      category: 'planets',
      short:
        'Action, desire, courage, and conflict.',
      description:
        'Mars represents energy, drive, assertion, anger, sexuality, motivation, and the way a person goes after what they want.',
      keywords: [
        'action',
        'drive',
        'courage',
      ],
    },
    {
      id: 'houses',
      term: 'Houses',
      category: 'houses',
      short:
        'Life areas in a birth chart.',
      description:
        'The twelve houses describe where planetary energy appears in life, such as identity, money, home, love, work, partnership, and spirituality.',
      keywords: [
        'birth chart',
        'life areas',
        'twelve houses',
      ],
    },
    {
      id: 'aspects',
      term: 'Aspects',
      category: 'aspects',
      short:
        'Angles between planets.',
      description:
        'Aspects show how planets interact. Some feel supportive, some feel tense, and many create growth through dynamic contrast.',
      keywords: [
        'angle',
        'planets',
        'synastry',
      ],
    },
    {
      id: 'retrograde',
      term: 'Retrograde',
      category: 'planets',
      short:
        'A symbolic inward review cycle.',
      description:
        'Retrograde means a planet appears to move backward from Earth. Astrologically, it is often used for review, delay, revision, and inner processing.',
      keywords: [
        'mercury retrograde',
        'review',
        'delay',
      ],
    },
    {
      id: 'major-arcana',
      term: 'Major Arcana',
      category: 'tarot',
      short:
        'The main archetypal cards in tarot.',
      description:
        'The Major Arcana cards describe large life themes, turning points, archetypal lessons, and meaningful transitions.',
      keywords: [
        'tarot',
        'archetype',
        'fool',
      ],
    },
    {
      id: 'minor-arcana',
      term: 'Minor Arcana',
      category: 'tarot',
      short:
        'Daily-life tarot cards divided into four suits.',
      description:
        'The Minor Arcana shows everyday experiences through Cups, Wands, Swords, and Pentacles.',
      keywords: [
        'tarot suits',
        'cups',
        'wands',
        'swords',
        'pentacles',
      ],
    },
    {
      id: 'new-moon',
      term: 'New Moon',
      category: 'moon',
      short:
        'A lunar phase for beginning and intention.',
      description:
        'The New Moon is commonly used for quiet reflection, planting intentions, and beginning a new emotional or creative cycle.',
      keywords: [
        'moon',
        'intention',
        'beginning',
      ],
    },
    {
      id: 'full-moon',
      term: 'Full Moon',
      category: 'moon',
      short:
        'A lunar phase for clarity and release.',
      description:
        'The Full Moon is often associated with culmination, visibility, emotional clarity, gratitude, and release.',
      keywords: [
        'moon',
        'release',
        'clarity',
      ],
    },
  ];

export function searchAstroGlossaryTerms(
  query: string,
  category?: AstroGlossaryCategory,
): AstroGlossaryTerm[] {
  const normalized =
    query.trim().toLowerCase();

  return ASTRO_GLOSSARY_TERMS.filter(
    item => {
      if (
        category &&
        item.category !== category
      ) {
        return false;
      }

      if (!normalized) {
        return true;
      }

      return [
        item.term,
        item.short,
        item.description,
        item.category,
        ...item.keywords,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalized);
    },
  );
}
