import {
  CONTROLLED_BY,
  CONTROLS,
  GENERATED_BY,
  GENERATES,
  MONTH_ELEMENT_MULTIPLIERS,
} from '../constants';
import type {
  ChartRelation,
  DayMasterStrength,
  ElementAnalysis,
  Pillar,
  PillarKind,
  StrengthPattern,
} from '../types';
import {clamp, round} from '../utils/math';

const SUPPORTIVE_RELATIONS: ChartRelation['type'][] = [
  'stemCombination',
  'sixHarmony',
  'threeHarmony',
  'threeMeeting',
];

const CHALLENGING_RELATIONS: ChartRelation['type'][] = [
  'stemClash',
  'sixClash',
  'harm',
  'break',
  'punishment',
  'selfPunishment',
];

function relationAdjustment(relations: ChartRelation[]): number {
  let value = 0;

  for (const relation of relations) {
    const touchesDayOrMonth = relation.participants.some(
      participant => participant.pillar === 'day' || participant.pillar === 'month',
    );

    if (!touchesDayOrMonth) {
      continue;
    }

    if (SUPPORTIVE_RELATIONS.includes(relation.type)) {
      value += relation.type === 'threeHarmony' || relation.type === 'threeMeeting' ? 2 : 1;
    }

    if (CHALLENGING_RELATIONS.includes(relation.type)) {
      value -= relation.type === 'sixClash' || relation.type === 'punishment' ? 2 : 1;
    }
  }

  return clamp(value, -6, 6);
}

function detectPattern(
  score: number,
  rootScore: number,
  visibleSupport: number,
  supportRaw: number,
  drainRaw: number,
): StrengthPattern {
  if (
    score <= 22 &&
    rootScore < 2.5 &&
    visibleSupport <= 2.5 &&
    drainRaw > supportRaw * 2.2
  ) {
    return 'followWeakCandidate';
  }

  if (
    score >= 80 &&
    rootScore >= 10 &&
    visibleSupport >= 5 &&
    supportRaw > drainRaw * 2.2
  ) {
    return 'followStrongCandidate';
  }

  return 'ordinary';
}

export function analyzeDayMasterStrength(
  pillars: Record<PillarKind, Pillar>,
  elements: ElementAnalysis,
  relations: ChartRelation[] = [],
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
  let ownRootCount = 0;
  let resourceRootCount = 0;
  let hiddenSupportValue = 0;

  for (const kind of ['year', 'month', 'day', 'hour'] as PillarKind[]) {
    const pillar = pillars[kind];
    const pillarFactor = kind === 'month' ? 1.4 : kind === 'day' ? 1.2 : 1;

    for (const hidden of pillar.hiddenStemTenGods) {
      if (hidden.stem.element === own) {
        const value = hidden.weight * 12 * pillarFactor;
        rootScore += value;
        hiddenSupportValue += value * 0.42;
        ownRootCount += 1;
      } else if (hidden.stem.element === resource) {
        const value = hidden.weight * 8 * pillarFactor;
        rootScore += value * 0.45;
        hiddenSupportValue += value * 0.34;
        resourceRootCount += 1;
      }
    }
  }

  let visibleSupportValue = 0;
  let visibleSupportCount = 0;

  for (const kind of ['year', 'month', 'hour'] as PillarKind[]) {
    const stemElement = pillars[kind].stem.element;

    if (stemElement === own) {
      visibleSupportValue += 4;
      visibleSupportCount += 1;
    } else if (stemElement === resource) {
      visibleSupportValue += 3;
      visibleSupportCount += 1;
    }
  }

  const monthMain =
    pillars.month.hiddenStemTenGods.find(item => item.role === 'main') ??
    pillars.month.hiddenStemTenGods[0];

  let monthCommand = 0;

  if (monthMain) {
    const monthElement = monthMain.stem.element;

    if (monthElement === own) {
      monthCommand = 12;
    } else if (monthElement === resource) {
      monthCommand = 9;
    } else if (monthElement === output) {
      monthCommand = -6;
    } else if (monthElement === wealth) {
      monthCommand = -7;
    } else if (monthElement === officer) {
      monthCommand = -9;
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

  const supportBalance = clamp((supportPercent - 50) * 0.62, -31, 31);
  const rootsComponent = clamp(rootScore * 0.52, 0, 16);
  const visibleSupportComponent = clamp(visibleSupportValue, 0, 10);
  const hiddenSupportComponent = clamp(hiddenSupportValue, 0, 9);
  const relationComponent = relationAdjustment(relations);

  const score = clamp(
    50 +
      supportBalance +
      monthCommand +
      rootsComponent +
      visibleSupportComponent +
      hiddenSupportComponent +
      relationComponent,
    0,
    100,
  );

  const level: DayMasterStrength['level'] =
    score < 25
      ? 'veryWeak'
      : score < 42
        ? 'weak'
        : score <= 58
          ? 'balanced'
          : score <= 76
            ? 'strong'
            : 'veryStrong';

  const pattern = detectPattern(
    score,
    rootScore,
    visibleSupportValue,
    supportRaw,
    drainRaw,
  );

  const reasons = [
    `supportPercent:${round(supportPercent, 1)}`,
    `ownRoots:${ownRootCount}`,
    `resourceRoots:${resourceRootCount}`,
    `visibleSupportCount:${visibleSupportCount}`,
    `monthCommand:${round(monthCommand, 1)}`,
    `season:${seasonSupport}`,
    `pattern:${pattern}`,
  ];

  const signals = [
    Math.sign(supportBalance),
    Math.sign(monthCommand),
    Math.sign(rootsComponent + visibleSupportComponent - 4),
  ].filter(value => value !== 0);

  const sameDirection =
    signals.length >= 2 && signals.every(value => value === signals[0]);

  const confidence: DayMasterStrength['confidence'] =
    pattern !== 'ordinary'
      ? 'low'
      : Math.abs(score - 50) >= 23 && sameDirection
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
    components: {
      supportBalance: round(supportBalance, 2),
      monthCommand: round(monthCommand, 2),
      roots: round(rootsComponent, 2),
      visibleSupport: round(visibleSupportComponent, 2),
      hiddenSupport: round(hiddenSupportComponent, 2),
      relationAdjustment: round(relationComponent, 2),
    },
    pattern,
    balanceDistance: round(Math.abs(score - 50), 1),
  };
}
