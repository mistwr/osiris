'use client';
import { useEffect, useMemo, useState } from 'react';

type RecordRow = Record<string, unknown>;
type EnergyResponse = { total_count: number | null; results: RecordRow[]; attribution: string; granularity: string };
const PROVIDERS = [
  { name: 'EDP Comercial', color: '#f43f5e' },
  { name: 'Endesa', color: '#3b82f6' },
  { name: 'Iberdrola', color: '#22c55e' },
  { name: 'Galp', color: '#fb923c' },
  { name: 'Repsol', color: '#facc15' },
  { name: 'Goldenergy', color: '#a855f7' },
];
const label = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, character => character.toUpperCase());
const format = (value: unknown) => typeof value === 'number' ? value.toLocaleString('pt-PT') : String(value ?? '—');
const providerFrom = (row: RecordRow): string | null => {
  const key = Object.keys(row).find(name => /^(comercializador|fornecedor|supplier|retailer)$/i.test(name));
  const value = key ? row[key] : null;
  return typeof value === 'string' && value.trim() ? value.trim() : null;
};

export default function LuminEnergy() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<EnergyResponse | null>(null);
  const [error, setError] = useState('');
  const [offset, setOffset] = useState(0);
  const [provider, setProvider] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    setLoading(true);
    setError('');
    fetch('/api/lumin/energy/eredes?limit=30&offset=' + offset, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('API indisponível');
        return response.json();
      })
      .then((payload: EnergyResponse) => setData(payload))
      .catch(error => { if (error.name !== 'AbortError') setError('Não foi possível consultar a E-REDES.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [open, offset]);

  const rows = useMemo(() => (data?.results ?? []).filter(row => {
    if (provider && providerFrom(row)?.toLocaleLowerCase('pt-PT') !== provider.toLocaleLowerCase('pt-PT')) return false;
    if (search && !JSON.stringify(row).toLocaleLowerCase('pt-PT').includes(search.toLocaleLowerCase('pt-PT'))) return false;
    return true;
  }), [data, provider, search]);
  const providerFieldAvailable = (data?.results ?? []).some(row => providerFrom(row) !== null);

  return <div className="absolute bottom-32 right-3 z-[351] text-xs" data-hud>
    <button type="button" onClick={() => setOpen(value => !value)}
      className="rounded-xl border border-amber-400/60 bg-slate-950/95 px-4 py-3 font-semibold tracking-wider text-amber-200 shadow-[0_0_24px_rgba(251,191,36,0.18)]">
      ⚡ LUMIN · ENERGY {open ? '−' : '+'}
    </button>
    {open && <section className="mt-2 w-[min(92vw,410px)] max-h-[68dvh] overflow-y-auto rounded-2xl border border-amber-400/50 bg-[#071324]/95 p-4 text-white shadow-[0_12px_40px_rgba(0,0,0,0.75)] backdrop-blur-xl">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">LUMIN AI VISION</p>
          <h2 className="mt-1 text-lg font-bold text-amber-200">⚡ Energia · Portugal</h2>
          <p className="text-slate-300">Pontos de consumo e fornecedores</p>
        </div>
        <button type="button" aria-label="Fechar" onClick={() => setOpen(false)} className="rounded-lg border border-slate-600 px-3 py-2">✕</button>
      </div>
      <div className="mb-3 rounded-xl border border-cyan-700/50 bg-cyan-950/30 p-3">
        <p className="text-[10px] uppercase tracking-wider text-cyan-300">Registos estatísticos no conjunto de dados</p>
        <p className="mt-1 text-2xl font-bold text-white">{data?.total_count?.toLocaleString('pt-PT') ?? '—'}</p>
        <p className="mt-1 text-[11px] text-slate-400">Não representa o número de casas nem a quota de mercado.</p>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        {PROVIDERS.map(item => <button key={item.name} type="button" disabled={!providerFieldAvailable}
          onClick={() => { setProvider(current => current === item.name ? '' : item.name); setOffset(0); }}
          className={`flex items-center gap-2 rounded-lg border p-2 text-left ${provider === item.name ? 'border-amber-300 bg-amber-900/30' : 'border-slate-700 bg-slate-900/70'} disabled:opacity-50`}>
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: item.color }} />
          <span>{item.name}</span>
        </button>)}
      </div>
      {!providerFieldAvailable && <p className="mb-3 rounded-lg border border-amber-700/40 bg-amber-950/20 p-2 text-amber-200">
        A fonte consultada não disponibiliza comercializadoras individuais nestes registos. Os filtros por fornecedor ficam indisponíveis até existir uma fonte oficial com esses dados.
      </p>}
      <label className="mb-3 block text-slate-300">Pesquisar nos registos apresentados
        <input type="search" value={search} onChange={event => setSearch(event.target.value)}
          placeholder="Distrito, concelho, tensão…" className="mt-1 w-full rounded-lg border border-cyan-700/50 bg-slate-900 p-3 text-white outline-none focus:border-cyan-400" />
      </label>
      {loading && <p className="mb-2 text-cyan-300">A atualizar dados…</p>}
      {error && <p role="alert" className="mb-2 text-rose-300">{error}</p>}
      <div className="mb-2 flex items-center justify-between"><h3 className="font-semibold">Registos oficiais</h3><span className="text-slate-400">{rows.length} nesta página</span></div>
      {rows.map((row, index) => <details key={offset + index} className="mb-2 rounded-xl border border-slate-700/60 bg-slate-900/70 p-3">
        <summary className="cursor-pointer text-cyan-100">Registo {offset + index + 1}</summary>
        <dl className="mt-2 space-y-1">{Object.entries(row).map(([key, value]) => <div key={key} className="flex flex-wrap justify-between gap-2 border-t border-slate-700/40 pt-1">
          <dt className="text-slate-400">{label(key)}</dt><dd className="max-w-[65%] break-words text-right text-white">{format(value)}</dd>
        </div>)}</dl>
      </details>)}
      {!loading && rows.length === 0 && <p className="my-3 text-slate-400">Sem registos para esta pesquisa nesta página.</p>}
      <div className="mt-3 flex items-center justify-between">
        <button type="button" disabled={offset === 0 || loading} onClick={() => setOffset(value => Math.max(0, value - 30))} className="rounded-lg border border-slate-600 px-3 py-2 disabled:opacity-40">← Anterior</button>
        <button type="button" disabled={loading || (data?.results.length ?? 0) < 30} onClick={() => setOffset(value => value + 30)} className="rounded-lg border border-slate-600 px-3 py-2 disabled:opacity-40">Seguinte →</button>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-slate-400">Dados estatísticos públicos, sem CPEs ou moradas individuais. A comercializadora de uma residência não pode ser inferida destes dados.</p>
      <a href="https://e-redes.opendatasoft.com/explore/dataset/20-caracterizacao-pes-contrato-ativo/" target="_blank" rel="noopener noreferrer" className="mt-2 block text-cyan-300 underline">Fonte oficial: E-REDES Open Data · CC BY 4.0 ↗</a>
    </section>}
  </div>;
}
