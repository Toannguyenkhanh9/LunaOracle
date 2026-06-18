import {
  GENERATED_BY,
  GENERATES,
  CONTROLS,
  CONTROLLED_BY,
  MONTH_ELEMENT_MULTIPLIERS,
} from '../constants';
import type {
  DayMasterStrength,
  ElementAnalysis,
  Pillar,
  PillarKind,
} from '../types';
import {clamp, round} from '../utils/math';

export function analyzeDayMasterStrength(
  pillars: Record<PillarKind, Pillar>,
  elements: ElementAnalysis,
): DayMasterStrength {
  const dayMaster = pillars.day.stem;
  const own = dayMaster.element;
  const resource = GENERATED_BY[own];
  const output = GENERATES[own];
  const wealth = CONTROLS[own];
  const officer = CONTROLLED_BY[own];

  const supportRaw =
    elements.seasonAdjusted[own] + elements.seasonAdjusted[resource];

  const drainRaw =
    elements.seasonAdjusted[output] +
    elements.seasonAdjusted[wealth] +
    elements.seasonAdjusted[officer];

  const total = supportRaw + drainRaw;
  const supportPercent = total > 0 ? (supportRaw / total) * 100 : 50;

  let rootScore = 0;
  let rootCount = 0;

  for (const kind of ['year', 'month', 'day', 'hour'] as PillarKind[]) {
    const pillar = pillars[kind];

    for (const hidden of pillar.hiddenStemTenGods) {
      if (hidden.stem.element !== own) {
        continue;
      }

      const factor = kind === 'month' ? 1.4 : kind === 'day' ? 1.2 : 1;
      rootScore += hidden.weight * 12 * factor;
      rootCount += 1;
    }
  }

  const season = MONTH_ELEMENT_MULTIPLIERS[pillars.month.branch.index];
  const seasonSupportValue = season[own] + season[resource];
  const seasonDrainValue = season[output] + season[wealth] + season[officer];

  const seasonSupport: DayMasterStrength['seasonSupport'] =
    seasonSupportValue >= seasonDrainValue * 0.85
      ? 'supportive'
      : seasonSupportValue <= seasonDrainValue * 0.55
        ? 'draining'
        : 'neutral';

  const seasonalAdjustment =
    seasonSupport === 'supportive' ? 8 : seasonSupport === 'draining' ? -8 : 0;

  const score = clamp(
    supportPercent * 0.78 + Math.min(rootScore, 18) + seasonalAdjustment,
    0,
    100,
  );

  const level: DayMasterStrength['level'] =
    score < 28
      ? 'veryWeak'
      : score < 42
        ? 'weak'
        : score <= 58
          ? 'balanced'
          : score <= 72
            ? 'strong'
            : 'veryStrong';

  const reasons = [
    `supportPercent:${round(supportPercent, 1)}`,
    `rootCount:${rootCount}`,
    `season:${seasonSupport}`,
  ];

  const confidence: DayMasterStrength['confidence'] =
    Math.abs(score - 50) >= 22
      ? 'high'
      : Math.abs(score - 50) >= 10
        ? 'medium'
        : 'low';

  return {
    level,
    score: round(score, 1),
    supportScore: round(supportRaw, 2),
    drainScore: round(drainRaw, 2),
    rootScore: round(rootScore, 2),
    seasonSupport,
    reasons,
    confidence,
  };
}
