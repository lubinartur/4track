'use client';

import { useParams, useRouter } from 'next/navigation';
import ItemHero from '@/components/item/ItemHero';
import RatingBlock from '@/components/item/RatingBlock';
import TagChip from '@/components/item/TagChip';
import WhyItWorked from '@/components/item/WhyItWorked';
import { useItemView } from '@/db/hooksItems';

export default function ItemPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { item, loading } = useItemView(id);

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
  const displayRating = item?.entry?.userRating != null
    ? (item.entry.userRating % 1 === 0 
        ? item.entry.userRating.toFixed(0) 
        : item.entry.userRating.toFixed(1))
    : null;
  const displayTags = item?.entry?.whyTags?.slice(0, 3) || [];

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

            {/* Rating */}
            {displayRating && <RatingBlock rating={displayRating} />}

            {/* Tags */}
            {displayTags.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2.5">
                {displayTags.map((tag) => (
                  <TagChip key={tag} label={tag} />
                ))}
              </div>
            )}

            {/* Why It Worked */}
            <WhyItWorked />
          </div>
        </div>
      </div>
    </div>
  );
}
