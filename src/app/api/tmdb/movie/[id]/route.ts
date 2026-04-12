import { NextRequest, NextResponse } from 'next/server';
import { fetchTmdbMovieItemDetail } from '@/lib/tmdbMovieDetail';

/**
 * GET `/api/tmdb/movie/[id]` — `id` is the numeric TMDB movie id (e.g. `27205`).
 * Returns `{ item: ItemDetail }` for clients; the item page uses the same builder server-side.
 */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const raw = (await ctx.params).id;
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) {
    return NextResponse.json({ error: 'Invalid movie id' }, { status: 400 });
  }

  const item = await fetchTmdbMovieItemDetail(n);
  if (!item) {
    return NextResponse.json({ error: 'Movie not found or TMDB unavailable' }, { status: 404 });
  }

  return NextResponse.json({ item });
}
