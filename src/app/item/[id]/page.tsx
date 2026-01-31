'use client';

import { useState, useCallback, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ItemHero from '@/components/item/ItemHero';
import ItemAbout from '@/components/item/ItemAbout';
import UserRating from '@/components/item/UserRating';
import { useItemView } from '@/db/hooksItems';
import { upsertEntry, deleteEntry } from '@/repos/entriesRepo';

export default function ItemPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { item, loading } = useItemView(id);
  const [isUpdating, setIsUpdating] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState(false);

  const handleWatched = useCallback(async () => {
    if (!item || isUpdating) return;
    setIsUpdating(true);
    try {
      const now = Date.now();
      await upsertEntry({
        id: item.id,
        domain: item.domain,
        status: 'watched',
        watchedAt: now,
        userRating: item.entry?.userRating, // Preserve existing rating
        whyTags: item.entry?.whyTags || [],
      });
      // useLiveQuery will automatically refresh
    } catch (error) {
      console.error('Error marking as watched:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [item, isUpdating]);

  const handleQueued = useCallback(async () => {
    if (!item || isUpdating) return;
    setIsUpdating(true);
    try {
      const now = Date.now();
      await upsertEntry({
        id: item.id,
        domain: item.domain,
        status: 'queued',
        queuedAt: now,
        userRating: item.entry?.userRating, // Preserve existing rating
        whyTags: item.entry?.whyTags || [],
      });
      // useLiveQuery will automatically refresh
    } catch (error) {
      console.error('Error adding to queue:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [item, isUpdating]);

  const handleRatingChange = useCallback(async (rating: number) => {
    if (!item || !item.entry || isUpdating) return;
    setIsUpdating(true);
    try {
      await upsertEntry({
        id: item.id,
        domain: item.domain,
        status: item.entry.status, // Preserve status
        userRating: rating,
        whyTags: item.entry.whyTags || [], // Preserve whyTags
        watchedAt: item.entry.watchedAt, // Preserve watchedAt
        queuedAt: item.entry.queuedAt, // Preserve queuedAt
      });
      // useLiveQuery will automatically refresh
    } catch (error) {
      console.error('Error updating rating:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [item, isUpdating]);

  const handleRemove = useCallback(async () => {
    if (!item || !item.entry || isUpdating) return;
    
    // First tap: show confirm state
    if (!removeConfirm) {
      setRemoveConfirm(true);
      return;
    }

    // Second tap: delete
    setIsUpdating(true);
    try {
      await deleteEntry(item.id);
      // Navigate back or to films page
      try {
        router.back();
      } catch {
        router.push('/films');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      setIsUpdating(false);
      setRemoveConfirm(false);
    }
  }, [item, router, isUpdating, removeConfirm]);

  // Reset remove confirm when item changes
  useEffect(() => {
    setRemoveConfirm(false);
  }, [item?.id]);

  // Loading state
  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        {/* Cinematic vignette background */}
        <div className="fixed inset-0 bg-[#0b0b0f]">
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(11, 11, 15, 0) 0%, rgba(11, 11, 15, 0.3) 40%, rgba(5, 5, 8, 0.8) 100%)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a20]/20 via-transparent to-transparent" />
          <div 
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
              backgroundSize: '100% 4px'
            }}
          />
        </div>

        <div className="relative mx-auto max-w-md min-h-screen px-4 pt-safe-area-inset-top pb-32">
          <div className="relative rounded-[36px] bg-[#0b0b0f]/30 overflow-hidden shadow-[inset_0_0_80px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.02)] backdrop-blur-[0.5px]">
            <div className="relative w-full mb-8 h-[50vh] min-h-[360px] max-h-[420px] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3a2a4a] via-[#2a2a3a] to-[#1a1a2a] animate-pulse" />
            </div>
            <div className="px-6 py-8">
              <div className="h-12 bg-white/5 rounded-lg mb-6 animate-pulse" />
              <div className="h-16 bg-white/5 rounded-lg mb-8 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!loading && !item) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        {/* Cinematic vignette background */}
        <div className="fixed inset-0 bg-[#0b0b0f]">
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(11, 11, 15, 0) 0%, rgba(11, 11, 15, 0.3) 40%, rgba(5, 5, 8, 0.8) 100%)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a20]/20 via-transparent to-transparent" />
          <div 
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
              backgroundSize: '100% 4px'
            }}
          />
        </div>

        <div className="relative mx-auto max-w-md min-h-screen px-4 pt-safe-area-inset-top pb-32 flex items-center justify-center">
          <div className="relative rounded-[36px] bg-[#0b0b0f]/30 p-8 shadow-[inset_0_0_80px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.02)] backdrop-blur-[0.5px] text-center">
            <h2 className="mb-4 text-[24px] font-light text-primary" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Item not found
            </h2>
            <p className="mb-6 text-secondary text-sm">
              The item you&apos;re looking for doesn&apos;t exist.
            </p>
            <button
              onClick={() => router.back()}
              className="rounded-full border border-white/5 bg-[#141420]/60 px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-white/[0.08] hover:border-white/8"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render item data
  const entryStatus = item?.entry?.status || null;
  const userRating = item?.entry?.userRating;

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
        <div className="relative rounded-[36px] bg-[#0b0b0f]/30 overflow-hidden shadow-[inset_0_0_80px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.02)] backdrop-blur-[0.5px]">
          <ItemHero backdropUrl={item?.backdropUrl} posterUrl={item?.posterUrl} />

          {/* Title */}
          <div className="px-6">
            <h1 className="mb-8 text-[44px] font-light leading-[1.2] tracking-[-0.01em] text-primary" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              {item?.title}
            </h1>

            {/* About: year, genres, rating, overview */}
            {item && <ItemAbout item={item} />}

            {/* Status Actions */}
            {item && (
              <div className="mt-6 flex gap-3">
                {/* Primary button based on status */}
                {entryStatus === 'watched' ? (
                  <button
                    onClick={() => {
                      // Scroll to rating component
                      const ratingEl = document.getElementById('user-rating');
                      if (ratingEl) {
                        ratingEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    disabled={isUpdating}
                    className="flex-1 px-4 py-3 rounded-xl border border-white/30 bg-white/10 text-white text-sm font-medium transition-colors hover:bg-white/[0.15] disabled:opacity-50"
                  >
                    Change rating
                  </button>
                ) : (
                  <button
                    onClick={handleWatched}
                    disabled={isUpdating}
                    className="flex-1 px-4 py-3 rounded-xl border border-white/30 bg-white/10 text-white text-sm font-medium transition-colors hover:bg-white/[0.15] disabled:opacity-50"
                  >
                    Mark as watched
                  </button>
                )}

                {/* Secondary button based on status */}
                {entryStatus === null ? (
                  <button
                    onClick={handleQueued}
                    disabled={isUpdating}
                    className="flex-1 px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-white/60 text-sm font-medium transition-colors hover:bg-white/[0.08] hover:border-white/10 disabled:opacity-50"
                  >
                    Add to queue
                  </button>
                ) : (
                  <button
                    onClick={handleRemove}
                    disabled={isUpdating}
                    className="flex-1 px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-white/50 text-sm font-medium transition-colors hover:text-white/80 hover:bg-white/[0.08] disabled:opacity-50"
                  >
                    {removeConfirm ? 'Remove?' : 'Remove'}
                  </button>
                )}
              </div>
            )}

            {/* User Rating - only show when watched */}
            {item?.entry?.status === 'watched' && (
              <div id="user-rating">
                <UserRating
                  value={item.entry?.userRating ?? undefined}
                  onChange={handleRatingChange}
                />
              </div>
            )}

            {/* Ratings display */}
            <div className="mt-6 space-y-1">
              {userRating != null && (
                <div className="text-base text-white/90 font-medium">
                  Your rating: {userRating % 1 === 0 ? userRating.toFixed(0) : userRating.toFixed(1)}
                </div>
              )}
              {item?.voteAverage != null && (
                <div className="text-sm text-white/50">
                  TMDB: {item.voteAverage.toFixed(1)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
