import {
  calculateAdvancedCompatibility,
  getCompatibilityWeights,
  type CompatibilityMode,
} from './advancedCompatibility';

import {
  buildLifeTimeline,
} from './lifeTimeline';

import {
  getTodayInsight,
  type TodayProfileRelation,
  type TodayRating,
} from './todayInsight';

import type {
  UserProfile,
} from './userProfiles';

export type ExplainableKind =
  | 'today'
  | 'timeline'
  | 'compatibility'
  | 'bazi'
  | 'ziwei';

export type ExplanationTone =
  | 'strong'
  | 'supportive'
  | 'balanced'
  | 'caution';

export type ExplanationFactor = {
  code: string;
  labelKey: string;
  descriptionKey: string;
  score?: number;
  weight?: number;
  contribution?: number;
  rawValue?: string;
};

export type ExplainableResult = {
  kind: ExplainableKind;
  titleKey: string;
  summaryKey: string;
  methodologyKey: string;
  limitationsKey: string;
  overallScore?: number;
  tone: ExplanationTone;
  factors: ExplanationFactor[];
  rawData: Record<
    string,
    string | number | boolean | null
  >;
  modelVersion: string;
};

export type GenericChartExplanationPayload = {
  title?: string;
  factors: Array<{
    code: string;
    label: string;
    description?: string;
    score?: number;
    rawValue?: string;
  }>;
  rawData?: Record<
    string,
    string | number | boolean | null
  >;
  modelVersion?: string;
};

function clamp(
  value: number,
): number {
  return Math.min(
    100,
    Math.max(
      0,
      Math.round(value),
    ),
  );
}

function toneFromScore(
  score: number,
): ExplanationTone {
  if (score >= 80) {
    return 'strong';
  }

  if (score >= 66) {
    return 'supportive';
  }

  if (score >= 48) {
    return 'balanced';
  }

  return 'caution';
}

function ratingScore(
  rating: TodayRating,
): number {
  switch (rating) {
    case 'auspicious':
      return 78;
    case 'balanced':
      return 62;
    case 'caution':
    default:
      return 44;
  }
}

function relationScore(
  relation:
    | TodayProfileRelation
    | undefined,
): number {
  switch (relation) {
    case 'sixHarmony':
      return 88;
    case 'threeHarmony':
      return 82;
    case 'supportive':
      return 70;
    case 'neutral':
      return 58;
    case 'clash':
      return 38;
    default:
      return 60;
  }
}

export function explainToday(
  date: Date,
  profile: UserProfile | null,
): ExplainableResult {
  const insight =
    getTodayInsight(
      date,
      profile,
    );

  const calendarScore =
    ratingScore(
      insight.rating,
    );

  const profileScore =
    relationScore(
      insight.profileInsight
        ?.relation,
    );

  const activityScore =
    clamp(
      52 +
        insight.suitable.length *
          7 -
        insight.cautions.length *
          4,
    );

  const hourScore =
    clamp(
      46 +
        insight.auspiciousHours
          .length *
          6,
    );

  const weights = {
    calendar: 0.35,
    profile:
      profile ? 0.30 : 0,
    activities:
      profile ? 0.20 : 0.35,
    hours: 0.15,
  };

  const totalWeight =
    Object.values(
      weights,
    ).reduce(
      (sum, value) =>
        sum + value,
      0,
    );

  const overallScore =
    clamp(
      (
        calendarScore *
          weights.calendar +
        profileScore *
          weights.profile +
        activityScore *
          weights.activities +
        hourScore *
          weights.hours
      ) / totalWeight,
    );

  return {
    kind: 'today',
    titleKey:
      'explainable.today.title',
    summaryKey:
      `explainable.tones.${toneFromScore(
        overallScore,
      )}.summary`,
    methodologyKey:
      'explainable.today.methodology',
    limitationsKey:
      'explainable.common.limitations',
    overallScore,
    tone:
      toneFromScore(
        overallScore,
      ),
    factors: [
      {
        code:
          'calendarTone',
        labelKey:
          'explainable.today.factors.calendarTone.label',
        descriptionKey:
          'explainable.today.factors.calendarTone.description',
        score:
          calendarScore,
        weight:
          weights.calendar,
        contribution:
          calendarScore *
          weights.calendar,
        rawValue:
          insight.rating,
      },
      {
        code:
          'profileRelation',
        labelKey:
          'explainable.today.factors.profileRelation.label',
        descriptionKey:
          'explainable.today.factors.profileRelation.description',
        score:
          profileScore,
        weight:
          weights.profile,
        contribution:
          profileScore *
          weights.profile,
        rawValue:
          insight.profileInsight
            ?.relation ??
          'none',
      },
      {
        code:
          'activityBalance',
        labelKey:
          'explainable.today.factors.activityBalance.label',
        descriptionKey:
          'explainable.today.factors.activityBalance.description',
        score:
          activityScore,
        weight:
          weights.activities,
        contribution:
          activityScore *
          weights.activities,
        rawValue:
          `${insight.suitable.length}/${insight.cautions.length}`,
      },
      {
        code:
          'auspiciousHours',
        labelKey:
          'explainable.today.factors.auspiciousHours.label',
        descriptionKey:
          'explainable.today.factors.auspiciousHours.description',
        score:
          hourScore,
        weight:
          weights.hours,
        contribution:
          hourScore *
          weights.hours,
        rawValue:
          String(
            insight.auspiciousHours
              .length,
          ),
      },
    ],
    rawData: {
      generatedAt:
        insight.generatedAt,
      dayCanChiRaw:
        insight.dayCanChiRaw,
      monthCanChiRaw:
        insight.monthCanChiRaw,
      yearCanChiRaw:
        insight.yearCanChiRaw,
      heavenlyStemIndex:
        insight.heavenlyStemIndex,
      earthlyBranchIndex:
        insight.earthlyBranchIndex,
      tianShenLuckRaw:
        insight.tianShenLuckRaw,
      suitableCount:
        insight.suitable.length,
      cautionCount:
        insight.cautions.length,
      auspiciousHourCount:
        insight.auspiciousHours
          .length,
      profileRelation:
        insight.profileInsight
          ?.relation ??
        null,
    },
    modelVersion:
      'today-explanation-v1',
  };
}

