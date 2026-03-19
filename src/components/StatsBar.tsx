interface StatsBarProps {
  totalStars: number;
  recordCount: number;
  totalDays: number;
  label: string;
}

export function StatsBar({ totalStars, recordCount, totalDays, label }: StatsBarProps) {
  const avgStars = recordCount > 0 ? (totalStars / recordCount).toFixed(1) : '-';

  return (
    <div className="border-t border-gray-100 bg-white px-4 py-3">
      <div className="flex items-center justify-around">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-amber-500">
            {totalStars}
          </span>
          <span className="text-xs text-gray-400">{label}总星数</span>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-blue-500">
            {avgStars}
          </span>
          <span className="text-xs text-gray-400">平均评分</span>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-green-500">
            {recordCount}<span className="text-sm text-gray-400">/{totalDays}</span>
          </span>
          <span className="text-xs text-gray-400">记录天数</span>
        </div>
      </div>
    </div>
  );
}
