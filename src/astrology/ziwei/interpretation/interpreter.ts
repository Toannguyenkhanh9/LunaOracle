import type {
  ZiweiAnnualCycle,
  ZiweiAnnualInterpretation,
  ZiweiAuxiliaryStarCategory,
  ZiweiAuxiliaryStarId,
  ZiweiChartStage5,
  ZiweiDomainId,
  ZiweiDomainInterpretation,
  ZiweiInterpretationConfidence,
  ZiweiInterpretationEvidence,
  ZiweiInterpretationLevel,
  ZiweiInterpretationReport,
  ZiweiInterpretationTone,
  ZiweiMainStarId,
  ZiweiPalaceId,
  ZiweiPalaceInterpretation,
  ZiweiStarBrightness,
  ZiweiTransformationType,
  ZiweiTrangSinhStageId,
} from '../types';

const PALACE_IDS: ZiweiPalaceId[] = [
  'life',
  'parents',
  'fortune',
  'property',
  'career',
  'friends',
  'travel',
  'health',
  'wealth',
  'children',
  'spouse',
  'siblings',
];

const MAIN_STAR_BASE: Record<ZiweiMainStarId, number> = {
  ziWei: 9,
  tianJi: 4,
  taiYang: 6,
  wuQu: 5,
  tianTong: 5,
  lianZhen: 0,
  tianFu: 9,
  taiYin: 6,
  tanLang: 1,
  juMen: -2,
  tianXiang: 7,
  tianLiang: 7,
  qiSha: -3,
  poJun: -4,
};

const BRIGHTNESS_WEIGHT: Record<Exclude<ZiweiStarBrightness, 'notEvaluated'>, number> = {
  mien: 12,
  vuong: 9,
  dac: 6,
  binh: 1,
  ham: -10,
};

const STAR_PALACE_BONUS: Partial<
  Record<ZiweiMainStarId, Partial<Record<ZiweiPalaceId, number>>>
> = {
  ziWei: {life: 5, career: 5, wealth: 2},
  tianJi: {career: 4, travel: 4, wealth: 2},
  taiYang: {career: 5, travel: 4, parents: 3},
  wuQu: {wealth: 6, career: 4, property: 2},
  tianTong: {fortune: 5, children: 4, spouse: 2},
  lianZhen: {career: 3, spouse: -2, health: -2},
  tianFu: {wealth: 6, property: 5, life: 4},
  taiYin: {wealth: 5, property: 5, spouse: 3},
  tanLang: {spouse: 3, wealth: 3, friends: 3, health: -2},
  juMen: {career: 2, friends: -3, spouse: -3},
  tianXiang: {career: 5, friends: 4, life: 3},
  tianLiang: {health: 5, parents: 4, fortune: 4},
  qiSha: {career: 4, travel: 4, spouse: -3, health: -2},
  poJun: {travel: 5, career: 2, property: -3, spouse: -3},
};

const AUXILIARY_TONE_WEIGHT = {
  supportive: 5,
  challenging: -6,
  mixed: 0,
} as const;

const AUXILIARY_CATEGORY_BONUS: Partial<
  Record<ZiweiAuxiliaryStarCategory, Partial<Record<ZiweiPalaceId, number>>>
> = {
  assistant: {life: 2, career: 2, friends: 2},
  literary: {career: 3, fortune: 2},
  noble: {life: 2, career: 3},
  wealth: {wealth: 4, career: 2},
  malefic: {health: -2, spouse: -1},
  mobility: {travel: 4, career: 2},
  romance: {spouse: 4, children: 2},
  solitary: {spouse: -3, fortune: 1},
  ceremonial: {parents: 2, fortune: 2},
};

const TRANSFORMATION_WEIGHT: Record<ZiweiTransformationType, number> = {
  lu: 12,
  quan: 8,
  ke: 7,
  ji: -14,
};

const TRANSFORMATION_PALACE_BONUS: Record<
  ZiweiTransformationType,
  Partial<Record<ZiweiPalaceId, number>>
> = {
  lu: {wealth: 4, career: 2, property: 2},
  quan: {career: 4, life: 2},
  ke: {career: 3, fortune: 2, parents: 1},
  ji: {health: -3, spouse: -3, friends: -2},
};

const TRANG_SINH_WEIGHT: Record<ZiweiTrangSinhStageId, number> = {
  trangSinh: 7,
  mocDuc: 1,
  quanDoi: 6,
  lamQuan: 8,
  deVuong: 10,
  suy: -2,
  benh: -5,
  tu: -8,
  mo: -4,
  tuyet: -9,
  thai: 2,
  duong: 3,
};

