import { db } from '../db';

/**
 * Purges all manually-added items from the new data model.
 * 
 * Definition of "manual" (items without TMDB metadata):
 * - CatalogItem.posterUrl is empty OR undefined
 * - AND CatalogItem.backdropUrl is empty OR undefined
 * 
 * @returns Object with deletion counts
 */
export async function purgeLocalItems(): Promise<{
  entriesDeleted: number;
  catalogDeleted: number;
  tasteSeedsDeleted: number;
  legacyFilmsDeleted: number;
}> {
  let entriesDeleted = 0;
  let catalogDeleted = 0;
  let tasteSeedsDeleted = 0;
  let legacyFilmsDeleted = 0;

  try {
    // Select catalog items where posterUrl is empty/undefined AND backdropUrl is empty/undefined
    const allCatalogItems = await db.catalog.toArray();
    const manualCatalogItems = allCatalogItems.filter((item) => {
      const hasPoster = item.posterUrl && item.posterUrl.trim() !== '';
      const hasBackdrop = item.backdropUrl && item.backdropUrl.trim() !== '';
      return !hasPoster && !hasBackdrop;
    });

    // Collect entryIds from those catalog items
    const idsToDelete = new Set<string>(manualCatalogItems.map((item) => item.id));

    console.log(`Found ${idsToDelete.size} manual items to purge (no TMDB metadata)`);

    // Collect titles from catalog items for legacy films matching
    const titlesToMatch = new Set<string>(
      manualCatalogItems.map((item) => item.title).filter(Boolean)
    );

    // For each id, delete from entries, catalog, and taste seeds
    for (const id of idsToDelete) {
      // Delete entry
      try {
        await db.entries.delete(id);
        entriesDeleted++;
      } catch (error) {
        // Entry might not exist, continue
      }

      // Delete catalog item
      try {
        await db.catalog.delete(id);
        catalogDeleted++;
      } catch (error) {
        // Catalog item might not exist, continue
      }

      // Delete taste seeds where entryId === id
      const deletedCount = await db.tasteSeeds.where('entryId').equals(id).delete();
      tasteSeedsDeleted += deletedCount;
    }

    // Additionally delete from legacy db.films any records with title matching catalog.title
    // (best-effort; count deletions; if films table not needed, delete none)
    if (titlesToMatch.size > 0) {
      const allFilms = await db.films.toArray();
      const filmsToDelete = allFilms.filter((film) => titlesToMatch.has(film.title));
      
      if (filmsToDelete.length > 0) {
        await db.films.bulkDelete(filmsToDelete.map((film) => film.id));
        legacyFilmsDeleted = filmsToDelete.length;
      }
    }

    console.log(`Purge complete: ${entriesDeleted} entries, ${catalogDeleted} catalog, ${tasteSeedsDeleted} taste seeds, ${legacyFilmsDeleted} legacy films`);
  } catch (error) {
    console.error('Error during local items purge:', error);
    throw error;
  }

  return {
    entriesDeleted,
    catalogDeleted,
    tasteSeedsDeleted,
    legacyFilmsDeleted,
  };
}
