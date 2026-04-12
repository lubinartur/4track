'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Check, Trash2 } from 'lucide-react';
import ItemMetaRow from '@/components/item/ItemMetaRow';
import type { LibraryEntry } from '@/app/library/mockData';
import { libraryInputFromEntry } from '@/lib/libraryMovieInput';
import { useLibraryStore } from '@/store/libraryStore';

type LibraryListItemProps = {
  entry: LibraryEntry;
};

function itemHref(entry: LibraryEntry): string | undefined {
  if (entry.itemSlug && entry.itemSlug.length > 0) return `/item/${entry.itemSlug}`;
  if (/^tmdb-\d+$/.test(entry.id)) return `/item/${entry.id}`;
  return undefined;
}

/**
 * Library row — poster + title/meta + Watched (primary) + delete (secondary), aligned with SearchResultItem rhythm.
 */
export default function LibraryListItem({ entry }: LibraryListItemProps) {
  const href = itemHref(entry);

  const markWatched = useLibraryStore((s) => s.markWatched);
  const removeFromLibrary = useLibraryStore((s) => s.removeFromLibrary);
  const libraryInput = useMemo(() => libraryInputFromEntry(entry), [entry]);

  const poster = (
    <div
      className={[
        'relative h-[120px] w-20 shrink-0 overflow-hidden rounded-[20px]',
        'bg-gradient-to-br from-[#1c1c26] via-[#0f0f14] to-[#08080c]',
        'shadow-[0px_8px_20px_0px_rgba(0,0,0,0.35)]',
      ].join(' ')}
    >
      {entry.posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- until `next/image` domains are configured
        <img src={entry.posterUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div
          className="h-full w-full bg-[radial-gradient(ellipse_72%_58%_at_50%_42%,rgba(255,255,255,0.055),transparent_68%)]"
          aria-hidden
        />
      )}
    </div>
  );

  return (
    <article className="relative flex w-full max-w-[358px] flex-nowrap items-start gap-4 pr-4">
      {href ? (
        <Link
          href={href}
          className="absolute inset-0 z-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#ff5b00]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161620]"
          aria-label={`Open ${entry.title}`}
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
            <h2 className="text-[16px] font-medium leading-tight tracking-[-0.01em] text-white">
              {entry.title}
            </h2>
            <ItemMetaRow
              rating={entry.rating}
              year={entry.year}
              genresLabel={entry.genresLabel}
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
              onClick={() => markWatched(libraryInput)}
              className="inline-flex h-[44px] shrink-0 items-center gap-2 whitespace-nowrap rounded-[12px] bg-[#ff5b00] px-4 py-2.5 text-[12px] font-normal leading-none text-white transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5b00]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161620] active:scale-[0.98]"
            >
              <Check size={14} strokeWidth={1.5} className="shrink-0" aria-hidden />
              Watched
            </button>
            <button
              type="button"
              aria-label={`Remove ${entry.title} from library`}
              onClick={() => removeFromLibrary(entry.id)}
              className="inline-flex h-[44px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[12px] border border-solid border-[#ff5b00] bg-[#101018] px-4 py-2.5 text-white transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5b00]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161620] active:scale-[0.98]"
            >
              <Trash2 size={14} strokeWidth={1.5} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
