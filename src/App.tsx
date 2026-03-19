import { useState, useCallback } from 'react';
import type { ViewMode } from './types';
import { useRecords } from './hooks/useRecords';
import { WeekView } from './components/WeekView';
import { MonthView } from './components/MonthView';
import { RecordModal } from './components/RecordModal';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalDate, setModalDate] = useState<string | null>(null);
  const { records, addRecord, deleteRecord, getRecord, getTotalStars, getRecordCount } = useRecords();

  const handleNavigate = useCallback(
    (direction: -1 | 1) => {
      setCurrentDate((prev) => {
        const next = new Date(prev);
        if (viewMode === 'week') {
          next.setDate(next.getDate() + direction * 7);
        } else {
          next.setMonth(next.getMonth() + direction);
        }
        return next;
      });
    },
    [viewMode],
  );

  const handleDateSelect = useCallback((date: string) => {
    setModalDate(date);
  }, []);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const existingRecord = modalDate ? getRecord(modalDate) : undefined;

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-gray-50 relative">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 pt-safe-top">
        <div className="flex items-center justify-between py-3">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-1.5">
            <span className="text-2xl">⭐</span>
            Study Star
          </h1>
          <button
            onClick={handleToday}
            className="text-sm text-blue-500 font-medium px-3 py-1.5 rounded-lg bg-blue-50 active:bg-blue-100 transition"
          >
            今天
          </button>
        </div>

        {/* 视图切换 Tab */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-3">
          <button
            onClick={() => setViewMode('week')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              viewMode === 'week'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            周视图
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              viewMode === 'month'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            月视图
          </button>
        </div>
      </header>

      {/* 视图区域 */}
      {viewMode === 'week' ? (
        <WeekView
          currentDate={currentDate}
          records={records}
          onDateSelect={handleDateSelect}
          onNavigate={handleNavigate}
          getTotalStars={getTotalStars}
          getRecordCount={getRecordCount}
        />
      ) : (
        <MonthView
          currentDate={currentDate}
          records={records}
          onDateSelect={handleDateSelect}
          onNavigate={handleNavigate}
          getTotalStars={getTotalStars}
          getRecordCount={getRecordCount}
        />
      )}

      {/* 编辑弹窗 */}
      <RecordModal
        open={!!modalDate}
        date={modalDate ?? ''}
        existing={existingRecord}
        onSave={addRecord}
        onDelete={modalDate ? () => deleteRecord(modalDate) : undefined}
        onClose={() => setModalDate(null)}
      />
    </div>
  );
}
