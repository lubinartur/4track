import { db, Film, Session, Book, type Entry, type CatalogItem, type TasteSeed } from './db';
import { makeEntryId } from './entryId';
import { upsertEntry } from '@/repos/entriesRepo';
import { upsertCatalogItems } from '@/repos/catalogRepo';
import { migrateLegacyFilmsToEntries, isLegacyFilmsMigrationDone } from './migrations/migrateLegacyFilms';

const seedFilms: Omit<Film, 'id' | 'createdAt'>[] = [
  {
    title: 'Dune: Part Two',
    rating: 9.5,
    tags: ['SCI-FI', 'ATMOSPHERIC'],
  },
  {
    title: 'The Zone of Interest',
    rating: 9.0,
    tags: ['INTENSE', 'CINEMA'],
  },
];

const seedSessions: Omit<Session, 'id' | 'createdAt'>[] = [
  {
    title: 'Upper Body Power',
    durationMin: 45,
    type: 'Strength',
    intensity: 8.2,
    tags: ['STRENGTH', 'HYPERTROPHY'],
  },
  {
    title: 'Cardio Interval',
    durationMin: 30,
    type: 'Cardio',
    intensity: 8.2,
    tags: ['CARDIO', 'HIIT'],
  },
  {
    title: 'Lower Body Focus',
    durationMin: 50,
    type: 'Strength',
    intensity: 8.2,
    tags: ['STRENGTH', 'LEGS'],
  },
];

const seedBooks: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    status: 'reading',
    pace: 'steady',
  },
  {
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    status: 'finished',
    pace: 'steady',
  },
  {
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    status: 'paused',
    pace: 'steady',
  },
];

export async function seedDatabase() {
  try {
    // Films: only seed if table is empty
    const filmsCount = await db.films.count();
    if (filmsCount === 0) {
      const filmsToAdd: Film[] = seedFilms.map((film, index) => ({
        ...film,
        id: `film-${index + 1}`,
        createdAt: Date.now() - (seedFilms.length - index) * 86400000, // Stagger by days
      }));

      // Use bulkPut for idempotency (won't throw if key exists)
      await db.films.bulkPut(filmsToAdd);
      console.log('Database seeded with', filmsToAdd.length, 'films');
    }

    // Sessions: only seed if table is empty
    const sessionsCount = await db.sessions.count();
    if (sessionsCount === 0) {
      const now = Date.now();
      // 1 session today (this week), 2 sessions 2-3 days ago (still within last 7 days)
      const sessionsToAdd: Session[] = seedSessions.map((session, index) => ({
        ...session,
        id: `session-${index + 1}`,
        createdAt: now - (index * 2 * 86400000), // 0 days, 2 days, 4 days ago (all within last 7)
      }));

      // Use bulkPut for idempotency (won't throw if key exists)
      await db.sessions.bulkPut(sessionsToAdd);
      console.log('Database seeded with', sessionsToAdd.length, 'sessions');
    }

    // Books: only seed if table is empty
    const booksCount = await db.books.count();
    if (booksCount === 0) {
      const now = Date.now();
      const booksToAdd: Book[] = seedBooks.map((book, index) => ({
        ...book,
        id: `book-${index + 1}`,
        createdAt: now - (seedBooks.length - index) * 86400000 * 7, // Stagger by weeks
        updatedAt: now - (seedBooks.length - index) * 86400000 * 7,
      }));

      // Use bulkPut for idempotency (won't throw if key exists)
      await db.books.bulkPut(booksToAdd);
      console.log('Database seeded with', booksToAdd.length, 'books');
    }

    // Entries: only seed if table is empty (map existing seed films to entries)
    const entriesCount = await db.entries.count();
    if (entriesCount === 0) {
      const entriesToAdd: Entry[] = seedFilms.map((film, index) => {
        const entryId = makeEntryId('tmdb', 'film', `seed-${index + 1}`);
        const createdAt = Date.now() - (seedFilms.length - index) * 86400000;
        
        return {
          id: entryId,
          domain: 'film',
          status: 'watched',
          userRating: film.rating,
          whyTags: film.tags,
          createdAt,
          updatedAt: createdAt,
          watchedAt: createdAt,
        };
      });

      // Use upsertEntry to ensure proper timestamp handling
      for (const entry of entriesToAdd) {
        await upsertEntry(entry);
      }
      console.log('Database seeded with', entriesToAdd.length, 'entries');
    }

    // Catalog: only seed if table is empty (create matching catalog items)
    const catalogCount = await db.catalog.count();
    if (catalogCount === 0) {
      const catalogItemsToAdd: CatalogItem[] = seedFilms.map((film, index) => {
        const catalogId = makeEntryId('tmdb', 'film', `seed-${index + 1}`);
        
        return {
          id: catalogId,
          source: 'tmdb',
          sourceId: `seed-${index + 1}`,
          domain: 'film',
          title: film.title,
          genres: film.tags,
          // year, overview, posterUrl, backdropUrl can be empty for now
        };
      });

      await upsertCatalogItems(catalogItemsToAdd);
      console.log('Database seeded with', catalogItemsToAdd.length, 'catalog items');
    }

    // TasteSeeds: only seed if table is empty (create taste seeds for entries)
    const tasteSeedsCount = await db.tasteSeeds.count();
    if (tasteSeedsCount === 0) {
      const entries = await db.entries.toArray();
      const now = Date.now();
      
      const tasteSeedsToAdd: TasteSeed[] = entries.map((entry, index) => ({
        entryId: entry.id,
        weight: (index % 3) + 1 as 1 | 2 | 3, // Distribute weights 1, 2, 3
        createdAt: now - index * 1000, // Stagger slightly
      }));

      await db.tasteSeeds.bulkPut(tasteSeedsToAdd);
      console.log('Database seeded with', tasteSeedsToAdd.length, 'taste seeds');
    }

    // Run legacy films migration if not already done
    if (!(await isLegacyFilmsMigrationDone())) {
      try {
        const result = await migrateLegacyFilmsToEntries();
        if (result.migrated > 0 || result.skipped > 0) {
          console.log(`Legacy films migration: ${result.migrated} migrated, ${result.skipped} skipped`);
        }
      } catch (error) {
        console.error('Error during legacy films migration:', error);
        // Don't throw - allow seeding to complete even if migration fails
      }
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
