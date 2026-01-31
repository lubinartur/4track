import type { Domain, Entry } from '@/db/db';

export interface ItemView {
  id: string;
  domain: Domain;
  title: string;
  year?: number;
  overview?: string;
  posterUrl?: string;
  backdropUrl?: string;
  genres: string[];
  voteAverage?: number; // TMDB rating (0-10 scale)
  entry?: Entry;
}
