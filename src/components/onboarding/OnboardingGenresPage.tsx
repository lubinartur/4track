'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import AppBackgroundLighting from '@/components/AppBackgroundLighting';
import GenreCard from '@/components/onboarding/GenreCard';
import { onboardingGenres } from '@/app/onboarding/mockData';
import { useOnboardingStore } from '@/store/onboardingStore';

const MAX = 3;

export default function OnboardingGenresPage() {
  const router = useRouter();
  const selectedGenres = useOnboardingStore((s) => s.selectedGenres);
  const toggleGenre = useOnboardingStore((s) => s.toggleGenre);

  const selectedSet = useMemo(() => new Set(selectedGenres), [selectedGenres]);
  const atCap = selectedGenres.length >= MAX;

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[390px] overflow-hidden bg-[#161620]">
      <AppBackgroundLighting />

      <div className="relative z-[1] flex min-h-screen flex-col px-4 pb-0 pt-0">
        <main className="flex flex-1 flex-col">
          <div className="mt-[63px] text-[32px] font-bold leading-normal text-white">
            <p className="m-0">
              Pick your <span className="text-[#ff5b00]">favorite</span>
            </p>
            <p className="m-0">genres</p>
          </div>

          <p className="mt-4 text-[20px] font-normal leading-normal text-white">
            Choose <span className="text-[#ff5b00]">up to 3 genres</span>
          </p>

          <p className="mt-[13px] text-[20px] font-normal leading-normal text-[rgba(255,255,255,0.5)]">
            Selected:{' '}
            <span className="text-[#ff5b00]">
              {selectedGenres.length}/{MAX}
            </span>
          </p>

          <div className="mt-[21px] grid grid-cols-2 gap-x-[12px] gap-y-[12px]">
            {onboardingGenres.map((g) => {
              const selected = selectedSet.has(g.label);
              const disabled = !selected && atCap;
              return (
                <GenreCard
                  key={g.id}
                  label={g.label}
                  imageUrl={g.imageUrl}
                  selected={selected}
                  disabled={disabled}
                  onToggle={() => toggleGenre(g.label, MAX)}
                />
              );
            })}
          </div>
        </main>

        <button
          type="button"
          disabled={selectedGenres.length === 0}
          onClick={() => router.push('/onboarding/rate')}
          className={[
            'mx-auto mb-9 inline-flex h-[44px] w-[297px] items-center justify-center rounded-[12px] px-4 py-[10px] text-[12px] font-normal leading-none text-white transition-[opacity,transform,background-color] duration-[170ms] ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5b00]/45',
            selectedGenres.length === 0
              ? 'cursor-not-allowed bg-[#383838] opacity-100'
              : 'bg-[#ff5b00] hover:opacity-95 active:scale-[0.98]',
          ].join(' ')}
        >
          Discover your taste →
        </button>
      </div>
    </div>
  );
}

