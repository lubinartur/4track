'use client';

import { useRouter } from 'next/navigation';
import AppBackgroundLighting from '@/components/AppBackgroundLighting';
import OnboardingHeroPreviewCard from '@/components/onboarding/OnboardingHeroPreviewCard';
import { onboardingHeroPreview } from '@/app/onboarding/mockData';

export default function OnboardingWelcomePage() {
  const router = useRouter();

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[390px] overflow-hidden bg-[#161620]">
      <AppBackgroundLighting />

      <div className="relative z-[1] flex min-h-screen flex-col px-4 pb-0 pt-0">
        <main className="flex flex-1 flex-col">
          <div className="mt-[63px] w-full max-w-[358px] text-[32px] font-bold leading-normal text-white">
            <p className="m-0">Your taste has a</p>
            <p className="m-0 text-[#ff5b00]">pattern.</p>
          </div>

          <div className="mt-4 w-full max-w-[358px] text-[20px] font-normal leading-normal text-white">
            <p className="m-0">4Track learns what you love</p>
            <p className="m-0">and finds your next perfect movie.</p>
          </div>

          <div className="mt-6 flex w-full justify-center">
            <OnboardingHeroPreviewCard
              title={onboardingHeroPreview.title}
              posterUrl={onboardingHeroPreview.posterUrl}
              rating={onboardingHeroPreview.rating}
              year={onboardingHeroPreview.year}
              genresLabel={onboardingHeroPreview.genresLabel}
              aiMatchPercent={onboardingHeroPreview.aiMatchPercent}
              reasonTags={onboardingHeroPreview.reasonTags}
              mode="welcome"
            />
          </div>
        </main>

        <button
          type="button"
          onClick={() => router.push('/onboarding/genres')}
          className="mx-auto mb-9 inline-flex h-[44px] w-[297px] items-center justify-center rounded-[12px] bg-[#ff5b00] px-4 py-[10px] text-[12px] font-normal leading-none text-white transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5b00]/45 active:scale-[0.98]"
        >
          Discover your taste →
        </button>
      </div>
    </div>
  );
}

