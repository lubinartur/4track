import { NextResponse } from 'next/server';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

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

function buildTMDBUrl(endpoint: string, keyType: TMDBKeyType, apiKey: string, params: Record<string, string> = {}): string {
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
  if (keyType === 'v4') {
    return {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
    };
  } else {
    // v3: DO NOT include Authorization header
    return {
      'Accept': 'application/json',
    };
  }
}

export async function GET() {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'TMDB_API_KEY missing' }, { status: 500 });
  }

  const keyType = detectKeyType(apiKey);
  if (!keyType) {
    return NextResponse.json({ error: 'TMDB_API_KEY format invalid' }, { status: 500 });
  }

  try {
    const url = buildTMDBUrl('configuration', keyType, apiKey);
    const headers = getTMDBHeaders(keyType, apiKey);
    
    const response = await fetch(url, { headers });

    if (!response.ok) {
      // Try to extract status_message from JSON response
      let errorDetails = '';
      try {
        const errorData = await response.json();
        if (errorData.status_message) {
          errorDetails = errorData.status_message;
        } else {
          errorDetails = await response.text();
        }
      } catch {
        try {
          errorDetails = await response.text();
        } catch {
          errorDetails = 'Failed to read error response';
        }
      }
      
      return NextResponse.json(
        {
          error: 'TMDB request failed',
          status: response.status,
          details: errorDetails.slice(0, 300),
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('TMDB ping error:', error);
    return NextResponse.json(
      {
        error: 'Failed to ping TMDB',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
