'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import FilmsHeader from '@/components/films/FilmsHeader';
import RecentlyWatchedItem from '@/components/films/RecentlyWatchedItem';
import { useWatchedFilms } from '@/db/hooksEntries';
import { setEntryStatus, deleteEntry } from '@/repos/entriesRepo';

export default function AllFilmsPage() {
  const { items, loading } = useWatchedFilms();

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
      // useLiveQuery will automatically refresh the list
    } catch (error) {
      console.error('Error removing film:', error);
    }
  }, []);

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

          {/* All watched films */}
          <div>
            <div className="mb-4">
              <h2 className="text-[14px] font-medium uppercase tracking-[0.08em] text-primary">
                All watched films
              </h2>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="text-tertiary text-sm">Loading...</div>
              ) : items.length > 0 ? (
                items.map((item) => (
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
                <div className="text-tertiary text-sm">No films yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
