import {
  CONTROLS,
  GENERATED_BY,
  GENERATES,
  SIX_CLASH_PAIRS,
  SIX_HARMONY_PAIRS,
  THREE_HARMONY_GROUPS,
} from '../constants';
import type {
  BaziChart,
  BranchId,
  CompatibilityDomainScore,
  CompatibilityPurpose,
  DetailedCompatibilityResult,
  Element,
  PillarKind,
} from '../types';
import {clamp, round} from '../utils/math';
import {elementRelationshipScore} from './scoring';

const PILLAR_KINDS: PillarKind[] = ['year', 'month', 'day', 'hour'];

function pairMatches(
  first: BranchId,
  second: BranchId,
  pair: [BranchId, BranchId],
): boolean {
  return (
    (pair[0] === first && pair[1] === second) ||
    (pair[0] === second && pair[1] === first)
  );
}

function domainLevel(score: number): CompatibilityDomainScore['level'] {
  if (score >= 78) return 'strong';
  if (score >= 64) return 'favorable';
  if (score >= 48) return 'balanced';
  if (score >= 32) return 'developing';
  return 'low';
}

function scoreDomain(
  score: number,
  factorCodes: string[],
): CompatibilityDomainScore {
  const normalized = clamp(score, 5, 95);

  return {
    score: round(normalized, 1),
    level: domainLevel(normalized),
    factorCodes: Array.from(new Set(factorCodes)),
  };
}

function dominantAndFavorableComplements(
  first: BaziChart,
  second: BaziChart,
): Element[] {
  return Array.from(
    new Set([
      ...first.usefulElements.favorable.filter(element =>
        second.elements.dominant.includes(element),
      ),
      ...second.usefulElements.favorable.filter(element =>
        first.elements.dominant.includes(element),
      ),
    ]),
  );
}

function usefulElementConflicts(
  first: BaziChart,
  second: BaziChart,
): Element[] {
  return Array.from(
    new Set([
      ...first.usefulElements.unfavorable.filter(element =>
        second.elements.dominant.includes(element),
      ),
      ...second.usefulElements.unfavorable.filter(element =>
        first.elements.dominant.includes(element),
      ),
    ]),
  );
}

