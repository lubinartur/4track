'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import FilmsHeader from '@/components/films/FilmsHeader';
import MetricCard from '@/components/shared/MetricCard';
import MetricRow from '@/components/shared/MetricRow';
import RecentlyWatchedItem from '@/components/films/RecentlyWatchedItem';
import { useWatchedFilms, useQueuedFilms, useLifePick } from '@/db/hooksEntries';
import { setEntryStatus, deleteEntry } from '@/repos/entriesRepo';

/**
 * Converts technical reason text to human-friendly explanation.
 */
function humanizeReason(reason: string): string {
  if (reason.includes('liked')) {
    return 'Matches genres you enjoy';
  }
  if (reason.includes('General pick') || reason.includes('catalog')) {
    return 'Because you rated similar films highly';
  }
  if (reason.includes('different direction') || reason.includes('wildcard')) {
    return 'A wildcard to explore something different';
  }
  if (reason.includes('Trending')) {
    return 'Popular right now';
  }
  // Default fallback
  return 'Based on your taste';
}

/**
 * Formats a timestamp as relative time (Today, 2d ago, 1w ago, etc.)
 */
function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);

  if (days === 0) {
    return 'Today';
  }
  if (days === 1) {
    return '1d ago';
  }
  if (days < 7) {
    return `${days}d ago`;
  }
  if (weeks === 1) {
    return '1w ago';
  }
  if (weeks < 4) {
    return `${weeks}w ago`;
  }
  return `${Math.floor(days / 30)}mo ago`;
}

