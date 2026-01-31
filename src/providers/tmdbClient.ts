import type { CatalogItem } from '@/db/db';

interface TMDBSearchResult {
  source: 'tmdb';
  sourceId: number | string;
  domain: 'film' | 'series';
  title: string;
  year?: number;
  overview?: string;
  posterUrl?: string;
  backdropUrl?: string;
  genres: string[];
  voteAverage?: number;
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

/**
 * Fetch TMDB recommendations for a movie or TV show.
 * Returns normalized CatalogItem-like objects (without id field).
 */
export async function fetchRecommendationsTmdb(
  sourceId: string,
  domain: 'film' | 'series'
): Promise<TMDBSearchResult[]> {
  const response = await fetch(
    `/api/tmdb/recommendations?sourceId=${encodeURIComponent(sourceId)}&domain=${domain}`
  );

  if (!response.ok) {
    let errorMessage = `TMDB recommendations failed: ${response.statusText}`;
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

/**
 * Fetch TMDB trending items for a domain.
 * Returns normalized CatalogItem-like objects (without id field).
 */
export async function fetchTrendingTmdb(
  domain: 'film' | 'series'
): Promise<TMDBSearchResult[]> {
  const response = await fetch(
    `/api/tmdb/trending?domain=${domain}`
  );

  if (!response.ok) {
    let errorMessage = `TMDB trending failed: ${response.statusText}`;
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

/**
 * Fetch TMDB details for a movie or TV show.
 * Returns normalized CatalogItem-like object (without id field).
 */
export async function fetchTmdbDetails(
  domain: 'film' | 'series',
  sourceId: string
): Promise<TMDBSearchResult> {
  const response = await fetch(
    `/api/tmdb/details?domain=${domain}&sourceId=${encodeURIComponent(sourceId)}`
  );

  if (!response.ok) {
    let errorMessage = `TMDB details failed: ${response.statusText}`;
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

  const result: TMDBSearchResult = await response.json();
  return result;
}
