'use client';

import type { ItemView } from '@/types/itemView';

interface PosterTileProps {
  item: ItemView;
  label?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  size?: 'hero' | 'normal';
  onClick?: () => void;
  disabled?: boolean;
}

export default function PosterTile({
  item,
  label,
  subtitle,
  actions,
  size = 'normal',
  onClick,
  disabled = false,
}: PosterTileProps) {
  const hasImage = item.posterUrl || item.backdropUrl;
  const isHero = size === 'hero';
  
  // Hero: larger width, normal: standard poster width
  const widthClass = isHero ? 'w-[180px] sm:w-[240px]' : 'w-[120px] sm:w-[160px]';
  
  // Separate year and user rating for proper styling
  const year = item.year?.toString();
  const userRating = item.entry?.userRating;

  return (
    <div
      className={`relative flex-shrink-0 ${widthClass} snap-start ${
        disabled ? 'opacity-40 cursor-default' : 'cursor-pointer'
      }`}
      onClick={disabled ? undefined : onClick}
    >
      <div className={`relative aspect-[2/3] rounded-lg overflow-hidden border border-white/5 bg-gradient-to-br from-[#3a2a4a] via-[#2a2a3a] to-[#1a1a2a] transition-transform hover:scale-[1.06] active:scale-[0.98] shadow-lg hover:shadow-xl ${
        isHero ? 'shadow-2xl' : ''
      }`}>
        {/* Image */}
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.posterUrl || item.backdropUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : null}

        {/* Label overlay (top-left) */}
        {label && (
          <div className="absolute top-2 left-2 z-10">
            <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/70 bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
              {label}
            </span>
          </div>
        )}

        {/* Actions overlay (top-right) */}
        {actions && !disabled && (
          <div
            className="absolute top-2 right-2 z-20 flex gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            {actions}
          </div>
        )}

        {/* Bottom gradient overlay for text readability - no blur, only gradient */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-lg" 
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 45%, rgba(0,0,0,0.35) 65%, rgba(0,0,0,0.1) 80%, rgba(0,0,0,0) 90%)'
          }}
        />

        {/* Bottom overlay - title, meta, subtitle */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-4">
          <h3 className={`text-white font-medium leading-tight line-clamp-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] ${
            isHero ? 'text-[14px]' : 'text-[11px]'
          }`}>
            {item.title}
          </h3>
          {(year || userRating) && (
            <div className={`mt-0.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] flex items-center gap-1.5 ${
              isHero ? 'text-[11px]' : 'text-[10px]'
            }`}>
              {year && (
                <span className="text-white/60">{year}</span>
              )}
              {year && userRating && (
                <span className="text-white/40">•</span>
              )}
              {userRating && (
                <span className="text-orange-500 font-semibold tracking-wide">
                  ★ {userRating}
                </span>
              )}
            </div>
          )}
          {subtitle && (
            <p className={`text-white/50 mt-1 line-clamp-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] ${
              isHero ? 'text-[11px]' : 'text-[10px]'
            }`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Disabled overlay */}
        {disabled && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <p className="text-[11px] text-white/60 font-medium">Coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
