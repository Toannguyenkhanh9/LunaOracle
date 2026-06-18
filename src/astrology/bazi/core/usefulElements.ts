import {
  CONTROLS,
  CONTROLLED_BY,
  ELEMENTS,
  GENERATED_BY,
  GENERATES,
} from '../constants';
import type {
  ClimateProfile,
  DayMasterStrength,
  Element,
  ElementAnalysis,
  Pillar,
  PillarKind,
  UsefulElementAnalysis,
  UsefulElementStrategy,
} from '../types';
import {clamp, round} from '../utils/math';

function unique(values: Element[]): Element[] {
  return Array.from(new Set(values));
}

function climateProfile(monthBranchIndex: number): ClimateProfile {
  if ([11, 0, 1].includes(monthBranchIndex)) {
    return 'cold';
  }

  if ([5, 6, 7].includes(monthBranchIndex)) {
    return 'hot';
  }

  if ([8, 9, 10].includes(monthBranchIndex)) {
    return 'dry';
  }

  if ([2, 3, 4].includes(monthBranchIndex)) {
    return 'damp';
  }

  return 'balanced';
}

function climateElements(profile: ClimateProfile): Element[] {
  switch (profile) {
    case 'cold':
      return ['fire', 'wood'];
    case 'hot':
      return ['water', 'metal'];
    case 'dry':
      return ['water', 'wood'];
    case 'damp':
      return ['fire', 'metal'];
    default:
      return [];
  }
}

function strategyFor(strength: DayMasterStrength): UsefulElementStrategy {
  if (strength.pattern === 'followStrongCandidate') {
    return 'followStrongCandidate';
  }

  if (strength.pattern === 'followWeakCandidate') {
    return 'followWeakCandidate';
  }

  if (strength.level === 'veryWeak' || strength.level === 'weak') {
    return 'supportWeak';
  }

  if (strength.level === 'veryStrong' || strength.level === 'strong') {
    return 'drainStrong';
  }

  return 'balanceDistribution';
}

function addScore(
  scores: Record<Element, number>,
  element: Element,
  value: number,
): void {
  scores[element] += value;
}

export function analyzeUsefulElements(
  pillars: Record<PillarKind, Pillar>,
  elements: ElementAnalysis,
  strength: DayMasterStrength,
): UsefulElementAnalysis {
  const own = pillars.day.stem.element;
  const resource = GENERATED_BY[own];
  const output = GENERATES[own];
  const wealth = CONTROLS[own];
  const officer = CONTROLLED_BY[own];

  const strategy = strategyFor(strength);
  const profile = climateProfile(pillars.month.branch.index);
  const climateBalancing = climateElements(profile);

  const elementScores = Object.fromEntries(
    ELEMENTS.map(element => [element, 0]),
  ) as Record<Element, number>;

  // Structural balance: deficient elements receive a modest positive score,
  // overly dominant elements receive a negative score.
  for (const element of ELEMENTS) {
    const deviation = 20 - elements.percentages[element];
    addScore(elementScores, element, clamp(deviation * 0.72, -14, 14));
  }

  const rationaleCodes: string[] = [];

  switch (strategy) {
    case 'supportWeak':
      addScore(elementScores, resource, 30);
      addScore(elementScores, own, 22);
      addScore(elementScores, output, -15);
      addScore(elementScores, wealth, -20);
      addScore(elementScores, officer, -22);
      rationaleCodes.push('weakDayMasterNeedsResourceAndPeer');
      break;

    case 'drainStrong':
      addScore(elementScores, output, 27);
      addScore(elementScores, wealth, 22);
      addScore(elementScores, officer, 18);
      addScore(elementScores, own, -24);
      addScore(elementScores, resource, -19);
      rationaleCodes.push('strongDayMasterNeedsDrainAndControl');
      break;

    case 'followStrongCandidate':
      addScore(elementScores, own, 30);
      addScore(elementScores, resource, 26);
      addScore(elementScores, output, -22);
      addScore(elementScores, wealth, -26);
      addScore(elementScores, officer, -28);
      rationaleCodes.push('followStrongCandidateNeedsVerification');
      break;

    case 'followWeakCandidate':
      addScore(elementScores, output, 22);
      addScore(elementScores, wealth, 28);
      addScore(elementScores, officer, 25);
      addScore(elementScores, own, -28);
      addScore(elementScores, resource, -26);
      rationaleCodes.push('followWeakCandidateNeedsVerification');
      break;

    default:
      for (const element of elements.deficient.slice(0, 2)) {
        addScore(elementScores, element, 18);
      }

      for (const element of elements.dominant.slice(0, 2)) {
        addScore(elementScores, element, -15);
      }

      addScore(elementScores, output, 5);
      addScore(elementScores, wealth, 4);
      rationaleCodes.push('balancedDayMasterUsesDistributionCorrection');
      break;
  }

  for (const [index, element] of climateBalancing.entries()) {
    addScore(elementScores, element, index === 0 ? 22 : 9);
  }

  if (climateBalancing.length > 0) {
    rationaleCodes.push(`climateProfile:${profile}`);
    rationaleCodes.push('seasonalClimateBalancing');
  }

  // A very dominant element should not automatically become Yong Shen solely
  // because of a climate bonus. This soft cap keeps the ranking structural.
  for (const element of ELEMENTS) {
    if (elements.percentages[element] >= 38) {
      addScore(elementScores, element, -7);
    }

    elementScores[element] = round(clamp(elementScores[element], -60, 60), 2);
  }

  const ranked = [...ELEMENTS].sort(
    (first, second) => elementScores[second] - elementScores[first],
  );

  const yongShen = ranked[0] ?? null;
  const xiShen = ranked
    .slice(1)
    .filter(element => elementScores[element] >= 8)
    .slice(0, 2);

  const jiShen = [...ranked]
    .reverse()
    .filter(element => elementScores[element] <= -8)
    .slice(0, 2);

  const mainJi = jiShen[0];
  const chouCandidate = mainJi ? GENERATED_BY[mainJi] : null;
  const chouShen = chouCandidate && !jiShen.includes(chouCandidate)
    ? [chouCandidate]
    : [];

  const occupied = new Set<Element>([
    ...(yongShen ? [yongShen] : []),
    ...xiShen,
    ...jiShen,
    ...chouShen,
  ]);

  const xianShen = ranked.filter(element => !occupied.has(element));
  const favorable = unique([
    ...(yongShen ? [yongShen] : []),
    ...xiShen,
  ]).slice(0, 3);

  const supportive = xianShen.filter(element => elementScores[element] > -8);
  const unfavorable = unique([...jiShen, ...chouShen]);

  const confidence: UsefulElementAnalysis['confidence'] =
    strength.pattern !== 'ordinary'
      ? 'low'
      : strength.confidence === 'high'
        ? 'medium'
        : strength.confidence === 'medium'
          ? 'medium'
          : 'low';

  return {
    favorable,
    supportive,
    unfavorable,
    climateBalancing,
    rationaleCodes,
    confidence,
    yongShen,
    xiShen,
    xianShen,
    jiShen,
    chouShen,
    elementScores,
    strategy,
    climateProfile: profile,
  };
}
