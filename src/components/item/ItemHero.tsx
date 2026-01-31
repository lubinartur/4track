'use client';

import BackButton from '@/components/layout/BackButton';

interface ItemHeroProps {
  image?: string;
  backdropUrl?: string;
  posterUrl?: string;
}

export default function ItemHero({ image, backdropUrl, posterUrl }: ItemHeroProps) {
  // Prefer: image (legacy) > backdropUrl > posterUrl > gradient
  const imageUrl = image || backdropUrl || posterUrl;

  return (
    <div className="relative w-full mb-8 h-[50vh] min-h-[360px] max-h-[420px] overflow-hidden">
      {/* Poster/backdrop image or gradient placeholder */}
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#3a2a4a] via-[#2a2a3a] to-[#1a1a2a]" />
      )}
      
      {/* Dark bottom gradient for text readability */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/80 to-transparent" />
      
      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <BackButton fallbackPath="/films" />
      </div>
    </div>
  );
}
