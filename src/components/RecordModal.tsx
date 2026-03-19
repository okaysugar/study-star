import { useEffect, useRef, useState } from 'react';
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
  const [visible, setVisible] = useState(false);

  // 打开时重置
  useEffect(() => {
    if (open) {
      setStars(existing?.stars ?? 3);
      setNote(existing?.note ?? '');
      // 延迟触发入场动画
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [open, existing]);

  if (!open) return null;

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
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 flex items-end justify-center bg-black/40 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`w-full max-w-lg bg-white rounded-t-3xl px-6 pt-6 pb-8 transition-transform duration-300 ease-out ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* 拖拽指示条 */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* 标题 */}
        <h3 className="text-lg font-semibold text-gray-800 text-center mb-6">
          {displayDate} 学习态度
        </h3>

        {/* 星星评分 */}
        <div className="flex flex-col items-center mb-6">
          <p className="text-sm text-gray-500 mb-3">点击评分</p>
          <StarRating value={stars} onChange={setStars} size="lg" />
          <p className="mt-2 text-2xl font-bold text-amber-500">{stars} 颗星</p>
        </div>

        {/* 备注输入 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">备注（可选）</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="今天学习表现如何？"
            maxLength={200}
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
        </div>

        {/* 按钮 */}
        <div className="flex gap-3">
          {existing && onDelete && (
            <button
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="flex-1 py-3 rounded-xl text-red-500 bg-red-50 font-medium active:bg-red-100 transition"
            >
              删除
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-gray-600 bg-gray-100 font-medium active:bg-gray-200 transition"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex-2 py-3 rounded-xl text-white bg-blue-500 font-semibold active:bg-blue-600 transition shadow-lg shadow-blue-500/25"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
