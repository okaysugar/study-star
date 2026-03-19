import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-gray-50/50 relative overflow-hidden">
      {/* Header - Glassmorphism */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100/80 px-4 pt-safe-top shadow-sm">
        <div className="flex items-center justify-between py-3">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-1.5"
          >
            <motion.span 
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
              className="text-2xl"
            >
              ⭐
            </motion.span>
            Study Star
          </motion.h1>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleToday}
            className="text-sm text-blue-600 font-semibold px-3.5 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 active:bg-blue-200 transition-colors"
          >
            今天
          </motion.button>
        </div>

        {/* 视图切换 Tab */}
        <div className="flex bg-gray-100/80 rounded-xl p-1 mb-3 relative">
          {['week', 'month'].map((mode) => {
            const isSelected = viewMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setViewMode(mode as ViewMode)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg relative z-10 transition-colors duration-200 ${
                  isSelected ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-20">{mode === 'week' ? '周视图' : '月视图'}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* 视图区域 */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, x: viewMode === 'week' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: viewMode === 'week' ? 20 : -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute inset-0 flex flex-col"
          >
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
          </motion.div>
        </AnimatePresence>
      </div>

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
