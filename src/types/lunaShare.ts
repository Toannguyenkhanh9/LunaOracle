export type LunaShareVariant =
  | 'dailyInsight'
  | 'tarot'
  | 'love'
  | 'forecast'
  | 'moon'
  | 'achievement'
  | 'affirmation';

export type LunaShareImageParams = {
  variant: LunaShareVariant;
  title: string;
  subtitle?: string;
  message: string;
  dateText?: string;
  footer?: string;
  score?: number;
  badge?: string;
  cardName?: string;
  cardId?: string;
  reversed?: boolean;
  tags?: string[];
};
