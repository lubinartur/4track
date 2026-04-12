'use client';

import { useMemo, useState } from 'react';
import AppBackgroundLighting from '@/components/AppBackgroundLighting';
import BottomNavigation from '@/components/BottomNavigation';
import LibraryList from '@/components/library/LibraryList';
import LibraryTabs from '@/components/library/LibraryTabs';
import { libraryTabCounts, libraryVisibleEntries, type LibraryTabId } from '@/app/library/mockData';
import { useLibraryStore } from '@/store/libraryStore';

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<LibraryTabId>('queue');

  const entriesByKey = useLibraryStore((s) => s.entriesByKey);
  const entries = useMemo(() => Object.values(entriesByKey), [entriesByKey]);

  const counts = useMemo(() => libraryTabCounts(entries), [entries]);

  const visibleItems = useMemo(() => libraryVisibleEntries(activeTab, entries), [activeTab, entries]);

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[390px] overflow-hidden bg-[#161620]">
      <AppBackgroundLighting />

      <div className="relative z-[1] flex flex-col px-4 pb-40 pt-3">
        <main className="flex flex-col">
          <h1 className="mt-5 text-[32px] font-bold leading-none tracking-normal text-white">Library</h1>

          <LibraryTabs activeTab={activeTab} counts={counts} onTabChange={setActiveTab} />

          <LibraryList items={visibleItems} activeTab={activeTab} />
        </main>

        <BottomNavigation activeItem="library" />
      </div>
    </div>
  );
}