const DOMAIN_PALACES: Record<
  ZiweiDomainId,
  {primary: ZiweiPalaceId; related: ZiweiPalaceId[]}
> = {
  self: {primary: 'life', related: ['fortune', 'travel', 'career']},
  love: {primary: 'spouse', related: ['life', 'fortune', 'children']},
  career: {primary: 'career', related: ['wealth', 'travel', 'friends']},
  wealth: {primary: 'wealth', related: ['career', 'property', 'fortune']},
  health: {primary: 'health', related: ['life', 'fortune']},
  family: {primary: 'parents', related: ['siblings', 'children', 'fortune', 'property']},
  travel: {primary: 'travel', related: ['friends', 'career', 'life']},
};

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function levelFromScore(score: number): ZiweiInterpretationLevel {
  if (score >= 78) return 'veryFavorable';
  if (score >= 64) return 'favorable';
  if (score >= 48) return 'balanced';
  if (score >= 34) return 'challenging';
  return 'veryChallenging';
}

function toneFromDelta(delta: number): ZiweiInterpretationTone {
  if (delta >= 3) return 'supportive';
  if (delta <= -3) return 'challenging';
  if (delta === 0) return 'neutral';
  return 'mixed';
}

function confidenceFromEvidence(
  evidenceCount: number,
  hasMainStar: boolean,
): ZiweiInterpretationConfidence {
  if (hasMainStar && evidenceCount >= 5) return 'high';
  if (evidenceCount >= 3) return 'medium';
  return 'low';
}

function averageConfidence(
  values: ZiweiInterpretationConfidence[],
): ZiweiInterpretationConfidence {
  const numeric = values.map(item => (item === 'high' ? 3 : item === 'medium' ? 2 : 1));
  const average = numeric.reduce((sum, item) => sum + item, 0) / Math.max(1, numeric.length);
  if (average >= 2.5) return 'high';
  if (average >= 1.5) return 'medium';
  return 'low';
}

function makeEvidence(
  source: ZiweiInterpretationEvidence['source'],
  sourceId: string,
  palaceId: ZiweiPalaceId,
  delta: number,
  code: string,
  details?: ZiweiInterpretationEvidence['details'],
  brightness?: ZiweiStarBrightness,
): ZiweiInterpretationEvidence {
  return {
    source,
    sourceId,
    palaceId,
    tone: toneFromDelta(delta),
    scoreDelta: Math.round(delta),
    code,
    details,
    brightness,
  };
}

function readPalace(
  chart: ZiweiChartStage5,
  palaceId: ZiweiPalaceId,
): ZiweiPalaceInterpretation {
  const evidence: ZiweiInterpretationEvidence[] = [];
  let score = 50;

  const mainStars = chart.mainStarsByPalace[palaceId];
  for (const star of mainStars) {
    const brightnessWeight =
      star.brightness === 'notEvaluated' ? 0 : BRIGHTNESS_WEIGHT[star.brightness];
    const palaceBonus = STAR_PALACE_BONUS[star.id]?.[palaceId] ?? 0;
    const delta = MAIN_STAR_BASE[star.id] + brightnessWeight + palaceBonus;
    score += delta;
    evidence.push(
      makeEvidence(
        'mainStar',
        star.id,
        palaceId,
        delta,
        'INTERPRET_MAIN_STAR',
        {base: MAIN_STAR_BASE[star.id], palaceBonus},
        star.brightness,
      ),
    );
  }

  if (mainStars.length === 0) {
    score -= 2;
    evidence.push(
      makeEvidence('mainStar', 'none', palaceId, -2, 'INTERPRET_NO_MAIN_STAR'),
    );
  }

  const auxiliaryStars = chart.auxiliaryStarsByPalace[palaceId];
  for (const star of auxiliaryStars) {
    const base = AUXILIARY_TONE_WEIGHT[star.tone];
    const categoryBonus = AUXILIARY_CATEGORY_BONUS[star.category]?.[palaceId] ?? 0;
    const delta = base + categoryBonus;
    score += delta;
    evidence.push(
      makeEvidence(
        'auxiliaryStar',
        star.id,
        palaceId,
        delta,
        'INTERPRET_AUXILIARY_STAR',
        {category: star.category, base, categoryBonus},
      ),
    );
  }

  const transformations = chart.transformationsByPalace[palaceId];
  for (const transformation of transformations) {
    const base = TRANSFORMATION_WEIGHT[transformation.type];
    const palaceBonus = TRANSFORMATION_PALACE_BONUS[transformation.type][palaceId] ?? 0;
    const delta = base + palaceBonus;
    score += delta;
    evidence.push(
      makeEvidence(
        'transformation',
        transformation.type,
        palaceId,
        delta,
        'INTERPRET_TRANSFORMATION',
        {starId: transformation.starId, palaceBonus},
      ),
    );
  }

  for (const marker of chart.voidMarkersByPalace[palaceId]) {
    const delta = marker === 'tuan' ? -6 : -8;
    score += delta;
    evidence.push(
      makeEvidence('voidMarker', marker, palaceId, delta, 'INTERPRET_VOID_MARKER'),
    );
  }

  const stage = chart.trangSinhByPalace[palaceId];
  if (stage) {
    const delta = TRANG_SINH_WEIGHT[stage.stageId];
    score += delta;
    evidence.push(
      makeEvidence(
        'trangSinh',
        stage.stageId,
        palaceId,
        delta,
        'INTERPRET_TRANG_SINH',
      ),
    );
  }

  if (chart.bodyResidencePalaceId === palaceId) {
    score += 3;
    evidence.push(
      makeEvidence(
        'bodyResidence',
        palaceId,
        palaceId,
        3,
        'INTERPRET_BODY_RESIDENCE',
      ),
    );
  }

  const normalized = clampScore(score);
  const level = levelFromScore(normalized);
  const confidence = confidenceFromEvidence(evidence.length, mainStars.length > 0);

  return {
    palaceId,
    score: normalized,
    level,
    confidence,
    headlineCode: `PALACE_${level.toUpperCase()}`,
    adviceCode: `ADVICE_PALACE_${palaceId.toUpperCase()}`,
    mainStarIds: mainStars.map(item => item.id),
    auxiliaryStarIds: auxiliaryStars.map(item => item.id),
    transformationTypes: transformations.map(item => item.type),
    evidence,
    supportiveEvidence: evidence.filter(item => item.tone === 'supportive'),
    challengingEvidence: evidence.filter(item => item.tone === 'challenging'),
  };
}

