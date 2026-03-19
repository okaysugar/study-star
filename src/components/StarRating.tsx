import { motion } from 'framer-motion';

interface StarRatingProps {
  value: number;
  onChange?: (value: 1 | 2 | 3 | 4 | 5) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ value, onChange, readonly = false, size = 'md' }: StarRatingProps) {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  const gapClass = {
    sm: 'gap-0.5',
    md: 'gap-1',
    lg: 'gap-1.5',
  }[size];

  const handleStarClick = (star: 1 | 2 | 3 | 4 | 5) => {
    if (readonly) return;
    // 触发设备震动反馈 (如果支持)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
    onChange?.(star);
  };

  return (
    <div className={`flex items-center ${gapClass}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => handleStarClick(star as 1 | 2 | 3 | 4 | 5)}
          whileTap={!readonly ? { scale: 0.8, rotate: -15 } : undefined}
          whileHover={!readonly ? { scale: 1.1 } : undefined}
          className={`${sizeClass} ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <motion.svg 
            viewBox="0 0 24 24" 
            className="w-full h-full drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            initial={false}
            animate={{
              scale: star <= value ? [1, 1.2, 1] : 1,
              rotate: star <= value ? [0, 10, -10, 0] : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={star <= value ? '#FDE047' : '#FFFFFF'}
              stroke="#000000"
              strokeWidth="2"
              strokeLinejoin="round"
              className="transition-colors duration-200"
            />
          </motion.svg>
        </motion.button>
      ))}
    </div>
  );
}
