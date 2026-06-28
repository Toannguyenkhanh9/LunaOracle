import AsyncStorage
  from '@react-native-async-storage/async-storage';

import {
  spendMoonDust,
  unlockMoonDustReward,
} from './moonDustRewards';

export type OracleShopItemType =
  | 'theme'
  | 'cardBack';

export type OracleThemeId =
  | 'purpleMystic'
  | 'goldenMoon'
  | 'loveRose'
  | 'darkGalaxy'
  | 'classicTarot';

export type OracleCardBackId =
  | 'lunaDefault'
  | 'goldenMoon'
  | 'roseOracle'
  | 'darkGalaxy'
  | 'classicRune';

export type OracleShopItem = {
  id: OracleThemeId | OracleCardBackId;
  type: OracleShopItemType;
  titleKey: string;
  titleFallback: string;
  descriptionKey: string;
  descriptionFallback: string;
  cost: number;
  premium?: boolean;
  colors: {
    background: string;
    accent: string;
    text: string;
  };
};

export type OracleShopState = {
  unlockedThemeIds: OracleThemeId[];
  unlockedCardBackIds: OracleCardBackId[];
  activeThemeId: OracleThemeId;
  activeCardBackId: OracleCardBackId;
};

const STORAGE_KEY =
  '@luna_oracle/oracle_shop_v1';

export const ORACLE_THEME_ITEMS:
OracleShopItem[] = [
  {
    id: 'purpleMystic',
    type: 'theme',
    titleKey:
      'oracleShop.items.purpleMystic.title',
    titleFallback:
      'Purple Mystic',
    descriptionKey:
      'oracleShop.items.purpleMystic.description',
    descriptionFallback:
      'The classic Luna Oracle purple theme.',
    cost: 0,
    colors: {
      background: '#1B1537',
      accent: '#D9B76E',
      text: '#FFF8EA',
    },
  },
  {
    id: 'goldenMoon',
    type: 'theme',
    titleKey:
      'oracleShop.items.goldenMoon.title',
    titleFallback:
      'Golden Moon',
    descriptionKey:
      'oracleShop.items.goldenMoon.description',
    descriptionFallback:
      'A warm golden theme for daily rituals.',
    cost: 80,
    colors: {
      background: '#2B1D12',
      accent: '#E7BE5B',
      text: '#FFF4D6',
    },
  },
  {
    id: 'loveRose',
    type: 'theme',
    titleKey:
      'oracleShop.items.loveRose.title',
    titleFallback:
      'Love Rose',
    descriptionKey:
      'oracleShop.items.loveRose.description',
    descriptionFallback:
      'A soft romantic theme for love readings.',
    cost: 120,
    colors: {
      background: '#351529',
      accent: '#E8A5C3',
      text: '#FFF4FA',
    },
  },
  {
    id: 'darkGalaxy',
    type: 'theme',
    titleKey:
      'oracleShop.items.darkGalaxy.title',
    titleFallback:
      'Dark Galaxy',
    descriptionKey:
      'oracleShop.items.darkGalaxy.description',
    descriptionFallback:
      'A deep night sky theme for advanced readings.',
    cost: 160,
    colors: {
      background: '#08071A',
      accent: '#9A8CFF',
      text: '#F2EFFF',
    },
  },
  {
    id: 'classicTarot',
    type: 'theme',
    titleKey:
      'oracleShop.items.classicTarot.title',
    titleFallback:
      'Classic Tarot',
    descriptionKey:
      'oracleShop.items.classicTarot.description',
    descriptionFallback:
      'A parchment-inspired theme for traditional tarot.',
    cost: 180,
    premium: true,
    colors: {
      background: '#3A271D',
      accent: '#C69A4B',
      text: '#FFF0D0',
    },
  },
];

export const ORACLE_CARD_BACK_ITEMS:
OracleShopItem[] = [
  {
    id: 'lunaDefault',
    type: 'cardBack',
    titleKey:
      'oracleShop.items.lunaDefault.title',
    titleFallback:
      'Luna Default',
    descriptionKey:
      'oracleShop.items.lunaDefault.description',
    descriptionFallback:
      'The default moon and star tarot back.',
    cost: 0,
    colors: {
      background: '#1B1537',
      accent: '#D9B76E',
      text: '#FFF8EA',
    },
  },
  {
    id: 'goldenMoon',
    type: 'cardBack',
    titleKey:
      'oracleShop.items.cardBackGoldenMoon.title',
    titleFallback:
      'Golden Moon',
    descriptionKey:
      'oracleShop.items.cardBackGoldenMoon.description',
    descriptionFallback:
      'Gold constellation lines over a warm moon.',
    cost: 60,
    colors: {
      background: '#2B1D12',
      accent: '#E7BE5B',
      text: '#FFF4D6',
    },
  },
  {
    id: 'roseOracle',
    type: 'cardBack',
    titleKey:
      'oracleShop.items.roseOracle.title',
    titleFallback:
      'Rose Oracle',
    descriptionKey:
      'oracleShop.items.roseOracle.description',
    descriptionFallback:
      'A gentle rose back for love and healing spreads.',
    cost: 90,
    colors: {
      background: '#351529',
      accent: '#E8A5C3',
      text: '#FFF4FA',
    },
  },
  {
    id: 'darkGalaxy',
    type: 'cardBack',
    titleKey:
      'oracleShop.items.cardBackDarkGalaxy.title',
    titleFallback:
      'Dark Galaxy',
    descriptionKey:
      'oracleShop.items.cardBackDarkGalaxy.description',
    descriptionFallback:
      'A cosmic card back for deep readings.',
    cost: 130,
    colors: {
      background: '#08071A',
      accent: '#9A8CFF',
      text: '#F2EFFF',
    },
  },
  {
    id: 'classicRune',
    type: 'cardBack',
    titleKey:
      'oracleShop.items.classicRune.title',
    titleFallback:
      'Classic Rune',
    descriptionKey:
      'oracleShop.items.classicRune.description',
    descriptionFallback:
      'A traditional rune-inspired card back.',
    cost: 160,
    premium: true,
    colors: {
      background: '#3A271D',
      accent: '#C69A4B',
      text: '#FFF0D0',
    },
  },
];

