import { getItemDetail, slugByTmdbId } from '@/app/item/itemData';
import { fetchTmdbMovieItemDetail } from '@/lib/tmdbMovieDetail';
import type { ItemDetail } from '@/types/item';

/**
 * Resolves `ItemDetail` for `/item/[id]`:
 * - curated registry slug (`fight-club`, …)
 * - `tmdb-{id}` — canonical local slug if we have one for that TMDB id, else live TMDB-backed detail
 */
export async function resolveItemDetail(routeId: string): Promise<ItemDetail | null> {
  const local = getItemDetail(routeId);
  if (local) return local;

  const m = /^tmdb-(\d+)$/.exec(routeId);
  if (!m) return null;

  const tmdbNumericId = Number(m[1]);
  if (!Number.isFinite(tmdbNumericId)) return null;

  const canonicalSlug = slugByTmdbId[tmdbNumericId];
  if (canonicalSlug) {
    const curated = getItemDetail(canonicalSlug);
    if (curated) return curated;
  }

  return fetchTmdbMovieItemDetail(tmdbNumericId);
}
