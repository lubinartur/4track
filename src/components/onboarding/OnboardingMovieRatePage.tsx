'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppBackgroundLighting from '@/components/AppBackgroundLighting';
import OnboardingHeroPreviewCard from '@/components/onboarding/OnboardingHeroPreviewCard';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress';
import { onboardingMovies } from '@/app/onboarding/mockData';
import { useOnboardingStore } from '@/store/onboardingStore';

const TARGET = 10;

export default function OnboardingMovieRatePage() {
  const router = useRouter();
  const ratedMovieIds = useOnboardingStore((s) => s.ratedMovieIds);
  const ratedMoviesCount = useOnboardingStore((s) => s.ratedMoviesCount);
  const rateMovie = useOnboardingStore((s) => s.rateMovie);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

  const [cursor, setCursor] = useState(0);

  const nextMovie = useMemo(() => {
    const ratedSet = new Set(ratedMovieIds);
    for (let i = 0; i < onboardingMovies.length; i++) {
      const idx = (cursor + i) % onboardingMovies.length;
      const m = onboardingMovies[idx];
      if (!ratedSet.has(m.id)) return { movie: m, idx };
    }
    return { movie: onboardingMovies[cursor % onboardingMovies.length], idx: cursor % onboardingMovies.length };
  }, [cursor, ratedMovieIds]);

  const canFinish = ratedMoviesCount >= TARGET;

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[390px] overflow-hidden bg-[#161620]">
      <AppBackgroundLighting />

      <div className="app-page-safe-top relative z-[1] flex min-h-screen flex-col px-4 pb-0">
        <main className="flex flex-1 flex-col">
          <h1 className="mt-0 text-[32px] font-bold leading-normal text-white">Tell us what you like</h1>
          <p className="mt-4 w-full max-w-[358px] text-[20px] font-normal leading-normal text-white">
            Rate a few movies to train your recommendations
          </p>

          <OnboardingProgress className="mt-[19px]" current={ratedMoviesCount} total={TARGET} />

          <div className="mt-[21px] flex w-full justify-center">
            <OnboardingHeroPreviewCard
              title={nextMovie.movie.title}
              posterUrl={nextMovie.movie.posterUrl}
              rating={nextMovie.movie.rating}
              year={nextMovie.movie.year}
              genresLabel={nextMovie.movie.genresLabel}
              aiMatchPercent={nextMovie.movie.aiMatchPercent}
              reasonTags={nextMovie.movie.reasonTags}
              mode="rate"
              onLike={() => {
                rateMovie(nextMovie.movie.id, 'like');
                setCursor((c) => c + 1);
              }}
              onNotSeen={() => {
                rateMovie(nextMovie.movie.id, 'not-seen');
                setCursor((c) => c + 1);
              }}
            />
          </div>
        </main>

        <button
          type="button"
          disabled={!canFinish}
          onClick={() => {
            if (!canFinish) return;
            completeOnboarding();
            router.replace('/discover');
          }}
          className={[
            'mx-auto mb-9 inline-flex h-[44px] w-[297px] items-center justify-center rounded-[12px] px-4 py-[10px] text-[12px] font-normal leading-none text-white transition-[opacity,transform,background-color] duration-[170ms] ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5b00]/45',
            canFinish ? 'bg-[#ff5b00] hover:opacity-95 active:scale-[0.98]' : 'cursor-not-allowed bg-[#383838] opacity-100',
          ].join(' ')}
        >
          Discover your taste →
        </button>
      </div>
    </div>
  );
}

