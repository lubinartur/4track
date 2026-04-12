'use client';

import { useCallback, useState } from 'react';
import AppBackgroundLighting from '@/components/AppBackgroundLighting';
import BottomNavigation from '@/components/BottomNavigation';
import TasteInsightCard from '@/components/TasteInsightCard';
import HomeHeroCarousel from '@/components/home/HomeHeroCarousel';
import RecommendedSection from '@/components/home/RecommendedSection';
import { homeHeroSlides, homeRecommended } from '@/app/home/mockData';
import type { HomeHeroContent } from '@/types/homeHero';

const INITIAL_INDEX = 1;

export default function HomePage() {
  const [activeHero, setActiveHero] = useState<HomeHeroContent>(
    () => homeHeroSlides[INITIAL_INDEX],
  );

  const handleActiveSlideChange = useCallback((slide: HomeHeroContent) => {
    setActiveHero(slide);
  }, []);

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[390px] overflow-x-visible bg-[#161620]">
      <AppBackgroundLighting />

      <div className="relative z-[1] flex flex-col px-4 pb-44 pt-3">
        <main className="contents">
          <h1 className="mt-5 text-[32px] font-bold leading-none tracking-normal text-white">
            Hello, ar4
          </h1>

          <HomeHeroCarousel
            slides={homeHeroSlides}
            initialIndex={INITIAL_INDEX}
            onActiveSlideChange={handleActiveSlideChange}
          />

          <div className="mt-2 flex w-full justify-center">
            <div className="w-full max-w-[326px]">
              <TasteInsightCard
                entryCount={activeHero.tasteInsight.entryCount}
                description={activeHero.tasteInsight.description}
              />
            </div>
          </div>

          <div className="mt-8 w-full">
            <RecommendedSection items={homeRecommended} />
          </div>
        </main>

        <BottomNavigation activeItem="home" />
      </div>
    </div>
  );
}
