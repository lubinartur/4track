'use client';

import { useRouter } from 'next/navigation';

interface ItemHeroProps {
  image?: string;
  backdropUrl?: string;
  posterUrl?: string;
}

export default function ItemHero({ image, backdropUrl, posterUrl }: ItemHeroProps) {
  const router = useRouter();
  
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
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-black/40 backdrop-blur-sm transition-colors hover:bg-black/60"
        aria-label="Back"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="text-white/80"
        >
          <path
            d="M12 4L6 10L12 16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
