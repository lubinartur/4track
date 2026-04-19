'use client';

type OnboardingProgressProps = {
  current: number;
  total: number;
  className?: string;
};

export default function OnboardingProgress({ current, total, className }: OnboardingProgressProps) {
  return (
    <p
      className={[
        'text-[20px] font-normal leading-normal text-[rgba(255,255,255,0.5)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="text-[#ff5b00]">{current}</span>
      <span>/{total} movies rated</span>
    </p>
  );
}

