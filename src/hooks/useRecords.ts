import { useState, useCallback, useMemo } from 'react';
import type { DailyRecord } from '../types';
import { loadRecords, saveRecords, exportRecordsToFile, parseImportedRecords } from '../utils/storage';

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

  const exportRecords = useCallback(() => {
    exportRecordsToFile(records);
  }, [records]);

  const importRecords = useCallback((text: string): boolean => {
    const imported = parseImportedRecords(text);
    if (!imported) return false;
    setRecords((prev) => {
      const next = { ...prev, ...imported };
      saveRecords(next);
      return next;
    });
    return true;
  }, []);

  return useMemo(
    () => ({ records, addRecord, deleteRecord, getRecord, exportRecords, importRecords }),
    [records, addRecord, deleteRecord, getRecord, exportRecords, importRecords],
  );
}
