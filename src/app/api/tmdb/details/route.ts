import { NextRequest, NextResponse } from 'next/server';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

interface TMDBGenre {
  id: number;
  name: string;
}

interface TMDBMovieDetails {
  id: number;
  title: string;
  release_date?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  genres: TMDBGenre[];
}

interface TMDBTVDetails {
  id: number;
  name: string;
  first_air_date?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  genres: TMDBGenre[];
}

type TMDBKeyType = 'v3' | 'v4';

function detectKeyType(apiKey: string): TMDBKeyType | null {
  // v4: JWT token starts with "eyJ"
  if (apiKey.startsWith('eyJ')) {
    return 'v4';
  }
  // v3: 32-character hex string
  if (/^[a-f0-9]{32}$/i.test(apiKey)) {
    return 'v3';
  }
  return null;
}

function buildTMDBUrl(endpoint: string, keyType: TMDBKeyType, apiKey: string, params: Record<string, string>): string {
  const baseUrl = `${TMDB_BASE_URL}/${endpoint}`;
  const searchParams = new URLSearchParams(params);
  
  if (keyType === 'v4') {
    // v4: DO NOT include api_key query param
    return `${baseUrl}?${searchParams.toString()}`;
  } else {
    // v3: append api_key to query
    searchParams.set('api_key', apiKey);
    return `${baseUrl}?${searchParams.toString()}`;
  }
}

function getTMDBHeaders(keyType: TMDBKeyType, apiKey: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (keyType === 'v4') {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }
  
  return headers;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sourceId = searchParams.get('sourceId');
  const domain = searchParams.get('domain'); // 'film' or 'series'

  if (!sourceId || !domain) {
    return NextResponse.json({ error: 'Missing sourceId or domain parameter' }, { status: 400 });
  }

  if (domain !== 'film' && domain !== 'series') {
    return NextResponse.json({ error: 'Invalid domain. Must be film or series' }, { status: 400 });
  }

  // Validate sourceId: must be numeric for TMDB API
  if (!/^\d+$/.test(sourceId)) {
    return NextResponse.json(
      { error: 'invalid sourceId; expected numeric tmdb id' },
      { status: 400 }
    );
  }

  // Map domain to TMDB type
  const type = domain === 'film' ? 'movie' : 'tv';

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'TMDB_API_KEY missing' }, { status: 500 });
  }

  const keyType = detectKeyType(apiKey);
  if (!keyType) {
    return NextResponse.json({ error: 'TMDB_API_KEY format invalid' }, { status: 500 });
  }

  try {
    const endpoint = type === 'movie' ? 'movie' : 'tv';
    const url = buildTMDBUrl(`${endpoint}/${sourceId}`, keyType, apiKey, {
      language: 'en-US',
    });
    
    const headers = getTMDBHeaders(keyType, apiKey);
    
    const response = await fetch(url, { headers });

    if (!response.ok) {
      let errorDetails = '';
      try {
        const errorData = await response.json();
        if (errorData.status_message) {
          errorDetails = errorData.status_message;
        }
      } catch {
        // If JSON parsing fails, try text
        try {
          const text = await response.text();
          errorDetails = text || 'Unknown error';
        } catch {
          errorDetails = 'Failed to read error response';
        }
      }
      
      return NextResponse.json(
        {
          error: 'TMDB request failed',
          status: response.status,
          ...(errorDetails && { details: errorDetails }),
        },
        { status: 502 }
      );
    }

    const data: TMDBMovieDetails | TMDBTVDetails = await response.json();
    const isMovie = type === 'movie';
    const movieDetails = data as TMDBMovieDetails;
    const tvDetails = data as TMDBTVDetails;

    const dateStr = isMovie ? movieDetails.release_date : tvDetails.first_air_date;
    const year = dateStr ? new Date(dateStr).getFullYear() : undefined;

    // Extract genre names directly from genres array
    const genres = data.genres.map((g) => g.name);

    // Normalize response
    const normalized = {
      source: 'tmdb' as const,
      sourceId: String(data.id),
      domain: (isMovie ? 'film' : 'series') as 'film' | 'series',
      title: isMovie ? movieDetails.title : tvDetails.name,
      year,
      overview: data.overview || undefined,
      posterUrl: data.poster_path
        ? `${TMDB_IMAGE_BASE}${data.poster_path}`
        : undefined,
      backdropUrl: data.backdrop_path
        ? `${TMDB_IMAGE_BASE.replace('/w500', '/w780')}${data.backdrop_path}`
        : undefined,
      genres,
      voteAverage: data.vote_average ?? undefined,
    };

    return NextResponse.json(normalized);
  } catch (error) {
    console.error('TMDB details error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch TMDB details',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
