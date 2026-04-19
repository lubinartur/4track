'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Check, Plus, Sparkles, Star } from 'lucide-react';
import ItemMetaRow from '@/components/item/ItemMetaRow';
import { useQueueSuccessFlash } from '@/hooks/useQueueSuccessFlash';
import { useWatchedRateSheet } from '@/hooks/useWatchedRateSheet';
import {
  movieActionFocusRing,
  movieActionPress,
  movieActionTransition,
} from '@/lib/movieActionAppearance';
import { libraryActionFlags } from '@/lib/libraryActionUi';
import { libraryInputFromHomeHero } from '@/lib/libraryMovieInput';
import { useLibraryStore } from '@/store/libraryStore';
import type { HomeHeroContent } from '@/types/homeHero';

type HeroMovieCardProps = {
  hero: HomeHeroContent;
  /** e.g. carousel slide width — default 326px */
  className?: string;
};

/**
 * Figma 101:1376 — one card: full-bleed poster, bottom gradient, AI MATCH pill, title + meta + tags + action row inside the frame.
 */
export default function HeroMovieCard({ hero, className }: HeroMovieCardProps) {
  const href = hero.itemSlug ? `/item/${hero.itemSlug}` : undefined;
  const [t1, t2, t3] = hero.reasonTags;

  const addToQueue = useLibraryStore((s) => s.addToQueue);
  const { openWatchedRateSheet } = useWatchedRateSheet();
  const { queueSuccessFlash, triggerQueueSuccessFlash } = useQueueSuccessFlash();
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite);
  const heroInput = libraryInputFromHomeHero(hero);
  const entry = useLibraryStore((s) => (heroInput ? s.entriesByKey[heroInput.key] : undefined));
  const flags = useMemo(() => libraryActionFlags(entry), [entry]);

  const iconBtn = [
    'flex h-10 w-[57px] shrink-0 items-center justify-center rounded-xl border border-[#ff5b00] bg-[#101018] text-white',
    movieActionTransition,
    movieActionPress,
    'hover:brightness-110',
    movieActionFocusRing,
    'disabled:pointer-events-none disabled:opacity-40',
  ].join(' ');

  return (
    <article className={['relative w-[326px] shrink-0', className].filter(Boolean).join(' ')}>
      <div className="relative h-[470px] w-full overflow-hidden rounded-[20px] shadow-[0px_10px_28px_0px_rgba(0,0,0,0.42)]">
        {/* Poster */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero.posterUrl}
          alt=""
          className="absolute inset-0 z-0 size-full object-cover"
        />

        {/* Scrim — layered: soft blend + strong bottom lift for readable UI */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 top-[28%] z-[1] rounded-b-[20px] bg-[linear-gradient(180deg,transparent_0%,rgba(8,8,14,0.25)_38%,rgba(12,12,20,0.72)_58%,rgba(14,14,22,0.92)_78%,#101018_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] z-[1] rounded-b-[20px] bg-gradient-to-t from-[#101018] from-[18%] via-[#101018]/92 via-[45%] to-transparent"
          aria-hidden
        />

        {href ? (
          <Link
            href={href}
            className="absolute inset-0 z-[2] rounded-[20px] outline-none ring-inset focus-visible:ring-2 focus-visible:ring-[#ff5b00]/45"
            aria-label={`Open ${hero.title}`}
          >
            {/* Ensures the hit target fills the frame (`pointer-events` on descendants does not inherit `none`). */}
            <span className="absolute inset-0 block rounded-[20px]" aria-hidden />
          </Link>
        ) : null}

        {/* AI MATCH — top of card (`[&_*]` so nested pills still pass taps through to the Link below). */}
        <div className="pointer-events-none [&_*]:pointer-events-none absolute left-1/2 top-6 z-[3] flex -translate-x-1/2 justify-center">
          <div className="flex items-center gap-1.5 rounded-[20px] border border-[#ff5b00]/35 bg-[#101018] px-3 py-1.5">
            <Sparkles className="size-[14px] shrink-0 text-[#ff5b00]" aria-hidden />
            <span className="whitespace-nowrap text-center text-[12px] font-normal text-[#ff5b00]">
              AI MATCH {hero.aiMatchPercent}%
            </span>
          </div>
        </div>

        {/* Title, meta, tags — pass-through so the full-card Link receives taps (children default to `pointer-events: auto`). */}
        <div className="pointer-events-none [&_*]:pointer-events-none absolute inset-x-0 bottom-0 top-[38.17%] z-[3] flex flex-col justify-end pb-[78px]">
          <div className="flex flex-col items-center gap-2 px-3">
            <h2 className="text-center text-[32px] font-bold leading-none tracking-normal text-white">
              {hero.title}
            </h2>
            <ItemMetaRow
              rating={hero.rating}
              year={hero.year}
              genresLabel={hero.genresLabel}
              className="justify-center"
            />
            <div className="mt-1 flex min-w-0 w-full flex-nowrap justify-center gap-2 overflow-x-auto scrollbar-hide">
              <span className="flex h-8 shrink-0 items-center justify-center rounded-[17px] bg-[rgba(255,255,255,0.1)] px-4 pb-[9px] pt-2 text-center text-[12px] font-normal whitespace-nowrap text-[rgba(255,255,255,0.4)]">
                {t1}
              </span>
              <span className="flex h-8 shrink-0 items-center justify-center rounded-[17px] bg-[rgba(255,255,255,0.1)] px-4 pb-[9px] pt-2 text-center text-[12px] font-normal whitespace-nowrap text-[rgba(255,255,255,0.4)]">
                {t2}
              </span>
              <span className="flex h-8 shrink-0 items-center justify-center rounded-[17px] bg-[rgba(255,255,255,0.1)] px-4 pb-[9px] pt-2 text-center text-[12px] font-normal whitespace-nowrap text-[rgba(255,255,255,0.4)]">
                {t3}
              </span>
            </div>
          </div>
        </div>

        {/* Action row — above the navigation link so list actions stay tappable */}
        <div className="pointer-events-auto absolute bottom-[18px] left-1/2 z-[4] mt-5 flex -translate-x-1/2 gap-[13px]">
          <button
            type="button"
            aria-label={flags.inQueue ? 'In queue' : 'Add to queue'}
            aria-pressed={flags.inQueue}
            disabled={!heroInput}
            onClick={() => {
              if (!heroInput) return;
              addToQueue(heroInput);
              triggerQueueSuccessFlash();
            }}
            className={iconBtn}
          >
            <span className="inline-flex origin-center" aria-hidden>
              {queueSuccessFlash ? (
                <Check size={14} strokeWidth={1.5} className="text-[#ff5b00]" />
              ) : (
                <Plus
                  size={14}
                  strokeWidth={1.5}
                  className={flags.inQueue ? 'text-[#ff5b00]' : 'text-white'}
                />
              )}
            </span>
          </button>
          <button
            type="button"
            aria-label={flags.watched ? 'Watched' : 'Mark as watched'}
            aria-pressed={flags.watched}
            disabled={!heroInput}
            onClick={() => heroInput && openWatchedRateSheet(heroInput)}
            className={iconBtn}
          >
            <Check
              size={14}
              strokeWidth={1.5}
              className={flags.watched ? 'text-[#ff5b00]' : 'text-white'}
              aria-hidden
            />
          </button>
          <button
            type="button"
            aria-label={flags.favorited ? 'Favorited' : 'Favorite'}
            aria-pressed={flags.favorited}
            disabled={!heroInput}
            onClick={() => heroInput && toggleFavorite(heroInput)}
            className={[
              iconBtn,
              flags.favorited ? 'bg-[#1a1410] ring-1 ring-inset ring-[#ff5b00]/30' : '',
            ].join(' ')}
          >
            <Star
              size={14}
              strokeWidth={1.5}
              className={flags.favorited ? 'fill-[#ff5b00] text-[#ff5b00]' : undefined}
              aria-hidden
            />
          </button>
        </div>
      </div>
    </article>
  );
}
