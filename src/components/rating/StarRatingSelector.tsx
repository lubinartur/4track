'use client';

import { Star } from 'lucide-react';

type StarRatingSelectorProps = {
  value: number;
  onChange: (value: number) => void;
  max?: number;
};

/**
 * Interactive 1–5 stars; `value` is the selected count (0 = none).
 */
export default function StarRatingSelector({ value, onChange, max = 5 }: StarRatingSelectorProps) {
  return (
    <div
      className="flex items-center justify-center gap-2"
      role="radiogroup"
      aria-label="Your rating"
    >
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const filled = n <= value;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={filled}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            onClick={() => onChange(n)}
            className="flex size-10 shrink-0 items-center justify-center rounded-md text-[#ff5b00] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5b00]/45"
          >
            <Star
              size={32}
              strokeWidth={1.5}
              className={
                filled
                  ? 'fill-[#ff5b00] text-[#ff5b00]'
                  : 'fill-transparent text-white/90'
              }
            />
          </button>
        );
      })}
    </div>
  );
}
