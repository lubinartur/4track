import { resolveItemSlugForMovie } from '@/lib/resolveItemSlug';
import { genreIdsToLabel } from '@/lib/tmdbMovieGenres';
import type { ItemCredits, ItemDetail } from '@/types/item';
import type { MovieItem } from '@/types/movie';

const POSTER = 'https://image.tmdb.org/t/p/w500';
const BACKDROP = 'https://image.tmdb.org/t/p/w780';

type TmdbGenre = { id?: number; name?: string };
type TmdbPerson = { name?: string; job?: string; known_for_department?: string };
type TmdbMovieDetailJson = {
  id: number;
  title?: string;
  original_title?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  release_date?: string;
  genres?: TmdbGenre[];
  production_companies?: { name?: string }[];
  credits?: { crew?: TmdbPerson[]; cast?: TmdbPerson[] };
};

type TmdbRecResult = {
  id: number;
  title?: string;
  vote_average?: number;
  release_date?: string;
  poster_path?: string | null;
  genre_ids?: number[];
};

function formatRating(v: number | undefined): string {
  if (v == null || Number.isNaN(v) || v === 0) return '—';
  return v.toFixed(1);
}

function parseYear(d: string | undefined): number {
  if (!d || d.length < 4) return 0;
  const y = parseInt(d.slice(0, 4), 10);
  return Number.isFinite(y) ? y : 0;
}

function crewFirst(crew: TmdbPerson[] | undefined, jobs: string[]): string {
  if (!crew?.length) return '—';
  for (const job of jobs) {
    const hit = crew.find((c) => c.job === job);
    if (hit?.name) return hit.name;
  }
  return '—';
}

function mapRecommendationRow(r: TmdbRecResult): MovieItem {
  const title = (r.title || '').trim() || 'Untitled';
  const posterUrl = r.poster_path ? `${POSTER}${r.poster_path}` : '';
  const genresLabel = genreIdsToLabel(r.genre_ids ?? []);
  const genre = genresLabel.split(' / ')[0] || 'Film';
  const slug = resolveItemSlugForMovie(r.id, title) ?? `tmdb-${r.id}`;
  return {
    id: `tmdb-rec-${r.id}`,
    title,
    rating: formatRating(r.vote_average),
    year: parseYear(r.release_date),
    genre,
    posterUrl,
    itemSlug: slug,
  };
}

function buildCredits(m: TmdbMovieDetailJson): ItemCredits {
  const crew = m.credits?.crew ?? [];
  const cast = m.credits?.cast ?? [];
  return {
    director: crewFirst(crew, ['Director']),
    lead: cast[0]?.name?.trim() || '—',
    music: crewFirst(crew, ['Original Music Composer', 'Music', 'Composer']),
    studio: m.production_companies?.[0]?.name?.trim() || '—',
  };
}

function reasonTagsFromGenres(genres: TmdbGenre[] | undefined): readonly [string, string, string] {
  const names = (genres ?? []).map((g) => g.name).filter(Boolean) as string[];
  const pad = ['Drama', 'Cinema', 'Story'];
  const a = names[0] ?? pad[0];
  const b = names[1] ?? pad[1];
  const c = names[2] ?? pad[2];
  return [a, b, c];
}

/**
 * Builds a full `ItemDetail` from TMDB for `/item/tmdb-{id}` routes (no local registry entry).
 */
export async function fetchTmdbMovieItemDetail(tmdbNumericId: number): Promise<ItemDetail | null> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return null;

  const base = `https://api.themoviedb.org/3/movie/${tmdbNumericId}`;
  const detailUrl = `${base}?api_key=${apiKey}&append_to_response=credits&language=en-US`;
  const recUrl = `${base}/recommendations?api_key=${apiKey}&language=en-US&page=1`;

  const [detailRes, recRes] = await Promise.all([
    fetch(detailUrl, { headers: { accept: 'application/json' }, next: { revalidate: 300 } }),
    fetch(recUrl, { headers: { accept: 'application/json' }, next: { revalidate: 300 } }),
  ]);

  if (!detailRes.ok) return null;
  const m = (await detailRes.json()) as TmdbMovieDetailJson;
  if (!m.id) return null;

  const title = (m.title || m.original_title || '').trim() || 'Untitled';
  const genresLabel = m.genres?.map((g) => g.name).filter(Boolean).join(' / ') || '—';
  const posterUrl = m.poster_path ? `${POSTER}${m.poster_path}` : '';
  const backdropUrl = m.backdrop_path ? `${BACKDROP}${m.backdrop_path}` : posterUrl;

  let similar: MovieItem[] = [];
  if (recRes.ok) {
    const recBody = (await recRes.json()) as { results?: TmdbRecResult[] };
    similar = (recBody.results ?? []).slice(0, 8).map(mapRecommendationRow);
  }

  const routeId = `tmdb-${tmdbNumericId}`;

  return {
    id: routeId,
    tmdbId: tmdbNumericId,
    title,
    rating: formatRating(m.vote_average),
    year: parseYear(m.release_date),
    genresLabel,
    posterUrl,
    backdropUrl,
    overview: (m.overview || '').trim() || 'No overview available.',
    credits: buildCredits(m),
    tasteInsight: {
      entryCount: 0,
      description:
        'We’ll build taste insights here as you rate more films. This page is generated from TMDB so you can still explore credits, overview, and similar picks.',
    },
    heroAiMatchPercent: 72,
    heroReasonTags: reasonTagsFromGenres(m.genres),
    similar,
  };
}
