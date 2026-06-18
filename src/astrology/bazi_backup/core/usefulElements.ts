import {
  CONTROLS,
  CONTROLLED_BY,
  GENERATED_BY,
  GENERATES,
} from '../constants';
import type {
  DayMasterStrength,
  Element,
  ElementAnalysis,
  Pillar,
  PillarKind,
  UsefulElementAnalysis,
} from '../types';

function unique(values: Element[]): Element[] {
  return Array.from(new Set(values));
}

function climateElements(monthBranchIndex: number): Element[] {
  if ([11, 0, 1].includes(monthBranchIndex)) {
    return ['fire'];
  }

  if ([5, 6, 7].includes(monthBranchIndex)) {
    return ['water'];
  }

  if ([8, 9, 10].includes(monthBranchIndex)) {
    return ['wood', 'fire'];
  }

  if ([2, 3, 4].includes(monthBranchIndex)) {
    return ['metal', 'earth'];
  }

  return [];
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

  let favorable: Element[] = [];
  let supportive: Element[] = [];
  let unfavorable: Element[] = [];
  const rationaleCodes: string[] = [];

  if (strength.level === 'veryWeak' || strength.level === 'weak') {
    favorable = [resource, own];
    supportive = [elements.deficient[0]].filter(Boolean);
    unfavorable = [output, wealth, officer];
    rationaleCodes.push('weakDayMasterNeedsResourceAndPeer');
  } else if (strength.level === 'veryStrong' || strength.level === 'strong') {
    favorable = [output, wealth, officer];
    supportive = [elements.deficient[0]].filter(Boolean);
    unfavorable = [own, resource];
    rationaleCodes.push('strongDayMasterNeedsDrainAndControl');
  } else {
    favorable = elements.deficient.slice(0, 2);
    supportive = [output, wealth, officer].filter(
      element => !favorable.includes(element),
    );
    unfavorable = elements.dominant.slice(0, 2);
    rationaleCodes.push('balancedDayMasterUsesDistributionCorrection');
  }

  const climateBalancing = climateElements(pillars.month.branch.index);

  if (climateBalancing.length > 0) {
    rationaleCodes.push('seasonalClimateBalancing');
  }

  return {
    favorable: unique([...favorable, ...climateBalancing]).slice(0, 3),
    supportive: unique(supportive).filter(
      element => !favorable.includes(element),
    ),
    unfavorable: unique(unfavorable).filter(
      element => !climateBalancing.includes(element),
    ),
    climateBalancing,
    rationaleCodes,
    confidence:
      strength.confidence === 'high'
        ? 'medium'
        : strength.confidence === 'medium'
          ? 'medium'
          : 'low',
  };
}
