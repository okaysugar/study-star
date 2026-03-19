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
