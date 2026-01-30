'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { seedDatabase } from './seed';

// Seed database on module load
if (typeof window !== 'undefined') {
  seedDatabase();
}

export function useFilms() {
  const films = useLiveQuery(
    () => db.films.orderBy('createdAt').reverse().toArray(),
    [],
    []
  );

  return { 
    films: films || [], 
    loading: films === undefined 
  };
}

export function useFilmStats() {
  const allFilms = useLiveQuery(
    () => db.films.toArray(),
    [],
    []
  );

  const stats = allFilms
    ? {
        watched: allFilms.length,
        avgScore: allFilms.length > 0
          ? Math.round((allFilms.reduce((sum, film) => sum + film.rating, 0) / allFilms.length) * 10) / 10
          : 0,
        last7: 4, // Mock value
      }
    : { watched: 0, avgScore: 0, last7: 4 };

  return { 
    stats, 
    loading: allFilms === undefined 
  };
}

export function useFilm(id: string) {
  const film = useLiveQuery(
    () => (id ? db.films.get(id) : Promise.resolve(undefined)),
    [id],
    undefined
  );

  return { 
    film: film || null, 
    loading: film === undefined 
  };
}

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      try {
        // Ensure database is seeded before loading
        await seedDatabase();
        const allSessions = await db.sessions.orderBy('createdAt').reverse().toArray();
        setSessions(allSessions);
      } catch (error) {
        console.error('Error loading sessions:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSessions();
  }, []);

  return { sessions, loading };
}

export function useSessionStats() {
  const [stats, setStats] = useState({
    trainingThisWeek: 0,
    avgIntensity: 0,
    last7Count: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        // Ensure database is seeded before loading
        await seedDatabase();
        const allSessions = await db.sessions.toArray();
        
        const now = Date.now();
        const sevenDaysAgo = now - 7 * 86400000;
        const oneWeekAgo = now - 7 * 86400000; // This week = last 7 days
        
        // Sessions in last 7 days (this week)
        const thisWeekSessions = allSessions.filter(
          (s) => s.createdAt >= oneWeekAgo
        );
        
        // Sessions in last 7 days (for last7 count)
        const last7Sessions = allSessions.filter(
          (s) => s.createdAt >= sevenDaysAgo
        );
        
        const trainingThisWeek = thisWeekSessions.length;
        const last7Count = last7Sessions.length;
        
        // Average intensity of all sessions
        const avgIntensity = allSessions.length > 0
          ? allSessions.reduce((sum, session) => sum + session.intensity, 0) / allSessions.length
          : 0;

        setStats({
          trainingThisWeek,
          avgIntensity: Math.round(avgIntensity * 10) / 10, // Round to 1 decimal
          last7Count,
        });
      } catch (error) {
        console.error('Error loading session stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return { stats, loading };
}

export function useLatestSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLatestSession() {
      try {
        // Ensure database is seeded before loading
        await seedDatabase();
        const latest = await db.sessions.orderBy('createdAt').reverse().first();
        setSession(latest || null);
      } catch (error) {
        console.error('Error loading latest session:', error);
      } finally {
        setLoading(false);
      }
    }

    loadLatestSession();
  }, []);

  return { session, loading };
}

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBooks() {
      try {
        // Ensure database is seeded before loading
        await seedDatabase();
        const allBooks = await db.books.orderBy('createdAt').reverse().toArray();
        setBooks(allBooks);
      } catch (error) {
        console.error('Error loading books:', error);
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  return { books, loading };
}

export function useReadingBook() {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReadingBook() {
      try {
        // Ensure database is seeded before loading
        await seedDatabase();
        const reading = await db.books.where('status').equals('reading').first();
        setBook(reading || null);
      } catch (error) {
        console.error('Error loading reading book:', error);
      } finally {
        setLoading(false);
      }
    }

    loadReadingBook();
  }, []);

  return { book, loading };
}

export function useBookStats() {
  const [stats, setStats] = useState({
    booksThisYear: 0,
    pace: 'steady' as 'steady' | 'slow' | 'fast',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        // Ensure database is seeded before loading
        await seedDatabase();
        const allBooks = await db.books.toArray();
        
        // Count finished books this year
        const yearStart = new Date(new Date().getFullYear(), 0, 1).getTime();
        const finishedThisYear = allBooks.filter(
          (b) => b.status === 'finished' && b.updatedAt >= yearStart
        );
        
        // Get pace from currently reading book
        const readingBook = await db.books.where('status').equals('reading').first();
        const pace = readingBook?.pace || 'steady';

        setStats({
          booksThisYear: finishedThisYear.length,
          pace,
        });
      } catch (error) {
        console.error('Error loading book stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return { stats, loading };
}

export function useRecentRead() {
  const [books, setBooks] = useState<Array<Book & { dateStr: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecentRead() {
      try {
        // Ensure database is seeded before loading
        await seedDatabase();
        // Get last 2 books where status != "reading", ordered by updatedAt desc
        const allBooks = await db.books.toArray();
        const recent = allBooks
          .filter((b) => b.status !== 'reading')
          .sort((a, b) => b.updatedAt - a.updatedAt)
          .slice(0, 2);

        // Format dates
        const now = Date.now();
        const booksWithDates = recent.map((book) => {
          const diff = now - book.updatedAt;
          const days = Math.floor(diff / 86400000);
          const weeks = Math.floor(days / 7);
          const months = Math.floor(days / 30);

          let dateStr = '';
          if (months > 0) {
            dateStr = `${months} ${months === 1 ? 'month' : 'months'} ago`;
          } else if (weeks > 0) {
            dateStr = `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
          } else {
            dateStr = `${days} ${days === 1 ? 'day' : 'days'} ago`;
          }

          return { ...book, dateStr };
        });

        setBooks(booksWithDates);
      } catch (error) {
        console.error('Error loading recent read:', error);
      } finally {
        setLoading(false);
      }
    }

    loadRecentRead();
  }, []);

  return { books, loading };
}
