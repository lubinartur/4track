'use client';

import PosterCard from './PosterCard';
import { Stagger, StaggerItem } from '@/components/motion/Motion';
import type { ItemView } from '@/types/itemView';

interface PosterGridProps {
  items: ItemView[];
  mode: 'queue' | 'watched';
  loading?: boolean;
  onMarkWatched?: (itemId: string) => void;
  onMoveToQueue?: (itemId: string) => void;
  onRemove?: (itemId: string, itemTitle: string) => void;
  emptyMessage?: string;
}

export default function PosterGrid({
  items,
  mode,
  loading = false,
  onMarkWatched,
  onMoveToQueue,
  onRemove,
  emptyMessage,
}: PosterGridProps) {
  if (loading) {
    return (
      <div className="text-white/50 text-sm">Loading...</div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[20px] border border-white/5 bg-[#141420]/30 p-6 text-center">
        <p className="text-[13px] text-white/50">
          {emptyMessage || 'No items yet'}
        </p>
      </div>
    );
  }

  return (
    <Stagger>
      <div className="grid grid-cols-2 gap-4 pb-24 overflow-visible">
        {items.map((item) => (
          <StaggerItem key={item.id}>
            <div className="overflow-visible">
              <PosterCard
                item={item}
                mode={mode}
                size="grid"
                onMarkWatched={onMarkWatched}
                onMoveToQueue={onMoveToQueue}
                onRemove={onRemove}
              />
            </div>
          </StaggerItem>
        ))}
      </div>
    </Stagger>
  );
}
