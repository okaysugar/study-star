import { motion, Variants } from 'framer-motion';
import type { DailyRecord } from '../types';
import { getWeekDates, getMonthDates } from '../utils/date';

interface StatsViewProps {
  records: Record<string, DailyRecord>;
  onClose: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: '100%' },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30, staggerChildren: 0.1 }
  },
  exit: { 
    opacity: 0, 
    y: '100%',
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

interface StatCardProps {
  title: string;
  totalStars: number;
  recordCount: number;
  totalDays?: number;
  bgColor: string;
  shadowColor: string;
}

function StatCard({ title, totalStars, recordCount, totalDays, bgColor, shadowColor }: StatCardProps) {
  const avgStars = recordCount > 0 ? (totalStars / recordCount).toFixed(1) : '-';
  const progress = totalDays ? (recordCount / totalDays) * 100 : 0;

  return (
    <motion.div 
      variants={itemVariants}
      className={`p-5 rounded-4xl border-4 border-black shadow-cartoon mb-6 bg-white`}
    >
      <div className={`text-xl font-black mb-4 inline-block px-4 py-1 rounded-xl border-2 border-black ${bgColor}`}>
        {title}
      </div>

      {totalDays && (
        <div className="mb-5">
          <div className="flex justify-between text-sm font-black text-black mb-2 px-1">
            <span>打卡进度</span>
            <span className="text-black">{Math.round(progress)}%</span>
          </div>
          <div className="h-4 w-full bg-gray-100 border-2 border-black rounded-full overflow-hidden shadow-inner relative">
            <motion.div 
              className={`absolute top-0 left-0 bottom-0 border-r-2 border-black ${bgColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 50, damping: 15, delay: 0.2 }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-around mt-2">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-black text-black" style={{ textShadow: `2px 2px 0px ${shadowColor}` }}>
            {totalStars}
          </span>
          <span className="text-sm font-bold text-gray-500 mt-1">获得星星</span>
        </div>
        
        <div className="w-1 h-10 bg-black/10 rounded-full" />
        
        <div className="flex flex-col items-center">
          <span className="text-3xl font-black text-black" style={{ textShadow: `2px 2px 0px ${shadowColor}` }}>
            {avgStars}
          </span>
          <span className="text-sm font-bold text-gray-500 mt-1">平均评分</span>
        </div>
        
        <div className="w-1 h-10 bg-black/10 rounded-full" />
        
        <div className="flex flex-col items-center">
          <span className="text-3xl font-black text-black" style={{ textShadow: `2px 2px 0px ${shadowColor}` }}>
            {recordCount}{totalDays && <span className="text-lg font-bold text-gray-400">/{totalDays}</span>}
          </span>
          <span className="text-sm font-bold text-gray-500 mt-1">打卡天数</span>
        </div>
      </div>
    </motion.div>
  );
}

export function StatsView({ records, onClose }: StatsViewProps) {
  const allDates = Object.keys(records);
  
  const now = new Date();
  const weekDates = getWeekDates(now);
  const monthDates = getMonthDates(now.getFullYear(), now.getMonth());
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  const getStats = (dates: string[]) => {
    let totalStars = 0;
    let recordCount = 0;
    dates.forEach(date => {
      if (records[date]) {
        totalStars += records[date].stars;
        recordCount += 1;
      }
    });
    return { totalStars, recordCount };
  };

  const allStats = getStats(allDates);
  const weekStats = getStats(weekDates);
  const monthStats = getStats(monthDates);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="absolute inset-0 bg-[#FFFBEB] z-50 flex flex-col pt-safe-top"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b-4 border-black bg-white shadow-cartoon-sm sticky top-0 z-10">
        <h2 className="text-2xl font-black text-black flex items-center gap-2" style={{ textShadow: '2px 2px 0px #A7F3D0' }}>
          <span className="text-3xl">📊</span> 数据统计
        </h2>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl border-2 border-black shadow-cartoon active:shadow-cartoon-active active:translate-y-0.5 active:translate-x-0.5"
        >
          <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 scroll-smooth">
        <StatCard
          title="🌟 累计总计"
          totalStars={allStats.totalStars}
          recordCount={allStats.recordCount}
          bgColor="bg-[#FDE68A]"
          shadowColor="#FCD34D"
        />

        <StatCard
          title="🎯 本周概况"
          totalStars={weekStats.totalStars}
          recordCount={weekStats.recordCount}
          totalDays={7}
          bgColor="bg-[#BAE6FD]"
          shadowColor="#7DD3FC"
        />

        <StatCard
          title="📅 本月成就"
          totalStars={monthStats.totalStars}
          recordCount={monthStats.recordCount}
          totalDays={daysInMonth}
          bgColor="bg-[#A7F3D0]"
          shadowColor="#6EE7B7"
        />
      </div>
    </motion.div>
  );
}