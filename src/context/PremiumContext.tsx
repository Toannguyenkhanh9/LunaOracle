import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  getPremiumEntitlement,
  type PremiumEntitlement,
} from '../services/premium';

type PremiumContextValue = {
  entitlement: PremiumEntitlement | null;
  isPremium: boolean;
  isLoading: boolean;
  refresh: () => Promise<void>;
};

const PremiumContext =
  createContext<PremiumContextValue | null>(
    null,
  );

export function PremiumProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [entitlement, setEntitlement] =
    useState<PremiumEntitlement | null>(
      null,
    );
  const [isLoading, setIsLoading] =
    useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);

    try {
      setEntitlement(
        await getPremiumEntitlement(),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      entitlement,
      isPremium:
        entitlement?.active ?? false,
      isLoading,
      refresh,
    }),
    [
      entitlement,
      isLoading,
      refresh,
    ],
  );

  return (
    <PremiumContext.Provider value={value}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium(): PremiumContextValue {
  const context = useContext(
    PremiumContext,
  );

  if (!context) {
    throw new Error(
      'usePremium must be used inside PremiumProvider',
    );
  }

  return context;
}
