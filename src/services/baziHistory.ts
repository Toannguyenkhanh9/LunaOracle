import AsyncStorage from '@react-native-async-storage/async-storage';

import type {BaziChart, BirthInput} from '../astrology/bazi';
import {calculateBaziFromInput} from './baziEngine';

const STORAGE_KEY = '@pagoda_online_bazi_history_v1';
const SCHEMA_VERSION = 1 as const;
const MAX_RECORDS = 100;

export type SavedBaziRecord = {
  schemaVersion: typeof SCHEMA_VERSION;
  id: string;
  title: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  engineVersion: string;
  inputFingerprint: string;
  input: BirthInput;
  chart: BaziChart;
};

type BaziHistoryEnvelope = {
  schemaVersion: typeof SCHEMA_VERSION;
  records: SavedBaziRecord[];
};

export type SaveBaziOptions = {
  id?: string;
  title?: string;
  notes?: string;
  replaceSameInput?: boolean;
};

function createId(): string {
  return `bazi-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function defaultTitle(chart: BaziChart): string {
  const input = chart.input.localDateTime;
  const date = `${String(input.day).padStart(2, '0')}/${String(
    input.month,
  ).padStart(2, '0')}/${input.year}`;

  return chart.input.displayName?.trim() || `BaZi ${date}`;
}

function normalizeRecord(value: unknown): SavedBaziRecord | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const item = value as Partial<SavedBaziRecord>;

  if (!item.id || !item.input || !item.chart) {
    return null;
  }

  const now = new Date().toISOString();

  return {
    schemaVersion: SCHEMA_VERSION,
    id: String(item.id),
    title: String(item.title || defaultTitle(item.chart)),
    notes: String(item.notes || ''),
    createdAt: String(item.createdAt || now),
    updatedAt: String(item.updatedAt || item.createdAt || now),
    engineVersion: String(item.engineVersion || item.chart.version || 'unknown'),
    inputFingerprint: String(
      item.inputFingerprint || item.chart.meta?.inputFingerprint || item.id,
    ),
    input: item.input,
    chart: item.chart,
  };
}

async function readEnvelope(): Promise<BaziHistoryEnvelope> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return {schemaVersion: SCHEMA_VERSION, records: []};
    }

    const parsed = JSON.parse(raw) as unknown;
    const rawRecords = Array.isArray(parsed)
      ? parsed
      : (parsed as Partial<BaziHistoryEnvelope>)?.records;

    const records = Array.isArray(rawRecords)
      ? rawRecords
          .map(normalizeRecord)
          .filter((item): item is SavedBaziRecord => item !== null)
      : [];

    return {
      schemaVersion: SCHEMA_VERSION,
      records: records
        .sort((first, second) => second.updatedAt.localeCompare(first.updatedAt))
        .slice(0, MAX_RECORDS),
    };
  } catch (error) {
    console.warn('Cannot read BaZi history:', error);
    return {schemaVersion: SCHEMA_VERSION, records: []};
  }
}

async function writeEnvelope(envelope: BaziHistoryEnvelope): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      schemaVersion: SCHEMA_VERSION,
      records: envelope.records.slice(0, MAX_RECORDS),
    }),
  );
}

export async function getSavedBaziCharts(): Promise<SavedBaziRecord[]> {
  return (await readEnvelope()).records;
}

export async function getSavedBaziChart(
  id: string,
): Promise<SavedBaziRecord | null> {
  const records = await getSavedBaziCharts();
  return records.find(item => item.id === id) ?? null;
}

export async function saveBaziChart(
  chart: BaziChart,
  options: SaveBaziOptions = {},
): Promise<SavedBaziRecord> {
  const envelope = await readEnvelope();
  const now = new Date().toISOString();
  const fingerprint =
    chart.meta?.inputFingerprint ||
    `${chart.version}:${chart.input.localDateTime.year}-${chart.input.localDateTime.month}-${chart.input.localDateTime.day}-${chart.input.localDateTime.hour}-${chart.input.localDateTime.minute}:${chart.input.location.timeZone}`;

  const existingIndex = options.id
    ? envelope.records.findIndex(item => item.id === options.id)
    : options.replaceSameInput
      ? envelope.records.findIndex(item => item.inputFingerprint === fingerprint)
      : -1;

  const existing = existingIndex >= 0 ? envelope.records[existingIndex] : null;
  const record: SavedBaziRecord = {
    schemaVersion: SCHEMA_VERSION,
    id: existing?.id ?? options.id ?? createId(),
    title: options.title?.trim() || existing?.title || defaultTitle(chart),
    notes: options.notes?.trim() ?? existing?.notes ?? '',
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    engineVersion: chart.version,
    inputFingerprint: fingerprint,
    input: chart.input,
    chart,
  };

  if (existingIndex >= 0) {
    envelope.records.splice(existingIndex, 1);
  }

  envelope.records.unshift(record);
  await writeEnvelope(envelope);
  return record;
}

export async function renameSavedBaziChart(
  id: string,
  title: string,
): Promise<SavedBaziRecord[]> {
  const envelope = await readEnvelope();
  const normalizedTitle = title.trim();

  envelope.records = envelope.records.map(item =>
    item.id === id
      ? {
          ...item,
          title: normalizedTitle || item.title,
          updatedAt: new Date().toISOString(),
        }
      : item,
  );

  await writeEnvelope(envelope);
  return envelope.records;
}

export async function updateSavedBaziNotes(
  id: string,
  notes: string,
): Promise<SavedBaziRecord[]> {
  const envelope = await readEnvelope();

  envelope.records = envelope.records.map(item =>
    item.id === id
      ? {...item, notes: notes.trim(), updatedAt: new Date().toISOString()}
      : item,
  );

  await writeEnvelope(envelope);
  return envelope.records;
}

export async function deleteSavedBaziChart(id: string): Promise<SavedBaziRecord[]> {
  const envelope = await readEnvelope();
  envelope.records = envelope.records.filter(item => item.id !== id);
  await writeEnvelope(envelope);
  return envelope.records;
}

export async function duplicateSavedBaziChart(
  id: string,
): Promise<SavedBaziRecord | null> {
  const source = await getSavedBaziChart(id);

  if (!source) {
    return null;
  }

  return saveBaziChart(source.chart, {
    title: `${source.title} (copy)`,
    notes: source.notes,
  });
}

export async function recalculateSavedBaziChart(
  id: string,
): Promise<SavedBaziRecord | null> {
  const source = await getSavedBaziChart(id);

  if (!source) {
    return null;
  }

  const chart = calculateBaziFromInput(source.input);

  return saveBaziChart(chart, {
    id,
    title: source.title,
    notes: source.notes,
  });
}

export async function clearSavedBaziCharts(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export function exportSavedBaziRecord(record: SavedBaziRecord): string {
  return JSON.stringify(record, null, 2);
}

export async function importSavedBaziRecord(
  json: string,
): Promise<SavedBaziRecord> {
  const normalized = normalizeRecord(JSON.parse(json));

  if (!normalized) {
    throw new Error('INVALID_BAZI_HISTORY_FILE');
  }

  return saveBaziChart(normalized.chart, {
    title: normalized.title,
    notes: normalized.notes,
  });
}
