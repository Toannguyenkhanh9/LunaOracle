import {
  CONTROLS,
  GENERATED_BY,
  GENERATES,
} from '../constants';
import type {
  BaziChart,
  ChartRelation,
  Element,
  Gender,
  Pillar,
  RelationType,
  TenGod,
  TransitDomain,
  TransitDomainScore,
  TransitLevel,
} from '../types';
import {clamp, round} from '../utils/math';

export const RELATION_WEIGHTS: Record<RelationType, number> = {
  stemCombination: 4,
  stemClash: -4,
  sixHarmony: 8,
  sixClash: -10,
  harm: -6,
  break: -4,
  punishment: -7,
  selfPunishment: -6,
  threeHarmony: 10,
  threeMeeting: 8,
};

const DOMAINS: TransitDomain[] = [
  'overall',
  'love',
  'career',
  'wealth',
  'wellbeing',
];

function level(score: number): TransitLevel {
  if (score >= 78) return 'strong';
  if (score >= 64) return 'favorable';
  if (score >= 48) return 'mixed';
  if (score >= 34) return 'cautious';
  return 'challenging';
}

function emptyScores(): Record<TransitDomain, number> {
  return {
    overall: 50,
    love: 50,
    career: 50,
    wealth: 50,
    wellbeing: 50,
  };
}

function emptyFactors(): Record<TransitDomain, string[]> {
  return {
    overall: [],
    love: [],
    career: [],
    wealth: [],
    wellbeing: [],
  };
}

function relationDomains(relation: ChartRelation): TransitDomain[] {
  const natalPillars = relation.participants
    .map(item => item.pillar)
    .filter(item => item === 'year' || item === 'month' || item === 'day' || item === 'hour');

  const result = new Set<TransitDomain>(['overall']);

  for (const pillar of natalPillars) {
    if (pillar === 'day') {
      result.add('love');
      result.add('wellbeing');
    } else if (pillar === 'month') {
      result.add('career');
      result.add('wealth');
    } else if (pillar === 'hour') {
      result.add('wealth');
      result.add('wellbeing');
    } else if (pillar === 'year') {
      result.add('career');
      result.add('wellbeing');
    }
  }

  return Array.from(result);
}

function apply(
  scores: Record<TransitDomain, number>,
  factors: Record<TransitDomain, string[]>,
  domain: TransitDomain,
  delta: number,
  code: string,
): void {
  scores[domain] += delta;
  factors[domain].push(code);
}

function applyToDomains(
  scores: Record<TransitDomain, number>,
  factors: Record<TransitDomain, string[]>,
  domains: TransitDomain[],
  delta: number,
  code: string,
): void {
  for (const domain of domains) {
    apply(scores, factors, domain, delta, code);
  }
}

function transitElements(pillar: Pillar): Element[] {
  return Array.from(
    new Set([
      pillar.stem.element,
      pillar.branch.primaryElement,
      ...pillar.hiddenStemTenGods.map(item => item.stem.element),
    ]),
  );
}

function applyElementEffects(
  chart: BaziChart,
  pillar: Pillar,
  scores: Record<TransitDomain, number>,
  factors: Record<TransitDomain, string[]>,
): void {
  const elements = transitElements(pillar);

  for (const element of elements) {
    if (chart.usefulElements.favorable.includes(element)) {
      applyToDomains(
        scores,
        factors,
        DOMAINS,
        5,
        `stage4.element.favorable.${element}`,
      );
    } else if (chart.usefulElements.supportive.includes(element)) {
      applyToDomains(
        scores,
        factors,
        DOMAINS,
        2,
        `stage4.element.supportive.${element}`,
      );
    }

    if (chart.usefulElements.unfavorable.includes(element)) {
      applyToDomains(
        scores,
        factors,
        DOMAINS,
        -5,
        `stage4.element.unfavorable.${element}`,
      );
    }
  }
}

function isWealthTenGod(tenGod: TenGod | 'dayMaster'): boolean {
  return tenGod === 'directWealth' || tenGod === 'indirectWealth';
}

function isOfficerTenGod(tenGod: TenGod | 'dayMaster'): boolean {
  return tenGod === 'directOfficer' || tenGod === 'sevenKillings';
}

function isOutputTenGod(tenGod: TenGod | 'dayMaster'): boolean {
  return tenGod === 'eatingGod' || tenGod === 'hurtingOfficer';
}

function isResourceTenGod(tenGod: TenGod | 'dayMaster'): boolean {
  return tenGod === 'directResource' || tenGod === 'indirectResource';
}

