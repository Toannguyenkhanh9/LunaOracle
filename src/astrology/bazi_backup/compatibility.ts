import type {
  BaziChart,
  BranchId,
  Element,
} from './types';
import {
  SIX_CLASH_PAIRS,
  SIX_HARMONY_PAIRS,
  THREE_HARMONY_GROUPS,
} from './constants';
import {clamp, round} from './utils/math';

export interface CompatibilityResult {
  score: number;
  level: 'low' | 'developing' | 'balanced' | 'favorable' | 'strong';
  harmonyCodes: string[];
  challengeCodes: string[];
  complementingElements: Element[];
  disclaimerCode: 'compatibility.notDeterministic';
}

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

function level(score: number): CompatibilityResult['level'] {
  if (score >= 78) return 'strong';
  if (score >= 64) return 'favorable';
  if (score >= 48) return 'balanced';
  if (score >= 32) return 'developing';
  return 'low';
}

export function compareBaziCharts(
  first: BaziChart,
  second: BaziChart,
): CompatibilityResult {
  let score = 50;
  const harmonyCodes: string[] = [];
  const challengeCodes: string[] = [];

  const branchPairs: Array<[BranchId, BranchId, string]> = [
    [first.pillars.day.branch.id, second.pillars.day.branch.id, 'dayBranch'],
    [first.pillars.year.branch.id, second.pillars.year.branch.id, 'yearBranch'],
    [first.pillars.hour.branch.id, second.pillars.hour.branch.id, 'hourBranch'],
  ];

  for (const [firstBranch, secondBranch, label] of branchPairs) {
    const harmony = SIX_HARMONY_PAIRS.find(pair =>
      pairMatches(firstBranch, secondBranch, [pair[0], pair[1]]),
    );

    if (harmony) {
      score += 10;
      harmonyCodes.push(`compatibility.harmony.${label}.sixHarmony`);
    }

    if (
      THREE_HARMONY_GROUPS.some(group =>
        group.branches.includes(firstBranch) && group.branches.includes(secondBranch),
      )
    ) {
      score += 6;
      harmonyCodes.push(`compatibility.harmony.${label}.threeHarmony`);
    }

    if (
      SIX_CLASH_PAIRS.some(pair => pairMatches(firstBranch, secondBranch, pair))
    ) {
      score -= 12;
      challengeCodes.push(`compatibility.challenge.${label}.clash`);
    }
  }

  const complementingElements = first.usefulElements.favorable.filter(element =>
    second.elements.dominant.includes(element),
  );

  const reverseComplement = second.usefulElements.favorable.filter(element =>
    first.elements.dominant.includes(element),
  );

  const allComplements = Array.from(
    new Set([...complementingElements, ...reverseComplement]),
  );

  score += allComplements.length * 5;

  if (allComplements.length > 0) {
    harmonyCodes.push('compatibility.harmony.elementComplement');
  }

  const normalized = clamp(score, 10, 92);

  return {
    score: round(normalized, 1),
    level: level(normalized),
    harmonyCodes,
    challengeCodes,
    complementingElements: allComplements,
    disclaimerCode: 'compatibility.notDeterministic',
  };
}
