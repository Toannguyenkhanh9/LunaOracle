import {EMPTY_TEN_GOD_DISTRIBUTION} from '../constants';
import type {
  Pillar,
  PillarKind,
  TenGod,
  TenGodDistribution,
} from '../types';

export function analyzeTenGodDistribution(
  pillars: Record<PillarKind, Pillar>,
): TenGodDistribution {
  const visible = EMPTY_TEN_GOD_DISTRIBUTION();
  const hidden = EMPTY_TEN_GOD_DISTRIBUTION();
  const combined = EMPTY_TEN_GOD_DISTRIBUTION();

  for (const kind of ['year', 'month', 'day', 'hour'] as PillarKind[]) {
    const pillar = pillars[kind];

    if (pillar.stemTenGod !== 'dayMaster') {
      visible[pillar.stemTenGod] += 1;
      combined[pillar.stemTenGod] += 1;
    }

    const branchFactor = kind === 'month' ? 1.5 : kind === 'day' ? 1.2 : 1;

    for (const hiddenItem of pillar.hiddenStemTenGods) {
      if (hiddenItem.tenGod === 'dayMaster') {
        continue;
      }

      const weight = hiddenItem.weight * branchFactor;
      hidden[hiddenItem.tenGod] += weight;
      combined[hiddenItem.tenGod] += weight;
    }
  }

  const dominant = (Object.keys(combined) as TenGod[])
    .sort((first, second) => combined[second] - combined[first])
    .filter(item => combined[item] > 0)
    .slice(0, 4);

  return {
    visible,
    hidden,
    combined,
    dominant,
  };
}
