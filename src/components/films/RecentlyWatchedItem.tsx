'use client';

interface RecentlyWatchedItemProps {
  title: string;
  rating?: number | null;
  image?: string;
  status?: 'watched' | 'queued' | null;
  onMarkWatched?: (e: React.MouseEvent) => void;
  onMoveToQueue?: (e: React.MouseEvent) => void;
  onRemove?: (e: React.MouseEvent) => void;
  rightAction?: React.ReactNode;
}

export default function RecentlyWatchedItem({ 
  title, 
  rating, 
  image, 
  status,
  onMarkWatched,
  onMoveToQueue,
  onRemove,
  rightAction 
}: RecentlyWatchedItemProps) {
  const isQueued = status === 'queued';
  const isWatched = status === 'watched';

  return (
    <div className="flex gap-4 rounded-[20px] border border-white/5 bg-[#141420]/50 p-3.5 shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.08)] backdrop-blur-sm">
      {/* Thumbnail */}
      <div 
        className="flex-shrink-0 w-16 h-24 rounded-[12px] bg-gradient-to-br from-[#3a2a4a] via-[#2a2a3a] to-[#1a1a2a] overflow-hidden"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="w-full h-full object-cover" />
        ) : null}
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <h3 className="mb-2 text-[15px] font-medium leading-tight text-primary line-clamp-2">
          {title}
        </h3>
        {rating != null && (
          <div className="text-[11px]">
            <span className="text-tertiary">RATED</span>{' '}
            <span className="text-[#ff3d00] font-medium">{rating}</span>
          </div>
        )}
      </div>

      {/* Right action icons */}
      <div className="flex-shrink-0 flex items-center gap-1.5">
        {rightAction ? (
          rightAction
        ) : (
          <>
            {isQueued && onMarkWatched && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onMarkWatched(e);
                }}
                className="p-1.5 rounded-full border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white active:scale-95 transition-all"
                aria-label="Mark as watched"
                title="Mark as watched"
              >
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
              </button>
            )}
            {isWatched && onMoveToQueue && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onMoveToQueue(e);
                }}
                className="p-1.5 rounded-full border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white active:scale-95 transition-all"
                aria-label="Move back to queue"
                title="Move back to queue"
              >
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
                  <path d="M3 7v6h6" />
                  <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                </svg>
              </button>
            )}
            {onRemove && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove(e);
                }}
                className="p-1.5 rounded-full border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-red-300 active:scale-95 transition-all"
                aria-label="Remove"
                title="Remove"
              >
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
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
