import {
  SIX_CLASH_PAIRS,
  SIX_HARMONY_PAIRS,
  THREE_HARMONY_GROUPS,
} from '../constants';
import {createPillar} from '../core/pillars';
import {analyzeExternalPillarRelations} from '../core/relations';
import type {
  BaziChart,
  BranchId,
  CalendarProvider,
  DateSelectionActivity,
  DateSelectionRequest,
  Element,
  Pillar,
  RecommendedDate,
  RelationType,
  TransitDomain,
} from '../types';
import {clamp, round} from '../utils/math';
import {scoreTransitPillar} from './scoring';

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

function parseIsoDate(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    throw new Error('INVALID_STAGE4_DATE');
  }

  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    12,
    0,
    0,
    0,
  );

  if (
    date.getFullYear() !== Number(match[1]) ||
    date.getMonth() !== Number(match[2]) - 1 ||
    date.getDate() !== Number(match[3])
  ) {
    throw new Error('INVALID_STAGE4_DATE');
  }

  return date;
}

function isoDate(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function createDayPillar(
  provider: CalendarProvider,
  chart: BaziChart,
  date: Date,
): Pillar {
  const calendar = provider.calculate(
    {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: 12,
      minute: 0,
      second: 0,
    },
    'midnight',
  );

  return createPillar(
    'transit',
    calendar.dayStemIndex,
    calendar.dayBranchIndex,
    chart.pillars.day.stem,
  );
}

function activityDomain(activity: DateSelectionActivity): TransitDomain {
  if (activity === 'wedding') return 'love';
  if (activity === 'opening' || activity === 'signing') return 'wealth';
  if (activity === 'construction' || activity === 'moving') return 'career';
  return 'overall';
}

function relationDelta(type: RelationType): number {
  switch (type) {
    case 'sixHarmony':
      return 9;
    case 'threeHarmony':
      return 10;
    case 'threeMeeting':
      return 7;
    case 'stemCombination':
      return 4;
    case 'sixClash':
      return -12;
    case 'harm':
      return -7;
    case 'punishment':
    case 'selfPunishment':
      return -8;
    case 'break':
      return -5;
    case 'stemClash':
      return -4;
    default:
      return 0;
  }
}

function partnerCompatibilityDelta(
  dayBranch: BranchId,
  partner: BaziChart,
): number {
  const partnerDay = partner.pillars.day.branch.id;

  if (
    SIX_HARMONY_PAIRS.some(pair =>
      pairMatches(dayBranch, partnerDay, [pair[0], pair[1]]),
    )
  ) {
    return 10;
  }

  if (
    THREE_HARMONY_GROUPS.some(group =>
      group.branches.includes(dayBranch) &&
      group.branches.includes(partnerDay),
    )
  ) {
    return 7;
  }

  if (
    SIX_CLASH_PAIRS.some(pair =>
      pairMatches(dayBranch, partnerDay, pair),
    )
  ) {
    return -13;
  }

  return 0;
}

function activityAdjustment(
  activity: DateSelectionActivity,
  pillar: Pillar,
): {
  score: number;
  reasonCodes: string[];
  warningCodes: string[];
} {
  let score = 0;
  const reasonCodes: string[] = [];
  const warningCodes: string[] = [];

  const tenGod = pillar.stemTenGod;

  if (activity === 'wedding') {
    if (
      tenGod === 'directWealth' ||
      tenGod === 'indirectWealth' ||
      tenGod === 'directOfficer' ||
      tenGod === 'sevenKillings'
    ) {
      score += 8;
      reasonCodes.push('stage4.date.activityWeddingStar');
    }
  }

  if (activity === 'opening' || activity === 'signing') {
    if (tenGod === 'directWealth' || tenGod === 'indirectWealth') {
      score += 10;
      reasonCodes.push('stage4.date.activityWealthStar');
    }

    if (tenGod === 'eatingGod' || tenGod === 'hurtingOfficer') {
      score += 5;
      reasonCodes.push('stage4.date.activityOutputStar');
    }
  }

  if (activity === 'construction' || activity === 'moving') {
    if (pillar.branch.primaryElement === 'earth') {
      score += 6;
      reasonCodes.push('stage4.date.activityEarthSupport');
    }
  }

  if (activity === 'travel') {
    if (
      pillar.stemTenGod === 'eatingGod' ||
      pillar.stemTenGod === 'indirectResource'
    ) {
      score += 5;
      reasonCodes.push('stage4.date.activityMovementSupport');
    }
  }

  if (pillar.stemTenGod === 'robWealth') {
    score -= 6;
    warningCodes.push('stage4.date.robWealthCaution');
  }

  return {score, reasonCodes, warningCodes};
}

export function selectAuspiciousDates(
  provider: CalendarProvider,
  primary: BaziChart,
  request: DateSelectionRequest,
  partner?: BaziChart,
): RecommendedDate[] {
  const start = parseIsoDate(request.startDate);
  const end = parseIsoDate(request.endDate);

  if (end.getTime() < start.getTime()) {
    throw new Error('INVALID_STAGE4_DATE_RANGE');
  }

  const days =
    Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;

  if (days > 550) {
    throw new Error('STAGE4_DATE_RANGE_TOO_LARGE');
  }

  const limit = Math.max(1, Math.min(30, Math.trunc(request.limit ?? 12)));
  const domain = activityDomain(request.activity);
  const results: RecommendedDate[] = [];

  const cursor = new Date(start);

  while (cursor.getTime() <= end.getTime()) {
    const pillar = createDayPillar(provider, primary, cursor);
    const relationsToPrimary = analyzeExternalPillarRelations(
      pillar,
      'transit',
      primary.pillars,
    );
    const primaryScores = scoreTransitPillar(
      primary,
      pillar,
      relationsToPrimary,
    );

    let score =
      primaryScores.overall.score * 0.45 +
      primaryScores[domain].score * 0.55;

    const reasonCodes = [
      ...primaryScores[domain].factorCodes.slice(0, 6),
    ];
    const warningCodes: string[] = [];

    for (const relation of relationsToPrimary) {
      const delta = relationDelta(relation.type);
      score += delta * 0.35;

      if (delta > 0) {
        reasonCodes.push(`stage4.date.relation.${relation.type}`);
      } else if (delta < 0) {
        warningCodes.push(`stage4.date.relation.${relation.type}`);
      }
    }

    const activity = activityAdjustment(request.activity, pillar);
    score += activity.score;
    reasonCodes.push(...activity.reasonCodes);
    warningCodes.push(...activity.warningCodes);

    let partnerScore: number | null = null;

    if (partner) {
      const partnerRelations = analyzeExternalPillarRelations(
        pillar,
        'transit',
        partner.pillars,
      );
      const partnerScores = scoreTransitPillar(
        partner,
        pillar,
        partnerRelations,
      );
      partnerScore =
        partnerScores.overall.score * 0.45 +
        partnerScores[domain].score * 0.55;

      score = score * 0.58 + partnerScore * 0.42;
      score += partnerCompatibilityDelta(
        pillar.branch.id,
        partner,
      );

      reasonCodes.push('stage4.date.partnerIncluded');
    }

    const normalized = round(clamp(score, 5, 95), 1);

    results.push({
      date: isoDate(cursor),
      pillar,
      score: normalized,
      level:
        normalized >= 78
          ? 'strong'
          : normalized >= 64
            ? 'favorable'
            : normalized >= 48
              ? 'mixed'
              : normalized >= 34
                ? 'cautious'
                : 'challenging',
      activity: request.activity,
      primaryScore: round(
        primaryScores.overall.score * 0.45 +
          primaryScores[domain].score * 0.55,
        1,
      ),
      partnerScore:
        partnerScore === null ? null : round(partnerScore, 1),
      reasonCodes: Array.from(new Set(reasonCodes)),
      warningCodes: Array.from(new Set(warningCodes)),
      disclaimerCodes: [
        'stage4.date.baziStructuralReferenceOnly',
        'stage4.date.notTraditionalAlmanacReplacement',
      ],
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  return results
    .sort((first, second) => {
      if (second.score !== first.score) {
        return second.score - first.score;
      }

      return first.date.localeCompare(second.date);
    })
    .slice(0, limit);
}
