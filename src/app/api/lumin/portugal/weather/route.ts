import { NextResponse } from 'next/server';

/** IPMA forecast proxy: validated upstream, short cache, no credentials. */
const IPMA_URL = 'https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/1110600.json';

export async function GET() {
  try {
    const response = await fetch(IPMA_URL, { next: { revalidate: 1800 }, signal: AbortSignal.timeout(10000) });
    if (!response.ok) return NextResponse.json({ error: 'IPMA unavailable' }, { status: 502 });
    const payload: unknown = await response.json();
    if (!payload || typeof payload !== 'object' || !('data' in payload) || !Array.isArray(payload.data)) {
      return NextResponse.json({ error: 'Invalid IPMA response' }, { status: 502 });
    }
    return NextResponse.json({
      source: 'IPMA',
      sourceUrl: IPMA_URL,
      fetchedAt: new Date().toISOString(),
      location: 'Porto',
      forecast: payload.data,
    }, { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } });
  } catch {
    return NextResponse.json({ error: 'Weather source temporarily unavailable' }, { status: 503 });
  }
}
