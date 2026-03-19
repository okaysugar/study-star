import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DailyRecord } from '../types';
import { StarRating } from './StarRating';

interface RecordModalProps {
  open: boolean;
  date: string;
  existing?: DailyRecord;
  onSave: (record: DailyRecord) => void;
  onDelete?: () => void;
  onClose: () => void;
}

export function RecordModal({ open, date, existing, onSave, onDelete, onClose }: RecordModalProps) {
  const [stars, setStars] = useState<1 | 2 | 3 | 4 | 5>(existing?.stars ?? 3);
  const [note, setNote] = useState(existing?.note ?? '');
  const backdropRef = useRef<HTMLDivElement>(null);

  // 打开时重置
  useEffect(() => {
    if (open) {
      setStars(existing?.stars ?? 3);
      setNote(existing?.note ?? '');
    }
  }, [open, existing]);

  const displayDate = (() => {
    const [, m, d] = date.split('-');
    return `${parseInt(m)}月${parseInt(d)}日`;
  })();

  const handleSave = () => {
    onSave({ date, stars, note: note.trim() || undefined });
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={backdropRef}
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-lg bg-white rounded-t-[2rem] px-6 pt-4 pb-8 shadow-2xl"
          >
            {/* 拖拽指示条 */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </div>

            {/* 标题 */}
            <h3 className="text-xl font-bold text-gray-800 text-center mb-8">
              {displayDate} 学习态度
            </h3>

            {/* 星星评分 */}
            <div className="flex flex-col items-center mb-8">
              <p className="text-sm text-gray-500 mb-4 font-medium">点击评分</p>
              <StarRating value={stars} onChange={setStars} size="lg" />
              <motion.p 
                key={stars}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-3 text-2xl font-bold text-amber-500"
              >
                {stars} 颗星
              </motion.p>
            </div>

            {/* 备注输入 */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">备注（可选）</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="今天学习表现如何？"
                maxLength={200}
                rows={3}
                className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-200"
              />
            </div>

            {/* 按钮 */}
            <div className="flex gap-3">
              {existing && onDelete && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onDelete();
                    onClose();
                  }}
                  className="flex-1 py-3.5 rounded-2xl text-red-500 bg-red-50 font-semibold hover:bg-red-100 transition-colors"
                >
                  删除
                </motion.button>
              )}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl text-gray-600 bg-gray-100 font-semibold hover:bg-gray-200 transition-colors"
              >
                取消
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex-[2] py-3.5 rounded-2xl text-white bg-gradient-to-r from-blue-500 to-indigo-500 font-bold hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg shadow-blue-500/30"
              >
                保存
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
