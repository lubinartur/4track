'use client';

import Link from 'next/link';
import PageContainer from '@/components/layout/PageContainer';
import PageShell from '@/components/layout/PageShell';
import CuratedRail from '@/components/curated/CuratedRail';
import { useLifePick } from '@/db/hooksEntries';
import { PageFade } from '@/components/motion/Motion';

export default function LifePage() {
  const lifePick = useLifePick();
  
  // Count actual picks for Films section
  const filmsPicksCount = [
    lifePick.safePick,
    lifePick.wildcard,
    lifePick.extraPick
  ].filter(Boolean).length;
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
        <PageShell
          kicker="TONIGHT"
          title="Good morning."
          rightIcon={
            <Link
              href="/profile"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-white/[0.03] transition-colors hover:bg-white/8"
              aria-label="Profile"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                className="text-white/50"
              >
                <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.2" fill="none" />
                <path
                  d="M4 17c0-3.314 2.686-6 6-6s6 2.686 6 6"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  fill="none"
                />
              </svg>
            </Link>
          }
        >
          {/* Films — Curated for you */}
          <div className="mb-16">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="text-[18px] font-medium tracking-tight text-white/85">
                Films
              </h2>
              {filmsPicksCount > 2 && (
                <a
                  href="/films"
                  className="text-[13px] font-medium text-orange-500 transition-colors hover:text-orange-400 flex items-center gap-1"
                >
                  View all
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </a>
              )}
            </div>
            <CuratedRail domain="film" count={3} />
          </div>

          {/* Series — Curated for you (PLACEHOLDER) */}
          <div className="mb-16">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="text-[18px] font-medium tracking-tight text-white/85">
                Series
              </h2>
              <a
                href="#"
                className="text-[13px] font-medium text-white/40 transition-colors hover:text-white/60"
              >
                View all
              </a>
            </div>
            <CuratedRail domain="series" count={3} mode="placeholder" />
          </div>

          {/* Anime — Curated for you (PLACEHOLDER) */}
          <div className="mb-16">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="text-[18px] font-medium tracking-tight text-white/85">
                Anime
              </h2>
              <a
                href="#"
                className="text-[13px] font-medium text-white/40 transition-colors hover:text-white/60"
              >
                View all
              </a>
            </div>
            <CuratedRail domain="anime" count={3} mode="placeholder" />
          </div>

          {/* Books — Curated for you (PLACEHOLDER) */}
          <div className="mb-16">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="text-[18px] font-medium tracking-tight text-white/85">
                Books
              </h2>
              <a
                href="#"
                className="text-[13px] font-medium text-white/40 transition-colors hover:text-white/60"
              >
                View all
              </a>
            </div>
            <CuratedRail domain="book" count={3} mode="placeholder" />
          </div>
        </PageShell>
      </PageContainer>
      </div>
    </PageFade>
  );
}
