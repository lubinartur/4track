'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AppBackgroundLighting from '@/components/AppBackgroundLighting';
import BottomNavigation from '@/components/BottomNavigation';
import DiscoverHero from '@/components/discover/DiscoverHero';
import DiscoverRows from '@/components/discover/DiscoverRows';
import { discoverTabItems } from '@/app/discover/mockData';

export default function DiscoverPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>(() => discoverTabItems[0].id);

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[390px] overflow-hidden bg-[#161620]">
      <AppBackgroundLighting />

      <div className="app-page-safe-top relative z-[1] flex flex-col px-4 pb-40">
        <main className="contents">
          <DiscoverHero
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onSearchSubmit={(q) => {
              router.push(`/discover/search?q=${encodeURIComponent(q)}`);
            }}
          />
          <DiscoverRows activeTab={activeTab} />
        </main>

        <BottomNavigation activeItem="discover" />
      </div>
    </div>
  );
}
