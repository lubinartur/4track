'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import HeroMovieCard from '@/components/home/HeroMovieCard';
import type { HomeHeroContent } from '@/types/homeHero';

const CARD_W = 326;
const GAP_PX = 16;
/** Centers 326px slides; lower subtract → closer neighbors / more peek. */
const SIDE_INSET = `max(0px, calc(50% - 132px))`;

type HomeHeroCarouselProps = {
  slides: HomeHeroContent[];
  /** Index that is featured on first paint (centered). */
  initialIndex?: number;
  /** Called when the centered slide changes (scroll). */
  onActiveSlideChange?: (slide: HomeHeroContent) => void;
};

export default function HomeHeroCarousel({
  slides,
  initialIndex = 1,
  onActiveSlideChange,
}: HomeHeroCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(initialIndex);

  const updateActive = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const mid = el.getBoundingClientRect().left + el.clientWidth / 2;
    let best = 0;
    let bestD = Infinity;
    slideRefs.current.forEach((slide, i) => {
      if (!slide) return;
      const r = slide.getBoundingClientRect();
      const c = r.left + r.width / 2;
      const d = Math.abs(c - mid);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setActive(best);
  }, []);

  useLayoutEffect(() => {
    const target = slideRefs.current[initialIndex];
    if (!target) return;
    target.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'auto' });
    setActive(initialIndex);
  }, [slides, initialIndex]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
    return () => el.removeEventListener('scroll', updateActive);
  }, [updateActive]);

  useEffect(() => {
    const slide = slides[active];
    if (slide) onActiveSlideChange?.(slide);
  }, [active, slides, onActiveSlideChange]);

  return (
    <div className="relative -mx-4 mt-3 w-[calc(100%+2rem)] min-w-0 shrink-0 overflow-x-visible overflow-y-visible">
      <div
        ref={scrollerRef}
        className="snap-x snap-mandatory overflow-x-auto overflow-y-visible py-2 scrollbar-hide"
        style={{
          scrollPaddingLeft: SIDE_INSET,
          scrollPaddingRight: SIDE_INSET,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div
          className="flex w-max overflow-visible"
          style={{
            gap: GAP_PX,
            paddingLeft: SIDE_INSET,
            paddingRight: SIDE_INSET,
          }}
        >
          {slides.map((hero, i) => (
            <div
              key={hero.id}
              ref={(node) => {
                slideRefs.current[i] = node;
              }}
              className={[
                'snap-center shrink-0 overflow-visible',
                'origin-center transition-[transform,opacity] duration-300 ease-out',
                i === active ? 'z-[2] scale-100 opacity-100' : 'z-[1] scale-[0.98] opacity-[0.52]',
              ].join(' ')}
              style={{ width: CARD_W }}
            >
              <HeroMovieCard hero={hero} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
