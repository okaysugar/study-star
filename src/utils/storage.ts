import type { DailyRecord } from '../types';

const STORAGE_KEY = 'study-star-records';

export function loadRecords(): Record<string, DailyRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveRecords(records: Record<string, DailyRecord>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function exportRecordsToFile(records: Record<string, DailyRecord>): void {
  const json = JSON.stringify(records, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `study-star-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseImportedRecords(
  text: string,
): Record<string, DailyRecord> | null {
  try {
    const data = JSON.parse(text);
    if (typeof data !== 'object' || data === null || Array.isArray(data)) return null;
    const result: Record<string, DailyRecord> = {};
    for (const [key, val] of Object.entries(data)) {
      const v = val as Record<string, unknown>;
      if (
        typeof v.date === 'string' &&
        typeof v.stars === 'number' &&
        v.stars >= 1 &&
        v.stars <= 5
      ) {
        result[key] = {
          date: v.date,
          stars: v.stars as DailyRecord['stars'],
          ...(typeof v.note === 'string' ? { note: v.note } : {}),
        };
      }
    }
    return Object.keys(result).length > 0 ? result : null;
  } catch {
    return null;
  }
}
