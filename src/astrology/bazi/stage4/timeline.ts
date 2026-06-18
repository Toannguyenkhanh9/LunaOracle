import type {
  AnnualTransitDetailed,
  BaziChart,
  CalendarProvider,
  LuckPillar,
  MonthlyTransitDetailed,
  Pillar,
  Stage4TimelineOptions,
  TransitTimeline,
} from '../types';
import {createPillar} from '../core/pillars';
import {analyzeExternalPillarRelations} from '../core/relations';
import {scoreTransitPillar} from './scoring';

function clampInteger(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, Math.trunc(value)));
}

function findActiveLuckPillar(
  chart: BaziChart,
  year: number,
): LuckPillar | null {
  return (
    chart.luckPillars.find(
      item =>
        year >= item.approximateStartYear &&
        year <= item.approximateEndYear,
    ) ?? null
  );
}

function ageInYear(chart: BaziChart, year: number): number {
  return Math.max(0, year - chart.input.localDateTime.year);
}

function createYearPillar(
  provider: CalendarProvider,
  chart: BaziChart,
  year: number,
): Pillar {
  const calendar = provider.calculate(
    {
      year,
      month: 7,
      day: 1,
      hour: 12,
      minute: 0,
      second: 0,
    },
    'midnight',
  );

  return createPillar(
    'transit',
    calendar.yearStemIndex,
    calendar.yearBranchIndex,
    chart.pillars.day.stem,
  );
}

function createMonthPillar(
  provider: CalendarProvider,
  chart: BaziChart,
  year: number,
  month: number,
): Pillar {
  // Day 15 at noon is chosen to stay away from most solar-term boundaries.
  const calendar = provider.calculate(
    {
      year,
      month,
      day: 15,
      hour: 12,
      minute: 0,
      second: 0,
    },
    'midnight',
  );

  return createPillar(
    'transit',
    calendar.monthStemIndex,
    calendar.monthBranchIndex,
    chart.pillars.day.stem,
  );
}

function headlineCodes(
  scores: AnnualTransitDetailed['domainScores'],
): string[] {
  const ordered = Object.entries(scores)
    .sort((first, second) => second[1].score - first[1].score)
    .filter(([domain]) => domain !== 'overall');

  const strongest = ordered[0];
  const weakest = ordered[ordered.length - 1];

  const codes = [
    `stage4.timeline.strongest.${strongest[0]}`,
    `stage4.timeline.weakest.${weakest[0]}`,
  ];

  if (scores.overall.level === 'strong' || scores.overall.level === 'favorable') {
    codes.push('stage4.timeline.overallFavorable');
  } else if (
    scores.overall.level === 'challenging' ||
    scores.overall.level === 'cautious'
  ) {
    codes.push('stage4.timeline.overallCaution');
  } else {
    codes.push('stage4.timeline.overallMixed');
  }

  return codes;
}

function buildAnnual(
  provider: CalendarProvider,
  chart: BaziChart,
  year: number,
): AnnualTransitDetailed {
  const pillar = createYearPillar(provider, chart, year);
  const relationsToNatal = analyzeExternalPillarRelations(
    pillar,
    'transit',
    chart.pillars,
  );
  const activeLuck = findActiveLuckPillar(chart, year);
  const relationsToLuck = activeLuck
    ? analyzeExternalPillarRelations(
        pillar,
        'transit',
        {
          ...chart.pillars,
          month: activeLuck.pillar,
        },
      ).filter(relation =>
        relation.participants.some(item => item.pillar === 'month'),
      )
    : [];

  const domainScores = scoreTransitPillar(
    chart,
    pillar,
    [...relationsToNatal, ...relationsToLuck],
  );

  return {
    year,
    age: ageInYear(chart, year),
    pillar,
    activeLuckPillarIndex: activeLuck?.index ?? null,
    activeLuckPillar: activeLuck?.pillar ?? null,
    relationsToNatal,
    relationsToLuck,
    domainScores,
    headlineCodes: headlineCodes(domainScores),
    warningCodes:
      domainScores.overall.level === 'challenging'
        ? ['stage4.timeline.reviewMajorDecisions']
        : [],
  };
}

function buildMonthly(
  provider: CalendarProvider,
  chart: BaziChart,
  year: number,
  month: number,
  annual: AnnualTransitDetailed,
): MonthlyTransitDetailed {
  const pillar = createMonthPillar(provider, chart, year, month);
  const relationsToNatal = analyzeExternalPillarRelations(
    pillar,
    'transit',
    chart.pillars,
  );
  const relationsToAnnual = analyzeExternalPillarRelations(
    pillar,
    'transit',
    {
      ...chart.pillars,
      year: annual.pillar,
    },
  ).filter(relation =>
    relation.participants.some(item => item.pillar === 'year'),
  );

  const domainScores = scoreTransitPillar(
    chart,
    pillar,
    [...relationsToNatal, ...relationsToAnnual],
  );

  return {
    year,
    month,
    pillar,
    annualPillar: annual.pillar,
    relationsToNatal,
    relationsToAnnual,
    domainScores,
    headlineCodes: headlineCodes(domainScores),
  };
}

export function buildTransitTimeline(
  provider: CalendarProvider,
  chart: BaziChart,
  options: Stage4TimelineOptions,
): TransitTimeline {
  const startYear = clampInteger(
    options.startYear,
    1600,
    2400,
  );
  const years = clampInteger(options.years, 1, 30);
  const includeMonthly = Boolean(options.includeMonthly);
  const monthlyYears = new Set(
    (options.monthlyYears ?? []).map(item =>
      clampInteger(item, startYear, startYear + years - 1),
    ),
  );

  if (includeMonthly && monthlyYears.size === 0) {
    monthlyYears.add(startYear);
  }

  const annual: AnnualTransitDetailed[] = [];
  const monthlyByYear: Record<string, MonthlyTransitDetailed[]> = {};

  for (let year = startYear; year < startYear + years; year += 1) {
    const annualItem = buildAnnual(provider, chart, year);
    annual.push(annualItem);

    if (includeMonthly && monthlyYears.has(year)) {
      monthlyByYear[String(year)] = Array.from(
        {length: 12},
        (_, index) =>
          buildMonthly(
            provider,
            chart,
            year,
            index + 1,
            annualItem,
          ),
      );
    }
  }

  const sorted = [...annual].sort(
    (first, second) =>
      second.domainScores.overall.score -
      first.domainScores.overall.score,
  );

  return {
    startYear,
    endYear: startYear + years - 1,
    annual,
    monthlyByYear,
    peakYears: sorted.slice(0, Math.min(3, sorted.length)).map(item => item.year),
    cautionYears: sorted
      .slice(Math.max(0, sorted.length - 3))
      .reverse()
      .map(item => item.year),
    disclaimerCodes: [
      'stage4.timeline.referenceOnly',
      'stage4.timeline.monthBoundaryApproximation',
    ],
  };
}
