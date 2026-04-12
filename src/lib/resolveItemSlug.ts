import { itemDetailsById, slugByTmdbId } from '@/app/item/itemData';
import { slugifyMovieTitle } from '@/lib/movieSlug';

/** Resolve `/item/[slug]` for TMDB search rows when we have a matching catalog entry. */
export function resolveItemSlugForMovie(tmdbNumericId: number, title: string): string | undefined {
  const byId = slugByTmdbId[tmdbNumericId];
  if (byId) return byId;

  const fromTitle = slugifyMovieTitle(title);
  if (fromTitle && itemDetailsById[fromTitle]) return fromTitle;

  return undefined;
}
