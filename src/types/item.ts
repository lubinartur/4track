import type { MovieItem } from '@/types/movie';

export type ItemCredits = {
  director: string;
  lead: string;
  music: string;
  studio: string;
};

export type ItemDetail = {
  id: string;
  /** TMDB movie id — maps search results to this slug when present. */
  tmdbId?: number;
  title: string;
  rating: string;
  year: number;
  genresLabel: string;
  posterUrl: string;
  /** Full-width blurred hero behind header */
  backdropUrl: string;
  overview: string;
  credits: ItemCredits;
  tasteInsight: {
    entryCount: number;
    description: string;
  };
  /** Hero carousel / taste context — mock values until backend exists */
  heroAiMatchPercent: number;
  heroReasonTags: readonly [string, string, string];
  similar: MovieItem[];
};
