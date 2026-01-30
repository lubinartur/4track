import type { CatalogItem } from '@/db/db';

interface TMDBSearchResult {
  source: 'tmdb';
  sourceId: number;
  domain: 'film' | 'series';
  title: string;
  year?: number;
  overview?: string;
  posterUrl?: string;
  backdropUrl?: string;
  genres: string[];
}

/**
 * Search TMDB for movies or TV shows.
 * Returns normalized CatalogItem-like objects (without id field).
 */
export async function searchTmdb(
  query: string,
  domain: 'film' | 'series'
): Promise<TMDBSearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  const type = domain === 'film' ? 'movie' : 'tv';
  const response = await fetch(
    `/api/tmdb/search?q=${encodeURIComponent(query)}&type=${type}`
  );

  if (!response.ok) {
    let errorMessage = `TMDB search failed: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
        if (errorData.details) {
          errorMessage += ` - ${errorData.details}`;
        }
      }
    } catch {
      // Use default error message if JSON parsing fails
    }
    throw new Error(errorMessage);
  }

  const results: TMDBSearchResult[] = await response.json();
  return results;
}