export function explainTimelineYear(
  profile: UserProfile,
  year: number,
): ExplainableResult {
  const result =
    buildLifeTimeline(
      profile,
      year,
      year,
    )[0];

  const factors:
    ExplanationFactor[] = [
      {
        code: 'career',
        labelKey:
          'explainable.timeline.factors.career.label',
        descriptionKey:
          'explainable.timeline.factors.career.description',
        score:
          result.careerScore,
        weight: 0.25,
        contribution:
          result.careerScore *
          0.25,
      },
      {
        code: 'wealth',
        labelKey:
          'explainable.timeline.factors.wealth.label',
        descriptionKey:
          'explainable.timeline.factors.wealth.description',
        score:
          result.wealthScore,
        weight: 0.25,
        contribution:
          result.wealthScore *
          0.25,
      },
      {
        code:
          'relationship',
        labelKey:
          'explainable.timeline.factors.relationship.label',
        descriptionKey:
          'explainable.timeline.factors.relationship.description',
        score:
          result.relationshipScore,
        weight: 0.25,
        contribution:
          result.relationshipScore *
          0.25,
      },
      {
        code: 'wellbeing',
        labelKey:
          'explainable.timeline.factors.wellbeing.label',
        descriptionKey:
          'explainable.timeline.factors.wellbeing.description',
        score:
          result.wellbeingScore,
        weight: 0.25,
        contribution:
          result.wellbeingScore *
          0.25,
      },
    ];

  return {
    kind: 'timeline',
    titleKey:
      'explainable.timeline.title',
    summaryKey:
      `explainable.tones.${toneFromScore(
        result.overallScore,
      )}.summary`,
    methodologyKey:
      'explainable.timeline.methodology',
    limitationsKey:
      'explainable.common.limitations',
    overallScore:
      result.overallScore,
    tone:
      toneFromScore(
        result.overallScore,
      ),
    factors,
    rawData: {
      year:
        result.year,
      age:
        result.age,
      stemIndex:
        result.stemIndex,
      branchIndex:
        result.branchIndex,
      element:
        result.element,
      relation:
        result.relation,
      tone:
        result.tone,
    },
    modelVersion:
      'life-timeline-v1',
  };
}

export function explainCompatibility(
  first: UserProfile,
  second: UserProfile,
  mode: CompatibilityMode,
): ExplainableResult {
  const result =
    calculateAdvancedCompatibility(
      first,
      second,
      mode,
    );

  const weights =
    getCompatibilityWeights(
      mode,
    );

  const factors =
    result.dimensions.map(
      item => ({
        code:
          item.code,
        labelKey:
          `insightFeatures.compatibility.dimensions.${item.code}`,
        descriptionKey:
          `explainable.compatibility.factorDescriptions.${item.code}`,
        score:
          item.score,
        weight:
          weights[item.code],
        contribution:
          item.score *
          weights[item.code],
        rawValue:
          item.code,
      }),
    );

  return {
    kind:
      'compatibility',
    titleKey:
      'explainable.compatibility.title',
    summaryKey:
      `explainable.tones.${toneFromScore(
        result.overallScore,
      )}.summary`,
    methodologyKey:
      'explainable.compatibility.methodology',
    limitationsKey:
      'explainable.common.limitations',
    overallScore:
      result.overallScore,
    tone:
      toneFromScore(
        result.overallScore,
      ),
    factors,
    rawData: {
      profileAId:
        result.profileAId,
      profileBId:
        result.profileBId,
      mode:
        result.mode,
      modelVersion:
        result.modelVersion,
    },
    modelVersion:
      result.modelVersion,
  };
}

export function explainGenericChart(
  kind: 'bazi' | 'ziwei',
  payload:
    GenericChartExplanationPayload,
): ExplainableResult {
  const factors:
    ExplanationFactor[] =
      payload.factors.map(
        item => ({
          code:
            item.code,
          labelKey:
            item.label,
          descriptionKey:
            item.description ??
            'explainable.common.genericFactorDescription',
          score:
            item.score,
          rawValue:
            item.rawValue,
        }),
      );

  const scored =
    factors.filter(
      item =>
        typeof item.score ===
        'number',
    );

  const overallScore =
    scored.length > 0
      ? clamp(
          scored.reduce(
            (sum, item) =>
              sum +
              (
                item.score ??
                0
              ),
            0,
          ) /
            scored.length,
        )
      : undefined;

  return {
    kind,
    titleKey:
      kind === 'bazi'
        ? 'explainable.bazi.title'
        : 'explainable.ziwei.title',
    summaryKey:
      overallScore ===
      undefined
        ? 'explainable.common.genericSummary'
        : `explainable.tones.${toneFromScore(
            overallScore,
          )}.summary`,
    methodologyKey:
      kind === 'bazi'
        ? 'explainable.bazi.methodology'
        : 'explainable.ziwei.methodology',
    limitationsKey:
      'explainable.common.limitations',
    overallScore,
    tone:
      overallScore ===
      undefined
        ? 'balanced'
        : toneFromScore(
            overallScore,
          ),
    factors,
    rawData:
      payload.rawData ??
      {},
    modelVersion:
      payload.modelVersion ??
      `${kind}-explanation-v1`,
  };
}
