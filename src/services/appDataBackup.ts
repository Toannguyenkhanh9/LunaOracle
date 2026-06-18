import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppBackupEnvelope = {
  version: 1;
  createdAt: string;
  appId: 'online-pagoda';
  data: Record<string, string>;
};

const INCLUDED_PREFIXES = [
  '@online_pagoda/',
  '@temple_app/',
  '@pagoda/',
];

const EXCLUDED_KEYS = new Set([
  '@online_pagoda/cloud_sync_config_v1',
  '@online_pagoda/cloud_sync_metadata_v1',
  '@online_pagoda/premium_entitlement_v1',
]);

function shouldIncludeKey(key: string): boolean {
  return (
    INCLUDED_PREFIXES.some(prefix =>
      key.startsWith(prefix),
    ) && !EXCLUDED_KEYS.has(key)
  );
}

export async function createAppBackup(): Promise<AppBackupEnvelope> {
  const allKeys = await AsyncStorage.getAllKeys();
  const selectedKeys = allKeys.filter(
    shouldIncludeKey,
  );

  const pairs =
    await AsyncStorage.multiGet(selectedKeys);

  const data: Record<string, string> = {};

  pairs.forEach(([key, value]) => {
    if (value !== null) {
      data[key] = value;
    }
  });

  return {
    version: 1,
    createdAt: new Date().toISOString(),
    appId: 'online-pagoda',
    data,
  };
}

export function validateAppBackup(
  value: unknown,
): value is AppBackupEnvelope {
  if (
    typeof value !== 'object' ||
    value === null
  ) {
    return false;
  }

  const candidate =
    value as Partial<AppBackupEnvelope>;

  return (
    candidate.version === 1 &&
    candidate.appId === 'online-pagoda' &&
    typeof candidate.createdAt ===
      'string' &&
    typeof candidate.data === 'object' &&
    candidate.data !== null
  );
}

export async function restoreAppBackup(
  backup: AppBackupEnvelope,
): Promise<void> {
  if (!validateAppBackup(backup)) {
    throw new Error('INVALID_BACKUP');
  }

  const entries = Object.entries(
    backup.data,
  ).filter(([key]) =>
    shouldIncludeKey(key),
  );

  await AsyncStorage.multiSet(entries);
}

export async function getBackupDataSize(
  backup: AppBackupEnvelope,
): Promise<number> {
  return JSON.stringify(backup).length;
}
