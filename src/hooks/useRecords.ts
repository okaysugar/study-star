import { useState, useCallback, useMemo } from 'react';
import type { DailyRecord } from '../types';
import { loadRecords, saveRecords } from '../utils/storage';

export function useRecords() {
  const [records, setRecords] = useState<Record<string, DailyRecord>>(() => loadRecords());

  const addRecord = useCallback((record: DailyRecord) => {
    setRecords((prev) => {
      const next = { ...prev, [record.date]: record };
      saveRecords(next);
      return next;
    });
  }, []);

  const deleteRecord = useCallback((date: string) => {
    setRecords((prev) => {
      const next = { ...prev };
      delete next[date];
      saveRecords(next);
      return next;
    });
  }, []);

  const getRecord = useCallback(
    (date: string): DailyRecord | undefined => records[date],
    [records],
  );

  const getTotalStars = useCallback(
    (dates: string[]): number => {
      return dates.reduce((sum, date) => {
        const r = records[date];
        return sum + (r ? r.stars : 0);
      }, 0);
    },
    [records],
  );

  const getRecordCount = useCallback(
    (dates: string[]): number => {
      return dates.filter((date) => records[date]).length;
    },
    [records],
  );

  return useMemo(
    () => ({ records, addRecord, deleteRecord, getRecord, getTotalStars, getRecordCount }),
    [records, addRecord, deleteRecord, getRecord, getTotalStars, getRecordCount],
  );
}
