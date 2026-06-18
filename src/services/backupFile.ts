import RNFS from 'react-native-fs';
import Share from 'react-native-share';

import {
  createAppBackup,
  restoreAppBackup,
  validateAppBackup,
} from './appDataBackup';

export async function exportBackupFile(): Promise<string> {
  const backup = await createAppBackup();

  const filePath = `${RNFS.DocumentDirectoryPath}/online-pagoda-backup-${Date.now()}.json`;

  await RNFS.writeFile(
    filePath,
    JSON.stringify(backup, null, 2),
    'utf8',
  );

  await Share.open({
    type: 'application/json',
    url: `file://${filePath}`,
    failOnCancel: false,
  });

  return filePath;
}

export async function importBackupFile(
  filePath: string,
): Promise<void> {
  const normalized = filePath.replace(
    /^file:\/\//,
    '',
  );

  const raw = await RNFS.readFile(
    normalized,
    'utf8',
  );

  const parsed = JSON.parse(raw) as unknown;

  if (!validateAppBackup(parsed)) {
    throw new Error('INVALID_BACKUP');
  }

  await restoreAppBackup(parsed);
}
