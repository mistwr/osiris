'use client';
import { useEffect, useState } from 'react';

type RecordRow = Record<string, unknown>;
type EnergyResponse = { total_count: number | null; results: RecordRow[]; attribution: string; granularity: string };

export default function LuminEnergy() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<EnergyResponse | null>(null);
  const [error, setError] = useState('');
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    setError('');
    fetch('/api/lumin/energy/eredes?limit=10&offset=' + offset, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('API indisponível');
        return response.json();
      })
      .then(setData)
      .catch(error => { if (error.name !== 'AbortError') setError('Não foi possível consultar a E-REDES.'); });
    return () => controller.abort();
  }, [open, offset]);
  return <div className="absolute bottom-32 right-3 z-[351] text-xs" data-hud>
    <button type="button" onClick={() => setOpen(value => !value)}
      className="rounded-md border border-amber-500/50 bg-slate-950/90 px-3 py-2 text-amber-200 shadow-lg">
      ⚡ LUMIN · ENERGY {open ? '−' : '+'}
    </button>
    {open && <section className="mt-2 w-72 max-h-[65vh] overflow-y-auto rounded-lg border border-amber-500/40 bg-slate-950/95 p-3 text-white shadow-xl">
      <h2 className="mb-2 font-semibold">Portugal · Pontos de consumo</h2>
      <p className="mb-2 text-slate-300">Estatísticas públicas de contratos ativos. Não mostram casas, CPEs individuais ou fornecedores contratados.</p>
      {error && <p role="alert" className="text-rose-300">{error}</p>}
      {!error && !data && <p>A consultar E-REDES…</p>}
      {data && <>
        <p className="mb-2 text-amber-200">Registos estatísticos: {data.total_count?.toLocaleString('pt-PT') ?? '—'}</p>
        {data.results.map((row, index) => <details key={offset + index} className="mb-1 rounded bg-slate-800/70 p-2">
          <summary>Registo {offset + index + 1}</summary>
          <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-words text-[10px]">{JSON.stringify(row, null, 2)}</pre>
        </details>)}
        <div className="mt-2 flex items-center justify-between">
          <button type="button" disabled={offset === 0} onClick={() => setOffset(value => Math.max(0, value - 10))}>← Anterior</button>
          <button type="button" disabled={data.results.length < 10} onClick={() => setOffset(value => value + 10)}>Seguinte →</button>
        </div>
      </>}
      <a href="https://e-redes.opendatasoft.com/explore/dataset/20-caracterizacao-pes-contrato-ativo/" target="_blank" rel="noopener noreferrer" className="mt-3 block text-amber-300 underline">Fonte: E-REDES Open Data · CC BY 4.0</a>
    </section>}
  </div>;
}
