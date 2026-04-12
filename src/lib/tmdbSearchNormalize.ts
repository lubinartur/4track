import { genreIdsToLabel } from '@/lib/tmdbMovieGenres';
import { resolveItemSlugForMovie } from '@/lib/resolveItemSlug';
import type { DiscoverSearchResultItem } from '@/types/discoverSearch';

export type TmdbMovieSearchResult = {
  id: number;
  title?: string;
  original_title?: string;
  vote_average?: number;
  release_date?: string;
  poster_path?: string | null;
  genre_ids?: number[];
};

const POSTER_BASE = 'https://image.tmdb.org/t/p/w500';

function formatRating(vote: number | undefined): string {
  if (vote == null || Number.isNaN(vote)) return '—';
  if (vote === 0) return '—';
  return vote.toFixed(1);
}

function parseYear(releaseDate: string | undefined): number {
  if (!releaseDate || releaseDate.length < 4) return 0;
  const y = parseInt(releaseDate.slice(0, 4), 10);
  return Number.isFinite(y) ? y : 0;
}

export function normalizeTmdbMovieSearchRow(row: TmdbMovieSearchResult): DiscoverSearchResultItem {
  const title = (row.title || row.original_title || '').trim() || 'Untitled';
  const genresLabel = genreIdsToLabel(row.genre_ids ?? []);
  const posterUrl = row.poster_path ? `${POSTER_BASE}${row.poster_path}` : '';
  const itemSlug = resolveItemSlugForMovie(row.id, title);

  return {
    id: `tmdb-${row.id}`,
    title,
    rating: formatRating(row.vote_average),
    year: parseYear(row.release_date),
    genresLabel: genresLabel || '—',
    posterUrl,
    ...(itemSlug ? { itemSlug } : {}),
  };
}
