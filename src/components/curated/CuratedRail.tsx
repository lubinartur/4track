'use client';

import { useRouter } from 'next/navigation';
import PosterTile from '@/components/shared/PosterTile';
import ActionIconButton from '@/components/shared/ActionIconButton';
import { Stagger, StaggerItem } from '@/components/motion/Motion';
import { useLifePick } from '@/db/hooksEntries';
import { setEntryStatus, deleteEntry } from '@/repos/entriesRepo';
import type { Domain } from '@/db/db';

interface CuratedRailProps {
  domain: 'film' | 'series' | 'anime' | 'book';
  count?: number;
  label?: string;
  mode?: 'real' | 'placeholder';
}

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
  return 'Based on your taste';
}

export default function CuratedRail({ 
  domain, 
  count = 3, 
  label = 'Curated for you',
  mode = 'real'
}: CuratedRailProps) {
  const router = useRouter();
  const lifePick = useLifePick();

  const handleMarkWatched = async (itemId: string) => {
    try {
      await setEntryStatus(itemId, 'watched');
    } catch (error) {
      console.error('Error marking as watched:', error);
    }
  };

  const handleAddToQueue = async (itemId: string) => {
    try {
      await setEntryStatus(itemId, 'queued');
    } catch (error) {
      console.error('Error adding to queue:', error);
    }
  };

  const handleRemove = async (itemId: string, itemTitle: string) => {
    if (!confirm(`Remove "${itemTitle}" from your list?`)) {
      return;
    }
    try {
      await deleteEntry(itemId);
    } catch (error) {
      console.error('Error removing film:', error);
    }
  };

  // For placeholder domains
  if (mode === 'placeholder' || domain !== 'film') {
    return (
      <div className="relative">
        <div className="overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="flex gap-3 pb-4">
            {[...Array(count)].map((_, i) => (
              <PosterTile
                key={`placeholder-${domain}-${i}`}
                title="Coming soon"
                subtitle="Curated for you"
                reason={`${domain === 'series' ? 'Series' : domain === 'anime' ? 'Anime' : 'Books'} recommendations will appear here`}
                size="lg"
                disabled
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // For real film domain
  const picks: Array<{ item: typeof lifePick.safePick; reason: string }> = [];
  
  if (lifePick.safePick) {
    picks.push({ item: lifePick.safePick, reason: humanizeReason(lifePick.reasons.safe) });
  }
  if (lifePick.wildcard && lifePick.wildcard.id !== lifePick.safePick?.id) {
    picks.push({ item: lifePick.wildcard, reason: humanizeReason(lifePick.reasons.wildcard) });
  }
  if (lifePick.extraPick && picks.length < count) {
    const isDuplicate = picks.some(p => p.item?.id === lifePick.extraPick?.id);
    if (!isDuplicate) {
      picks.push({ item: lifePick.extraPick, reason: 'From your catalog' });
    }
  }

  // If no picks, show placeholder
  if (picks.length === 0) {
    return (
      <div className="relative">
        <div className="overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="flex gap-3 pb-4">
            <PosterTile
              title="We're learning your taste"
              subtitle="Curated for you"
              reason="Rate a few films to unlock better picks"
              size="lg"
              disabled
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
        <Stagger>
          <div className="flex gap-4 pr-8 snap-x snap-mandatory overflow-visible">
            {picks.slice(0, count).map((pick) => {
            if (!pick.item) return null;
            return (
              <StaggerItem key={pick.item.id}>
                <PosterTile
                  title={pick.item.title}
                  subtitle={pick.item.year?.toString()}
                  image={pick.item.posterUrl || pick.item.backdropUrl}
                  badge="CURATED"
                  reason={pick.reason}
                  size="lg"
                  href={`/item/${pick.item.id}`}
                  actions={
                  <>
                    {pick.item.entry?.status !== 'watched' && (
                      <div data-action-button>
                        <ActionIconButton
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleMarkWatched(pick.item!.id);
                          }}
                          ariaLabel="Mark as watched"
                          title="Mark as watched"
                          icon={
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="m9 12 2 2 4-4" />
                            </svg>
                          }
                        />
                      </div>
                    )}
                    {!pick.item.entry && (
                      <div data-action-button>
                        <ActionIconButton
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToQueue(pick.item!.id);
                          }}
                          ariaLabel="Add to queue"
                          title="Add to queue"
                          icon={
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 5v14" />
                              <path d="M5 12h14" />
                            </svg>
                          }
                        />
                      </div>
                    )}
                    {pick.item.entry && (
                      <div data-action-button>
                        <ActionIconButton
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemove(pick.item!.id, pick.item!.title);
                          }}
                          ariaLabel="Remove"
                          title="Remove"
                          variant="destructive"
                          icon={
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          }
                        />
                      </div>
                    )}
                  </>
                }
              />
              </StaggerItem>
            );
          })}
          </div>
        </Stagger>
      </div>
    </div>
  );
}