export default function FilmsPage() {
  const { items, loading: filmsLoading } = useWatchedFilms();
  const { items: queuedItems, loading: queuedLoading } = useQueuedFilms();
  const recentlyWatched = items.slice(0, 2);
  const upNext = queuedItems.slice(0, 2);
  const lifePick = useLifePick();

  const handleMarkWatched = useCallback(async (itemId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await setEntryStatus(itemId, 'watched');
      // useLiveQuery will automatically refresh
    } catch (error) {
      console.error('Error marking as watched:', error);
    }
  }, []);

  const handleMoveToQueue = useCallback(async (itemId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await setEntryStatus(itemId, 'queued');
      // useLiveQuery will automatically refresh
    } catch (error) {
      console.error('Error moving to queue:', error);
    }
  }, []);

  const handleRemove = useCallback(async (itemId: string, itemTitle: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm(`Remove "${itemTitle}" from your list?`)) {
      return;
    }

    try {
      await deleteEntry(itemId);
      // useLiveQuery will automatically refresh
    } catch (error) {
      console.error('Error removing film:', error);
    }
  }, []);

  // Compute stats inline from items
  const totalWatched = items.length;
  const ratingsWithValues = items
    .map((item) => item.entry?.userRating)
    .filter((rating): rating is number => rating !== undefined && rating !== null);
  const avgRating = ratingsWithValues.length > 0
    ? ratingsWithValues.reduce((sum, rating) => sum + rating, 0) / ratingsWithValues.length
    : null;
  
  // Find most recent watchedAt timestamp
  const mostRecentWatched = items
    .map((item) => item.entry?.watchedAt)
    .filter((ts): ts is number => ts !== undefined && ts !== null)
    .sort((a, b) => b - a)[0];
  
  const stats = {
    watched: totalWatched,
    avgScore: avgRating,
    lastWatched: mostRecentWatched,
  };
  const statsLoading = filmsLoading;
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
          <div className="mb-12 px-8">
            <MetricRow>
              <MetricCard label="WAT" value={statsLoading ? '...' : stats.watched.toString()} />
              <MetricCard 
                label="AVG" 
                value={statsLoading ? '...' : (stats.avgScore !== null ? stats.avgScore.toFixed(1) : '—')} 
              />
              <MetricCard 
                label="LAST" 
                value={statsLoading ? '...' : (stats.lastWatched ? formatRelativeTime(stats.lastWatched) : '—')} 
              />
            </MetricRow>
          </div>

          {/* Curated for you */}
          <div className="mb-12">
            <h2 className="mb-5 text-[18px] font-medium uppercase tracking-[0.08em] text-primary">
              Curated for you
            </h2>
            {lifePick.safePick ? (
              <Link href={`/item/${lifePick.safePick.id}`}>
                <div className="relative rounded-[20px] border border-white/5 bg-[#141420]/50 overflow-hidden shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.08)] backdrop-blur-sm">
                  {/* Backdrop/Poster */}
                  <div className="relative h-56 bg-gradient-to-br from-[#3a2a4a] via-[#2a2a3a] to-[#1a1a2a]">
                    {lifePick.safePick.backdropUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={lifePick.safePick.backdropUrl}
                        alt=""
                        className="w-full h-full object-cover opacity-60"
                      />
                    ) : lifePick.safePick.posterUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={lifePick.safePick.posterUrl}
                        alt=""
                        className="w-full h-full object-cover opacity-60"
                      />
                    ) : null}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141420] via-[#141420]/80 to-transparent" />
                  </div>
                  
                  {/* Content */}
                  <div className="p-5">
                    <h3 className="mb-2 text-[18px] font-medium text-primary line-clamp-1">
                      {lifePick.safePick.title}
                      {lifePick.safePick.year && (
                        <span className="text-secondary font-normal"> ({lifePick.safePick.year})</span>
                      )}
                    </h3>
                    <p className="text-[13px] text-white/60 leading-relaxed line-clamp-2">
                      {humanizeReason(lifePick.reasons.safe)}
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="rounded-[20px] border border-white/5 bg-[#141420]/50 p-6 text-center">
                <h3 className="mb-2 text-[15px] font-medium text-primary">We're learning your taste</h3>
                <p className="mb-4 text-[13px] text-white/60">
                  Rate a few films to unlock better picks
                </p>
                <Link
                  href="/onboarding/taste"
                  className="inline-block rounded-xl border border-white/5 bg-white/[0.03] px-4 py-2 text-[13px] font-medium text-white/70 transition-colors hover:bg-white/[0.08] hover:border-white/10"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>

          {/* Up Next (Queue) */}
          <div className="mb-12">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[12px] font-medium uppercase tracking-[0.08em] text-white/70">
                Up Next
              </h2>
              <Link href="/films/queue" className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/35 transition-colors hover:text-white/50">
                VIEW ALL
              </Link>
            </div>
            <div className="space-y-2.5">
              {queuedLoading ? (
                <div className="text-tertiary text-sm">Loading...</div>
              ) : upNext.length > 0 ? (
                upNext.map((item) => (
                  <Link key={item.id} href={`/item/${item.id}`}>
                    <RecentlyWatchedItem
                      title={item.title}
                      rating={null}
                      image={item.posterUrl || item.backdropUrl}
                      status="queued"
                      onMarkWatched={(e) => handleMarkWatched(item.id, e)}
                      onRemove={(e) => handleRemove(item.id, item.title, e)}
                    />
                  </Link>
                ))
              ) : (
                <div className="rounded-[20px] border border-white/5 bg-[#141420]/30 p-4 text-center">
                  <p className="text-[13px] text-white/50">
                    Queue is empty — add something to watch next
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recently watched */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[12px] font-medium uppercase tracking-[0.08em] text-white/50">
                Recently watched
              </h2>
              <Link href="/films/all" className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/35 transition-colors hover:text-white/50">
                VIEW ALL
              </Link>
            </div>
            <div className="space-y-2">
              {filmsLoading ? (
                <div className="text-tertiary text-sm">Loading...</div>
              ) : recentlyWatched.length > 0 ? (
                recentlyWatched.map((item) => (
                  <Link key={item.id} href={`/item/${item.id}`}>
                    <RecentlyWatchedItem
                      title={item.title}
                      rating={item.entry?.userRating ?? null}
                      image={item.posterUrl || item.backdropUrl}
                      status="watched"
                      onMoveToQueue={(e) => handleMoveToQueue(item.id, e)}
                      onRemove={(e) => handleRemove(item.id, item.title, e)}
                    />
                  </Link>
                ))
              ) : (
                <div className="rounded-[20px] border border-white/5 bg-[#141420]/30 p-4 text-center">
                  <p className="text-[13px] text-white/50">
                    No watched films yet — mark one as watched
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