const DEFAULT_STATE:
OracleShopState = {
  unlockedThemeIds: [
    'purpleMystic',
  ],
  unlockedCardBackIds: [
    'lunaDefault',
  ],
  activeThemeId:
    'purpleMystic',
  activeCardBackId:
    'lunaDefault',
};

async function readState():
Promise<OracleShopState> {
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
      unlockedThemeIds:
        Array.isArray(
          parsed.unlockedThemeIds,
        )
          ? parsed.unlockedThemeIds
          : DEFAULT_STATE.unlockedThemeIds,
      unlockedCardBackIds:
        Array.isArray(
          parsed.unlockedCardBackIds,
        )
          ? parsed.unlockedCardBackIds
          : DEFAULT_STATE.unlockedCardBackIds,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

async function writeState(
  state: OracleShopState,
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state),
  );
}

function getItem(
  type: OracleShopItemType,
  id: string,
): OracleShopItem | undefined {
  const items =
    type === 'theme'
      ? ORACLE_THEME_ITEMS
      : ORACLE_CARD_BACK_ITEMS;

  return items.find(
    item => item.id === id,
  );
}

export async function getOracleShopState():
Promise<OracleShopState> {
  return readState();
}

export async function purchaseOracleShopItem(
  type: OracleShopItemType,
  id: string,
): Promise<{
  success: boolean;
  reason?: 'missing' | 'notEnoughMoonDust';
  state: OracleShopState;
}> {
  const item =
    getItem(type, id);

  const state =
    await readState();

  if (!item) {
    return {
      success: false,
      reason: 'missing',
      state,
    };
  }

  const alreadyUnlocked =
    type === 'theme'
      ? state.unlockedThemeIds.includes(
          id as OracleThemeId,
        )
      : state.unlockedCardBackIds.includes(
          id as OracleCardBackId,
        );

  if (alreadyUnlocked) {
    return {
      success: true,
      state,
    };
  }

  const paidState =
    item.cost > 0
      ? await spendMoonDust(
          item.cost,
        )
      : state;

  if (!paidState) {
    return {
      success: false,
      reason:
        'notEnoughMoonDust',
      state,
    };
  }

  await unlockMoonDustReward({
    id:
      `${type}_${id}`,
    type:
      type === 'theme'
        ? 'theme'
        : 'cardBack',
    titleKey:
      item.titleKey,
    titleFallback:
      item.titleFallback,
    descriptionKey:
      item.descriptionKey,
    descriptionFallback:
      item.descriptionFallback,
  }).catch(() => {});

  const nextState:
    OracleShopState = {
      ...state,
      unlockedThemeIds:
        type === 'theme'
          ? Array.from(
              new Set([
                ...state.unlockedThemeIds,
                id as OracleThemeId,
              ]),
            )
          : state.unlockedThemeIds,
      unlockedCardBackIds:
        type === 'cardBack'
          ? Array.from(
              new Set([
                ...state.unlockedCardBackIds,
                id as OracleCardBackId,
              ]),
            )
          : state.unlockedCardBackIds,
    };

  await writeState(nextState);

  return {
    success: true,
    state:
      nextState,
  };
}

export async function equipOracleShopItem(
  type: OracleShopItemType,
  id: string,
): Promise<OracleShopState | undefined> {
  const state =
    await readState();

  const unlocked =
    type === 'theme'
      ? state.unlockedThemeIds.includes(
          id as OracleThemeId,
        )
      : state.unlockedCardBackIds.includes(
          id as OracleCardBackId,
        );

  if (!unlocked) {
    return undefined;
  }

  const nextState:
    OracleShopState = {
      ...state,
      activeThemeId:
        type === 'theme'
          ? (id as OracleThemeId)
          : state.activeThemeId,
      activeCardBackId:
        type === 'cardBack'
          ? (id as OracleCardBackId)
          : state.activeCardBackId,
  };

  await writeState(nextState);

  return nextState;
}

export async function resetOracleShop():
Promise<void> {
  await AsyncStorage.removeItem(
    STORAGE_KEY,
  );
}
