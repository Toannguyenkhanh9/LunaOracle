import {CONTROLS} from '../constants';
import type {
  CareerArchetype,
  CareerDomainAnalysis,
  ChartStructure,
  DayMasterStrength,
  DomainFactor,
  Gender,
  LifeDomainAnalysis,
  LifeDomainLevel,
  LoveDomainAnalysis,
  LoveStyle,
  Pillar,
  PillarKind,
  RelationSummary,
  TenGod,
  TenGodDistribution,
  UsefulElementAnalysis,
  WealthDomainAnalysis,
  WealthStyle,
} from '../types';
import {clamp, round} from '../utils/math';

const OFFICER_GODS: TenGod[] = ['directOfficer', 'sevenKillings'];
const RESOURCE_GODS: TenGod[] = ['directResource', 'indirectResource'];
const OUTPUT_GODS: TenGod[] = ['eatingGod', 'hurtingOfficer'];
const WEALTH_GODS: TenGod[] = ['directWealth', 'indirectWealth'];
const PEER_GODS: TenGod[] = ['friend', 'robWealth'];

function sumGods(distribution: TenGodDistribution, gods: TenGod[]): number {
  return gods.reduce((sum, god) => sum + distribution.combined[god], 0);
}

function level(score: number): LifeDomainLevel {
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

function confidence(
  strength: DayMasterStrength,
  structure: ChartStructure,
): 'low' | 'medium' | 'high' {
  if (
    strength.pattern !== 'ordinary' ||
    structure.specialPatternCandidate === 'followStrong' ||
    structure.specialPatternCandidate === 'followWeak'
  ) {
    return 'low';
  }

  if (strength.confidence === 'high' && structure.confidence !== 'low') {
    return 'high';
  }

  return 'medium';
}

function factor(code: string, score: number): DomainFactor {
  return {
    code,
    score: round(score, 1),
  };
}

function spouseStarsForGender(gender: Gender): TenGod[] {
  if (gender === 'male') {
    return ['directWealth', 'indirectWealth'];
  }

  if (gender === 'female') {
    return ['directOfficer', 'sevenKillings'];
  }

  return [
    'directWealth',
    'indirectWealth',
    'directOfficer',
    'sevenKillings',
  ];
}

function loveStyle(
  gods: TenGodDistribution,
  spouseStars: TenGod[],
  spousePalaceScore: number,
): LoveStyle {
  const output = sumGods(gods, OUTPUT_GODS);
  const peer = sumGods(gods, PEER_GODS);
  const direct = spouseStars.reduce(
    (sum, god) => sum + (god === 'directWealth' || god === 'directOfficer' ? gods.combined[god] : 0),
    0,
  );
  const indirect = spouseStars.reduce(
    (sum, god) => sum + (god === 'indirectWealth' || god === 'sevenKillings' ? gods.combined[god] : 0),
    0,
  );

  if (spousePalaceScore < 40 || indirect > direct * 1.4) {
    return 'intense';
  }

  if (output >= 2.4) {
    return 'expressive';
  }

  if (peer >= 2.8) {
    return 'independent';
  }

  if (direct >= indirect && direct >= 1) {
    return 'steady';
  }

  return 'reflective';
}

function analyzeLove(
  gender: Gender,
  gods: TenGodDistribution,
  relationSummary: RelationSummary,
  strength: DayMasterStrength,
  structure: ChartStructure,
  useful: UsefulElementAnalysis,
): LoveDomainAnalysis {
  const spouseStars = spouseStarsForGender(gender);
  const spouseStarStrength = sumGods(gods, spouseStars);
  const directSpouse = sumGods(
    gods,
    spouseStars.filter(god => god === 'directWealth' || god === 'directOfficer'),
  );
  const indirectSpouse = sumGods(
    gods,
    spouseStars.filter(god => god === 'indirectWealth' || god === 'sevenKillings'),
  );

  const spouseStarFactor = clamp(spouseStarStrength * 5.2, 0, 25);
  const spousePalaceFactor = (relationSummary.spousePalaceScore - 50) * 0.34;
  const balanceFactor =
    strength.level === 'balanced'
      ? 8
      : strength.level === 'weak' || strength.level === 'strong'
        ? 3
        : -5;
  const directnessFactor = directSpouse >= indirectSpouse && directSpouse > 0 ? 4 : 0;

  const factors = [
    factor('stage2.love.factor.spouseStarPresence', spouseStarFactor),
    factor('stage2.love.factor.spousePalaceRelations', spousePalaceFactor),
    factor('stage2.love.factor.dayMasterBalance', balanceFactor),
    factor('stage2.love.factor.directSpouseStar', directnessFactor),
  ];

  const score = clamp(
    44 + factors.reduce((sum, item) => sum + item.score, 0),
    12,
    94,
  );

  const style = loveStyle(gods, spouseStars, relationSummary.spousePalaceScore);
  const riskCodes: string[] = [];

  if (relationSummary.spousePalaceScore < 45) {
    riskCodes.push('stage2.love.risk.spousePalaceConflict');
  }

  if (spouseStarStrength < 0.7) {
    riskCodes.push('stage2.love.risk.spouseStarQuiet');
  }

  if (indirectSpouse > directSpouse * 1.5 && indirectSpouse > 1.2) {
    riskCodes.push('stage2.love.risk.intensityBeforeStability');
  }

  if (strength.level === 'veryStrong') {
    riskCodes.push('stage2.love.risk.controlAndIndependence');
  }

  if (strength.level === 'veryWeak') {
    riskCodes.push('stage2.love.risk.overAccommodation');
  }

  return {
    score: round(score, 1),
    level: level(score),
    headlineCode: `stage2.love.headline.${style}`,
    factorCodes: factors.filter(item => item.score > 0).map(item => item.code),
    riskCodes,
    adviceCodes: [
      'stage2.love.advice.communicateNeeds',
      relationSummary.spousePalaceScore < 50
        ? 'stage2.love.advice.slowConflictResponse'
        : 'stage2.love.advice.buildSharedRhythm',
    ],
    favorableElements: useful.favorable,
    relatedTenGods: spouseStars,
    confidence: confidence(strength, structure),
    factors,
    style,
    spouseStars,
    spouseStarStrength: round(spouseStarStrength, 2),
    spousePalaceScore: relationSummary.spousePalaceScore,
  };
}

function careerArchetype(
  gods: TenGodDistribution,
  structure: ChartStructure,
): CareerArchetype {
  const values: Array<{type: CareerArchetype; value: number}> = [
    {
      type: 'leadership',
      value: sumGods(gods, OFFICER_GODS) +
        (OFFICER_GODS.includes(structure.primaryTenGod as TenGod) ? 2 : 0),
    },
    {
      type: 'creative',
      value: sumGods(gods, OUTPUT_GODS) +
        (OUTPUT_GODS.includes(structure.primaryTenGod as TenGod) ? 2 : 0),
    },
    {
      type: 'analytical',
      value: sumGods(gods, RESOURCE_GODS) +
        (RESOURCE_GODS.includes(structure.primaryTenGod as TenGod) ? 2 : 0),
    },
    {
      type: 'commercial',
      value: sumGods(gods, WEALTH_GODS) +
        (WEALTH_GODS.includes(structure.primaryTenGod as TenGod) ? 2 : 0),
    },
    {
      type: 'independent',
      value: sumGods(gods, PEER_GODS) +
        (PEER_GODS.includes(structure.primaryTenGod as TenGod) ? 1.5 : 0),
    },
  ];

  values.sort((first, second) => second.value - first.value);

  if (values[0].value < 1.2) {
    return 'specialist';
  }

  return values[0].type;
}

function analyzeCareer(
  gods: TenGodDistribution,
  relationSummary: RelationSummary,
  strength: DayMasterStrength,
  structure: ChartStructure,
  useful: UsefulElementAnalysis,
): CareerDomainAnalysis {
  const officer = sumGods(gods, OFFICER_GODS);
  const resource = sumGods(gods, RESOURCE_GODS);
  const output = sumGods(gods, OUTPUT_GODS);
  const wealth = sumGods(gods, WEALTH_GODS);
  const peer = sumGods(gods, PEER_GODS);

  const professionalSignal = clamp(
    Math.max(officer, resource, output, wealth, peer) * 4.5,
    0,
    24,
  );
  const structureFactor =
    (structure.isExposed ? 7 : 2) + (structure.stabilityScore - 50) * 0.12;
  const careerPalaceFactor = (relationSummary.careerPalaceScore - 50) * 0.3;
  const capacityFactor =
    strength.level === 'balanced'
      ? 8
      : strength.level === 'weak' || strength.level === 'strong'
        ? 4
        : -4;

  const factors = [
    factor('stage2.career.factor.professionalSignal', professionalSignal),
    factor('stage2.career.factor.structureVisibility', structureFactor),
    factor('stage2.career.factor.monthPillarRelations', careerPalaceFactor),
    factor('stage2.career.factor.capacityBalance', capacityFactor),
  ];

  const score = clamp(
    43 + factors.reduce((sum, item) => sum + item.score, 0),
    15,
    95,
  );
  const archetype = careerArchetype(gods, structure);
  const riskCodes: string[] = [];

  if (relationSummary.careerPalaceScore < 44) {
    riskCodes.push('stage2.career.risk.environmentFriction');
  }

  if (strength.level === 'veryWeak') {
    riskCodes.push('stage2.career.risk.capacityOverload');
  }

  if (strength.level === 'veryStrong') {
    riskCodes.push('stage2.career.risk.overControl');
  }

  if (structure.purityScore < 22) {
    riskCodes.push('stage2.career.risk.scatteredStructure');
  }

  return {
    score: round(score, 1),
    level: level(score),
    headlineCode: `stage2.career.headline.${archetype}`,
    factorCodes: factors.filter(item => item.score > 0).map(item => item.code),
    riskCodes,
    adviceCodes: [
      `stage2.career.advice.${archetype}`,
      'stage2.career.advice.validateWithRealSkills',
    ],
    favorableElements: useful.favorable,
    relatedTenGods: structure.supportingTenGods,
    confidence: confidence(strength, structure),
    factors,
    archetype,
    structureTenGod: structure.primaryTenGod,
    careerPalaceScore: relationSummary.careerPalaceScore,
  };
}

function wealthStyle(
  directWealth: number,
  indirectWealth: number,
  output: number,
  strength: DayMasterStrength,
): WealthStyle {
  if (directWealth >= indirectWealth * 1.25 && directWealth >= 1) {
    return 'stableAccumulation';
  }

  if (indirectWealth >= directWealth * 1.25 && indirectWealth >= 1) {
    return 'opportunityDriven';
  }

  if (output >= 2.2) {
    return 'valueCreation';
  }

  if (strength.level === 'strong' || strength.level === 'veryStrong') {
    return 'resourceManagement';
  }

  return 'conservative';
}

function analyzeWealth(
  pillars: Record<PillarKind, Pillar>,
  gods: TenGodDistribution,
  strength: DayMasterStrength,
  structure: ChartStructure,
  useful: UsefulElementAnalysis,
): WealthDomainAnalysis {
  const directWealthStrength = gods.combined.directWealth;
  const indirectWealthStrength = gods.combined.indirectWealth;
  const totalWealth = directWealthStrength + indirectWealthStrength;
  const output = sumGods(gods, OUTPUT_GODS);
  const wealthElement = CONTROLS[pillars.day.stem.element];

  const wealthSignal = clamp(totalWealth * 6.2, 0, 28);
  const valueCreation = clamp(output * 3.2, 0, 14);
  const capacity =
    strength.level === 'balanced'
      ? 11
      : strength.level === 'strong'
        ? 8
        : strength.level === 'veryStrong'
          ? 4
          : strength.level === 'weak'
            ? -5
            : -12;
  const usefulElementFit = useful.favorable.includes(wealthElement)
    ? 9
    : useful.unfavorable.includes(wealthElement)
      ? -10
      : 1;

  const factors = [
    factor('stage2.wealth.factor.wealthStars', wealthSignal),
    factor('stage2.wealth.factor.outputCreatesValue', valueCreation),
    factor('stage2.wealth.factor.dayMasterCapacity', capacity),
    factor('stage2.wealth.factor.usefulElementFit', usefulElementFit),
  ];

  const score = clamp(
    40 + factors.reduce((sum, item) => sum + item.score, 0),
    10,
    94,
  );
  const style = wealthStyle(
    directWealthStrength,
    indirectWealthStrength,
    output,
    strength,
  );
  const wealthCapacityScore = clamp(50 + capacity * 3 + usefulElementFit * 1.2, 0, 100);
  const riskCodes: string[] = [];

  if (strength.level === 'weak' || strength.level === 'veryWeak') {
    riskCodes.push('stage2.wealth.risk.overextension');
  }

  if (indirectWealthStrength > directWealthStrength * 1.8) {
    riskCodes.push('stage2.wealth.risk.opportunityVolatility');
  }

  if (gods.combined.robWealth >= 1.8) {
    riskCodes.push('stage2.wealth.risk.peerCompetition');
  }

  if (totalWealth < 0.8) {
    riskCodes.push('stage2.wealth.risk.wealthStarQuiet');
  }

  return {
    score: round(score, 1),
    level: level(score),
    headlineCode: `stage2.wealth.headline.${style}`,
    factorCodes: factors.filter(item => item.score > 0).map(item => item.code),
    riskCodes,
    adviceCodes: [
      `stage2.wealth.advice.${style}`,
      'stage2.wealth.advice.noGuaranteedPrediction',
    ],
    favorableElements: useful.favorable,
    relatedTenGods: WEALTH_GODS,
    confidence: confidence(strength, structure),
    factors,
    style,
    directWealthStrength: round(directWealthStrength, 2),
    indirectWealthStrength: round(indirectWealthStrength, 2),
    wealthCapacityScore: round(wealthCapacityScore, 1),
  };
}

export function analyzeLifeDomains(
  gender: Gender,
  pillars: Record<PillarKind, Pillar>,
  gods: TenGodDistribution,
  relationSummary: RelationSummary,
  strength: DayMasterStrength,
  structure: ChartStructure,
  useful: UsefulElementAnalysis,
): LifeDomainAnalysis {
  return {
    love: analyzeLove(
      gender,
      gods,
      relationSummary,
      strength,
      structure,
      useful,
    ),
    career: analyzeCareer(
      gods,
      relationSummary,
      strength,
      structure,
      useful,
    ),
    wealth: analyzeWealth(
      pillars,
      gods,
      strength,
      structure,
      useful,
    ),
  };
}
