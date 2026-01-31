'use client';

interface PosterCardProps {
  title: string;
  posterUrl?: string;
  backdropUrl?: string;
  meta?: string;
  rightActions?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export default function PosterCard({
  title,
  posterUrl,
  backdropUrl,
  meta,
  rightActions,
  onClick,
  disabled = false,
}: PosterCardProps) {
  const hasImage = posterUrl || backdropUrl;

  return (
    <div
      className={`relative flex-shrink-0 w-[120px] sm:w-[160px] snap-start ${
        disabled ? 'opacity-40 cursor-default' : 'cursor-pointer'
      }`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gradient-to-br from-[#3a2a4a] via-[#2a2a3a] to-[#1a1a2a] transition-transform hover:scale-[1.06] active:scale-[0.98] shadow-lg hover:shadow-xl">
        {/* Image */}
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={posterUrl || backdropUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : null}

        {/* Right actions overlay */}
        {rightActions && !disabled && (
          <div
            className="absolute top-2 right-2 z-20 flex gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            {rightActions}
          </div>
        )}

        {/* Bottom gradient overlay for text readability - no blur, only gradient */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-lg" 
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 45%, rgba(0,0,0,0.35) 65%, rgba(0,0,0,0.1) 80%, rgba(0,0,0,0) 90%)'
          }}
        />

        {/* Bottom overlay - always show title, optionally show meta */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-4">
          <h3 className="text-[11px] font-medium text-white leading-tight line-clamp-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]">
            {title}
          </h3>
          {meta && (
            <div className="text-[10px] text-white/60 mt-0.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]">
              {meta}
            </div>
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
