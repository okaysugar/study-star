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
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-lg bg-[#FFFBEB] rounded-t-[2rem] px-6 pt-4 pb-8 border-t-4 border-black shadow-[0_-8px_0px_0px_rgba(0,0,0,0.2)]"
          >
            {/* 拖拽指示条 */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-2 bg-black/20 rounded-full" />
            </div>

            {/* 标题 */}
            <h3 className="text-2xl font-black text-black text-center mb-8" style={{ textShadow: '2px 2px 0px #FDE68A' }}>
              {displayDate} 学习态度
            </h3>

            {/* 星星评分 */}
            <div className="flex flex-col items-center mb-8 bg-white p-6 rounded-3xl border-2 border-black shadow-cartoon-sm">
              <p className="text-base text-black mb-4 font-bold">点击星星打分!</p>
              <StarRating value={stars} onChange={setStars} size="lg" />
              <motion.p 
                key={stars}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-4 text-3xl font-black text-black"
                style={{ textShadow: '2px 2px 0px #FDE68A' }}
              >
                {stars} 颗星
              </motion.p>
            </div>

            {/* 备注输入 */}
            <div className="mb-8">
              <label className="block text-base font-black text-black mb-3">写点什么吧~ (可选)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="今天学习表现如何？"
                maxLength={200}
                rows={3}
                className="w-full px-5 py-4 bg-white border-2 border-black rounded-2xl text-black placeholder-gray-400 font-bold resize-none focus:outline-none focus:shadow-cartoon transition-all duration-200"
              />
            </div>

            {/* 按钮 */}
            <div className="flex gap-4">
              {existing && onDelete && (
                <motion.button
                  whileTap={{ scale: 0.95, y: 4, x: 4 }}
                  onClick={() => {
                    onDelete();
                    onClose();
                  }}
                  className="flex-1 py-4 rounded-2xl text-black bg-[#FECACA] border-2 border-black font-black shadow-cartoon active:shadow-cartoon-active transition-all"
                >
                  删除
                </motion.button>
              )}
              <motion.button
                whileTap={{ scale: 0.95, y: 4, x: 4 }}
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl text-black bg-white border-2 border-black font-black shadow-cartoon active:shadow-cartoon-active transition-all"
              >
                取消
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95, y: 4, x: 4 }}
                onClick={handleSave}
                className="flex-[2] py-4 rounded-2xl text-black bg-[#A7F3D0] border-2 border-black font-black text-lg shadow-cartoon active:shadow-cartoon-active transition-all"
              >
                保存记录!
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
