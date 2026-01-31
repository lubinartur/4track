'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Entry } from './db';

/**
 * Hook to check if multiple entries exist by their IDs.
 * Returns a Map<entryId, Entry | undefined> for efficient lookups.
 */
export function useEntriesExist(entryIds: string[]): Map<string, Entry | undefined> {
  // Create stable dependency string from sorted IDs
  const idsKey = [...entryIds].sort().join(',');
  
  const entriesMap = useLiveQuery(
    async () => {
      if (entryIds.length === 0) return new Map<string, Entry | undefined>();
      
      const entries = await db.entries.bulkGet(entryIds);
      const map = new Map<string, Entry | undefined>();
      entryIds.forEach((id, index) => {
        map.set(id, entries[index]);
      });
      return map;
    },
    [idsKey], // Dependency on sorted IDs
    new Map()
  );

  return entriesMap || new Map();
}
