import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import AsyncStorage
  from '@react-native-async-storage/async-storage';

export type ExpertViewMode =
  | 'simple'
  | 'expert';

export type ExpertModePreferences = {
  mode: ExpertViewMode;
  showCalculationDetails: boolean;
  showRawCodes: boolean;
  showDiagnostics: boolean;
};

type StoredEnvelope = {
  schemaVersion: 1;
  preferences: ExpertModePreferences;
};

const STORAGE_KEY =
  '@eastern_destiny/expert_mode_v1';

const DEFAULT_PREFERENCES: ExpertModePreferences = {
  mode: 'simple',
  showCalculationDetails: true,
  showRawCodes: false,
  showDiagnostics: true,
};

let currentPreferences:
  ExpertModePreferences = {
    ...DEFAULT_PREFERENCES,
  };

let hasLoaded = false;

let loadingPromise:
  Promise<void> | null = null;

const listeners =
  new Set<
    (
      value:
        ExpertModePreferences,
    ) => void
  >();

function normalizePreferences(
  value: unknown,
): ExpertModePreferences {
  if (
    !value ||
    typeof value !== 'object'
  ) {
    return {
      ...DEFAULT_PREFERENCES,
    };
  }

  const candidate =
    value as Partial<
      ExpertModePreferences
    >;

  return {
    mode:
      candidate.mode ===
      'expert'
        ? 'expert'
        : 'simple',
    showCalculationDetails:
      candidate.showCalculationDetails ??
      DEFAULT_PREFERENCES
        .showCalculationDetails,
    showRawCodes:
      candidate.showRawCodes ??
      DEFAULT_PREFERENCES
        .showRawCodes,
    showDiagnostics:
      candidate.showDiagnostics ??
      DEFAULT_PREFERENCES
        .showDiagnostics,
  };
}

function emit(): void {
  listeners.forEach(
    listener =>
      listener({
        ...currentPreferences,
      }),
  );
}

async function persist(): Promise<void> {
  const envelope:
    StoredEnvelope = {
      schemaVersion: 1,
      preferences:
        currentPreferences,
    };

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(envelope),
  );
}

export async function initializeExpertMode(): Promise<void> {
  if (hasLoaded) {
    return;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise =
    (async () => {
      try {
        const raw =
          await AsyncStorage.getItem(
            STORAGE_KEY,
          );

        if (raw) {
          const parsed =
            JSON.parse(
              raw,
            ) as Partial<
              StoredEnvelope
            >;

          currentPreferences =
            normalizePreferences(
              parsed.preferences,
            );
        }
      } catch (error) {
        console.warn(
          'Unable to load expert mode preferences:',
          error,
        );

        currentPreferences = {
          ...DEFAULT_PREFERENCES,
        };
      } finally {
        hasLoaded = true;
        loadingPromise =
          null;
        emit();
      }
    })();

  return loadingPromise;
}

export function getExpertModePreferences(): ExpertModePreferences {
  return {
    ...currentPreferences,
  };
}

export async function setExpertViewMode(
  mode: ExpertViewMode,
): Promise<void> {
  currentPreferences = {
    ...currentPreferences,
    mode,
  };

  emit();

  try {
    await persist();
  } catch (error) {
    console.warn(
      'Unable to save expert view mode:',
      error,
    );
  }
}

export async function updateExpertModePreferences(
  patch: Partial<
    ExpertModePreferences
  >,
): Promise<void> {
  currentPreferences =
    normalizePreferences({
      ...currentPreferences,
      ...patch,
    });

  emit();

  try {
    await persist();
  } catch (error) {
    console.warn(
      'Unable to save expert mode preferences:',
      error,
    );
  }
}

export async function resetExpertModePreferences(): Promise<void> {
  currentPreferences = {
    ...DEFAULT_PREFERENCES,
  };

  emit();

  try {
    await AsyncStorage.removeItem(
      STORAGE_KEY,
    );
  } catch (error) {
    console.warn(
      'Unable to reset expert mode preferences:',
      error,
    );
  }
}

export function subscribeExpertMode(
  listener: (
    value:
      ExpertModePreferences,
  ) => void,
): () => void {
  listeners.add(
    listener,
  );

  return () => {
    listeners.delete(
      listener,
    );
  };
}

export function useExpertMode() {
  const [
    preferences,
    setPreferences,
  ] =
    useState<ExpertModePreferences>(
      getExpertModePreferences(),
    );

  const [
    isReady,
    setIsReady,
  ] =
    useState(hasLoaded);

  useEffect(() => {
    let active = true;

    const unsubscribe =
      subscribeExpertMode(
        value => {
          if (!active) {
            return;
          }

          setPreferences(
            value,
          );

          setIsReady(
            true,
          );
        },
      );

    initializeExpertMode()
      .then(() => {
        if (!active) {
          return;
        }

        setPreferences(
          getExpertModePreferences(),
        );

        setIsReady(
          true,
        );
      })
      .catch(() => {
        if (active) {
          setIsReady(
            true,
          );
        }
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const setMode =
    useCallback(
      (
        mode:
          ExpertViewMode,
      ) =>
        setExpertViewMode(
          mode,
        ),
      [],
    );

  const update =
    useCallback(
      (
        patch: Partial<
          ExpertModePreferences
        >,
      ) =>
        updateExpertModePreferences(
          patch,
        ),
      [],
    );

  const toggle =
    useCallback(
      () =>
        setExpertViewMode(
          preferences.mode ===
          'expert'
            ? 'simple'
            : 'expert',
        ),
      [
        preferences.mode,
      ],
    );

  return {
    isReady,
    preferences,
    isExpert:
      preferences.mode ===
      'expert',
    setMode,
    update,
    toggle,
  };
}
