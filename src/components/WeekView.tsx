import { motion } from 'framer-motion';
import type { DailyRecord } from '../types';
import { formatDate, getWeekRange, getWeekdayName, isToday, formatWeekRange, getWeekDates } from '../utils/date';
import { StarRating } from './StarRating';
import { StatsBar } from './StatsBar';

interface WeekViewProps {
  currentDate: Date;
  records: Record<string, DailyRecord>;
  onDateSelect: (date: string) => void;
  onNavigate: (direction: -1 | 1) => void;
  getTotalStars: (dates: string[]) => number;
  getRecordCount: (dates: string[]) => number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export function WeekView({
  currentDate,
  records,
  onDateSelect,
  onNavigate,
  getTotalStars,
  getRecordCount,
}: WeekViewProps) {
  const { days } = getWeekRange(currentDate);
  const weekDates = getWeekDates(currentDate);
  const totalStars = getTotalStars(weekDates);
  const recordCount = getRecordCount(weekDates);

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full">
      {/* 周导航 */}
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
          {formatWeekRange(currentDate)}
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

      {/* 日列表 */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex-1 overflow-y-auto px-4 space-y-3 pb-6 scroll-smooth"
      >
        {days.map((day) => {
          const dateStr = formatDate(day);
          const record = records[dateStr];
          const today = isToday(day);
          const future = day > new Date();

          return (
            <motion.button
              variants={item}
              key={dateStr}
              onClick={() => !future && onDateSelect(dateStr)}
              disabled={future}
              whileTap={!future ? { scale: 0.98 } : undefined}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 text-left ${
                today
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50/50 border-2 border-blue-200 shadow-md shadow-blue-100/50'
                  : record
                    ? 'bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'
                    : future
                      ? 'bg-gray-50/50 border border-transparent opacity-60'
                      : 'bg-white border border-gray-100 border-dashed hover:border-solid hover:border-gray-200'
              }`}
            >
              {/* 日期 */}
              <div className="flex flex-col items-center min-w-[3rem]">
                <span className={`text-xs font-semibold mb-1 ${today ? 'text-blue-500' : 'text-gray-400'}`}>
                  周{getWeekdayName(day)}
                </span>
                <span
                  className={`text-2xl font-black ${
                    today ? 'text-blue-600' : future ? 'text-gray-400' : 'text-gray-800'
                  }`}
                >
                  {day.getDate()}
                </span>
              </div>

              {/* 分割线 */}
              <div className={`w-px h-12 rounded-full ${today ? 'bg-blue-200/50' : 'bg-gray-100'}`} />

              {/* 星星和备注 */}
              <div className="flex-1 flex flex-col justify-center min-w-0">
                {record ? (
                  <>
                    <div className="mb-1">
                      <StarRating value={record.stars} readonly size="sm" />
                    </div>
                    {record.note && (
                      <p className="text-sm text-gray-500 truncate w-full font-medium">
                        {record.note}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${future ? 'bg-gray-100' : 'bg-gray-50'}`}>
                      <svg className={`w-4 h-4 ${future ? 'text-gray-300' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {future ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        )}
                      </svg>
                    </div>
                    <span className={`text-sm font-medium ${future ? 'text-gray-400' : 'text-gray-500'}`}>
                      {future ? '未到打卡时间' : '点击记录今天'}
                    </span>
                  </div>
                )}
              </div>

              {/* 箭头 */}
              {!future && (
                <svg className={`w-5 h-5 ${today ? 'text-blue-300' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* 统计 */}
      <StatsBar totalStars={totalStars} recordCount={recordCount} totalDays={7} label="本周" />
    </div>
  );
}
