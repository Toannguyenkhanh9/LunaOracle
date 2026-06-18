import type {
  ChartRelation,
  RelationDomain,
  RelationImpact,
  RelationImpactTone,
  RelationSummary,
} from '../types';
import {clamp, round} from '../utils/math';

const SUPPORTIVE_WEIGHTS: Partial<Record<ChartRelation['type'], number>> = {
  stemCombination: 1.5,
  sixHarmony: 2.5,
  threeHarmony: 4,
  threeMeeting: 3.5,
};

const CHALLENGING_WEIGHTS: Partial<Record<ChartRelation['type'], number>> = {
  stemClash: -1.5,
  sixClash: -4,
  harm: -2.5,
  break: -2,
  punishment: -3,
  selfPunishment: -3.5,
};

function domainsFor(relation: ChartRelation): RelationDomain[] {
  const pillars = relation.participants.map(participant => participant.pillar);
  const domains = new Set<RelationDomain>();

  if (pillars.includes('day')) {
    domains.add('self');
    domains.add('love');
  }

  if (pillars.includes('month')) {
    domains.add('career');
    domains.add('family');
  }

  if (pillars.includes('year')) {
    domains.add('social');
    domains.add('family');
  }

  if (pillars.includes('hour')) {
    domains.add('future');
  }

  if (domains.size === 0) {
    domains.add('self');
  }

  return Array.from(domains);
}

function toneFor(relation: ChartRelation): RelationImpactTone {
  if (SUPPORTIVE_WEIGHTS[relation.type] !== undefined) {
    return 'supportive';
  }

  if (CHALLENGING_WEIGHTS[relation.type] !== undefined) {
    return 'challenging';
  }

  return 'mixed';
}

function weightFor(relation: ChartRelation): number {
  return (
    SUPPORTIVE_WEIGHTS[relation.type] ??
    CHALLENGING_WEIGHTS[relation.type] ??
    0
  );
}

function scoreForDomain(
  impacts: RelationImpact[],
  domain: RelationDomain,
): number {
  const total = impacts
    .filter(impact => impact.domains.includes(domain))
    .reduce((sum, impact) => sum + impact.weight, 0);

  return round(clamp(50 + total * 7, 0, 100), 1);
}

export function summarizeRelations(relations: ChartRelation[]): RelationSummary {
  const impacts: RelationImpact[] = relations.map(relation => {
    const tone = toneFor(relation);
    const weight = weightFor(relation);
    const domains = domainsFor(relation);

    return {
      relation,
      tone,
      weight,
      domains,
      code: `relationImpact.${tone}.${relation.type}`,
    };
  });

  const strongestCodes = [...impacts]
    .sort((first, second) => Math.abs(second.weight) - Math.abs(first.weight))
    .slice(0, 6)
    .map(impact => impact.code);

  return {
    impacts,
    supportiveCount: impacts.filter(impact => impact.tone === 'supportive').length,
    mixedCount: impacts.filter(impact => impact.tone === 'mixed').length,
    challengingCount: impacts.filter(impact => impact.tone === 'challenging').length,
    spousePalaceScore: scoreForDomain(impacts, 'love'),
    careerPalaceScore: scoreForDomain(impacts, 'career'),
    familyScore: scoreForDomain(impacts, 'family'),
    strongestCodes,
  };
}
