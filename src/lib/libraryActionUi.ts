import type { LibraryEntry } from '@/app/library/mockData';

export type LibraryActionFlags = {
  inQueue: boolean;
  watched: boolean;
  /** Has a saved star rating from the rate sheet. */
  rated: boolean;
  favorited: boolean;
};

/** Derives button states from the current library row (if any). */
export function libraryActionFlags(entry: LibraryEntry | undefined): LibraryActionFlags {
  if (!entry) {
    return { inQueue: false, watched: false, rated: false, favorited: false };
  }
  const rated =
    typeof entry.userRating === 'number' && entry.userRating >= 1 && entry.userRating <= 5;
  return {
    inQueue: entry.status === 'queue',
    watched: entry.status === 'watched',
    rated,
    favorited: entry.favorite === true,
  };
}
