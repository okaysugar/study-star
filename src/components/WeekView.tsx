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
    <div className="flex flex-col flex-1 min-h-0">
      {/* 周导航 */}
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
          {formatWeekRange(currentDate)}
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

      {/* 日列表 */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-4">
        {days.map((day) => {
          const dateStr = formatDate(day);
          const record = records[dateStr];
          const today = isToday(day);
          const future = day > new Date();

          return (
            <button
              key={dateStr}
              onClick={() => !future && onDateSelect(dateStr)}
              disabled={future}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                today
                  ? 'bg-blue-50 border-2 border-blue-200 shadow-sm'
                  : record
                    ? 'bg-white border border-gray-100 shadow-sm'
                    : future
                      ? 'bg-gray-50 opacity-50'
                      : 'bg-white border border-gray-100 active:bg-gray-50'
              }`}
            >
              {/* 日期 */}
              <div className="flex flex-col items-center min-w-12">
                <span className="text-xs text-gray-400 font-medium">
                  周{getWeekdayName(day)}
                </span>
                <span
                  className={`text-xl font-bold ${
                    today ? 'text-blue-600' : 'text-gray-800'
                  }`}
                >
                  {day.getDate()}
                </span>
              </div>

              {/* 分割线 */}
              <div className="w-px h-10 bg-gray-200" />

              {/* 星星和备注 */}
              <div className="flex-1 flex flex-col items-start gap-1">
                {record ? (
                  <>
                    <StarRating value={record.stars} readonly size="sm" />
                    {record.note && (
                      <p className="text-xs text-gray-500 truncate max-w-full">
                        {record.note}
                      </p>
                    )}
                  </>
                ) : (
                  <span className="text-sm text-gray-400">
                    {future ? '未到' : '点击记录'}
                  </span>
                )}
              </div>

              {/* 箭头 */}
              {!future && (
                <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* 统计 */}
      <StatsBar totalStars={totalStars} recordCount={recordCount} totalDays={7} label="本周" />
    </div>
  );
}
