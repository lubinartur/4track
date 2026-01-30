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
  entry?: Entry;
}
