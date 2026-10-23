'use client';
import { useMemo, useState } from 'react';

type Camera = { id: string | number; lat?: number; lng?: number; lon?: number; name?: string; city?: string; country?: string; source?: string; feed_url?: string; stream_url?: string };
const inPortugal = (camera: Camera) => {
  const lat = Number(camera.lat);
  const lng = Number(camera.lng ?? camera.lon);
  const mainland = lat >= 36.8 && lat <= 42.2 && lng >= -9.6 && lng <= -6.0;
  const madeira = lat >= 32.3 && lat <= 33.3 && lng >= -17.5 && lng <= -16.0;
  const azores = lat >= 36.7 && lat <= 40.1 && lng >= -31.5 && lng <= -24.5;
  return Number.isFinite(lat) && Number.isFinite(lng) && (mainland || madeira || azores);
};

export default function PortugalCameras({ cameras, onLocate }: {
  cameras: Camera[];
  onLocate: (lat: number, lng: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const available = useMemo(() => cameras.filter(camera => inPortugal(camera) && Boolean(camera.feed_url || camera.stream_url)), [cameras]);
  const shown = useMemo(() => available.filter(camera =>
    [camera.name, camera.city, camera.source].some(value => String(value ?? '').toLocaleLowerCase('pt-PT').includes(search.toLocaleLowerCase('pt-PT')))
  ).slice(0, 80), [available, search]);
  return <div className="fixed bottom-24 right-3 z-[350] text-xs">
    <button type="button" onClick={() => { setOpen(value => !value); onLocate(39.55, -8.05); }}
      className="rounded-xl border border-cyan-400/60 bg-slate-950/95 px-4 py-3 font-bold text-cyan-100 shadow-lg">
      🇵🇹 Portugal · Câmaras {open ? '−' : '+'}
    </button>
    {open && <section className="mt-2 w-[min(90vw,350px)] max-h-[55dvh] overflow-y-auto rounded-xl border border-cyan-500/50 bg-slate-950/95 p-3 text-white shadow-xl">
      <h2 className="mb-1 text-base font-semibold">Portugal no globo</h2>
      <p className="mb-2 text-slate-300">{available.length} câmaras com URL de feed no catálogo mundial. A disponibilidade da transmissão não é garantida.</p>
      <input type="search" aria-label="Pesquisar câmaras de Portugal" placeholder="Pesquisar cidade ou câmara" value={search} onChange={event => setSearch(event.target.value)}
        className="mb-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-2 text-white"/>
      {shown.map(camera => <button key={camera.id} type="button"
        onClick={() => onLocate(Number(camera.lat), Number(camera.lng ?? camera.lon))}
        className="mb-1 flex w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-900 p-2 text-left">
        <span><strong>{camera.name || camera.city || 'Câmara pública'}</strong><span className="block text-slate-400">{camera.city || camera.source || 'Portugal'}</span></span>
        <span className="ml-2 text-cyan-300">Ver ↗</span>
      </button>)}
      {shown.length === 0 && <p className="p-2 text-slate-400">Não existem câmaras correspondentes no catálogo carregado. Não serão criados pins fictícios.</p>}
      <p className="mt-2 text-slate-400">Inclui continente, Madeira e Açores. Apenas fontes públicas integradas no catálogo mundial.</p>
    </section>}
  </div>;
}
