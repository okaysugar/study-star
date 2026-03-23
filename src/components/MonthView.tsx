import { motion, type Variants } from 'framer-motion';
import type { DailyRecord } from '../types';
import {
  formatDate,
  getMonthGrid,
  getMonthName,
  isToday,
} from '../utils/date';

interface MonthViewProps {
  currentDate: Date;
  records: Record<string, DailyRecord>;
  onDateSelect: (date: string) => void;
  onNavigate: (direction: -1 | 1) => void;
}

const WEEKDAY_HEADERS = ['一', '二', '三', '四', '五', '六', '日'];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export function MonthView({
  currentDate,
  records,
  onDateSelect,
  onNavigate,
}: MonthViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const grid = getMonthGrid(year, month);

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
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border-2 border-black shadow-cartoon active:shadow-cartoon-active active:translate-y-1 active:translate-x-1 transition-all"
        >
          <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        <span className="text-lg font-black text-black tracking-wide bg-white px-4 py-2 rounded-xl border-2 border-black shadow-cartoon-sm">
          {year}年{getMonthName(month)}
        </span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate(1)}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border-2 border-black shadow-cartoon active:shadow-cartoon-active active:translate-y-1 active:translate-x-1 transition-all"
        >
          <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* 星期头 */}
      <div className="grid grid-cols-7 px-4 mb-2">
        {WEEKDAY_HEADERS.map((name) => (
          <div key={name} className="text-center text-sm font-black text-black py-1">
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
              whileTap={isCurrentMonth && !future ? { scale: 0.9, y: 2, x: 2 } : undefined}
              className={`flex flex-col items-center justify-center py-2 rounded-2xl transition-all duration-150 min-h-16 relative border-2 ${
                !isCurrentMonth
                  ? 'opacity-0 pointer-events-none border-transparent'
                  : today
                    ? 'bg-[#BAE6FD] border-black shadow-cartoon'
                    : record
                      ? 'bg-[#FDE68A] border-black shadow-cartoon'
                      : future
                        ? 'bg-gray-100 border-dashed border-gray-300 opacity-60'
                        : 'bg-white border-black shadow-cartoon hover:bg-[#FEF3C7]'
              } ${isCurrentMonth && !future && 'active:shadow-cartoon-active'}`}
            >
              <span
                className={`text-base font-black leading-tight ${
                  today ? 'text-black' : isCurrentMonth ? 'text-black' : 'text-gray-400'
                }`}
                style={today ? { textShadow: '1px 1px 0px white' } : {}}
              >
                {day.getDate()}
              </span>
              {record && !today && renderMiniStars(record.stars)}
              {record && today && (
                <div className="flex gap-0.5 justify-center mt-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full border border-black ${
                        i <= record.stars ? 'bg-white' : 'bg-black/20'
                      }`}
                    />
                  ))}
                </div>
              )}
              {/* Today indicator dot if no record yet */}
              {today && !record && (
                <div className="absolute bottom-1.5 w-2 h-2 bg-black rounded-full animate-bounce" />
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