function buildPalaceMap(
  readings: ZiweiPalaceInterpretation[],
): Record<ZiweiPalaceId, ZiweiPalaceInterpretation> {
  const result = {} as Record<ZiweiPalaceId, ZiweiPalaceInterpretation>;
  for (const item of readings) result[item.palaceId] = item;
  return result;
}

function readDomain(
  domainId: ZiweiDomainId,
  palaceMap: Record<ZiweiPalaceId, ZiweiPalaceInterpretation>,
): ZiweiDomainInterpretation {
  const mapping = DOMAIN_PALACES[domainId];
  const primary = palaceMap[mapping.primary];
  const related = mapping.related.map(id => palaceMap[id]);
  const relatedWeight = related.length > 0 ? 0.4 / related.length : 0;
  const score = clampScore(
    primary.score * 0.6 +
      related.reduce((sum, item) => sum + item.score * relatedWeight, 0),
  );
  const level = levelFromScore(score);
  const confidence = averageConfidence([
    primary.confidence,
    ...related.map(item => item.confidence),
  ]);
  const evidence = [
    ...primary.evidence,
    ...related.flatMap(item => item.evidence.slice(0, 3)),
  ].sort((a, b) => Math.abs(b.scoreDelta) - Math.abs(a.scoreDelta));

  return {
    domainId,
    primaryPalaceId: mapping.primary,
    relatedPalaceIds: mapping.related,
    score,
    level,
    confidence,
    headlineCode: `DOMAIN_${domainId.toUpperCase()}_${level.toUpperCase()}`,
    adviceCode: `ADVICE_DOMAIN_${domainId.toUpperCase()}`,
    evidence: evidence.slice(0, 12),
  };
}

function buildDomainMap(
  readings: ZiweiDomainInterpretation[],
): Record<ZiweiDomainId, ZiweiDomainInterpretation> {
  const result = {} as Record<ZiweiDomainId, ZiweiDomainInterpretation>;
  for (const item of readings) result[item.domainId] = item;
  return result;
}

function annualEvidenceFromPalace(
  palaceReading: ZiweiPalaceInterpretation | undefined,
  source: 'majorCycle' | 'minorCycle',
  factor: number,
): ZiweiInterpretationEvidence | undefined {
  if (!palaceReading) return undefined;
  const delta = Math.round((palaceReading.score - 50) * factor);
  return makeEvidence(
    source,
    palaceReading.palaceId,
    palaceReading.palaceId,
    delta,
    source === 'majorCycle'
      ? 'INTERPRET_ANNUAL_MAJOR_CYCLE'
      : 'INTERPRET_ANNUAL_MINOR_CYCLE',
    {palaceScore: palaceReading.score},
  );
}

