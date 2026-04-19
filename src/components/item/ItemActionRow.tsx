'use client';

import { Check, Plus, Star } from 'lucide-react';
import {
  movieActionFocusRing,
  movieActionPress,
  movieActionTransition,
  queueButtonLabel,
  watchedButtonLabel,
} from '@/lib/movieActionAppearance';

export type ItemActionRowProps = {
  onAddToQueue?: () => void;
  onMarkWatched?: () => void;
  onFavorite?: () => void;
  /** Derived from library store for this title. */
  inQueue?: boolean;
  watched?: boolean;
  favoriteActive?: boolean;
  /** Brief check after Add to Queue; persistent queue state uses Plus only. */
  queueSuccessFlash?: boolean;
};

const iconSlot = 'inline-flex shrink-0 items-center justify-center';

const textRowBase = `inline-flex h-[48px] shrink-0 items-center gap-2 whitespace-nowrap rounded-[16px] border border-solid px-4 py-0 text-[12px] font-normal leading-none ${movieActionTransition} ${movieActionPress} ${movieActionFocusRing}`;

const iconOnlyBase = `inline-flex size-[48px] shrink-0 items-center justify-center rounded-[16px] border border-solid p-0 ${movieActionTransition} ${movieActionPress} ${movieActionFocusRing}`;

export default function ItemActionRow({
  onAddToQueue,
  onMarkWatched,
  onFavorite,
  inQueue = false,
  watched = false,
  favoriteActive = false,
  queueSuccessFlash = false,
}: ItemActionRowProps) {
  const queueLabel = queueButtonLabel(inQueue || queueSuccessFlash);
  const watchedLabel = watchedButtonLabel(watched);

  const queueIcon = (className: string) =>
    queueSuccessFlash ? (
      <Check size={16} strokeWidth={1.5} className={className} aria-hidden />
    ) : (
      <Plus size={16} strokeWidth={1.5} className={className} aria-hidden />
    );

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        onClick={onAddToQueue}
        aria-pressed={inQueue || queueSuccessFlash}
        className={[
          textRowBase,
          inQueue || queueSuccessFlash
            ? 'border-[#ff5b00] bg-[#101018] text-[#ff5b00] hover:bg-[#14141c]'
            : 'border-[#ff5b00] bg-[#101018] text-white hover:bg-[#14141c]',
        ].join(' ')}
      >
        <span className={iconSlot}>
          {queueIcon(inQueue || queueSuccessFlash ? 'text-[#ff5b00]' : 'text-white')}
        </span>
        {queueLabel}
      </button>
      <button
        type="button"
        onClick={onMarkWatched}
        aria-pressed={watched}
        className={[
          textRowBase,
          watched
            ? 'border-[#ff5b00] bg-[#101018] text-[#ff5b00] ring-1 ring-inset ring-[#ff5b00]/25 hover:bg-[#14141c]'
            : 'border-[#ff5b00] bg-[#101018] text-white hover:bg-[#14141c]',
        ].join(' ')}
      >
        <span className={iconSlot}>
          <Check
            size={16}
            strokeWidth={1.5}
            className={watched ? 'text-[#ff5b00]' : 'text-white'}
            aria-hidden
          />
        </span>
        {watchedLabel}
      </button>
      <button
        type="button"
        onClick={onFavorite}
        aria-label={favoriteActive ? 'Favorited' : 'Favorite'}
        aria-pressed={favoriteActive}
        className={[
          iconOnlyBase,
          favoriteActive
            ? 'border-[#ff5b00] bg-[#1a1410] text-[#ff5b00] ring-1 ring-inset ring-[#ff5b00]/30 hover:bg-[#221a14]'
            : 'border-[#ff5b00] bg-[#101018] text-white hover:bg-[#16161f]',
        ].join(' ')}
      >
        <span className={iconSlot}>
          <Star
            size={16}
            strokeWidth={1.5}
            className={favoriteActive ? 'fill-[#ff5b00] text-[#ff5b00]' : 'text-white'}
            aria-hidden
          />
        </span>
      </button>
    </div>
  );
}
