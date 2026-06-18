export type PremiumContentCategory =
  | 'meditation'
  | 'sutra'
  | 'sleep'
  | 'ritual'
  | 'theme';

export type PremiumContentItem = {
  id: string;
  category: PremiumContentCategory;
  titleKey: string;
  descriptionKey: string;
  durationMinutes?: number;
  icon: string;
  premium: boolean;
  bodyKey?: string;
  audioAsset?: number;
};

export const PREMIUM_CONTENT: PremiumContentItem[] = [
  {
    id: 'three-minute-calm',
    category: 'meditation',
    titleKey:
      'premiumContent.items.threeMinuteCalm.title',
    descriptionKey:
      'premiumContent.items.threeMinuteCalm.description',
    durationMinutes: 3,
    icon: '🌿',
    premium: false,
    bodyKey:
      'premiumContent.items.threeMinuteCalm.body',
  },
  {
    id: 'loving-kindness-15',
    category: 'meditation',
    titleKey:
      'premiumContent.items.lovingKindness.title',
    descriptionKey:
      'premiumContent.items.lovingKindness.description',
    durationMinutes: 15,
    icon: '💗',
    premium: true,
    bodyKey:
      'premiumContent.items.lovingKindness.body',
  },
  {
    id: 'deep-sleep-30',
    category: 'sleep',
    titleKey:
      'premiumContent.items.deepSleep.title',
    descriptionKey:
      'premiumContent.items.deepSleep.description',
    durationMinutes: 30,
    icon: '🌙',
    premium: true,
    bodyKey:
      'premiumContent.items.deepSleep.body',
  },
  {
    id: 'morning-ritual',
    category: 'ritual',
    titleKey:
      'premiumContent.items.morningRitual.title',
    descriptionKey:
      'premiumContent.items.morningRitual.description',
    durationMinutes: 12,
    icon: '🌅',
    premium: true,
    bodyKey:
      'premiumContent.items.morningRitual.body',
  },
  {
    id: 'evening-release',
    category: 'ritual',
    titleKey:
      'premiumContent.items.eveningRelease.title',
    descriptionKey:
      'premiumContent.items.eveningRelease.description',
    durationMinutes: 10,
    icon: '🕯️',
    premium: true,
    bodyKey:
      'premiumContent.items.eveningRelease.body',
  },
  {
    id: 'golden-temple-theme',
    category: 'theme',
    titleKey:
      'premiumContent.items.goldenTemple.title',
    descriptionKey:
      'premiumContent.items.goldenTemple.description',
    icon: '🏯',
    premium: true,
  },
  {
    id: 'rain-retreat',
    category: 'theme',
    titleKey:
      'premiumContent.items.rainRetreat.title',
    descriptionKey:
      'premiumContent.items.rainRetreat.description',
    icon: '🌧️',
    premium: true,
  },
];
