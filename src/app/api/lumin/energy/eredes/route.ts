import { NextRequest, NextResponse } from 'next/server';

const DATASET = '20-caracterizacao-pes-contrato-ativo';
const BASE = 'https://e-redes.opendatasoft.com/api/explore/v2.1/catalog/datasets/' + DATASET;
const SAFE_COLUMNS = new Set(['distrito', 'concelho', 'freguesia', 'data', 'tipo_instalacao', 'nivel_tensao']);

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const limitRaw = Number(params.get('limit') ?? 20);
  if (!Number.isInteger(limitRaw) || limitRaw < 1 || limitRaw > 100) {
    return NextResponse.json({ error: 'limit deve estar entre 1 e 100' }, { status: 400 });
  }
  const offsetRaw = Number(params.get('offset') ?? 0);
  if (!Number.isInteger(offsetRaw) || offsetRaw < 0 || offsetRaw > 10000) {
    return NextResponse.json({ error: 'offset inválido' }, { status: 400 });
  }
  const upstream = new URL(BASE + '/records');
  upstream.searchParams.set('limit', String(limitRaw));
  upstream.searchParams.set('offset', String(offsetRaw));
  const filters = [...params.entries()].filter(([key]) => key !== 'limit' && key !== 'offset');
  if (filters.length > 3 || filters.some(([key, value]) => !SAFE_COLUMNS.has(key) || value.length > 100 || !/^[\p{L}\p{N}\s.,/_-]+$/u.test(value))) {
    return NextResponse.json({ error: 'Filtro inválido' }, { status: 400 });
  }
  if (filters.length) {
    upstream.searchParams.set('where', filters.map(([key, value]) =>
      `${key}="${value.replace(/"/g, '')}"`).join(' AND '));
  }
  try {
    const response = await fetch(upstream, {
      signal: AbortSignal.timeout(12000),
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error('Upstream ' + response.status);
    const payload = await response.json();
    return NextResponse.json({
      source: 'E-REDES Open Data',
      attribution: 'E-REDES – Distribuição de Eletricidade, Portal Open Data (CC BY 4.0)',
      dataset: DATASET,
      granularity: 'Dados estatísticos; não identificam CPE, casa ou comercializadora individuais',
      total_count: payload.total_count ?? null,
      results: Array.isArray(payload.results) ? payload.results : [],
    }, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600' } });
  } catch {
    return NextResponse.json({ error: 'Serviço público E-REDES temporariamente indisponível' }, { status: 503 });
  }
}
