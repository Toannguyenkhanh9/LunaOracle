import AsyncStorage
  from '@react-native-async-storage/async-storage';

import {
  getTodayInsight,
  type TodayActivityCode,
  type TodayHourPeriod,
  type TodayObservance,
  type TodayProfileRelation,
  type TodayRating,
} from './todayInsight';

import type {
  UserProfile,
} from './userProfiles';

export type DailyBriefTone =
  | 'favorable'
  | 'balanced'
  | 'reflective';

export type DailyBrief = {
  date: Date;
  dateKey: string;
  generatedAt: string;

  profileId?: string;
  profileName?: string;

  lunarDay: number;
  lunarMonth: number;
  lunarYear: number;
  dayCanChiRaw: string;
  element: string;

  rating: TodayRating;
  tone: DailyBriefTone;

  profileRelation?:
    TodayProfileRelation;

  suitable:
    TodayActivityCode[];
  cautions:
    TodayActivityCode[];

  topHours:
    TodayHourPeriod[];

  nextObservance:
    TodayObservance | null;

  reflectionIndex: number;

  headlineCode: string;
  focusCode: string;
  cautionCode: string;
};

const PROFILE_KEY =
  '@eastern_destiny/daily_brief_profile_v1';

function pad2(
  value: number,
): string {
  return String(value)
    .padStart(2, '0');
}

function dateKey(
  value: Date,
): string {
  return [
    value.getFullYear(),
    pad2(
      value.getMonth() + 1,
    ),
    pad2(
      value.getDate(),
    ),
  ].join('-');
}

function toneFromRating(
  rating: TodayRating,
): DailyBriefTone {
  if (
    rating === 'auspicious'
  ) {
    return 'favorable';
  }

  if (
    rating === 'caution'
  ) {
    return 'reflective';
  }

  return 'balanced';
}

function headlineCode(
  rating: TodayRating,
  relation?:
    TodayProfileRelation,
): string {
  if (
    relation === 'clash'
  ) {
    return 'slowDown';
  }

  if (
    relation ===
      'sixHarmony' ||
    relation ===
      'threeHarmony'
  ) {
    return 'connection';
  }

  if (
    rating === 'auspicious'
  ) {
    return 'steadyMomentum';
  }

  if (
    rating === 'caution'
  ) {
    return 'carefulReview';
  }

  return 'balancedDay';
}

function focusCode(
  suitable:
    TodayActivityCode[],
): string {
  if (
    suitable.includes(
      'signing',
    )
  ) {
    return 'clearAgreements';
  }

  if (
    suitable.includes(
      'study',
    )
  ) {
    return 'learning';
  }

  if (
    suitable.includes(
      'cleaning',
    )
  ) {
    return 'organize';
  }

  if (
    suitable.includes(
      'travel',
    )
  ) {
    return 'movement';
  }

  if (
    suitable.includes(
      'worship',
    )
  ) {
    return 'reflection';
  }

  return 'onePriority';
}

function cautionCode(
  cautions:
    TodayActivityCode[],
  relation?:
    TodayProfileRelation,
): string {
  if (
    relation === 'clash'
  ) {
    return 'avoidRushing';
  }

  if (
    cautions.includes(
      'majorDecision',
    )
  ) {
    return 'majorDecision';
  }

  if (
    cautions.includes(
      'overcommitment',
    )
  ) {
    return 'overcommitment';
  }

  return 'checkEnergy';
}

export function buildDailyBrief(
  profile: UserProfile | null,
  inputDate = new Date(),
): DailyBrief {
  const insight =
    getTodayInsight(
      inputDate,
      profile,
    );

  const relation =
    insight.profileInsight
      ?.relation;

  return {
    date:
      insight.solarDate,
    dateKey:
      dateKey(
        insight.solarDate,
      ),
    generatedAt:
      new Date().toISOString(),

    profileId:
      profile?.id,
    profileName:
      profile?.displayName,

    lunarDay:
      insight.lunarDay,
    lunarMonth:
      insight.lunarMonth,
    lunarYear:
      insight.lunarYear,
    dayCanChiRaw:
      insight.dayCanChiRaw,
    element:
      insight.element,

    rating:
      insight.rating,
    tone:
      toneFromRating(
        insight.rating,
      ),

    profileRelation:
      relation,

    suitable:
      insight.suitable.slice(
        0,
        3,
      ),
    cautions:
      insight.cautions.slice(
        0,
        2,
      ),

    topHours:
      insight.auspiciousHours.slice(
        0,
        3,
      ),

    nextObservance:
      insight.nextObservance,

    reflectionIndex:
      insight.reflectionIndex,

    headlineCode:
      headlineCode(
        insight.rating,
        relation,
      ),
    focusCode:
      focusCode(
        insight.suitable,
      ),
    cautionCode:
      cautionCode(
        insight.cautions,
        relation,
      ),
  };
}

export async function getDailyBriefProfileId(): Promise<
  string | null
> {
  try {
    return (
      await AsyncStorage.getItem(
        PROFILE_KEY,
      )
    );
  } catch {
    return null;
  }
}

export async function setDailyBriefProfileId(
  profileId: string | null,
): Promise<void> {
  if (profileId) {
    await AsyncStorage.setItem(
      PROFILE_KEY,
      profileId,
    );
    return;
  }

  await AsyncStorage.removeItem(
    PROFILE_KEY,
  );
}
