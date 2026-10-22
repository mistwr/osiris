import { NextResponse } from 'next/server';
import { portugalSources } from '@/lib/lumin/portugal';

export async function GET() {
  return NextResponse.json({
    project: 'LUMIN OSIRIS',
    region: 'Portugal',
    generatedAt: new Date().toISOString(),
    sources: portugalSources.map(({ id, name, homepage, category, status }) => ({ id, name, homepage, category, status })),
    note: 'Catálogo de fontes. ready significa endpoint configurado, não garante disponibilidade neste instante.',
  }, { headers: { 'Cache-Control': 'public, s-maxage=3600' } });
}
