'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Check, Plus } from 'lucide-react';
import ItemMetaRow from '@/components/item/ItemMetaRow';
import { libraryInputFromSearchResult } from '@/lib/libraryMovieInput';
import { useLibraryStore } from '@/store/libraryStore';
import type { DiscoverSearchResultItem } from '@/types/discoverSearch';

type SearchResultItemProps = {
  item: DiscoverSearchResultItem;
};

function itemDetailHref(item: DiscoverSearchResultItem): string | undefined {
  if (item.itemSlug && item.itemSlug.length > 0) return `/item/${item.itemSlug}`;
  if (/^tmdb-\d+$/.test(item.id)) return `/item/${item.id}`;
  return undefined;
}

/**
 * Discover Search row — poster, title, meta, Queue + Watched.
 * Row `Link` only when there is a resolvable item route (curated slug or `tmdb-{id}`); otherwise no dead tap target.
 */
export default function SearchResultItem({ item }: SearchResultItemProps) {
  const href = itemDetailHref(item);

  const addToQueue = useLibraryStore((s) => s.addToQueue);
  const markWatched = useLibraryStore((s) => s.markWatched);
  const libraryInput = useMemo(() => libraryInputFromSearchResult(item), [item]);
  const canSave = libraryInput != null;

  const poster = (
    <div
      className={[
        'relative h-[120px] w-20 shrink-0 overflow-hidden rounded-[20px]',
        'bg-gradient-to-br from-[#1c1c26] via-[#0f0f14] to-[#08080c]',
        'shadow-[0px_8px_20px_0px_rgba(0,0,0,0.35)]',
      ].join(' ')}
    >
      {item.posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- until `next/image` domains are configured
        <img src={item.posterUrl} alt={item.title} className="h-full w-full object-cover" />
      ) : (
        <div
          className="h-full w-full bg-[radial-gradient(ellipse_72%_58%_at_50%_42%,rgba(255,255,255,0.055),transparent_68%)]"
          aria-hidden
        />
      )}
    </div>
  );

  return (
    <article className="relative flex w-full max-w-[358px] flex-nowrap items-center gap-4 pr-4">
      {href ? (
        <Link
          href={href}
          className="absolute inset-0 z-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#ff5b00]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161620]"
          aria-label={`Open ${item.title}`}
        >
          <span className="absolute inset-0 block" aria-hidden />
        </Link>
      ) : null}

      <div
        className={[
          'relative z-[1] flex min-w-0 flex-1 gap-4',
          href ? 'pointer-events-none' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="shrink-0">{poster}</div>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
          <div className="flex min-w-0 flex-col gap-3">
            <h2 className="text-[16px] font-medium leading-normal text-white">{item.title}</h2>
            <ItemMetaRow
              rating={item.rating}
              year={item.year}
              genresLabel={item.genresLabel}
              className="flex-nowrap"
            />
          </div>
          <div
            className={[
              'relative z-[2] flex flex-nowrap items-center gap-3',
              href ? 'pointer-events-auto' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <button
              type="button"
              disabled={!canSave}
              onClick={() => libraryInput && addToQueue(libraryInput)}
              className="inline-flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-[#ff5b00] px-4 text-[12px] font-normal leading-none text-white transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5b00]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161620] enabled:active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
            >
              <Plus size={14} strokeWidth={1.5} aria-hidden />
              Queue
            </button>
            <button
              type="button"
              disabled={!canSave}
              onClick={() => libraryInput && markWatched(libraryInput)}
              className="inline-flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border border-solid border-[#ff5b00] bg-[#101018] px-4 text-[12px] font-normal leading-none text-white transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5b00]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161620] enabled:active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
            >
              <Check size={14} strokeWidth={1.5} aria-hidden />
              Watched
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
