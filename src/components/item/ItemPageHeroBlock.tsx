'use client';

import { useEffect, useState } from 'react';
import type { ItemDetail } from '@/types/item';
import ItemActionRow from './ItemActionRow';
import ItemMetaRow from './ItemMetaRow';

type ItemPageHeroBlockProps = {
  item: ItemDetail;
};

/**
 * Hero: stagger on poster + title/meta. Scroll only adjusts opacity on that block (no overlay layers).
 * Action row stays full opacity — separate sibling below.
 */
export default function ItemPageHeroBlock({ item }: ItemPageHeroBlockProps) {
  const [scrollBlend, setScrollBlend] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const onMq = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', onMq);
    return () => mq.removeEventListener('change', onMq);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const onScroll = () => {
      const range = 220;
      setScrollBlend(Math.min(1, window.scrollY / range));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reduceMotion]);

  /** Single property fade — no extra DOM, no rectangular scrim. */
  const heroUpperOpacity = reduceMotion ? 1 : 1 - scrollBlend * 0.32;

  return (
    <div className="relative mt-4 flex flex-col gap-4">
      <div
        className="flex flex-col gap-4 transition-opacity duration-200 ease-out"
        style={{ opacity: heroUpperOpacity }}
      >
        <div className="item-hero-stagger item-hero-stagger--poster">
          <div
            className={[
              'relative h-[180px] w-[120px] overflow-hidden rounded-[20px]',
              'shadow-[0px_8px_20px_0px_rgba(0,0,0,0.35)]',
            ].join(' ')}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.posterUrl} alt={item.title} className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="item-hero-stagger item-hero-stagger--meta flex flex-col gap-4">
          <h1 className="text-[32px] font-bold leading-none tracking-normal text-white">{item.title}</h1>
          <ItemMetaRow rating={item.rating} year={item.year} genresLabel={item.genresLabel} />
        </div>
      </div>

      <div className="relative z-[1]">
        <ItemActionRow />
      </div>
    </div>
  );
}
