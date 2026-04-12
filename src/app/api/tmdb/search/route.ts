import { NextRequest, NextResponse } from 'next/server';
import { filterDiscoverSearchResults } from '@/app/discover/search/mockData';
import { normalizeTmdbMovieSearchRow, type TmdbMovieSearchResult } from '@/lib/tmdbSearchNormalize';

const TMDB_SEARCH = 'https://api.themoviedb.org/3/search/movie';

type TmdbSearchResponse = {
  results?: TmdbMovieSearchResult[];
  success?: boolean;
  status_message?: string;
};

/**
 * Server-side TMDB movie search. Set `TMDB_API_KEY` (v3 API key from TMDB dashboard).
 * Without a key, returns filtered local mock results (`degraded: true`) so the UI still works in dev.
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      results: filterDiscoverSearchResults(q),
      degraded: true,
    });
  }

  try {
    const url = new URL(TMDB_SEARCH);
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('query', q);
    url.searchParams.set('page', '1');
    url.searchParams.set('include_adult', 'false');
    url.searchParams.set('language', 'en-US');

    const res = await fetch(url, {
      headers: { accept: 'application/json' },
      next: { revalidate: 120 },
    });

    const body = (await res.json()) as TmdbSearchResponse;

    if (!res.ok) {
      const msg = body.status_message || `TMDB error (${res.status})`;
      return NextResponse.json({ results: [], error: msg }, { status: 502 });
    }

    const rows = Array.isArray(body.results) ? body.results : [];
    const results = rows.map(normalizeTmdbMovieSearchRow);

    return NextResponse.json({ results });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Search request failed';
    return NextResponse.json({ results: [], error: message }, { status: 502 });
  }
}
