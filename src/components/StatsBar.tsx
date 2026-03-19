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
    <div className="bg-white px-5 py-5 rounded-t-[2rem] border-t-4 border-black shadow-[0_-8px_0px_0px_rgba(0,0,0,0.1)] relative z-10">
      {/* 进度条 */}
      <div className="mb-5">
        <div className="flex justify-between text-sm font-black text-black mb-2 px-1">
          <span>{label}打卡进度</span>
          <span className="text-black">{Math.round(progress)}%</span>
        </div>
        <div className="h-4 w-full bg-white border-2 border-black rounded-full overflow-hidden shadow-inner">
          <motion.div 
            className="h-full bg-[#A7F3D0] border-r-2 border-black"
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
            className="text-3xl font-black text-black"
            style={{ textShadow: '2px 2px 0px #FDE68A' }}
          >
            {totalStars}
          </motion.span>
          <span className="text-sm font-bold text-gray-600 mt-1">总星数</span>
        </div>
        
        <div className="w-1 h-10 bg-black/10 rounded-full" />
        
        <div className="flex flex-col items-center">
          <motion.span 
            key={avgStars}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-black text-black"
            style={{ textShadow: '2px 2px 0px #BAE6FD' }}
          >
            {avgStars}
          </motion.span>
          <span className="text-sm font-bold text-gray-600 mt-1">平均评分</span>
        </div>
        
        <div className="w-1 h-10 bg-black/10 rounded-full" />
        
        <div className="flex flex-col items-center">
          <motion.span 
            key={recordCount}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-black text-black"
            style={{ textShadow: '2px 2px 0px #A7F3D0' }}
          >
            {recordCount}<span className="text-lg font-bold text-gray-400">/{totalDays}</span>
          </motion.span>
          <span className="text-sm font-bold text-gray-600 mt-1">打卡天数</span>
        </div>
      </div>
    </div>
  );
}
