'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { getItemView } from '@/repos/itemsRepo';

/**
 * Hook to get an ItemView by ID with reactive updates.
 */
export function useItemView(id: string) {
  const item = useLiveQuery(
    async () => {
      if (!id) return null;
      return getItemView(id);
    },
    [id],
    null
  );

  return {
    item: item || null,
    loading: item === undefined,
  };
}
