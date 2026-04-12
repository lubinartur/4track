'use client';

import LibraryListItem from '@/components/library/LibraryListItem';
import type { LibraryEntry, LibraryTabId } from '@/app/library/mockData';

type LibraryListProps = {
  items: LibraryEntry[];
  activeTab: LibraryTabId;
};

const EMPTY_COPY: Record<LibraryTabId, string> = {
  queue: 'Your queue is empty.',
  watched: 'No watched films yet.',
  favorites: 'No favorites yet.',
};

export default function LibraryList({ items, activeTab }: LibraryListProps) {
  if (items.length === 0) {
    return (
      <p className="mt-4 max-w-[358px] text-[14px] font-normal leading-snug text-[rgba(255,255,255,0.5)]">
        {EMPTY_COPY[activeTab]}
      </p>
    );
  }

  return (
    <ul className="mt-4 flex w-full flex-col gap-5" aria-label="Library titles">
      {items.map((entry) => (
        <li key={entry.id}>
          <LibraryListItem entry={entry} />
        </li>
      ))}
    </ul>
  );
}
