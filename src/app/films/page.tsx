'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import PageContainer from '@/components/layout/PageContainer';
import PageShell from '@/components/layout/PageShell';
import CuratedRail from '@/components/curated/CuratedRail';
import { useWatchedFilms, useQueuedFilms } from '@/db/hooksEntries';
import { setEntryStatus, deleteEntry } from '@/repos/entriesRepo';
import { PageFade } from '@/components/motion/Motion';
import type { ItemView } from '@/types/itemView';

// Local component for horizontal rail with small cards (only used in this file)
function HorizontalRail({
  items,
  mode,
  onMarkWatched,
  onMoveToQueue,
  onRemove,
}: {
  items: ItemView[];
  mode: 'queue' | 'watched';
  onMarkWatched?: (itemId: string) => void;
  onMoveToQueue?: (itemId: string) => void;
  onRemove?: (itemId: string, itemTitle: string) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2" style={{ WebkitOverflowScrolling: 'touch' }}>
      {items.slice(0, 12).map((item) => {
        const hasImage = item.posterUrl || item.backdropUrl;
        const year = item.year?.toString();
        const userRating = mode === 'watched' && item.entry?.userRating != null 
          ? String(item.entry.userRating) 
          : null;

        return (
          <div key={item.id} className="snap-start shrink-0 w-[calc((100%-1rem)/2)] sm:w-[calc((100%-1rem)/2)]">
            <Link
              href={`/item/${item.id}`}
              className="relative aspect-[2/3] rounded-[24px] overflow-hidden border border-white/10 bg-white/5 block"
            >
              {/* Image */}
              {hasImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.posterUrl || item.backdropUrl}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : null}

              {/* Action icons overlay (top-right) */}
              <div
                className="absolute top-2 right-2 z-20 flex gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                {mode === 'queue' && onMarkWatched && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onMarkWatched(item.id);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur border border-white/10 text-white/80 hover:bg-black/70 hover:text-white transition-colors"
                    aria-label="Mark as watched"
                    title="Mark as watched"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </button>
                )}
                {mode === 'watched' && onMoveToQueue && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onMoveToQueue(item.id);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur border border-white/10 text-white/80 hover:bg-black/70 hover:text-white transition-colors"
                    aria-label="Move back to queue"
                    title="Move back to queue"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7v6h6" />
                      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                    </svg>
                  </button>
                )}
                {onRemove && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onRemove(item.id, item.title);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur border border-white/10 text-white/80 hover:bg-black/70 hover:text-red-300 transition-colors"
                    aria-label="Remove"
                    title="Remove"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Bottom gradient overlay */}
              <div 
                className="absolute inset-0 pointer-events-none rounded-[24px]" 
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 45%, rgba(0,0,0,0.35) 65%, rgba(0,0,0,0.1) 80%, rgba(0,0,0,0) 90%)'
                }}
              />

              {/* Bottom overlay - title + metadata */}
              <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-4">
                <h3 className="text-[11px] font-medium text-white leading-tight line-clamp-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]">
                  {item.title}
                </h3>
                {(year || userRating) && (
                  <div className="text-[10px] mt-0.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] flex items-center gap-1.5">
                    {year && (
                      <span className="text-white/60">{year}</span>
                    )}
                    {year && userRating && (
                      <span className="text-white/40">•</span>
                    )}
                    {userRating && (
                      <span className="text-orange-500 font-semibold tracking-wide">
                        ★ {userRating}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default function FilmsPage() {
  const { items, loading: filmsLoading } = useWatchedFilms();
  const { items: queuedItems, loading: queuedLoading } = useQueuedFilms();

  const handleMarkWatched = useCallback(async (itemId: string) => {
    try {
      await setEntryStatus(itemId, 'watched');
    } catch (error) {
      console.error('Error marking as watched:', error);
    }
  }, []);

  const handleMoveToQueue = useCallback(async (itemId: string) => {
    try {
      await setEntryStatus(itemId, 'queued');
    } catch (error) {
      console.error('Error moving to queue:', error);
    }
  }, []);

  const handleRemove = useCallback(async (itemId: string, itemTitle: string) => {
    if (!confirm(`Remove "${itemTitle}" from your list?`)) {
      return;
    }

    try {
      await deleteEntry(itemId);
    } catch (error) {
      console.error('Error removing film:', error);
    }
  }, []);

  return (
    <PageFade>
      <div className="relative min-h-screen overflow-hidden">
      {/* Cinematic vignette background */}
      <div className="fixed inset-0 bg-[#0b0b0f]">
        {/* Radial vignette - edges darker */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(11, 11, 15, 0) 0%, rgba(11, 11, 15, 0.3) 40%, rgba(5, 5, 8, 0.8) 100%)'
          }}
        />
        {/* Subtle top glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a20]/20 via-transparent to-transparent" />
        {/* Optional noise-like effect */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
            backgroundSize: '100% 4px'
          }}
        />
      </div>

      {/* Content container */}
      <PageContainer>
        <PageShell kicker="LIBRARY" title="Films">
          {/* Curated for you */}
          <div className="mb-12">
            <h2 className="mb-5 text-[18px] font-medium tracking-tight text-white/85">
              Curated for you
            </h2>
            <CuratedRail domain="film" count={3} />
          </div>

          {/* Up Next (Queue) */}
          {queuedItems.length > 0 && (
            <div className="mb-12">
              <div className="mb-4 flex items-end justify-between px-4">
                <h2 className="text-[18px] font-medium tracking-tight text-white/85">
                  Up Next
                </h2>
                {queuedItems.length > 2 && (
                  <Link
                    href="/films/queue"
                    className="text-[13px] font-medium text-orange-500 transition-colors hover:text-orange-400 flex items-center gap-1"
                  >
                    View all
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Link>
                )}
              </div>
              {queuedLoading ? (
                <div className="text-white/50 text-sm px-4">Loading...</div>
              ) : (
                <HorizontalRail
                  items={queuedItems}
                  mode="queue"
                  onMarkWatched={handleMarkWatched}
                  onRemove={handleRemove}
                />
              )}
            </div>
          )}

          {/* Recently watched */}
          {items.length > 0 && (
            <div className="mb-12">
              <div className="mb-4 flex items-end justify-between px-4">
                <h2 className="text-[18px] font-medium tracking-tight text-white/85">
                  Recently Watched
                </h2>
                {items.length > 2 && (
                  <Link
                    href="/films/all"
                    className="text-[13px] font-medium text-orange-500 transition-colors hover:text-orange-400 flex items-center gap-1"
                  >
                    View all
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Link>
                )}
              </div>
              {filmsLoading ? (
                <div className="text-white/50 text-sm px-4">Loading...</div>
              ) : (
                <HorizontalRail
                  items={items}
                  mode="watched"
                  onMoveToQueue={handleMoveToQueue}
                  onRemove={handleRemove}
                />
              )}
            </div>
          )}
        </PageShell>
      </PageContainer>
      </div>
    </PageFade>
  );
}
