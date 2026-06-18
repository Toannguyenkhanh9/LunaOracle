import {
  createDefaultBaziStage4Analyzer,
  type BaziChart,
  type CompatibilityPurpose,
  type DateSelectionActivity,
  type DetailedCompatibilityResult,
  type RecommendedDate,
  type Stage4TimelineOptions,
  type TransitTimeline,
} from '../astrology/bazi';

const analyzer = createDefaultBaziStage4Analyzer();

export function calculateBaziTimeline(
  chart: BaziChart,
  options: Stage4TimelineOptions,
): TransitTimeline {
  return analyzer.buildTimeline(chart, options);
}

export function calculateBaziCompatibility(
  first: BaziChart,
  second: BaziChart,
  purpose: CompatibilityPurpose = 'general',
): DetailedCompatibilityResult {
  return analyzer.compare(first, second, purpose);
}

export function calculateBaziRecommendedDates(
  primary: BaziChart,
  activity: DateSelectionActivity,
  startDate: string,
  endDate: string,
  partner?: BaziChart,
  limit = 12,
): RecommendedDate[] {
  return analyzer.selectDates(
    primary,
    {
      activity,
      startDate,
      endDate,
      limit,
    },
    partner,
  );
}
