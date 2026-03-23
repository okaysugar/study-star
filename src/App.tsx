import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, FolderOpen, Download, Upload } from 'lucide-react';
import type { ViewMode } from './types';
import { useRecords } from './hooks/useRecords';
import { WeekView } from './components/WeekView';
import { MonthView } from './components/MonthView';
import { RecordModal } from './components/RecordModal';
import { StatsView } from './components/StatsView';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalDate, setModalDate] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showIOMenu, setShowIOMenu] = useState(false);
  const { records, addRecord, deleteRecord, getRecord, exportRecords, importRecords } = useRecords();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = useCallback(() => {
    setShowIOMenu(false);
    fileInputRef.current?.click();
  }, []);

  const handleExport = useCallback(() => {
    setShowIOMenu(false);
    exportRecords();
  }, [exportRecords]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const ok = importRecords(reader.result as string);
        if (!ok) alert('导入失败：文件格式不正确');
      };
      reader.readAsText(file);
      e.target.value = '';
    },
    [importRecords],
  );

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
        <div className="flex items-center justify-between py-2">
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
            小汐的学习星
          </motion.h1>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />
            {/* 导入/导出合并入口 */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowIOMenu((v) => !v)}
                className="w-10 h-10 flex items-center justify-center bg-[#FEF3C7] border-2 border-black rounded-xl shadow-cartoon transition-all active:shadow-cartoon-active active:translate-y-1 active:translate-x-1"
                title="导入/导出"
              >
                <FolderOpen className="w-5 h-5 text-amber-700" strokeWidth={2.5} />
              </motion.button>
              <AnimatePresence>
                {showIOMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowIOMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -4 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="absolute right-0 top-12 z-50 bg-white border-2 border-black rounded-2xl shadow-cartoon overflow-hidden min-w-[120px]"
                    >
                      <button
                        onClick={handleImport}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-bold text-black hover:bg-[#FEF3C7] transition-colors border-b-2 border-black"
                      >
                        <Upload className="w-4 h-4 text-amber-700" strokeWidth={2.5} />
                        导入记录
                      </button>
                      <button
                        onClick={handleExport}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-bold text-black hover:bg-[#DBEAFE] transition-colors"
                      >
                        <Download className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                        导出记录
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowStats(true)}
              className="w-10 h-10 flex items-center justify-center bg-[#E0E7FF] border-2 border-black rounded-xl shadow-cartoon transition-all active:shadow-cartoon-active active:translate-y-1 active:translate-x-1"
            >
              <BarChart2 className="w-5 h-5 text-indigo-600" strokeWidth={2.5} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleToday}
              className="text-sm font-bold px-4 py-2 bg-[#A7F3D0] text-black border-2 border-black rounded-xl shadow-cartoon transition-all active:shadow-cartoon-active active:translate-y-1 active:translate-x-1"
            >
              今天!
            </motion.button>
          </div>
        </div>

        {/* 视图切换 Tab */}
        <div className="flex bg-white border-2 border-black rounded-2xl p-1.5 mb-2 shadow-cartoon-sm relative">
          {['week', 'month'].map((mode) => {
            const isSelected = viewMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setViewMode(mode as ViewMode)}
                className={`flex-1 py-1.5 text-sm font-bold rounded-xl relative z-10 transition-colors duration-200 ${
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
              />
            ) : (
              <MonthView
                currentDate={currentDate}
                records={records}
                onDateSelect={handleDateSelect}
                onNavigate={handleNavigate}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 统计弹窗 */}
      <AnimatePresence>
        {showStats && (
          <StatsView records={records} onClose={() => setShowStats(false)} />
        )}
      </AnimatePresence>

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
