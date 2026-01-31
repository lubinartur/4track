'use client';

interface UserRatingProps {
  value?: number;
  onChange: (value: number) => void;
}

export default function UserRating({ value, onChange }: UserRatingProps) {
  // Rating pills: 6-10 (most common range)
  const ratingSteps = [6, 7, 8, 9, 10];
  const hasValue = value != null;

  return (
    <div className="mt-6">
      <div className="flex gap-2 flex-wrap">
        {ratingSteps.map((step) => (
          <button
            key={step}
            onClick={() => onChange(step)}
            className={`px-4 py-2 text-sm rounded-lg border font-medium transition-colors ${
              hasValue && Math.abs(value - step) < 0.1
                ? 'bg-white/10 border-white/30 text-white'
                : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/[0.08] hover:border-white/10'
            }`}
          >
            {step}
          </button>
        ))}
      </div>
    </div>
  );
}
