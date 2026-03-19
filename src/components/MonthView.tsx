import { motion } from 'framer-motion';
import type { DailyRecord } from '../types';
import {
  formatDate,
  getMonthGrid,
  getMonthName,
  getMonthDates,
  isToday,
} from '../utils/date';
import { StatsBar } from './StatsBar';

interface MonthViewProps {
  currentDate: Date;
  records: Record<string, DailyRecord>;
  onDateSelect: (date: string) => void;
  onNavigate: (direction: -1 | 1) => void;
  getTotalStars: (dates: string[]) => number;
  getRecordCount: (dates: string[]) => number;
}

const WEEKDAY_HEADERS = ['一', '二', '三', '四', '五', '六', '日'];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02
    }
  }
};

const item = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export function MonthView({
  currentDate,
  records,
  onDateSelect,
  onNavigate,
  getTotalStars,
  getRecordCount,
}: MonthViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const grid = getMonthGrid(year, month);
  const monthDates = getMonthDates(year, month);
  const totalStars = getTotalStars(monthDates);
  const recordCount = getRecordCount(monthDates);
  const totalDays = new Date(year, month + 1, 0).getDate();

  /** 渲染星星小点 */
  const renderMiniStars = (count: number) => {
    return (
      <div className="flex gap-0.5 justify-center mt-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full shadow-sm ${
              i <= count ? 'bg-amber-400' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full">
      {/* 月导航 */}
      <div className="flex items-center justify-between px-5 py-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        <span className="text-base font-bold text-gray-800 tracking-wide">
          {year}年{getMonthName(month)}
        </span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate(1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* 星期头 */}
      <div className="grid grid-cols-7 px-4 mb-2">
        {WEEKDAY_HEADERS.map((name) => (
          <div key={name} className="text-center text-xs font-bold text-gray-400 py-1">
            {name}
          </div>
        ))}
      </div>

      {/* 日期网格 */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-7 gap-2 px-4 flex-1 overflow-y-auto pb-6 content-start"
      >
        {grid.map((day) => {
          const dateStr = formatDate(day);
          const record = records[dateStr];
          const isCurrentMonth = day.getMonth() === month;
          const today = isToday(day);
          const future = day > new Date();

          return (
            <motion.button
              variants={item}
              key={dateStr}
              onClick={() => isCurrentMonth && !future && onDateSelect(dateStr)}
              disabled={!isCurrentMonth || future}
              whileTap={isCurrentMonth && !future ? { scale: 0.9 } : undefined}
              className={`flex flex-col items-center justify-center py-2 rounded-2xl transition-all duration-200 min-h-[3.5rem] relative ${
                !isCurrentMonth
                  ? 'opacity-0 pointer-events-none'
                  : today
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30'
                    : record
                      ? 'bg-amber-50/80 border border-amber-200/50 shadow-sm'
                      : future
                        ? 'opacity-40 bg-gray-50/50'
                        : 'bg-white border border-gray-100 hover:border-gray-200 shadow-sm'
              }`}
            >
              <span
                className={`text-sm font-bold leading-tight ${
                  today ? 'text-white' : isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
                }`}
              >
                {day.getDate()}
              </span>
              {record && !today && renderMiniStars(record.stars)}
              {record && today && (
                <div className="flex gap-0.5 justify-center mt-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full shadow-sm ${
                        i <= record.stars ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              )}
              {/* Today indicator dot if no record yet */}
              {today && !record && (
                <div className="absolute bottom-1.5 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* 统计 */}
      <StatsBar totalStars={totalStars} recordCount={recordCount} totalDays={totalDays} label="本月" />
    </div>
  );
}
