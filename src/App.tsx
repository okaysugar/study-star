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
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-[#FFFBEB] relative overflow-hidden font-sans">
      {/* Header - Cartoon Style */}
      <header className="sticky top-0 z-40 bg-[#FFFBEB] border-b-4 border-black px-4 pt-safe-top shadow-cartoon-sm mb-2">
        <div className="flex items-center justify-between py-4">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-black text-black flex items-center gap-2"
            style={{ textShadow: '2px 2px 0px #FDE68A' }}
          >
            <motion.span 
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
              className="text-3xl drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            >
              ⭐
            </motion.span>
            Study Star
          </motion.h1>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleToday}
            className="text-sm font-bold px-4 py-2 bg-[#A7F3D0] text-black border-2 border-black rounded-xl shadow-cartoon transition-all active:shadow-cartoon-active active:translate-y-[4px] active:translate-x-[4px]"
          >
            今天!
          </motion.button>
        </div>

        {/* 视图切换 Tab */}
        <div className="flex bg-white border-2 border-black rounded-2xl p-1.5 mb-4 shadow-cartoon-sm relative">
          {['week', 'month'].map((mode) => {
            const isSelected = viewMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setViewMode(mode as ViewMode)}
                className={`flex-1 py-2.5 text-base font-bold rounded-xl relative z-10 transition-colors duration-200 ${
                  isSelected ? 'text-black' : 'text-gray-500 hover:text-black'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-0 bg-[#FDE68A] border-2 border-black rounded-xl"
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
