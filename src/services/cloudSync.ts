import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  createAppBackup,
  restoreAppBackup,
  type AppBackupEnvelope,
  validateAppBackup,
} from './appDataBackup';

export type CloudSyncConfig = {
  endpoint: string;
  accessToken: string;
  autoSync: boolean;
};

export type CloudSyncMetadata = {
  lastUploadAt?: string;
  lastDownloadAt?: string;
  lastRemoteCreatedAt?: string;
};

const CONFIG_KEY =
  '@online_pagoda/cloud_sync_config_v1';
const METADATA_KEY =
  '@online_pagoda/cloud_sync_metadata_v1';

const DEFAULT_CONFIG: CloudSyncConfig = {
  endpoint: '',
  accessToken: '',
  autoSync: false,
};

function normalizeEndpoint(
  endpoint: string,
): string {
  return endpoint.trim().replace(/\/+$/, '');
}

export async function getCloudSyncConfig(): Promise<CloudSyncConfig> {
  try {
    const raw = await AsyncStorage.getItem(
      CONFIG_KEY,
    );

    if (!raw) {
      return DEFAULT_CONFIG;
    }

    return {
      ...DEFAULT_CONFIG,
      ...(JSON.parse(
        raw,
      ) as Partial<CloudSyncConfig>),
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function saveCloudSyncConfig(
  config: CloudSyncConfig,
): Promise<void> {
  await AsyncStorage.setItem(
    CONFIG_KEY,
    JSON.stringify({
      ...config,
      endpoint: normalizeEndpoint(
        config.endpoint,
      ),
    }),
  );
}

export async function getCloudSyncMetadata(): Promise<CloudSyncMetadata> {
  try {
    const raw = await AsyncStorage.getItem(
      METADATA_KEY,
    );

    return raw
      ? (JSON.parse(
          raw,
        ) as CloudSyncMetadata)
      : {};
  } catch {
    return {};
  }
}

async function saveMetadata(
  metadata: CloudSyncMetadata,
): Promise<void> {
  await AsyncStorage.setItem(
    METADATA_KEY,
    JSON.stringify(metadata),
  );
}

function assertConfigured(
  config: CloudSyncConfig,
): void {
  if (
    !config.endpoint.trim() ||
    !config.accessToken.trim()
  ) {
    throw new Error('SYNC_NOT_CONFIGURED');
  }
}

function headers(
  config: CloudSyncConfig,
): Record<string, string> {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${config.accessToken}`,
  };
}

export async function uploadBackupToCloud(): Promise<AppBackupEnvelope> {
  const config =
    await getCloudSyncConfig();

  assertConfigured(config);

  const backup = await createAppBackup();

  const response = await fetch(
    `${normalizeEndpoint(
      config.endpoint,
    )}/backup`,
    {
      method: 'PUT',
      headers: headers(config),
      body: JSON.stringify(backup),
    },
  );

  if (!response.ok) {
    throw new Error(
      `SYNC_UPLOAD_FAILED_${response.status}`,
    );
  }

  const metadata =
    await getCloudSyncMetadata();

  await saveMetadata({
    ...metadata,
    lastUploadAt:
      new Date().toISOString(),
    lastRemoteCreatedAt:
      backup.createdAt,
  });

  return backup;
}

export async function downloadBackupFromCloud(): Promise<AppBackupEnvelope> {
  const config =
    await getCloudSyncConfig();

  assertConfigured(config);

  const response = await fetch(
    `${normalizeEndpoint(
      config.endpoint,
    )}/backup/latest`,
    {
      method: 'GET',
      headers: headers(config),
    },
  );

  if (!response.ok) {
    throw new Error(
      `SYNC_DOWNLOAD_FAILED_${response.status}`,
    );
  }

  const backup =
    (await response.json()) as unknown;

  if (!validateAppBackup(backup)) {
    throw new Error(
      'SYNC_INVALID_REMOTE_BACKUP',
    );
  }

  await restoreAppBackup(backup);

  const metadata =
    await getCloudSyncMetadata();

  await saveMetadata({
    ...metadata,
    lastDownloadAt:
      new Date().toISOString(),
    lastRemoteCreatedAt:
      backup.createdAt,
  });

  return backup;
}

export async function autoUploadIfEnabled(): Promise<void> {
  const config =
    await getCloudSyncConfig();

  if (!config.autoSync) {
    return;
  }

  await uploadBackupToCloud();
}
