import type { ItemView } from '@/types/itemView';

interface ItemAboutProps {
  item: ItemView;
}

export default function ItemAbout({ item }: ItemAboutProps) {
  const hasYear = item.year != null;
  const hasGenres = item.genres && item.genres.length > 0;
  const hasOverview = item.overview && item.overview.trim().length > 0;
  const voteAverage = item.voteAverage;

  // Don't render if no data
  if (!hasYear && !hasGenres && !voteAverage && !hasOverview) {
    return null;
  }

  return (
    <div className="mt-6 space-y-3">
      {/* Meta row: year + genres */}
      {(hasYear || hasGenres) && (
        <div className="text-sm text-white/60">
          {hasYear && <span>{item.year}</span>}
          {hasYear && hasGenres && <span className="mx-2">•</span>}
          {hasGenres && <span>{item.genres.join(', ')}</span>}
        </div>
      )}

      {/* Rating row: TMDB rating */}
      {voteAverage != null && (
        <div className="text-sm text-white/50">
          TMDB {voteAverage.toFixed(1)}
        </div>
      )}

      {/* Overview paragraph */}
      {hasOverview && (
        <p className="text-base text-white/80 leading-relaxed">
          {item.overview}
        </p>
      )}
    </div>
  );
}
