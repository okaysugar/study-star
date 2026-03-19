import { motion } from 'framer-motion';

interface StatsBarProps {
  totalStars: number;
  recordCount: number;
  totalDays: number;
  label: string;
}

export function StatsBar({ totalStars, recordCount, totalDays, label }: StatsBarProps) {
  const avgStars = recordCount > 0 ? (totalStars / recordCount).toFixed(1) : '-';
  const progress = recordCount > 0 ? (recordCount / totalDays) * 100 : 0;

  return (
    <div className="bg-white px-5 py-4 rounded-t-3xl shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)] border-t border-gray-100/50 relative z-10">
      {/* 进度条 */}
      <div className="mb-4">
        <div className="flex justify-between text-xs font-medium text-gray-500 mb-1.5 px-1">
          <span>{label}打卡进度</span>
          <span className="text-blue-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 50, damping: 15, delay: 0.2 }}
          />
        </div>
      </div>

      {/* 统计数据 */}
      <div className="flex items-center justify-around">
        <div className="flex flex-col items-center">
          <motion.span 
            key={totalStars}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-black bg-gradient-to-br from-amber-400 to-orange-500 bg-clip-text text-transparent"
          >
            {totalStars}
          </motion.span>
          <span className="text-xs font-medium text-gray-400 mt-0.5">总星数</span>
        </div>
        
        <div className="w-px h-8 bg-gray-100" />
        
        <div className="flex flex-col items-center">
          <motion.span 
            key={avgStars}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-black text-blue-500"
          >
            {avgStars}
          </motion.span>
          <span className="text-xs font-medium text-gray-400 mt-0.5">平均评分</span>
        </div>
        
        <div className="w-px h-8 bg-gray-100" />
        
        <div className="flex flex-col items-center">
          <motion.span 
            key={recordCount}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-black text-emerald-500"
          >
            {recordCount}<span className="text-sm font-semibold text-gray-300">/{totalDays}</span>
          </motion.span>
          <span className="text-xs font-medium text-gray-400 mt-0.5">打卡天数</span>
        </div>
      </div>
    </div>
  );
}
