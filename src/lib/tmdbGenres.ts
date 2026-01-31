/**
 * TMDB Movie Genre IDs to Names mapping (official TMDB genre list)
 * Source: https://developer.themoviedb.org/reference/genre-movie-list
 */
const TMDB_MOVIE_GENRES: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

/**
 * Maps TMDB genre IDs to genre names.
 * Returns unique genre names in the order they appear.
 */
export function mapTmdbGenreIdsToNames(ids: number[]): string[] {
  const names = ids
    .map((id) => TMDB_MOVIE_GENRES[id])
    .filter((name): name is string => name !== undefined);
  
  // Return unique names while preserving order
  return Array.from(new Set(names));
}
