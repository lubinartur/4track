'use client';

import Link from 'next/link';
import type { ItemView } from '@/types/itemView';

import type { ItemView } from '@/types/itemView';

interface HeroPickProps {
  item: ItemView;
  reason: string;
  onMarkWatched?: (e: React.MouseEvent) => void;
  onAddToQueue?: (e: React.MouseEvent) => void;
  onRemove?: (e: React.MouseEvent) => void;
}

export default function HeroPick({
  item,
  reason,
  onMarkWatched,
  onAddToQueue,
  onRemove,
}: HeroPickProps) {
  const hasBackdrop = item.backdropUrl || item.posterUrl;
  const metaParts = [
    item.year,
    item.genres?.slice(0, 2).join(' • '),
  ].filter(Boolean);

  return (
    <Link href={`/item/${item.id}`}>
      <div className="relative mb-16 h-[60vh] min-h-[400px] max-h-[500px] rounded-[24px] overflow-hidden">
        {/* Backdrop */}
        {hasBackdrop ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.backdropUrl || item.posterUrl}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#3a2a4a] via-[#2a2a3a] to-[#1a1a2a]" />
        )}

        {/* Strong bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/80 via-60% to-transparent" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-6 sm:p-8">
          {/* Title and meta */}
          <div className="mb-4">
            <h1 className="mb-2 text-[32px] sm:text-[40px] font-medium leading-tight text-white">
              {item.title}
            </h1>
            {metaParts.length > 0 && (
              <p className="text-[14px] text-white/70 mb-3">
                {metaParts.join(' • ')}
              </p>
            )}
            <p className="text-[14px] text-white/60 leading-relaxed max-w-2xl">
              {reason}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {onMarkWatched && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onMarkWatched(e);
                }}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[13px] font-medium text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Mark watched
              </button>
            )}
            {onAddToQueue && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToQueue(e);
                }}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[13px] font-medium text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Add to queue
              </button>
            )}
            {onRemove && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove(e);
                }}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-medium text-white/60 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white/80"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
