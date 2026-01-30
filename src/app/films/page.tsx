'use client';

import Link from 'next/link';
import FilmsHeader from '@/components/films/FilmsHeader';
import MetricCard from '@/components/shared/MetricCard';
import MetricRow from '@/components/shared/MetricRow';
import CuratedPosterCard from '@/components/films/CuratedPosterCard';
import RecentlyWatchedItem from '@/components/films/RecentlyWatchedItem';
import { useFilms, useFilmStats } from '@/db/hooks';

export default function FilmsPage() {
  const { films, loading: filmsLoading } = useFilms();
  const { stats, loading: statsLoading } = useFilmStats();

  const recentlyWatched = films.slice(0, 2);
  return (
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

      {/* Content container with device stage feeling */}
      <div className="relative mx-auto max-w-md min-h-screen px-4 pt-safe-area-inset-top pb-32">
        <div className="relative rounded-[36px] bg-[#0b0b0f]/30 p-6 pt-8 shadow-[inset_0_0_80px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.02)] backdrop-blur-[0.5px]">
          <FilmsHeader />

          {/* Stats row */}
          <div className="mb-8 px-8">
            <MetricRow>
              <MetricCard label="WATCHED" value={statsLoading ? '...' : stats.watched.toString()} />
              <MetricCard label="AVG SCORE" value={statsLoading ? '...' : stats.avgScore.toFixed(1)} />
              <MetricCard label="LAST 7" value={statsLoading ? '...' : stats.last7.toString()} />
            </MetricRow>
          </div>

          {/* Curated for you */}
          <div className="mb-8">
            <h2 className="mb-4 text-[14px] font-medium uppercase tracking-[0.08em] text-primary">
              Curated for you
            </h2>
            <div className="flex overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
              <div className="flex pr-2">
                <CuratedPosterCard chip="SLOW-BURN + EPIC" />
                <CuratedPosterCard chip="INTENSE + REWARDING" />
                <CuratedPosterCard chip="THOUGHTFUL + CINEMATIC" />
              </div>
            </div>
          </div>

          {/* Recently watched */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[14px] font-medium uppercase tracking-[0.08em] text-primary">
                Recently watched
              </h2>
              <button className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/35 transition-colors hover:text-white/50">
                VIEW ALL
              </button>
            </div>
            <div className="space-y-3">
              {filmsLoading ? (
                <div className="text-tertiary text-sm">Loading...</div>
              ) : recentlyWatched.length > 0 ? (
                recentlyWatched.map((film) => (
                  <Link key={film.id} href={`/item/${film.id}`}>
                    <RecentlyWatchedItem
                      title={film.title}
                      rating={film.rating.toString()}
                    />
                  </Link>
                ))
              ) : (
                <div className="text-tertiary text-sm">No films yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
