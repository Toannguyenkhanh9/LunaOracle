import type {
  BaziInterpretation,
  ChartRelation,
  DayMasterStrength,
  ElementAnalysis,
  Gender,
  InterpretationSection,
  TenGod,
  TenGodDistribution,
  UsefulElementAnalysis,
} from '../types';
import {clamp, round} from '../utils/math';

function level(score: number): InterpretationSection['level'] {
  if (score >= 78) {
    return 'strong';
  }

  if (score >= 64) {
    return 'favorable';
  }

  if (score >= 48) {
    return 'balanced';
  }

  if (score >= 32) {
    return 'developing';
  }

  return 'low';
}

function countRelations(relations: ChartRelation[], types: ChartRelation['type'][]): number {
  return relations.filter(item => types.includes(item.type)).length;
}

function sumGods(
  distribution: TenGodDistribution,
  gods: TenGod[],
): number {
  return gods.reduce((sum, god) => sum + distribution.combined[god], 0);
}

function dominantHeadline(distribution: TenGodDistribution): string {
  const dominant = distribution.dominant[0] ?? 'friend';
  return `character.headline.${dominant}`;
}

function characterSection(
  gods: TenGodDistribution,
  strength: DayMasterStrength,
): InterpretationSection {
  const dominant = gods.dominant.slice(0, 3);
  const score = clamp(52 + dominant.length * 5 + (strength.level === 'balanced' ? 8 : 0), 0, 100);

  return {
    score: round(score, 1),
    level: level(score),
    headlineCode: dominantHeadline(gods),
    strengthCodes: dominant.map(god => `character.strength.${god}`),
    cautionCodes: strength.level === 'veryStrong' || strength.level === 'veryWeak'
      ? [`character.caution.${strength.level}`]
      : ['character.caution.balanceBlindSpots'],
    adviceCodes: [
      `character.advice.${strength.level}`,
      'character.advice.useFavorableElementsAsContext',
    ],
  };
}

function loveSection(
  gender: Gender,
  gods: TenGodDistribution,
  relations: ChartRelation[],
): InterpretationSection {
  const spouseGods: TenGod[] =
    gender === 'male'
      ? ['directWealth', 'indirectWealth']
      : gender === 'female'
        ? ['directOfficer', 'sevenKillings']
        : ['directWealth', 'indirectWealth', 'directOfficer', 'sevenKillings'];

  const spousePresence = sumGods(gods, spouseGods);
  const positive = countRelations(relations, [
    'sixHarmony',
    'threeHarmony',
    'stemCombination',
  ]);
  const challenging = countRelations(relations, [
    'sixClash',
    'harm',
    'punishment',
    'selfPunishment',
    'break',
  ]);

  const score = clamp(48 + spousePresence * 5 + positive * 6 - challenging * 5, 15, 92);

  const headline =
    positive > challenging
      ? 'love.headline.connectionOriented'
      : challenging > positive
        ? 'love.headline.boundaryAndCommunication'
        : 'love.headline.steadyDevelopment';

  return {
    score: round(score, 1),
    level: level(score),
    headlineCode: headline,
    strengthCodes: [
      positive > 0 ? 'love.strength.harmonyPresent' : 'love.strength.selfAwarenessNeeded',
      spousePresence > 1.5 ? 'love.strength.relationshipStarVisible' : 'love.strength.slowTrustCanBeStable',
    ],
    cautionCodes: [
      challenging > 0 ? 'love.caution.manageConflictPatterns' : 'love.caution.avoidAssumptions',
      'love.caution.doNotTreatScoreAsPrediction',
    ],
    adviceCodes: [
      'love.advice.communicateNeedsClearly',
      positive > 0 ? 'love.advice.buildSharedRituals' : 'love.advice.createEmotionalSafety',
    ],
  };
}

