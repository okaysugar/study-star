export interface DailyRecord {
  date: string; // YYYY-MM-DD
  stars: 1 | 2 | 3 | 4 | 5;
  note?: string;
}

export type ViewMode = 'week' | 'month';
