import type {
  LunaShareImageParams,
} from '../types/lunaShare';

export type SocialTemplateId =
  | 'storyDaily'
  | 'squareTarot'
  | 'minimalQuote'
  | 'loveScore'
  | 'weeklyPoster'
  | 'moonMessage';

export type SocialShareTemplate = {
  id: SocialTemplateId;
  titleKey: string;
  titleFallback: string;
  descriptionKey: string;
  descriptionFallback: string;
  variant: LunaShareImageParams['variant'];
  badge: string;
  tags: string[];
};

export const SOCIAL_SHARE_TEMPLATES:
SocialShareTemplate[] = [
  {
    id: 'storyDaily',
    titleKey:
      'shareTemplates.items.storyDaily.title',
    titleFallback:
      'Daily Story',
    descriptionKey:
      'shareTemplates.items.storyDaily.description',
    descriptionFallback:
      'A vertical story-style daily insight image.',
    variant:
      'dailyInsight',
    badge:
      'TODAY',
    tags: [
      'daily',
      'story',
      'luna',
    ],
  },
  {
    id: 'squareTarot',
    titleKey:
      'shareTemplates.items.squareTarot.title',
    titleFallback:
      'Tarot Square',
    descriptionKey:
      'shareTemplates.items.squareTarot.description',
    descriptionFallback:
      'A square tarot card poster for social feeds.',
    variant:
      'tarot',
    badge:
      'TAROT',
    tags: [
      'tarot',
      'card',
      'luna',
    ],
  },
  {
    id: 'minimalQuote',
    titleKey:
      'shareTemplates.items.minimalQuote.title',
    titleFallback:
      'Minimal Quote',
    descriptionKey:
      'shareTemplates.items.minimalQuote.description',
    descriptionFallback:
      'A calm quote image with soft moon styling.',
    variant:
      'affirmation',
    badge:
      'QUOTE',
    tags: [
      'quote',
      'oracle',
      'luna',
    ],
  },
  {
    id: 'loveScore',
    titleKey:
      'shareTemplates.items.loveScore.title',
    titleFallback:
      'Love Score',
    descriptionKey:
      'shareTemplates.items.loveScore.description',
    descriptionFallback:
      'A romantic share card for Love Mode.',
    variant:
      'love',
    badge:
      'LOVE',
    tags: [
      'love',
      'venus',
      'luna',
    ],
  },
  {
    id: 'weeklyPoster',
    titleKey:
      'shareTemplates.items.weeklyPoster.title',
    titleFallback:
      'Weekly Poster',
    descriptionKey:
      'shareTemplates.items.weeklyPoster.description',
    descriptionFallback:
      'A weekly energy report poster.',
    variant:
      'forecast',
    badge:
      'WEEKLY',
    tags: [
      'weekly',
      'report',
      'luna',
    ],
  },
  {
    id: 'moonMessage',
    titleKey:
      'shareTemplates.items.moonMessage.title',
    titleFallback:
      'Moon Message',
    descriptionKey:
      'shareTemplates.items.moonMessage.description',
    descriptionFallback:
      'A moon-focused reflection card.',
    variant:
      'moon',
    badge:
      'MOON',
    tags: [
      'moon',
      'ritual',
      'luna',
    ],
  },
];

export function buildTemplateShareParams(
  template: SocialShareTemplate,
): Partial<LunaShareImageParams> {
  const defaultTitle =
    template.titleFallback;

  return {
    variant:
      template.variant,
    title:
      defaultTitle,
    subtitle:
      template.descriptionFallback,
    message:
      'Move with clarity, not pressure. One aligned step is enough.',
    score:
      template.variant === 'affirmation'
        ? undefined
        : 82,
    badge:
      template.badge,
    tags:
      template.tags,
  };
}
