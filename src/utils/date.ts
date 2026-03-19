/**
 * 日期工具函数 — 使用原生 Date API
 */

/** 格式化日期为 YYYY-MM-DD */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 解析 YYYY-MM-DD 字符串为 Date（本地时区） */
export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** 获取某一周的周一到周日（周一为起始） */
export function getWeekRange(date: Date): { start: Date; end: Date; days: Date[] } {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon, ...
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const curr = new Date(monday);
    curr.setDate(monday.getDate() + i);
    days.push(curr);
  }

  return {
    start: days[0],
    end: days[6],
    days,
  };
}

/** 获取某月的完整日历网格（含前后补齐的日期，周一起始） */
export function getMonthGrid(year: number, month: number): Date[] {
  // month: 0-indexed
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // 前面补齐到周一
  let startDay = firstDay.getDay(); // 0=Sun
  if (startDay === 0) startDay = 7;
  const prefixCount = startDay - 1;

  // 后面补齐到周日
  let endDay = lastDay.getDay();
  if (endDay === 0) endDay = 7;
  const suffixCount = 7 - endDay;

  const grid: Date[] = [];

  for (let i = prefixCount; i > 0; i--) {
    const d = new Date(year, month, 1 - i);
    grid.push(d);
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    grid.push(new Date(year, month, i));
  }

  for (let i = 1; i <= suffixCount; i++) {
    grid.push(new Date(year, month + 1, i));
  }

  return grid;
}

/** 获取某周内所有日期的字符串数组 */
export function getWeekDates(date: Date): string[] {
  return getWeekRange(date).days.map(formatDate);
}

/** 获取某月内所有日期的字符串数组 */
export function getMonthDates(year: number, month: number): string[] {
  const lastDay = new Date(year, month + 1, 0);
  const days: string[] = [];
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(formatDate(new Date(year, month, i)));
  }
  return days;
}

/** 是否为今天 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/** 是否为同一天 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** 星期名（中文简写） */
const WEEKDAY_NAMES = ['一', '二', '三', '四', '五', '六', '日'];
export function getWeekdayName(date: Date): string {
  const day = date.getDay();
  return WEEKDAY_NAMES[day === 0 ? 6 : day - 1];
}

/** 月份名（中文） */
const MONTH_NAMES = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月',
];
export function getMonthName(month: number): string {
  return MONTH_NAMES[month];
}

/** 格式化日期范围显示 */
export function formatWeekRange(date: Date): string {
  const { start, end } = getWeekRange(date);
  const sm = start.getMonth() + 1;
  const sd = start.getDate();
  const em = end.getMonth() + 1;
  const ed = end.getDate();
  if (sm === em) {
    return `${sm}月${sd}日 - ${ed}日`;
  }
  return `${sm}月${sd}日 - ${em}月${ed}日`;
}
