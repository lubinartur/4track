interface CuratedPosterCardProps {
  chip: string;
}

export default function CuratedPosterCard({ chip }: CuratedPosterCardProps) {
  return (
    <div className="relative mr-4 flex-shrink-0 w-[140px] rounded-[20px] overflow-hidden bg-[#141420]/60" style={{ aspectRatio: '2/3.15' }}>
      {/* Poster image */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#3a2a4a] via-[#2a2a3a] to-[#1a1a2a]"
      />
      
      {/* Gradient overlay at bottom for readability */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
      
      {/* Overlay chip */}
      <div className="absolute bottom-3 left-3 right-3">
        <div className="flex items-center gap-1.5 rounded-full border border-white/5 bg-black/40 px-2.5 py-1.5 backdrop-blur-sm">
          <svg
            width="8"
            height="8"
            viewBox="0 0 12 12"
            fill="none"
            className="text-[#ff3d00]/60"
          >
            <path
              d="M6 1L7.5 4.5L11 6L7.5 7.5L6 11L4.5 7.5L1 6L4.5 4.5L6 1Z"
              fill="currentColor"
            />
          </svg>
          <span className="text-[8px] font-medium text-white/85 leading-none tracking-wide">
            {chip}
          </span>
        </div>
      </div>
    </div>
  );
}
