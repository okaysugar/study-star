import { motion, Variants } from 'framer-motion';
import { BarChart2, Star, Target, Calendar, Gift, TrendingUp, CheckCircle, Utensils, X, Flame } from 'lucide-react';
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

interface RewardItemProps {
  icon: string;
  name: string;
  condition: string;
  currentAvg: string;
  unlocked: boolean;
  hasRecords: boolean;
}

function RewardItem({ icon, name, condition, currentAvg, unlocked, hasRecords }: RewardItemProps) {
  return (
    <motion.div
      variants={itemVariants}
      className={`flex items-center gap-4 p-4 rounded-2xl border-4 border-black shadow-cartoon-sm ${
        unlocked ? 'bg-[#FEF9C3]' : 'bg-white'
      }`}
    >
      <motion.div
        className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 border-black shadow-cartoon-sm ${
          unlocked ? 'bg-[#FDE047]' : 'bg-gray-100'
        }`}
        animate={unlocked ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
        transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
      >
        <span className="text-3xl">{icon}</span>
      </motion.div>
      <div className="flex-1 min-w-0">
        <div className="font-black text-black text-lg">{name}</div>
        <div className="text-sm font-bold text-gray-600 flex items-center gap-1 mt-0.5">
          <Target className="w-4 h-4" />
          {condition}
        </div>
      </div>
      <div className="flex flex-col items-center shrink-0 min-w-[60px]">
        {hasRecords ? (
          <>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-xl font-black text-black">{currentAvg}</span>
            </div>
            {unlocked ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="text-xs font-black text-green-700 bg-green-200 px-2 py-1 rounded-lg border-2 border-green-600 mt-1 shadow-cartoon-sm"
              >
                已达标!
              </motion.span>
            ) : (
              <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2 py-1 rounded-lg border-2 border-orange-500 mt-1 shadow-cartoon-sm">加油!</span>
            )}
          </>
        ) : (
          <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-lg border-2 border-gray-400 shadow-cartoon-sm">暂无记录</span>
        )}
      </div>
    </motion.div>
  );
}

interface PeriodSectionProps {
  title: string;
  icon: React.ReactNode;
  totalStars: number;
  recordCount: number;
  totalDays: number;
  bgColor: string;
  iconBgColor: string;
  shadowColor: string;
  compact?: boolean;
}

function PeriodSection({ title, icon, totalStars, recordCount, totalDays, bgColor, iconBgColor, shadowColor, compact = false }: PeriodSectionProps) {
  const avgStars = recordCount > 0 ? (totalStars / recordCount).toFixed(1) : '-';

  return (
    <div className="relative flex flex-col h-full">
      <div className={`self-start inline-flex items-center gap-1.5 ${compact ? 'text-base' : 'text-xl'} font-black mb-3 px-2.5 py-1 rounded-xl border-2 border-black ${bgColor} shadow-cartoon-sm`}>
        <div className={`p-0.5 rounded-md border-2 border-black ${iconBgColor}`}>
          {icon}
        </div>
        {title}
      </div>
      
      <div className={`flex flex-col gap-2 flex-1 justify-center`}>
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border-2 border-black shadow-cartoon-sm hover:translate-y-px hover:translate-x-px hover:shadow-none transition-all">
          <div className="flex items-center gap-1.5">
            <div className="p-1 bg-yellow-100 rounded-lg border border-yellow-300">
              <Star className="w-4 h-4 text-yellow-600 fill-yellow-500" />
            </div>
            <span className="text-sm font-black text-amber-900">星星</span>
          </div>
          <span className="text-xl font-black text-amber-600" style={{ textShadow: `1px 1px 0px #FDE68A` }}>
            {totalStars}
          </span>
        </div>
        
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 border-2 border-black shadow-cartoon-sm hover:translate-y-px hover:translate-x-px hover:shadow-none transition-all">
          <div className="flex items-center gap-1.5">
            <div className="p-1 bg-blue-100 rounded-lg border border-blue-300">
              <TrendingUp className="w-4 h-4 text-blue-600" strokeWidth={3} />
            </div>
            <span className="text-sm font-black text-blue-900">均分</span>
          </div>
          <span className="text-xl font-black text-blue-600" style={{ textShadow: `1px 1px 0px #BFDBFE` }}>
            {avgStars}
          </span>
        </div>
        
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border-2 border-black shadow-cartoon-sm hover:translate-y-px hover:translate-x-px hover:shadow-none transition-all">
          <div className="flex items-center gap-1.5">
            <div className="p-1 bg-emerald-100 rounded-lg border border-emerald-300">
              <CheckCircle className="w-4 h-4 text-emerald-600" strokeWidth={3} />
            </div>
            <span className="text-sm font-black text-emerald-900">打卡</span>
          </div>
          <span className="text-xl font-black text-emerald-600 flex items-baseline" style={{ textShadow: `1px 1px 0px #A7F3D0` }}>
            {recordCount}
            <span className="text-xs font-bold text-emerald-600/60 ml-0.5" style={{ textShadow: 'none' }}>/{totalDays}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  totalStars: number;
  recordCount: number;
  totalDays?: number;
  bgColor: string;
  iconBgColor: string;
  shadowColor: string;
}

function StatCard({ title, icon, totalStars, recordCount, totalDays, bgColor, iconBgColor, shadowColor }: StatCardProps) {
  const avgStars = recordCount > 0 ? (totalStars / recordCount).toFixed(1) : '-';

  return (
    <motion.div 
      variants={itemVariants}
      className={`p-5 rounded-3xl border-4 border-black shadow-cartoon mb-6 bg-white relative overflow-hidden`}
    >
      <div className="absolute -right-6 -top-6 opacity-10 rotate-12 pointer-events-none">
        {icon}
      </div>
      
      <div className={`inline-flex items-center gap-2 text-xl font-black mb-5 px-4 py-2 rounded-xl border-2 border-black ${bgColor} shadow-cartoon-sm relative z-10`}>
        <div className={`p-1 rounded-lg border-2 border-black ${iconBgColor}`}>
          {icon}
        </div>
        {title}
      </div>

      <div className="grid grid-cols-3 gap-3 relative z-10">
        <div className="flex flex-col items-center p-3 rounded-2xl bg-white border-2 border-black shadow-cartoon-sm">
          <div className="flex items-center gap-1 mb-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-bold text-gray-600">获得星星</span>
          </div>
          <span className="text-4xl font-black text-black" style={{ textShadow: `2px 2px 0px ${shadowColor}` }}>
            {totalStars}
          </span>
        </div>
        
        <div className="flex flex-col items-center p-3 rounded-2xl bg-white border-2 border-black shadow-cartoon-sm">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-gray-600">平均评分</span>
          </div>
          <span className="text-4xl font-black text-black" style={{ textShadow: `2px 2px 0px ${shadowColor}` }}>
            {avgStars}
          </span>
        </div>
        
        <div className="flex flex-col items-center p-3 rounded-2xl bg-white border-2 border-black shadow-cartoon-sm">
          <div className="flex items-center gap-1 mb-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-xs font-bold text-gray-600">打卡天数</span>
          </div>
          <span className="text-4xl font-black text-black flex items-baseline" style={{ textShadow: `2px 2px 0px ${shadowColor}` }}>
            {recordCount}
            {totalDays && <span className="text-lg font-bold text-gray-400 ml-1" style={{ textShadow: 'none' }}>/{totalDays}</span>}
          </span>
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

  const lastWeekDate = new Date(now);
  lastWeekDate.setDate(lastWeekDate.getDate() - 7);
  const lastWeekDates = getWeekDates(lastWeekDate);
  const lastWeekStats = getStats(lastWeekDates);

  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthDates = getMonthDates(lastMonthDate.getFullYear(), lastMonthDate.getMonth());
  const lastMonthStats = getStats(lastMonthDates);

  const lastWeekAvg = lastWeekStats.recordCount > 0 ? lastWeekStats.totalStars / lastWeekStats.recordCount : 0;
  const lastMonthAvg = lastMonthStats.recordCount > 0 ? lastMonthStats.totalStars / lastMonthStats.recordCount : 0;
  const weekRewardUnlocked = lastWeekAvg >= 4;
  const monthRewardUnlocked = lastMonthAvg >= 4;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="absolute inset-0 bg-[#FFFBEB] z-50 flex flex-col pt-safe-top"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b-4 border-black bg-white shadow-cartoon-sm sticky top-0 z-20">
        <h2 className="text-2xl font-black text-black flex items-center gap-3">
          <div className="p-2 bg-[#E0E7FF] rounded-xl border-2 border-black shadow-cartoon-sm">
            <BarChart2 className="w-6 h-6 text-indigo-600" strokeWidth={3} />
          </div>
          数据统计
        </h2>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="w-11 h-11 flex items-center justify-center bg-gray-100 rounded-xl border-2 border-black shadow-cartoon active:shadow-none active:translate-y-1 active:translate-x-1 transition-all"
        >
          <X className="w-6 h-6 text-black" strokeWidth={3} />
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 scroll-smooth pb-10">
        <StatCard
          title="累计总计"
          icon={<Flame className="w-6 h-6 text-orange-600" strokeWidth={2.5} />}
          totalStars={allStats.totalStars}
          recordCount={allStats.recordCount}
          bgColor="bg-[#FEF3C7]"
          iconBgColor="bg-[#FDE68A]"
          shadowColor="#FCD34D"
        />

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <div className="p-3 rounded-3xl border-4 border-black shadow-cartoon bg-white">
            <PeriodSection
              title="本周"
              icon={<Target className="w-4 h-4 text-blue-600" strokeWidth={2.5} />}
              totalStars={weekStats.totalStars}
              recordCount={weekStats.recordCount}
              totalDays={7}
              bgColor="bg-[#E0F2FE]"
              iconBgColor="bg-[#BAE6FD]"
              shadowColor="#7DD3FC"
              compact={true}
            />
          </div>
          <div className="p-3 rounded-3xl border-4 border-black shadow-cartoon bg-white">
            <PeriodSection
              title="本月"
              icon={<Calendar className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />}
              totalStars={monthStats.totalStars}
              recordCount={monthStats.recordCount}
              totalDays={daysInMonth}
              bgColor="bg-[#D1FAE5]"
              iconBgColor="bg-[#A7F3D0]"
              shadowColor="#6EE7B7"
              compact={true}
            />
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="p-5 rounded-3xl border-4 border-black shadow-cartoon mb-6 bg-white relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 opacity-10 rotate-12 pointer-events-none">
            <Gift className="w-24 h-24 text-red-500" />
          </div>
          
          <div className="inline-flex items-center gap-2 text-xl font-black mb-5 px-4 py-2 rounded-xl border-2 border-black bg-[#FEE2E2] shadow-cartoon-sm relative z-10">
            <div className="p-1 rounded-lg border-2 border-black bg-[#FECACA]">
              <Gift className="w-5 h-5 text-red-600" strokeWidth={2.5} />
            </div>
            奖励目标
          </div>
          
          <div className="flex flex-col gap-4 relative z-10">
            <RewardItem
              icon="🍗"
              name="肯德基大餐"
              condition="上周平均 ≥ 4 颗星"
              currentAvg={lastWeekAvg.toFixed(1)}
              unlocked={weekRewardUnlocked}
              hasRecords={lastWeekStats.recordCount > 0}
            />
            <RewardItem
              icon="🍲"
              name="海底捞火锅"
              condition="上月平均 ≥ 4 颗星"
              currentAvg={lastMonthAvg.toFixed(1)}
              unlocked={monthRewardUnlocked}
              hasRecords={lastMonthStats.recordCount > 0}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
