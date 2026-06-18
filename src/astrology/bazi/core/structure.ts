import type {
  ChartRelation,
  ChartStructure,
  DayMasterStrength,
  Pillar,
  PillarKind,
  SpecialPatternCandidate,
  TenGod,
  TenGodDistribution,
} from '../types';
import {clamp, round} from '../utils/math';

const OUTPUT_GODS: TenGod[] = ['eatingGod', 'hurtingOfficer'];
const WEALTH_GODS: TenGod[] = ['directWealth', 'indirectWealth'];
const OFFICER_GODS: TenGod[] = ['directOfficer', 'sevenKillings'];
const RESOURCE_GODS: TenGod[] = ['directResource', 'indirectResource'];

function sumGods(distribution: TenGodDistribution, gods: TenGod[]): number {
  return gods.reduce((sum, god) => sum + distribution.combined[god], 0);
}

function detectDominantSpecial(
  distribution: TenGodDistribution,
  strength: DayMasterStrength,
): SpecialPatternCandidate {
  if (strength.pattern === 'followStrongCandidate') {
    return 'followStrong';
  }

  if (strength.pattern === 'followWeakCandidate') {
    return 'followWeak';
  }

  const groups: Array<{
    value: number;
    candidate: SpecialPatternCandidate;
  }> = [
    {value: sumGods(distribution, OUTPUT_GODS), candidate: 'dominantOutput'},
    {value: sumGods(distribution, WEALTH_GODS), candidate: 'dominantWealth'},
    {value: sumGods(distribution, OFFICER_GODS), candidate: 'dominantOfficer'},
    {value: sumGods(distribution, RESOURCE_GODS), candidate: 'dominantResource'},
  ];

  groups.sort((first, second) => second.value - first.value);
  const total = Object.values(distribution.combined).reduce((sum, value) => sum + value, 0);

  if (total > 0 && groups[0].value / total >= 0.42) {
    return groups[0].candidate;
  }

  return 'none';
}

export function analyzeChartStructure(
  pillars: Record<PillarKind, Pillar>,
  distribution: TenGodDistribution,
  strength: DayMasterStrength,
  relations: ChartRelation[],
): ChartStructure {
  const monthHidden = pillars.month.hiddenStemTenGods;
  const monthCommand =
    monthHidden.find(item => item.role === 'main') ?? monthHidden[0];

  if (!monthCommand) {
    throw new Error('MONTH_COMMAND_HIDDEN_STEM_NOT_FOUND');
  }

  let primaryTenGod = monthCommand.tenGod;
  const evidenceCodes: string[] = [
    `structure.monthCommand.${monthCommand.tenGod}`,
  ];

  if (primaryTenGod === 'dayMaster') {
    const nonDayMasterMonth = monthHidden.find(item => item.tenGod !== 'dayMaster');

    if (nonDayMasterMonth) {
      primaryTenGod = nonDayMasterMonth.tenGod;
      evidenceCodes.push('structure.monthCommandFallbackToSecondaryQi');
    } else {
      primaryTenGod = distribution.dominant[0] ?? 'dayMaster';
      evidenceCodes.push('structure.monthCommandFallbackToDominantTenGod');
    }
  }

  const visibleValue =
    primaryTenGod === 'dayMaster'
      ? 0
      : distribution.visible[primaryTenGod];

  const isExposed = visibleValue > 0;

  if (isExposed) {
    evidenceCodes.push('structure.primaryQiExposed');
  } else {
    evidenceCodes.push('structure.primaryQiHidden');
  }

  const totalGods = Object.values(distribution.combined).reduce(
    (sum, value) => sum + value,
    0,
  );

  const primaryValue =
    primaryTenGod === 'dayMaster'
      ? monthCommand.weight
      : distribution.combined[primaryTenGod];

  const purityScore = totalGods > 0
    ? clamp((primaryValue / totalGods) * 100 + (isExposed ? 10 : 0), 0, 100)
    : 0;

  const monthRelations = relations.filter(relation =>
    relation.participants.some(participant => participant.pillar === 'month'),
  );

  const supportiveRelations = monthRelations.filter(relation =>
    ['stemCombination', 'sixHarmony', 'threeHarmony', 'threeMeeting'].includes(
      relation.type,
    ),
  ).length;

  const challengingRelations = monthRelations.filter(relation =>
    ['stemClash', 'sixClash', 'harm', 'break', 'punishment', 'selfPunishment'].includes(
      relation.type,
    ),
  ).length;

  const stabilityScore = clamp(
    55 +
      (isExposed ? 12 : 0) +
      purityScore * 0.18 +
      supportiveRelations * 6 -
      challengingRelations * 9,
    0,
    100,
  );

  if (supportiveRelations > 0) {
    evidenceCodes.push('structure.monthPillarSupported');
  }

  if (challengingRelations > 0) {
    evidenceCodes.push('structure.monthPillarChallenged');
  }

  const supportingTenGods = distribution.dominant
    .filter(god => god !== primaryTenGod)
    .slice(0, 3);

  const specialPatternCandidate = detectDominantSpecial(distribution, strength);

  if (specialPatternCandidate !== 'none') {
    evidenceCodes.push(`structure.specialCandidate.${specialPatternCandidate}`);
  }

  const confidence: ChartStructure['confidence'] =
    specialPatternCandidate === 'followStrong' || specialPatternCandidate === 'followWeak'
      ? 'low'
      : purityScore >= 42 && isExposed
        ? 'high'
        : purityScore >= 24
          ? 'medium'
          : 'low';

  return {
    type: purityScore < 18 ? 'mixed' : primaryTenGod,
    primaryTenGod,
    monthCommandTenGod: monthCommand.tenGod,
    monthCommandStem: monthCommand.stem,
    isExposed,
    purityScore: round(purityScore, 1),
    stabilityScore: round(stabilityScore, 1),
    supportingTenGods,
    specialPatternCandidate,
    evidenceCodes,
    confidence,
  };
}
