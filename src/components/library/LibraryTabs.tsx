'use client';

import Tabs from '@/components/Tabs';
import type { TabItem } from '@/types/tabs';
import type { LibraryTabId } from '@/app/library/mockData';

type LibraryTabsProps = {
  activeTab: LibraryTabId;
  counts: Record<LibraryTabId, number>;
  onTabChange: (tab: LibraryTabId) => void;
};

const TAB_IDS: LibraryTabId[] = ['queue', 'watched', 'favorites'];

export default function LibraryTabs({ activeTab, counts, onTabChange }: LibraryTabsProps) {
  const items: TabItem[] = TAB_IDS.map((id) => {
    const n = counts[id];
    const label =
      id === 'queue' ? `Queue (${n})` : id === 'watched' ? `Watched (${n})` : `Favorites (${n})`;
    return { id, label };
  });

  return (
    <div className="mt-6 min-w-0 w-full">
      <Tabs
        items={items}
        activeItem={activeTab}
        onChange={(id) => onTabChange(id as LibraryTabId)}
      />
    </div>
  );
}
