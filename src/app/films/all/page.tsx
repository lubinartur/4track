'use client';

import { useCallback } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import LibraryListShell from '@/components/layout/LibraryListShell';
import PosterGrid from '@/components/posters/PosterGrid';
import { useWatchedFilms } from '@/db/hooksEntries';
import { setEntryStatus, deleteEntry } from '@/repos/entriesRepo';
import { PageFade } from '@/components/motion/Motion';

export default function AllFilmsPage() {
  const { items, loading } = useWatchedFilms();

  const handleMoveToQueue = useCallback(async (itemId: string) => {
    try {
      await setEntryStatus(itemId, 'queued');
    } catch (error) {
      console.error('Error moving to queue:', error);
    }
  }, []);

  const handleRemove = useCallback(async (itemId: string, itemTitle: string) => {
    if (!confirm(`Remove "${itemTitle}" from your list?`)) {
      return;
    }

    try {
      await deleteEntry(itemId);
    } catch (error) {
      console.error('Error removing film:', error);
    }
  }, []);

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
        <LibraryListShell 
          kicker="LIBRARY" 
          title="Watched" 
          fallbackPath="/films"
        >
          <PosterGrid
            items={items}
            mode="watched"
            loading={loading}
            onMoveToQueue={handleMoveToQueue}
            onRemove={handleRemove}
            emptyMessage="No films yet"
          />
        </LibraryListShell>
      </PageContainer>
      </div>
    </PageFade>
  );
}