export function compareBaziChartsDetailed(
  first: BaziChart,
  second: BaziChart,
  purpose: CompatibilityPurpose = 'general',
): DetailedCompatibilityResult {
  let emotional = 50;
  let communication = 50;
  let stability = 50;
  let cooperation = 50;
  let finance = 50;

  const emotionalCodes: string[] = [];
  const communicationCodes: string[] = [];
  const stabilityCodes: string[] = [];
  const cooperationCodes: string[] = [];
  const financeCodes: string[] = [];
  const harmonyCodes: string[] = [];
  const challengeCodes: string[] = [];

  for (const kind of PILLAR_KINDS) {
    const firstBranch = first.pillars[kind].branch.id;
    const secondBranch = second.pillars[kind].branch.id;

    if (
      SIX_HARMONY_PAIRS.some(pair =>
        pairMatches(firstBranch, secondBranch, [pair[0], pair[1]]),
      )
    ) {
      harmonyCodes.push(`stage4.compatibility.${kind}.sixHarmony`);
      stability += kind === 'day' ? 12 : 7;
      emotional += kind === 'day' ? 12 : 4;
      cooperation += kind === 'month' ? 9 : 4;
    }

    if (
      THREE_HARMONY_GROUPS.some(group =>
        group.branches.includes(firstBranch) &&
        group.branches.includes(secondBranch),
      )
    ) {
      harmonyCodes.push(`stage4.compatibility.${kind}.threeHarmony`);
      communication += 6;
      cooperation += 6;
      emotional += kind === 'day' ? 8 : 3;
    }

    if (
      SIX_CLASH_PAIRS.some(pair =>
        pairMatches(firstBranch, secondBranch, pair),
      )
    ) {
      challengeCodes.push(`stage4.compatibility.${kind}.clash`);
      stability -= kind === 'day' ? 15 : 8;
      emotional -= kind === 'day' ? 13 : 5;
      cooperation -= kind === 'month' ? 11 : 5;
    }
  }

  const dmElementScore = elementRelationshipScore(
    first.dayMaster.element,
    second.dayMaster.element,
  );

  emotional += dmElementScore;
  communication += dmElementScore;
  emotionalCodes.push('stage4.compatibility.dayMasterElementRelation');
  communicationCodes.push('stage4.compatibility.dayMasterElementRelation');

  if (first.dayMaster.polarity !== second.dayMaster.polarity) {
    emotional += 5;
    stability += 3;
    harmonyCodes.push('stage4.compatibility.polarityComplement');
  } else {
    communication += 2;
    harmonyCodes.push('stage4.compatibility.polaritySimilarity');
  }

  const complements = dominantAndFavorableComplements(first, second);
  const conflicts = usefulElementConflicts(first, second);

  cooperation += complements.length * 7;
  finance += complements.length * 5;
  stability += complements.length * 3;

  if (complements.length > 0) {
    cooperationCodes.push('stage4.compatibility.elementComplement');
    financeCodes.push('stage4.compatibility.elementComplement');
  }

  finance -= conflicts.length * 6;
  stability -= conflicts.length * 4;

  if (conflicts.length > 0) {
    financeCodes.push('stage4.compatibility.elementConflict');
    stabilityCodes.push('stage4.compatibility.elementConflict');
  }

  const careerAlignment =
    100 -
    Math.abs(
      first.lifeDomains.career.score -
        second.lifeDomains.career.score,
    );

  const wealthAlignment =
    100 -
    Math.abs(
      first.lifeDomains.wealth.score -
        second.lifeDomains.wealth.score,
    );

  cooperation += (careerAlignment - 50) * 0.12;
  finance += (wealthAlignment - 50) * 0.12;

  cooperationCodes.push('stage4.compatibility.careerRhythm');
  financeCodes.push('stage4.compatibility.wealthRhythm');

  if (purpose === 'love') {
    emotional += 7;
    stability += 5;
  } else if (purpose === 'business') {
    cooperation += 7;
    finance += 7;
  }

  const domains = {
    emotional: scoreDomain(emotional, emotionalCodes),
    communication: scoreDomain(communication, communicationCodes),
    stability: scoreDomain(stability, stabilityCodes),
    cooperation: scoreDomain(cooperation, cooperationCodes),
    finance: scoreDomain(finance, financeCodes),
  };

  const weights =
    purpose === 'love'
      ? {
          emotional: 0.34,
          communication: 0.22,
          stability: 0.24,
          cooperation: 0.12,
          finance: 0.08,
        }
      : purpose === 'business'
        ? {
            emotional: 0.08,
            communication: 0.2,
            stability: 0.16,
            cooperation: 0.32,
            finance: 0.24,
          }
        : {
            emotional: 0.2,
            communication: 0.2,
            stability: 0.2,
            cooperation: 0.2,
            finance: 0.2,
          };

  const overall =
    domains.emotional.score * weights.emotional +
    domains.communication.score * weights.communication +
    domains.stability.score * weights.stability +
    domains.cooperation.score * weights.cooperation +
    domains.finance.score * weights.finance;

  return {
    purpose,
    score: round(clamp(overall, 5, 95), 1),
    level: domainLevel(overall),
    domains,
    harmonyCodes: Array.from(new Set(harmonyCodes)),
    challengeCodes: Array.from(new Set(challengeCodes)),
    complementingElements: complements,
    conflictingElements: conflicts,
    disclaimerCodes: [
      'stage4.compatibility.notDeterministic',
      'stage4.compatibility.relationshipNeedsRealCommunication',
    ],
  };
}
