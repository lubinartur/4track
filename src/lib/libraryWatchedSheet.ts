import type { LibraryEntry } from '@/app/library/mockData';

/**
 * Library: open the rate sheet when marking watched, but not if already watched (no redundant sheet).
 */
export function shouldOpenRateSheetForLibraryWatched(entry: LibraryEntry): boolean {
  return entry.status !== 'watched';
}
