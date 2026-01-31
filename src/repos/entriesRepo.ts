import { db, type Entry, type Domain, type EntryStatus } from '@/db/db';

export interface UpsertEntryInput {
  id: string;
  domain: Domain;
  status: EntryStatus;
  userRating?: number;
  whyTags?: string[];
  watchedAt?: number;
  queuedAt?: number;
  createdAt?: number;
  updatedAt?: number;
}

/**
 * Upserts an entry. If entry exists, updates it while preserving createdAt.
 * If new, sets createdAt and updatedAt to now.
 */
export async function upsertEntry(input: UpsertEntryInput): Promise<Entry> {
  const now = Date.now();
  const existing = await db.entries.get(input.id);

  const entry: Entry = {
    id: input.id,
    domain: input.domain,
    status: input.status,
    userRating: input.userRating,
    whyTags: input.whyTags || [],
    createdAt: existing?.createdAt || input.createdAt || now,
    updatedAt: input.updatedAt || now,
    watchedAt: input.watchedAt,
    queuedAt: input.queuedAt,
  };

  await db.entries.put(entry);
  return entry;
}

/**
 * Gets a single entry by ID.
 */
export async function getEntry(id: string): Promise<Entry | undefined> {
  return db.entries.get(id);
}

/**
 * Deletes an entry by ID.
 * Note: This does NOT delete the associated CatalogItem (keeps it cached).
 */
export async function deleteEntry(id: string): Promise<void> {
  await db.entries.delete(id);
}

/**
 * Sets the status of an entry, updating the appropriate timestamp field.
 * Preserves all other entry data (userRating, whyTags, createdAt).
 * Clears the opposite timestamp (e.g., if setting to 'watched', clears queuedAt).
 */
export async function setEntryStatus(id: string, status: EntryStatus): Promise<Entry> {
  const existing = await db.entries.get(id);
  if (!existing) {
    throw new Error(`Entry with id ${id} not found`);
  }

  const now = Date.now();
  const entry: Entry = {
    ...existing,
    status,
    updatedAt: now,
    // Set the appropriate timestamp based on status, clear the opposite
    watchedAt: status === 'watched' ? now : undefined,
    queuedAt: status === 'queued' ? now : undefined,
  };

  await db.entries.put(entry);
  return entry;
}

export interface ListEntriesOptions {
  status?: EntryStatus;
  domain?: Domain;
}

/**
 * Lists entries with optional filters.
 * Results ordered by updatedAt descending.
 */
export async function listEntries(options: ListEntriesOptions = {}): Promise<Entry[]> {
  let query = db.entries.orderBy('updatedAt').reverse();

  if (options.status) {
    query = query.filter((entry) => entry.status === options.status);
  }

  if (options.domain) {
    query = query.filter((entry) => entry.domain === options.domain);
  }

  return query.toArray();
}
