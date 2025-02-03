import { cn } from '@/app/lib/utils';
import { StarIcon } from 'lucide-react';

export default function StarsRatingInput({
  value,
  onValueChange,
  length = 5,
}: {
  value: number;
  onValueChange: (value: number) => void;
  length?: number;
}) {
  return (
    <div className="flex items-center gap-x-1">
      {Array.from({ length }, (_, i) => (
        <button key={i} type="button" onClick={() => onValueChange(i + 1)}>
          <StarIcon className={cn('size-8 text-primary', value > i && 'fill-primary')} />
        </button>
      ))}
      <span className="text-xl">{value}</span>
    </div>
  );
}
