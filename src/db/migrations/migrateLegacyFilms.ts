import { db } from '../db';
import { makeEntryId } from '../entryId';
import { makeLocalSourceIdFromTitle } from '@/lib/localSourceId';
import { upsertEntry } from '@/repos/entriesRepo';
import { upsertCatalogItems } from '@/repos/catalogRepo';

const MIGRATION_KEY = 'legacyFilmsMigrated';

/**
 * Checks if the legacy films migration has already been completed.
 */
export async function isLegacyFilmsMigrationDone(): Promise<boolean> {
  const meta = await db.meta.get(MIGRATION_KEY);
  return meta?.value === 'true';
}

/**
 * Marks the legacy films migration as completed.
 */
async function setLegacyFilmsMigrationDone(): Promise<void> {
  await db.meta.put({ key: MIGRATION_KEY, value: 'true' });
}

/**
 * Migrates legacy db.films to new entries + catalog tables.
 * Idempotent: skips films that already have entries.
 * 
 * @returns Object with migrated and skipped counts
 */
export async function migrateLegacyFilmsToEntries(): Promise<{ migrated: number; skipped: number }> {
  // Check if already done
  if (await isLegacyFilmsMigrationDone()) {
    console.log('Legacy films migration already completed, skipping');
    return { migrated: 0, skipped: 0 };
  }

  let migrated = 0;
  let skipped = 0;

  try {
    // Read all films from legacy table
    const films = await db.films.toArray();

    if (films.length === 0) {
      console.log('No legacy films to migrate');
      await setLegacyFilmsMigrationDone();
      return { migrated: 0, skipped: 0 };
    }

    console.log(`Starting migration of ${films.length} legacy films...`);

    // Process each film
    for (const film of films) {
      // Generate deterministic sourceId from title
      const sourceId = makeLocalSourceIdFromTitle(film.title);
      const entryId = makeEntryId('tmdb', 'film', sourceId);

      // Check if entry already exists (idempotent check)
      const existingEntry = await db.entries.get(entryId);
      if (existingEntry) {
        skipped++;
        continue;
      }

      // Upsert catalog item
      await upsertCatalogItems([
        {
          id: entryId,
          source: 'tmdb',
          sourceId: sourceId,
          domain: 'film',
          title: film.title,
          posterUrl: film.image || undefined,
          genres: film.tags || [],
          overview: undefined,
          // year, backdropUrl left empty
        },
      ]);

      // Upsert entry
      await upsertEntry({
        id: entryId,
        domain: 'film',
        status: 'watched',
        userRating: film.rating,
        whyTags: film.tags || [],
        watchedAt: film.createdAt,
        createdAt: film.createdAt,
        updatedAt: film.createdAt,
      });

      migrated++;
    }

    // Mark migration as done
    await setLegacyFilmsMigrationDone();
    console.log(`Migration complete: ${migrated} migrated, ${skipped} skipped`);
  } catch (error) {
    console.error('Error during legacy films migration:', error);
    throw error;
  }

  return { migrated, skipped };
}