function readAnnual(
  annual: ZiweiAnnualCycle,
  palaceMap: Record<ZiweiPalaceId, ZiweiPalaceInterpretation>,
): ZiweiAnnualInterpretation {
  const evidence: ZiweiInterpretationEvidence[] = [];
  let score = 50;

  const majorEvidence = annual.activeMajorPalaceId
    ? annualEvidenceFromPalace(palaceMap[annual.activeMajorPalaceId], 'majorCycle', 0.34)
    : undefined;
  if (majorEvidence) {
    score += majorEvidence.scoreDelta;
    evidence.push(majorEvidence);
  }

  const minorEvidence = annualEvidenceFromPalace(
    palaceMap[annual.minorCyclePalaceId],
    'minorCycle',
    0.22,
  );
  if (minorEvidence) {
    score += minorEvidence.scoreDelta;
    evidence.push(minorEvidence);
  }

  const taiSuiReading = palaceMap[annual.taiSuiPalaceId];
  const taiSuiDelta = Math.round((taiSuiReading.score - 50) * 0.12);
  score += taiSuiDelta;
  evidence.push(
    makeEvidence(
      'annualStar',
      'taiSui',
      annual.taiSuiPalaceId,
      taiSuiDelta,
      'INTERPRET_ANNUAL_TAI_SUI',
      {palaceScore: taiSuiReading.score},
    ),
  );

  for (const star of annual.annualStars) {
    const delta =
      star.tone === 'supportive'
        ? 5
        : star.tone === 'challenging'
          ? -6
          : star.tone === 'mixed'
            ? 0
            : 1;
    score += delta;
    evidence.push(
      makeEvidence(
        'annualStar',
        star.id,
        star.palaceId,
        delta,
        'INTERPRET_ANNUAL_STAR',
      ),
    );
  }

  for (const transformation of annual.annualTransformations) {
    const delta = TRANSFORMATION_WEIGHT[transformation.type];
    score += delta;
    evidence.push(
      makeEvidence(
        'annualTransformation',
        transformation.type,
        transformation.palaceId,
        delta,
        'INTERPRET_ANNUAL_TRANSFORMATION',
        {starId: transformation.starId},
      ),
    );
  }

  const normalized = clampScore(score);
  const level = levelFromScore(normalized);
  const confidence: ZiweiInterpretationConfidence = annual.activeMajorPalaceId
    ? 'medium'
    : 'low';

  return {
    calendarYear: annual.calendarYear,
    nominalAge: annual.nominalAge,
    score: normalized,
    level,
    confidence,
    headlineCode: `ANNUAL_${level.toUpperCase()}`,
    adviceCode: 'ADVICE_ANNUAL_GENERAL',
    activeMajorPalaceId: annual.activeMajorPalaceId,
    minorCyclePalaceId: annual.minorCyclePalaceId,
    taiSuiPalaceId: annual.taiSuiPalaceId,
    evidence: evidence.sort(
      (a, b) => Math.abs(b.scoreDelta) - Math.abs(a.scoreDelta),
    ),
  };
}

export function buildZiweiInterpretation(
  chart: ZiweiChartStage5,
): ZiweiInterpretationReport {
  const palaceReadings = PALACE_IDS.map(palaceId => readPalace(chart, palaceId));
  const palaceReadingsById = buildPalaceMap(palaceReadings);
  const domainIds: ZiweiDomainId[] = [
    'self',
    'love',
    'career',
    'wealth',
    'health',
    'family',
    'travel',
  ];
  const domainReadings = domainIds.map(domainId =>
    readDomain(domainId, palaceReadingsById),
  );
  const domainReadingsById = buildDomainMap(domainReadings);
  const overallScore = clampScore(
    domainReadings.reduce((sum, item) => sum + item.score, 0) /
      domainReadings.length,
  );
  const overallLevel = levelFromScore(overallScore);
  const overallConfidence = averageConfidence(
    domainReadings.map(item => item.confidence),
  );
  const annualReadings = chart.annualCycles.map(item =>
    readAnnual(item, palaceReadingsById),
  );

  return {
    ruleset: 'ziwei-interpretation-reference-v1',
    overallScore,
    overallLevel,
    overallConfidence,
    headlineCode: `OVERALL_${overallLevel.toUpperCase()}`,
    palaceReadings,
    palaceReadingsById,
    domainReadings,
    domainReadingsById,
    annualReadings,
  };
}
