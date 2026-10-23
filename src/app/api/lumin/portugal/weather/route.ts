import { NextRequest, NextResponse } from 'next/server';
import { fetchIpmaCities } from '@/lib/lumin/ipma-cities';

const BASE = 'https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/';

export async function GET(request: NextRequest) {
  try {
    const cityId = request.nextUrl.searchParams.get('city') || '1131200';
    const cities = await fetchIpmaCities();
    const city = cities.find(item => String(item.idGlobal) === cityId);
    if (!city) return NextResponse.json({ error: 'Unknown IPMA city' }, { status: 400 });
    const sourceUrl = BASE + encodeURIComponent(cityId) + '.json';
    const response = await fetch(sourceUrl, { next: { revalidate: 1800 }, signal: AbortSignal.timeout(10000) });
    if (!response.ok) return NextResponse.json({ error: 'IPMA unavailable' }, { status: 502 });
    const payload: unknown = await response.json();
    if (!payload || typeof payload !== 'object' || !('data' in payload) || !Array.isArray(payload.data)) {
      return NextResponse.json({ error: 'Invalid IPMA response' }, { status: 502 });
    }
    return NextResponse.json({
      source: 'IPMA', sourceUrl, fetchedAt: new Date().toISOString(),
      location: city.local, forecast: payload.data,
    }, { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } });
  } catch {
    return NextResponse.json({ error: 'Weather source temporarily unavailable' }, { status: 503 });
  }
}
