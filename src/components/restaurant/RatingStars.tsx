import { Star } from 'lucide-react';

interface RatingStarsProps {
  value: number;
  count?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
}

export function RatingStars({ value, count, size = 16, interactive = false, onChange }: RatingStarsProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <Star
          key={star}
          size={size}
          className={`${star <= Math.round(value) ? 'fill-primary-500 text-primary-500' : 'text-gray-300'} ${
            interactive ? 'cursor-pointer' : ''
          }`}
          onClick={interactive ? () => onChange?.(star) : undefined}
        />
      ))}
      {count !== undefined && <span className="text-xs text-gray-500">({count})</span>}
    </div>
  );
}
