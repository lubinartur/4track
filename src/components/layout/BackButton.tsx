'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  fallbackPath?: string;
  className?: string;
}

export default function BackButton({ fallbackPath, className = '' }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    try {
      router.back();
    } catch {
      if (fallbackPath) {
        router.push(fallbackPath);
      }
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-black/40 backdrop-blur-sm text-white/80 transition-colors hover:bg-black/60 hover:text-white ${className}`}
      aria-label="Back"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 4L6 10L12 16" />
      </svg>
    </button>
  );
}
