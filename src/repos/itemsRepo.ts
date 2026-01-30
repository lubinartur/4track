import { getEntry } from './entriesRepo';
import { getCatalogItem } from './catalogRepo';
import type { ItemView } from '@/types/itemView';

/**
 * Gets a unified ItemView by combining entry and catalog data.
 * Returns null if neither entry nor catalog exists.
 */
export async function getItemView(id: string): Promise<ItemView | null> {
  // Fetch entry and catalog in parallel
  const [entry, catalog] = await Promise.all([
    getEntry(id),
    getCatalogItem(id),
  ]);

  // If neither exists, return null
  if (!entry && !catalog) {
    return null;
  }

  // Derive domain: prefer entry.domain if exists, else catalog.domain
  const domain = entry?.domain || catalog?.domain;
  if (!domain) {
    return null;
  }

  // Title: prefer catalog.title if exists, else fallback to "(Untitled)"
  const title = catalog?.title || '(Untitled)';

  // Genres default to empty array
  const genres = catalog?.genres || [];

  // Build ItemView
  const itemView: ItemView = {
    id,
    domain,
    title,
    year: catalog?.year,
    overview: catalog?.overview,
    posterUrl: catalog?.posterUrl,
    backdropUrl: catalog?.backdropUrl,
    genres,
    entry: entry || undefined,
  };

  return itemView;
}
