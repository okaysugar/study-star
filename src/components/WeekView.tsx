import { motion, type Variants } from 'framer-motion';
import type { DailyRecord } from '../types';
import { formatDate, getWeekRange, getWeekdayName, isToday, formatWeekRange } from '../utils/date';
import { StarRating } from './StarRating';

interface WeekViewProps {
  currentDate: Date;
  records: Record<string, DailyRecord>;
  onDateSelect: (date: string) => void;
  onNavigate: (direction: -1 | 1) => void;
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export function WeekView({
  currentDate,
  records,
  onDateSelect,
  onNavigate,
}: WeekViewProps) {
  const { days } = getWeekRange(currentDate);

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full">
      {/* 周导航 */}
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
          {formatWeekRange(currentDate)}
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

      {/* 日列表 */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex-1 overflow-y-auto px-5 space-y-4 pb-6 scroll-smooth"
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
              whileTap={!future ? { scale: 0.98, y: 4, x: 4 } : undefined}
              className={`w-full flex items-center gap-4 px-5 py-5 rounded-2xl transition-all duration-150 text-left border-2 border-black ${
                today
                  ? 'bg-[#BAE6FD] shadow-cartoon'
                  : record
                    ? 'bg-white shadow-cartoon'
                    : future
                      ? 'bg-gray-100 opacity-60 border-dashed'
                      : 'bg-white shadow-cartoon hover:bg-[#FEF3C7]'
              } ${!future && 'active:shadow-cartoon-active'}`}
            >
              {/* 日期 */}
              <div className="flex flex-col items-center min-w-14">
                <span className={`text-sm font-black mb-1 ${today ? 'text-black' : 'text-gray-600'}`}>
                  周{getWeekdayName(day)}
                </span>
                <span
                  className={`text-3xl font-black ${
                    today ? 'text-black' : future ? 'text-gray-400' : 'text-black'
                  }`}
                  style={today ? { textShadow: '2px 2px 0px white' } : {}}
                >
                  {day.getDate()}
                </span>
              </div>

              {/* 分割线 */}
              <div className="w-1 h-12 rounded-full bg-black/10" />

              {/* 星星和备注 */}
              <div className="flex-1 flex flex-col justify-center min-w-0">
                {record ? (
                  <>
                    <div className="mb-1.5">
                      <StarRating value={record.stars} readonly size="sm" />
                    </div>
                    {record.note && (
                      <p className="text-sm text-black truncate w-full font-bold bg-white/50 px-2 py-1 rounded-lg border-2 border-black/10 inline-block">
                        {record.note}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${future ? 'border-gray-300 bg-gray-200' : 'border-black bg-[#FDE68A]'}`}>
                      <svg className={`w-5 h-5 ${future ? 'text-gray-400' : 'text-black'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {future ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        )}
                      </svg>
                    </div>
                    <span className={`text-base font-black ${future ? 'text-gray-400' : 'text-black'}`}>
                      {future ? '还没到哦~' : '点我打卡!'}
                    </span>
                  </div>
                )}
              </div>

              {/* 箭头 */}
              {!future && (
                <div className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-cartoon-sm">
                  <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
