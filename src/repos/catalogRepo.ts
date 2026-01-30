import { db, type CatalogItem } from '@/db/db';

/**
 * Upserts multiple catalog items.
 */
export async function upsertCatalogItems(items: CatalogItem[]): Promise<void> {
  await db.catalog.bulkPut(items);
}

/**
 * Gets a single catalog item by ID.
 */
export async function getCatalogItem(id: string): Promise<CatalogItem | undefined> {
  return db.catalog.get(id);
}
