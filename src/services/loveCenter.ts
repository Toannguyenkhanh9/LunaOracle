import {
  buildBirthChart,
  getZodiacSymbol,
  type BirthChartResult,
} from './astroBirthChart';

import {
  getActiveBirthProfile,
  listBirthProfiles,
  type BirthProfile,
} from './birthProfiles';

import {
  buildProfileCompatibility,
} from './profileCompatibility';

export type LoveCenterResult = {
  activeProfile?: BirthProfile;
  activeChart?: BirthChartResult;
  partnerProfiles: BirthProfile[];
  loveScore: number;
  dailyThemeId: string;
  venusSign?: string;
  marsSign?: string;
  moonSign?: string;
  partnerPreview?: {
    partner: BirthProfile;
    score: number;
  };
};

const THEME_IDS = [
  'honestConversation',
  'gentleBoundaries',
  'receiveCare',
  'romanticPlay',
  'slowTrust',
  'selfWorth',
  'repair',
] as const;

function dayIndex(): number {
  const now =
    new Date();

  const start =
    new Date(
      now.getFullYear(),
      0,
      0,
    );

  return Math.floor(
    (
      now.getTime() -
      start.getTime()
    ) /
      86400000,
  );
}

function clampScore(
  value: number,
): number {
  return Math.max(
    20,
    Math.min(
      96,
      Math.round(value),
    ),
  );
}

function signLoveBonus(
  sign?: string,
): number {
  switch (sign) {
    case 'taurus':
    case 'libra':
    case 'pisces':
    case 'cancer':
      return 8;

    case 'aries':
    case 'leo':
    case 'sagittarius':
      return 6;

    case 'gemini':
    case 'aquarius':
      return 4;

    default:
      return 2;
  }
}

export async function buildLoveCenter():
Promise<LoveCenterResult> {
  const [
    activeProfile,
    profileState,
  ] =
    await Promise.all([
      getActiveBirthProfile(),
      listBirthProfiles(),
    ]);

  const partnerProfiles =
    activeProfile
      ? profileState.profiles.filter(
          item =>
            item.id !==
            activeProfile.id,
        )
      : profileState.profiles;

  if (!activeProfile) {
    return {
      partnerProfiles,
      loveScore: 50,
      dailyThemeId:
        THEME_IDS[
          dayIndex() %
            THEME_IDS.length
        ],
    };
  }

  const activeChart =
    buildBirthChart(
      activeProfile.input,
    );

  const venusSign =
    activeChart.points.venus.sign;

  const marsSign =
    activeChart.points.mars.sign;

  const moonSign =
    activeChart.points.moon.sign;

  const baseScore =
    56 +
    signLoveBonus(venusSign) +
    signLoveBonus(moonSign) /
      2;

  const partnerPreview =
    partnerProfiles[0]
      ? {
          partner:
            partnerProfiles[0],
          score:
            buildProfileCompatibility(
              activeProfile,
              partnerProfiles[0],
            ).loveScore,
        }
      : undefined;

  return {
    activeProfile,
    activeChart,
    partnerProfiles,
    loveScore:
      clampScore(baseScore),
    dailyThemeId:
      THEME_IDS[
        dayIndex() %
          THEME_IDS.length
      ],
    venusSign,
    marsSign,
    moonSign,
    partnerPreview,
  };
}

export function formatLoveSignature(
  result: LoveCenterResult,
): string {
  const parts =
    [
      result.venusSign
        ? `${getZodiacSymbol(result.venusSign)} Venus`
        : undefined,
      result.marsSign
        ? `${getZodiacSymbol(result.marsSign)} Mars`
        : undefined,
      result.moonSign
        ? `${getZodiacSymbol(result.moonSign)} Moon`
        : undefined,
    ].filter(Boolean);

  return parts.join(' • ');
}
