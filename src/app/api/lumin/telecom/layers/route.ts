import { NextResponse } from 'next/server';
import { ANACOM_ARCGIS, fetchAnacomLayers } from '@/lib/lumin/anacom';

export async function GET() {
  try {
    const layers = await fetchAnacomLayers();
    return NextResponse.json({
      source: 'GEO.ANACOM',
      sourceUrl: ANACOM_ARCGIS,
      updated: 'Refer to official ANACOM quarterly metadata',
      coverageType: 'Potential network coverage, not live signal or subscriber positions',
      layers,
    }, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } });
  } catch {
    return NextResponse.json({ error: 'ANACOM coverage catalogue unavailable' }, { status: 503 });
  }
}
