import { NextResponse } from 'next/server';
import { fetchIpmaCities, IPMA_CITIES_URL } from '@/lib/lumin/ipma-cities';
export async function GET() {
  try {
    const cities = (await fetchIpmaCities()).map(city => ({ id: city.idGlobal, name: city.local, lat: Number(city.latitude), lng: Number(city.longitude) })).filter(city => Number.isFinite(city.lat) && Number.isFinite(city.lng)).sort((a,b) => a.name.localeCompare(b.name, 'pt'));
    return NextResponse.json({ source: 'IPMA', sourceUrl: IPMA_CITIES_URL, cities });
  } catch {
    return NextResponse.json({ error: 'IPMA cities unavailable' }, { status: 503 });
  }
}
