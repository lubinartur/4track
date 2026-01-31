import Dexie, { Table } from 'dexie';

// Legacy tables (keep for backward compatibility)
export interface Film {
  id: string;
  title: string;
  rating: number;
  tags: string[];
  image?: string;
  createdAt: number;
}

export interface Session {
  id: string;
  title: string;
  durationMin: number;
  type: string;
  intensity: number;
  tags: string[];
  createdAt: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  status: 'reading' | 'finished' | 'paused';
  pace: 'steady' | 'slow' | 'fast';
  createdAt: number;
  updatedAt: number;
}

// New core data model types
export type Domain = 'film' | 'series' | 'anime' | 'book';
export type Source = 'tmdb' | 'anilist';
export type EntryStatus = 'queued' | 'watched';

export interface Entry {
  id: string; // Format: `${source}:${domain}:${sourceId}`
  domain: Domain;
  status: EntryStatus;
  userRating?: number;
  whyTags: string[];
  createdAt: number;
  updatedAt: number;
  watchedAt?: number;
  queuedAt?: number;
}

export interface CatalogItem {
  id: string; // Format: `${source}:${domain}:${sourceId}`
  source: Source;
  sourceId: string | number;
  domain: Domain;
  title: string;
  year?: number;
  overview?: string;
  posterUrl?: string;
  backdropUrl?: string;
  genres: string[];
  voteAverage?: number; // TMDB rating (0-10 scale)
}

export interface TasteSeed {
  entryId: string; // References Entry.id
  weight: 1 | 2 | 3;
  createdAt: number;
}

export interface MetaKV {
  key: string;
  value: string;
}

export class AppDatabase extends Dexie {
  // Legacy tables
  films!: Table<Film>;
  sessions!: Table<Session>;
  books!: Table<Book>;
  
  // New core tables
  entries!: Table<Entry>;
  catalog!: Table<CatalogItem>;
  tasteSeeds!: Table<TasteSeed>;
  meta!: Table<MetaKV>;

  constructor() {
    super('4trackDB');
    this.version(5).stores({
      // Legacy tables (keep existing indexes)
      films: 'id, title, rating, createdAt',
      sessions: 'id, title, createdAt',
      books: 'id, title, status, createdAt, updatedAt',
      // New core tables
      entries: 'id, domain, status, updatedAt, createdAt',
      catalog: 'id, source, domain, title',
      tasteSeeds: 'entryId, weight, createdAt',
      meta: 'key',
    });
  }
}

export const db = new AppDatabase();
