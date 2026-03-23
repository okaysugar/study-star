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

  return useMemo(
    () => ({ records, addRecord, deleteRecord, getRecord }),
    [records, addRecord, deleteRecord, getRecord],
  );
}
