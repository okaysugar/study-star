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

  return (
    <div className={`flex items-center ${gapClass}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star as 1 | 2 | 3 | 4 | 5)}
          className={`${sizeClass} transition-all duration-200 ${
            readonly ? 'cursor-default' : 'cursor-pointer active:scale-125'
          }`}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={star <= value ? '#FBBF24' : '#E5E7EB'}
              stroke={star <= value ? '#F59E0B' : '#D1D5DB'}
              strokeWidth="1"
              className="transition-colors duration-200"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}
