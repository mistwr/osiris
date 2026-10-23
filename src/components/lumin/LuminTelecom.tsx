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
  const [compareOperator, setCompareOperator] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [inspectArmed, setInspectArmed] = useState(false);
  useEffect(() => {
    const onLocation = (event: Event) => {
      setLocation((event as CustomEvent<{ lat: number; lng: number }>).detail);
      setInspectArmed(false);
      setOpen(true);
    };
    window.addEventListener('lumin:telecom-location', onLocation);
    return () => window.removeEventListener('lumin:telecom-location', onLocation);
  }, []);
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
    const comparison = layers.find(item => item.operator === compareOperator && item.technology === technology);
    window.dispatchEvent(new CustomEvent('lumin:telecom-coverage', {
      detail: { enabled: enabled && Boolean(selected), layerId: selected?.layerId ?? null, compareLayerId: enabled ? comparison?.layerId ?? null : null },
    }));
  }, [layers, operator, technology, enabled, compareOperator]);
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
      <label className="block">Comparar com
        <select value={compareOperator} onChange={e => setCompareOperator(e.target.value)} className="mb-2 w-full rounded bg-slate-800 p-2">
          <option value="">Sem comparação</option>
          {operators.filter(value => value !== operator).map(value => <option key={value}>{value}</option>)}
        </select>
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} /> Mostrar no globo
      </label>
      {error && <p role="alert" className="mt-2 text-rose-300">{error}</p>}
      {!error && layers.length === 0 && <p className="mt-2 text-slate-400">A carregar camadas…</p>}
      {layers.length > 0 && !layers.some(item => item.operator === operator && item.technology === technology) &&
        <p className="mt-2 text-amber-300">Esta combinação não está disponível no catálogo.</p>}
      {compareOperator && !layers.some(item => item.operator === compareOperator && item.technology === technology) && <p className="mt-2 text-amber-300">Sem camada de comparação para esta tecnologia.</p>}
      <button type="button" className="mt-3 w-full rounded border border-cyan-500/50 bg-cyan-900/30 p-2 text-cyan-100"
        onClick={() => { setInspectArmed(true); window.dispatchEvent(new CustomEvent('lumin:telecom-inspect', { detail: { enabled: true } })); }}>
        {inspectArmed ? 'Agora clica num ponto do mapa…' : '📍 Consultar ponto no mapa'}
      </button>
      {location && <div className="mt-2 rounded border border-slate-600 p-2">
        <p className="font-semibold">Ponto selecionado</p>
        <p className="font-mono">{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>
        <p className="mt-1 text-slate-300">A cobertura indicada no globo é uma estimativa cartográfica. Não identifica a operadora contratada nesta morada.</p>
        <a className="mt-1 block text-cyan-300 underline" href={`https://www.google.com/maps?q=${location.lat},${location.lng}`} target="_blank" rel="noopener noreferrer">Ver localização</a>
      </div>}
      <p className="mt-3 text-slate-400">Cobertura potencial, não sinal em tempo real. Fonte: GEO.ANACOM.</p>
    </section>}
  </div>;
}
