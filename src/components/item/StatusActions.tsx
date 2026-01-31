'use client';

interface StatusActionsProps {
  currentStatus?: 'watched' | 'queued' | null;
  onWatched: () => void;
  onQueued: () => void;
}

export default function StatusActions({ currentStatus, onWatched, onQueued }: StatusActionsProps) {
  return (
    <div className="mt-6 flex gap-3">
      <button
        onClick={onWatched}
        className={`flex-1 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
          currentStatus === 'watched'
            ? 'bg-white/10 border-white/30 text-white'
            : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/[0.08] hover:border-white/10'
        }`}
      >
        Watched
      </button>
      <button
        onClick={onQueued}
        className={`flex-1 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
          currentStatus === 'queued'
            ? 'bg-white/10 border-white/30 text-white'
            : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/[0.08] hover:border-white/10'
        }`}
      >
        Add to queue
      </button>
    </div>
  );
}
