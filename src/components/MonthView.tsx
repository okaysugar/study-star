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
      <div className="flex gap-px justify-center mt-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${
              i <= count ? 'bg-amber-400' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* 月导航 */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => onNavigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 transition"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-base font-semibold text-gray-700">
          {year}年{getMonthName(month)}
        </span>
        <button
          onClick={() => onNavigate(1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 transition"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 星期头 */}
      <div className="grid grid-cols-7 px-3 mb-1">
        {WEEKDAY_HEADERS.map((name) => (
          <div key={name} className="text-center text-xs font-medium text-gray-400 py-1">
            {name}
          </div>
        ))}
      </div>

      {/* 日期网格 */}
      <div className="grid grid-cols-7 gap-1 px-3 flex-1 overflow-y-auto pb-2">
        {grid.map((day) => {
          const dateStr = formatDate(day);
          const record = records[dateStr];
          const isCurrentMonth = day.getMonth() === month;
          const today = isToday(day);
          const future = day > new Date();

          return (
            <button
              key={dateStr}
              onClick={() => isCurrentMonth && !future && onDateSelect(dateStr)}
              disabled={!isCurrentMonth || future}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all duration-150 min-h-[3.2rem] ${
                !isCurrentMonth
                  ? 'opacity-30'
                  : today
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                    : record
                      ? 'bg-amber-50 border border-amber-200'
                      : future
                        ? 'opacity-40'
                        : 'active:bg-gray-100'
              }`}
            >
              <span
                className={`text-sm font-semibold leading-tight ${
                  today ? 'text-white' : isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
                }`}
              >
                {day.getDate()}
              </span>
              {record && !today && renderMiniStars(record.stars)}
              {record && today && (
                <div className="flex gap-px justify-center mt-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        i <= record.stars ? 'bg-white' : 'bg-blue-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 统计 */}
      <StatsBar totalStars={totalStars} recordCount={recordCount} totalDays={totalDays} label="本月" />
    </div>
  );
}
