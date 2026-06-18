import AsyncStorage from '@react-native-async-storage/async-storage';

export type PremiumEntitlementSource =
  | 'googlePlay'
  | 'appStore'
  | 'promotion'
  | 'development'
  | 'none';

export type PremiumEntitlement = {
  active: boolean;
  source: PremiumEntitlementSource;
  productId?: string;
  purchasedAt?: string;
  expiresAt?: string;
  updatedAt: string;
};

const STORAGE_KEY =
  '@online_pagoda/premium_entitlement_v1';

const FREE_ENTITLEMENT: PremiumEntitlement = {
  active: false,
  source: 'none',
  updatedAt: new Date(0).toISOString(),
};

function isNotExpired(
  entitlement: PremiumEntitlement,
): boolean {
  if (!entitlement.expiresAt) {
    return true;
  }

  const expiresAt = new Date(
    entitlement.expiresAt,
  ).getTime();

  return (
    Number.isFinite(expiresAt) &&
    expiresAt > Date.now()
  );
}

export async function getPremiumEntitlement(): Promise<PremiumEntitlement> {
  try {
    const raw = await AsyncStorage.getItem(
      STORAGE_KEY,
    );

    if (!raw) {
      return FREE_ENTITLEMENT;
    }

    const entitlement = {
      ...FREE_ENTITLEMENT,
      ...(JSON.parse(
        raw,
      ) as Partial<PremiumEntitlement>),
    };

    return {
      ...entitlement,
      active:
        Boolean(entitlement.active) &&
        isNotExpired(entitlement),
    };
  } catch {
    return FREE_ENTITLEMENT;
  }
}

export async function isPremiumActive(): Promise<boolean> {
  const entitlement =
    await getPremiumEntitlement();

  return entitlement.active;
}

export async function setPremiumEntitlement(
  entitlement: Omit<
    PremiumEntitlement,
    'updatedAt'
  >,
): Promise<PremiumEntitlement> {
  const normalized: PremiumEntitlement = {
    ...entitlement,
    updatedAt: new Date().toISOString(),
  };

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(normalized),
  );

  return normalized;
}

export async function clearPremiumEntitlement(): Promise<void> {
  await AsyncStorage.removeItem(
    STORAGE_KEY,
  );
}
