interface RecentlyWatchedItemProps {
  title: string;
  rating: string;
}

export default function RecentlyWatchedItem({ title, rating }: RecentlyWatchedItemProps) {
  return (
    <div className="flex gap-4 rounded-[20px] border border-white/5 bg-[#141420]/50 p-3.5 shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.08)] backdrop-blur-sm">
      {/* Thumbnail */}
      <div 
        className="flex-shrink-0 w-16 h-24 rounded-[12px] bg-gradient-to-br from-[#3a2a4a] via-[#2a2a3a] to-[#1a1a2a] overflow-hidden"
      />
      
      {/* Content */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <h3 className="mb-2 text-[15px] font-medium leading-tight text-primary line-clamp-2">
          {title}
        </h3>
        <div className="text-[11px]">
          <span className="text-tertiary">RATED</span>{' '}
          <span className="text-[#ff3d00] font-medium">{rating}</span>
        </div>
      </div>
    </div>
  );
}