function careerSection(
  gods: TenGodDistribution,
  strength: DayMasterStrength,
): InterpretationSection {
  const officer = sumGods(gods, ['directOfficer', 'sevenKillings']);
  const resource = sumGods(gods, ['directResource', 'indirectResource']);
  const output = sumGods(gods, ['eatingGod', 'hurtingOfficer']);
  const wealth = sumGods(gods, ['directWealth', 'indirectWealth']);

  const structure = officer * 5 + resource * 4 + output * 4 + wealth * 3;
  const balanceBonus = strength.level === 'balanced' ? 10 : 4;
  const score = clamp(42 + structure + balanceBonus, 20, 94);

  let headline = 'career.headline.balancedContributor';

  if (officer >= resource && officer >= output && officer >= wealth) {
    headline = 'career.headline.structureAndLeadership';
  } else if (output >= officer && output >= resource && output >= wealth) {
    headline = 'career.headline.creationAndCommunication';
  } else if (resource >= officer && resource >= output && resource >= wealth) {
    headline = 'career.headline.learningAndAnalysis';
  } else if (wealth >= officer && wealth >= resource && wealth >= output) {
    headline = 'career.headline.executionAndCommerce';
  }

  return {
    score: round(score, 1),
    level: level(score),
    headlineCode: headline,
    strengthCodes: [
      officer > 1 ? 'career.strength.responsibility' : 'career.strength.flexibility',
      resource > 1 ? 'career.strength.learning' : 'career.strength.practicalLearning',
      output > 1 ? 'career.strength.expression' : 'career.strength.focusedDelivery',
    ],
    cautionCodes: [
      strength.level === 'veryStrong'
        ? 'career.caution.overControl'
        : strength.level === 'veryWeak'
          ? 'career.caution.energyManagement'
          : 'career.caution.avoidScatteredPriorities',
    ],
    adviceCodes: [
      'career.advice.buildVisibleEvidence',
      'career.advice.useLuckCyclesAsPlanningContextOnly',
    ],
  };
}

function wealthSection(
  gods: TenGodDistribution,
  strength: DayMasterStrength,
): InterpretationSection {
  const wealth = sumGods(gods, ['directWealth', 'indirectWealth']);
  const output = sumGods(gods, ['eatingGod', 'hurtingOfficer']);
  const supportPenalty = strength.level === 'veryWeak' ? 12 : strength.level === 'weak' ? 6 : 0;
  const score = clamp(45 + wealth * 9 + output * 3 - supportPenalty, 18, 92);

  return {
    score: round(score, 1),
    level: level(score),
    headlineCode:
      wealth >= 2
        ? 'wealth.headline.resourceManagementVisible'
        : 'wealth.headline.buildThroughConsistency',
    strengthCodes: [
      wealth > 1 ? 'wealth.strength.commercialAwareness' : 'wealth.strength.longTermBuilding',
      output > 1 ? 'wealth.strength.createValue' : 'wealth.strength.conservativePacing',
    ],
    cautionCodes: [
      strength.level === 'weak' || strength.level === 'veryWeak'
        ? 'wealth.caution.doNotOverextend'
        : 'wealth.caution.avoidOverconfidence',
    ],
    adviceCodes: [
      'wealth.advice.budgetAndDiversify',
      'wealth.advice.noGuaranteedFinancialPrediction',
    ],
  };
}

function wellbeingSection(
  elements: ElementAnalysis,
  useful: UsefulElementAnalysis,
): InterpretationSection {
  const percentages = Object.values(elements.percentages);
  const spread = Math.max(...percentages) - Math.min(...percentages);
  const score = clamp(82 - spread * 0.9, 28, 88);

  return {
    score: round(score, 1),
    level: level(score),
    headlineCode:
      spread <= 18
        ? 'wellbeing.headline.elementBalance'
        : 'wellbeing.headline.rhythmAndRecovery',
    strengthCodes: [
      `wellbeing.strength.dominant.${elements.dominant[0]}`,
    ],
    cautionCodes: elements.deficient.map(
      element => `wellbeing.caution.low.${element}`,
    ),
    adviceCodes: [
      ...useful.favorable.map(element => `wellbeing.advice.support.${element}`),
      'wellbeing.advice.notMedicalAdvice',
    ],
  };
}

export function buildInterpretation(
  gender: Gender,
  gods: TenGodDistribution,
  relations: ChartRelation[],
  strength: DayMasterStrength,
  elements: ElementAnalysis,
  useful: UsefulElementAnalysis,
): BaziInterpretation {
  return {
    character: characterSection(gods, strength),
    love: loveSection(gender, gods, relations),
    career: careerSection(gods, strength),
    wealth: wealthSection(gods, strength),
    wellbeing: wellbeingSection(elements, useful),
  };
}
