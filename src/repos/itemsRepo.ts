import { getEntry } from './entriesRepo';
import { getCatalogItem, upsertCatalogItems } from './catalogRepo';
import { fetchTmdbDetails } from '@/providers/tmdbClient';
import type { ItemView } from '@/types/itemView';

// Track which items have been healed in this session to avoid infinite loops
const healedItemIds = new Set<string>();

/**
 * Gets a unified ItemView by combining entry and catalog data.
 * Returns null if neither entry nor catalog exists.
 */
export async function getItemView(id: string): Promise<ItemView | null> {
  // Try exact id first (current)
  let entry = await getEntry(id);
  let catalog = await getCatalogItem(id);
  let finalId = id;

  // Also try decodeURIComponent(id) in case route param is encoded
  if (!entry && !catalog) {
    try {
      const decodedId = decodeURIComponent(id);
      if (decodedId !== id) {
        [entry, catalog] = await Promise.all([
          getEntry(decodedId),
          getCatalogItem(decodedId),
        ]);
        // Use decoded id if found
        if (entry || catalog) {
          finalId = decodedId;
        }
      }
    } catch {
      // decodeURIComponent failed, ignore
    }
  }

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

  // Self-heal: if catalog is TMDB and missing genres or voteAverage, fetch details
  if (
    catalog &&
    catalog.source === 'tmdb' &&
    !healedItemIds.has(finalId) &&
    (catalog.genres.length === 0 || catalog.voteAverage == null)
  ) {
    healedItemIds.add(finalId);
    
    try {
      const sourceId = String(catalog.sourceId);
      // Only fetch details if sourceId is a numeric TMDB ID
      if (!/^\d+$/.test(sourceId)) {
        // Skip details fetch for non-numeric sourceIds (e.g., "seed-1", "local-...")
        console.warn(`Skipping TMDB details fetch for non-numeric sourceId: ${sourceId}`);
      } else {
        const details = await fetchTmdbDetails(domain, sourceId);
        
        // Upsert catalog with full metadata, keeping the same id
        // Ensure sourceId is string to match catalog format
        const detailsSourceId = typeof details.sourceId === 'number' ? String(details.sourceId) : details.sourceId;
        await upsertCatalogItems([
          {
            id: finalId,
            source: 'tmdb',
            sourceId: detailsSourceId,
            domain: details.domain,
            title: details.title,
            year: details.year,
            overview: details.overview,
            posterUrl: details.posterUrl,
            backdropUrl: details.backdropUrl,
            genres: details.genres,
            voteAverage: details.voteAverage,
          },
        ]);
        
        // Re-fetch catalog to get updated data
        catalog = await getCatalogItem(finalId);
      }
    } catch (error) {
      console.error(`Error self-healing metadata for ${finalId}:`, error);
      // Continue with existing catalog data if fetch fails
    }
  }

  // Build ItemView with potentially updated catalog
  const itemView: ItemView = {
    id: finalId,
    domain,
    title: catalog?.title || title,
    year: catalog?.year,
    overview: catalog?.overview,
    posterUrl: catalog?.posterUrl,
    backdropUrl: catalog?.backdropUrl,
    genres: catalog?.genres || genres,
    voteAverage: catalog?.voteAverage,
    entry: entry || undefined,
  };

  return itemView;
}
