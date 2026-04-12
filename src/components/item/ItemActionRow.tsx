'use client';

import { Check, Plus, Star } from 'lucide-react';

type ItemActionRowProps = {
  onAddToQueue?: () => void;
  onMarkWatched?: () => void;
  onFavorite?: () => void;
};

const focusRing = 'outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/15';

const press =
  'transition-[transform,background-color,color] duration-[170ms] ease-out active:scale-[0.98]';

/**
 * Single geometry for both text actions — same as “Mark as Watched”; orange only swaps fill + hover.
 */
const textBtn =
  `inline-flex h-[48px] shrink-0 items-center gap-2 whitespace-nowrap rounded-[16px] border-0 px-4 py-0 text-[12px] font-normal leading-none text-white ${press} ${focusRing}`;

const iconSlot = 'inline-flex shrink-0 items-center justify-center';

/** Icon-only control — 48×48, icon centered. */
const iconBtn =
  `inline-flex size-[48px] shrink-0 items-center justify-center rounded-[16px] border-0 bg-[#101018] p-0 text-white ${press} hover:bg-[#16161f] ${focusRing}`;

export default function ItemActionRow({
  onAddToQueue,
  onMarkWatched,
  onFavorite,
}: ItemActionRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        onClick={onAddToQueue}
        className={`${textBtn} bg-[#ff5b00] hover:bg-[#ea5400]`}
      >
        <span className={iconSlot} aria-hidden>
          <Plus size={16} strokeWidth={1.5} />
        </span>
        Add to Queue
      </button>
      <button
        type="button"
        onClick={onMarkWatched}
        className={`${textBtn} bg-[#101018] hover:bg-[#16161f]`}
      >
        <span className={iconSlot} aria-hidden>
          <Check size={16} strokeWidth={1.5} />
        </span>
        Mark as Watched
      </button>
      <button type="button" onClick={onFavorite} aria-label="Favorite" className={iconBtn}>
        <span className={iconSlot}>
          <Star size={16} strokeWidth={1.5} />
        </span>
      </button>
    </div>
  );
}
