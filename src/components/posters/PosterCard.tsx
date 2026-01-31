'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ActionIconButton from '@/components/shared/ActionIconButton';
import type { ItemView } from '@/types/itemView';

type CardSize = 'hero' | 'row' | 'grid';

interface PosterCardProps {
  item: ItemView;
  mode: 'queue' | 'watched';
  size?: CardSize;
  onMarkWatched?: (itemId: string) => void;
  onMoveToQueue?: (itemId: string) => void;
  onRemove?: (itemId: string, itemTitle: string) => void;
}

export default function PosterCard({
  item,
  mode,
  size = 'row',
  onMarkWatched,
  onMoveToQueue,
  onRemove,
}: PosterCardProps) {
  const hasImage = item.posterUrl || item.backdropUrl;

  // Separate year and user rating for proper styling
  const year = item.year?.toString();
  // Show rating only if mode is 'watched' and rating exists (not null/undefined)
  const userRating = mode === 'watched' && item.entry?.userRating != null 
    ? String(item.entry.userRating) 
    : null;

  // Size-based classes - unified sizing: all cards same aspect ratio
  // row: fixed width for horizontal rail
  // grid: w-full to fill grid cell, aspect-ratio maintains proportions
  const sizeClass = size === 'grid' ? 'w-full' : 'w-[220px] sm:w-[240px]';
  const behaviorClass = size === 'grid' ? '' : 'shrink-0 snap-start';

  return (
    <motion.div
      className={`overflow-visible ${sizeClass} ${behaviorClass}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
    >
      <Link
        href={`/item/${item.id}`}
        className="relative aspect-[2/3] rounded-[24px] overflow-hidden border border-white/5 bg-gradient-to-br from-[#3a2a4a] via-[#2a2a3a] to-[#1a1a2a] block shadow-lg"
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
          <div data-action-button>
            <ActionIconButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onMarkWatched(item.id);
              }}
              ariaLabel="Mark as watched"
              title="Mark as watched"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              }
            />
          </div>
        )}
        {mode === 'watched' && onMoveToQueue && (
          <div data-action-button>
            <ActionIconButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onMoveToQueue(item.id);
              }}
              ariaLabel="Move back to queue"
              title="Move back to queue"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7v6h6" />
                  <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                </svg>
              }
            />
          </div>
        )}
        {onRemove && (
          <div data-action-button>
            <ActionIconButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemove(item.id, item.title);
              }}
              ariaLabel="Remove"
              title="Remove"
              variant="destructive"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              }
            />
          </div>
        )}
      </div>

      {/* Bottom gradient overlay for text readability - no blur, only gradient */}
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
    </motion.div>
  );
}