function applyTenGodEffects(
  gender: Gender,
  pillar: Pillar,
  scores: Record<TransitDomain, number>,
  factors: Record<TransitDomain, string[]>,
): void {
  const tenGods = [
    pillar.stemTenGod,
    ...pillar.hiddenStemTenGods.map(item => item.tenGod),
  ];

  for (const tenGod of tenGods) {
    if (isWealthTenGod(tenGod)) {
      apply(scores, factors, 'wealth', 7, `stage4.tenGod.${tenGod}`);
      apply(scores, factors, 'career', 3, `stage4.tenGod.${tenGod}`);

      if (gender === 'male' || gender === 'unspecified') {
        apply(scores, factors, 'love', 5, `stage4.tenGod.${tenGod}.love`);
      }
    }

    if (isOfficerTenGod(tenGod)) {
      apply(scores, factors, 'career', 7, `stage4.tenGod.${tenGod}`);
      apply(scores, factors, 'overall', 2, `stage4.tenGod.${tenGod}`);

      if (gender === 'female' || gender === 'unspecified') {
        apply(scores, factors, 'love', 5, `stage4.tenGod.${tenGod}.love`);
      }
    }

    if (isOutputTenGod(tenGod)) {
      apply(scores, factors, 'career', 4, `stage4.tenGod.${tenGod}`);
      apply(scores, factors, 'wealth', 3, `stage4.tenGod.${tenGod}`);
      apply(scores, factors, 'wellbeing', 2, `stage4.tenGod.${tenGod}`);
    }

    if (isResourceTenGod(tenGod)) {
      apply(scores, factors, 'career', 3, `stage4.tenGod.${tenGod}`);
      apply(scores, factors, 'wellbeing', 5, `stage4.tenGod.${tenGod}`);
    }

    if (tenGod === 'friend' || tenGod === 'robWealth') {
      apply(scores, factors, 'wellbeing', 2, `stage4.tenGod.${tenGod}`);
      apply(scores, factors, 'wealth', tenGod === 'robWealth' ? -4 : -1, `stage4.tenGod.${tenGod}`);
    }
  }
}

function applyRelationEffects(
  relations: ChartRelation[],
  scores: Record<TransitDomain, number>,
  factors: Record<TransitDomain, string[]>,
): void {
  for (const relation of relations) {
    const base = RELATION_WEIGHTS[relation.type];
    const domains = relationDomains(relation);
    applyToDomains(
      scores,
      factors,
      domains,
      base,
      `stage4.relation.${relation.type}`,
    );

    if (
      relation.type === 'sixClash' ||
      relation.type === 'harm' ||
      relation.type === 'punishment' ||
      relation.type === 'selfPunishment'
    ) {
      const dayTouched = relation.participants.some(item => item.pillar === 'day');
      const monthTouched = relation.participants.some(item => item.pillar === 'month');

      if (dayTouched) {
        apply(scores, factors, 'love', -4, `stage4.relation.${relation.type}.day`);
      }

      if (monthTouched) {
        apply(scores, factors, 'career', -4, `stage4.relation.${relation.type}.month`);
      }
    }
  }
}

function normalizeDomainScores(
  scores: Record<TransitDomain, number>,
  factors: Record<TransitDomain, string[]>,
): Record<TransitDomain, TransitDomainScore> {
  const result = {} as Record<TransitDomain, TransitDomainScore>;

  for (const domain of DOMAINS) {
    const normalized = clamp(scores[domain], 5, 95);
    result[domain] = {
      score: round(normalized, 1),
      level: level(normalized),
      factorCodes: Array.from(new Set(factors[domain])),
    };
  }

  return result;
}

export function scoreTransitPillar(
  chart: BaziChart,
  pillar: Pillar,
  relations: ChartRelation[],
): Record<TransitDomain, TransitDomainScore> {
  const scores = emptyScores();
  const factors = emptyFactors();

  applyElementEffects(chart, pillar, scores, factors);
  applyTenGodEffects(chart.input.gender, pillar, scores, factors);
  applyRelationEffects(relations, scores, factors);

  const overallAverage =
    (scores.love + scores.career + scores.wealth + scores.wellbeing) / 4;

  scores.overall = (scores.overall + overallAverage) / 2;

  return normalizeDomainScores(scores, factors);
}

export function elementRelationshipScore(
  first: Element,
  second: Element,
): number {
  if (first === second) return 4;
  if (GENERATES[first] === second || GENERATED_BY[first] === second) return 7;
  if (CONTROLS[first] === second || CONTROLS[second] === first) return -6;
  return 0;
}
