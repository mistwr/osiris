'use client';
import { useEffect, useState } from 'react';

type CoverageLayer = { operator: string; technology: string; layerId: number; title: string };
const operators = ['MEO', 'NOS', 'VODAFONE', 'DIGI'];
const technologies = ['2G', '4G', '5G'];

export default function LuminTelecom() {
  const [open, setOpen] = useState(false);
  const [layers, setLayers] = useState<CoverageLayer[]>([]);
  const [operator, setOperator] = useState('MEO');
  const [technology, setTechnology] = useState('5G');
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    fetch('/api/lumin/telecom/layers', { signal: controller.signal })
      .then(async response => { if (!response.ok) throw new Error('ANACOM indisponível'); return response.json(); })
      .then(result => { setLayers(result.layers ?? []); setError(''); })
      .catch(err => { if (err.name !== 'AbortError') setError('Não foi possível consultar a ANACOM.'); });
    return () => controller.abort();
  }, [open]);
  useEffect(() => {
    const selected = layers.find(item => item.operator === operator && item.technology === technology);
    window.dispatchEvent(new CustomEvent('lumin:telecom-coverage', {
      detail: { enabled: enabled && Boolean(selected), layerId: selected?.layerId ?? null },
    }));
  }, [layers, operator, technology, enabled]);
  return <div className="absolute bottom-20 right-3 z-[351] text-xs" data-hud>
    <button type="button" onClick={() => setOpen(value => !value)}
      className="rounded-md border border-cyan-500/50 bg-slate-950/90 px-3 py-2 text-cyan-200 shadow-lg">
      📡 LUMIN · TELECOM {open ? '−' : '+'}
    </button>
    {open && <section className="mt-2 w-64 rounded-lg border border-cyan-500/40 bg-slate-950/95 p-3 text-white shadow-xl">
      <h2 className="mb-2 font-semibold">Cobertura oficial · Portugal</h2>
      <label className="block">Operador
        <select value={operator} onChange={e => setOperator(e.target.value)} className="mb-2 w-full rounded bg-slate-800 p-2">
          {operators.map(value => <option key={value}>{value}</option>)}
        </select>
      </label>
      <label className="block">Tecnologia
        <select value={technology} onChange={e => setTechnology(e.target.value)} className="mb-2 w-full rounded bg-slate-800 p-2">
          {technologies.map(value => <option key={value}>{value}</option>)}
        </select>
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} /> Mostrar no globo
      </label>
      {error && <p role="alert" className="mt-2 text-rose-300">{error}</p>}
      {!error && layers.length === 0 && <p className="mt-2 text-slate-400">A carregar camadas…</p>}
      {layers.length > 0 && !layers.some(item => item.operator === operator && item.technology === technology) &&
        <p className="mt-2 text-amber-300">Esta combinação não está disponível no catálogo.</p>}
      <p className="mt-3 text-slate-400">Cobertura potencial, não sinal em tempo real. Fonte: GEO.ANACOM.</p>
    </section>}
  </div>;
}
