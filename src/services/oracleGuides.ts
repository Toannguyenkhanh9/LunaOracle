import AsyncStorage
  from '@react-native-async-storage/async-storage';

import {
  spendMoonDust,
} from './moonDustRewards';

import {
  recordRetentionActivity,
} from './retentionProgress';

const STORAGE_KEY =
  '@luna_oracle/oracle_guides_v1';

export type OracleGuideId =
  | 'lunaGuide'
  | 'moonPriestess'
  | 'loveOracle'
  | 'shadowGuide'
  | 'careerOracle'
  | 'dreamOracle';

export type OracleGuide = {
  id: OracleGuideId;
  titleKey: string;
  titleFallback: string;
  descriptionKey: string;
  descriptionFallback: string;
  toneKey: string;
  toneFallback: string;
  cost: number;
  icon: string;
  color: string;
  accent: string;
};

export type OracleGuideState = {
  unlockedGuideIds: OracleGuideId[];
  activeGuideId: OracleGuideId;
};

const DEFAULT_STATE:
OracleGuideState = {
  unlockedGuideIds: [
    'lunaGuide',
  ],
  activeGuideId:
    'lunaGuide',
};

export const ORACLE_GUIDES:
OracleGuide[] = [
  {
    id: 'lunaGuide',
    titleKey:
      'oracleGuides.items.lunaGuide.title',
    titleFallback:
      'Luna Guide',
    descriptionKey:
      'oracleGuides.items.lunaGuide.description',
    descriptionFallback:
      'A gentle daily guide for calm reflection.',
    toneKey:
      'oracleGuides.items.lunaGuide.tone',
    toneFallback:
      'Soft, balanced, reassuring',
    cost: 0,
    icon: '☾',
    color: '#1B1537',
    accent: '#D9B76E',
  },
  {
    id: 'moonPriestess',
    titleKey:
      'oracleGuides.items.moonPriestess.title',
    titleFallback:
      'Moon Priestess',
    descriptionKey:
      'oracleGuides.items.moonPriestess.description',
    descriptionFallback:
      'A deeper lunar voice for ritual and intuition.',
    toneKey:
      'oracleGuides.items.moonPriestess.tone',
    toneFallback:
      'Mystical, slow, intuitive',
    cost: 120,
    icon: '☽',
    color: '#08071A',
    accent: '#9A8CFF',
  },
  {
    id: 'loveOracle',
    titleKey:
      'oracleGuides.items.loveOracle.title',
    titleFallback:
      'Love Oracle',
    descriptionKey:
      'oracleGuides.items.loveOracle.description',
    descriptionFallback:
      'A romantic but grounded guide for relationships.',
    toneKey:
      'oracleGuides.items.loveOracle.tone',
    toneFallback:
      'Warm, honest, heart-centered',
    cost: 140,
    icon: '♡',
    color: '#351529',
    accent: '#E8A5C3',
  },
  {
    id: 'shadowGuide',
    titleKey:
      'oracleGuides.items.shadowGuide.title',
    titleFallback:
      'Shadow Guide',
    descriptionKey:
      'oracleGuides.items.shadowGuide.description',
    descriptionFallback:
      'A direct guide for shadow work and inner truth.',
    toneKey:
      'oracleGuides.items.shadowGuide.tone',
    toneFallback:
      'Deep, clear, courageous',
    cost: 180,
    icon: '◆',
    color: '#111111',
    accent: '#C5B3FF',
  },
  {
    id: 'careerOracle',
    titleKey:
      'oracleGuides.items.careerOracle.title',
    titleFallback:
      'Career Oracle',
    descriptionKey:
      'oracleGuides.items.careerOracle.description',
    descriptionFallback:
      'A practical guide for work, focus, and decisions.',
    toneKey:
      'oracleGuides.items.careerOracle.tone',
    toneFallback:
      'Practical, structured, focused',
    cost: 160,
    icon: '♃',
    color: '#2B1D12',
    accent: '#E7BE5B',
  },
  {
    id: 'dreamOracle',
    titleKey:
      'oracleGuides.items.dreamOracle.title',
    titleFallback:
      'Dream Oracle',
    descriptionKey:
      'oracleGuides.items.dreamOracle.description',
    descriptionFallback:
      'A symbolic guide for dreams and hidden messages.',
    toneKey:
      'oracleGuides.items.dreamOracle.tone',
    toneFallback:
      'Symbolic, imaginative, subtle',
    cost: 150,
    icon: '✧',
    color: '#18263A',
    accent: '#9DD5FF',
  },
];

async function readState():
Promise<OracleGuideState> {
  const raw =
    await AsyncStorage.getItem(
      STORAGE_KEY,
    );

  if (!raw) {
    return DEFAULT_STATE;
  }

  try {
    const parsed =
      JSON.parse(raw);

    return {
      ...DEFAULT_STATE,
      ...parsed,
      unlockedGuideIds:
        Array.isArray(
          parsed.unlockedGuideIds,
        )
          ? parsed.unlockedGuideIds
          : DEFAULT_STATE.unlockedGuideIds,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

async function writeState(
  state: OracleGuideState,
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state),
  );
}

export async function getOracleGuideState():
Promise<OracleGuideState> {
  return readState();
}

export function getOracleGuide(
  id?: OracleGuideId,
): OracleGuide {
  return (
    ORACLE_GUIDES.find(
      item => item.id === id,
    ) ?? ORACLE_GUIDES[0]
  );
}

export async function unlockOracleGuide(
  guideId: OracleGuideId,
): Promise<{
  success: boolean;
  reason?: 'missing' | 'notEnoughMoonDust';
  state: OracleGuideState;
}> {
  const guide =
    ORACLE_GUIDES.find(
      item => item.id === guideId,
    );

  const state =
    await readState();

  if (!guide) {
    return {
      success: false,
      reason: 'missing',
      state,
    };
  }

  if (
    state.unlockedGuideIds.includes(
      guideId,
    )
  ) {
    return {
      success: true,
      state,
    };
  }

  const paid =
    guide.cost > 0
      ? await spendMoonDust(
          guide.cost,
        )
      : state;

  if (!paid) {
    return {
      success: false,
      reason: 'notEnoughMoonDust',
      state,
    };
  }

  const nextState:
    OracleGuideState = {
      ...state,
      unlockedGuideIds:
        Array.from(
          new Set([
            ...state.unlockedGuideIds,
            guideId,
          ]),
        ),
  };

  await writeState(nextState);
  await recordRetentionActivity(
    'oracleGuide',
  );

  return {
    success: true,
    state:
      nextState,
  };
}

export async function equipOracleGuide(
  guideId: OracleGuideId,
): Promise<OracleGuideState | undefined> {
  const state =
    await readState();

  if (
    !state.unlockedGuideIds.includes(
      guideId,
    )
  ) {
    return undefined;
  }

  const nextState = {
    ...state,
    activeGuideId:
      guideId,
  };

  await writeState(nextState);
  await recordRetentionActivity(
    'oracleGuide',
  );

  return nextState;
}

export async function getActiveOracleGuide():
Promise<OracleGuide> {
  const state =
    await readState();

  return getOracleGuide(
    state.activeGuideId,
  );
}
