import {
  BRANCHES,
  ELEMENTS,
  MONTH_ELEMENT_MULTIPLIERS,
} from '../constants';
import type {
  Element,
  ElementAnalysis,
  ElementContribution,
  Pillar,
  PillarKind,
} from '../types';
import {
  emptyElementRecord,
  normalizeRecord,
} from '../utils/math';

const VISIBLE_STEM_WEIGHT = 1;
const BRANCH_WEIGHT: Record<PillarKind, number> = {
  year: 1.15,
  month: 1.75,
  day: 1.25,
  hour: 1.15,
};

export function analyzeElements(
  pillars: Record<PillarKind, Pillar>,
): ElementAnalysis {
  const raw = emptyElementRecord();
  const adjusted = emptyElementRecord();
  const contributions: ElementContribution[] = [];
  const monthBranchIndex = pillars.month.branch.index;
  const seasonal = MONTH_ELEMENT_MULTIPLIERS[monthBranchIndex];

  for (const kind of ['year', 'month', 'day', 'hour'] as PillarKind[]) {
    const pillar = pillars[kind];

    raw[pillar.stem.element] += VISIBLE_STEM_WEIGHT;
    adjusted[pillar.stem.element] +=
      VISIBLE_STEM_WEIGHT * seasonal[pillar.stem.element];

    contributions.push({
      source: `${kind}.stem.${pillar.stem.id}`,
      element: pillar.stem.element,
      rawWeight: VISIBLE_STEM_WEIGHT,
      seasonalWeight:
        VISIBLE_STEM_WEIGHT * seasonal[pillar.stem.element],
    });

    const branchWeight = BRANCH_WEIGHT[kind];

    for (const hidden of pillar.branch.hiddenStems) {
      const hiddenStem = BRANCHES[pillar.branch.index].hiddenStems.find(
        item => item.stemId === hidden.stemId,
      );

      if (!hiddenStem) {
        continue;
      }

      const stem = pillar.hiddenStemTenGods.find(
        item => item.stem.id === hidden.stemId,
      )?.stem;

      if (!stem) {
        continue;
      }

      const weight = branchWeight * hidden.weight;
      raw[stem.element] += weight;
      adjusted[stem.element] += weight * seasonal[stem.element];

      contributions.push({
        source: `${kind}.branch.${pillar.branch.id}.${stem.id}`,
        element: stem.element,
        rawWeight: weight,
        seasonalWeight: weight * seasonal[stem.element],
      });
    }
  }

  const percentages = normalizeRecord(adjusted);
  const sorted = [...ELEMENTS].sort(
    (first, second) => percentages[second] - percentages[first],
  );

  const dominant = sorted.filter(
    element => percentages[element] >= 24,
  );

  const deficient = sorted
    .slice()
    .reverse()
    .filter(element => percentages[element] <= 12);

  return {
    raw,
    seasonAdjusted: adjusted,
    percentages,
    dominant: dominant.length > 0 ? dominant : [sorted[0]],
    deficient: deficient.length > 0 ? deficient : [sorted[sorted.length - 1]],
    contributions,
  };
}
