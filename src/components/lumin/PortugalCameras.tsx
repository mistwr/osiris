'use client';
import { useMemo, useState } from 'react';

type Camera = { id: string | number; lat?: number; lng?: number; lon?: number; name?: string; city?: string; country?: string; source?: string; feed_url?: string; stream_url?: string; external_url?: string };
const inPortugal = (camera: Camera) => {
  const lat = Number(camera.lat);
  const lng = Number(camera.lng ?? camera.lon);
  const mainland = lat >= 36.8 && lat <= 42.2 && lng >= -9.6 && lng <= -6.0;
  const madeira = lat >= 32.3 && lat <= 33.3 && lng >= -17.5 && lng <= -16.0;
  const azores = lat >= 36.7 && lat <= 40.1 && lng >= -31.5 && lng <= -24.5;
  return Number.isFinite(lat) && Number.isFinite(lng) && (mainland || madeira || azores);
};

const VERIFIED_CATALOG_LINKS: Camera[] = [
  { id: 'pubcam-portugal-aeroporto-da-madeira-madeira-airport-live', lat: 32.698962, lng: -16.773031, name: 'Madeira Airport Live', city: 'Santa Cruz · Madeira', country: 'Portugal', external_url: 'https://www.youtube.com/@madeiraairportlive/live', source: 'YouTube · operador' },
  { id: 'pubcam-portugal-aeroporto-humberto-delgado-lisbon-airport-wings', lat: 38.780998, lng: -9.131861, name: 'Lisbon Airport Wings', city: 'Lisboa · Aeroporto', country: 'Portugal', external_url: 'https://www.youtube.com/@AirportWingsLisbon/live', source: 'YouTube · operador' },
  { id: 'pubcam-portugal-funchal-madeira-web-live', lat: 32.64965, lng: -16.908678, name: 'Madeira Web Live', city: 'Funchal · Madeira', country: 'Portugal', external_url: 'https://www.youtube.com/@MadeiraWebLive/live', source: 'YouTube · operador' },
];

export default function PortugalCameras({ cameras, onLocate }: {
  cameras: Camera[];
  onLocate: (lat: number, lng: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [area, setArea] = useState<'todas' | 'continente' | 'madeira' | 'acores'>('todas');
  const [onlyDistinct, setOnlyDistinct] = useState(true);
  const available = useMemo(() => { const merged = new Map<string, Camera>(); for (const camera of [...VERIFIED_CATALOG_LINKS, ...cameras]) { if (inPortugal(camera) && Boolean(camera.feed_url || camera.stream_url || camera.external_url)) merged.set(String(camera.id), camera); } return [...merged.values()]; }, [cameras]);
  const shown = useMemo(() => available.filter(camera => {
    const lat = Number(camera.lat);
    const lng = Number(camera.lng ?? camera.lon);
    const isMadeira = lat >= 32.3 && lat <= 33.3 && lng >= -17.5 && lng <= -16.0;
    const isAzores = lat >= 36.7 && lat <= 40.1 && lng >= -31.5 && lng <= -24.5;
    const matchesArea = area === 'todas' || (area === 'madeira' && isMadeira) || (area === 'acores' && isAzores) || (area === 'continente' && !isMadeira && !isAzores);
    const url = camera.external_url || camera.feed_url || camera.stream_url || '';
    const distinct = !/^(https?:\/\/)?(www\.)?(beachcam\.meo\.pt|beachcam\.pt)\/?(?:\?.*)?$/i.test(url);
    return matchesArea && (!onlyDistinct || distinct) && [camera.name, camera.city, camera.source].some(value => String(value ?? '').toLocaleLowerCase('pt-PT').includes(search.toLocaleLowerCase('pt-PT')));
  }).slice(0, 80), [available, search, area, onlyDistinct]);
  return <div className="fixed bottom-24 right-3 z-[350] text-xs">
    <button type="button" onClick={() => { setOpen(value => !value); onLocate(39.55, -8.05); }}
      className="rounded-xl border border-cyan-400/60 bg-slate-950/95 px-4 py-3 font-bold text-cyan-100 shadow-lg">
      🇵🇹 Portugal · Câmaras {open ? '−' : '+'}
    </button>
    {open && <section className="mt-2 w-[min(90vw,350px)] max-h-[55dvh] overflow-y-auto rounded-xl border border-cyan-500/50 bg-slate-950/95 p-3 text-white shadow-xl">
      <h2 className="mb-1 text-base font-semibold">Portugal no globo</h2>
      <p className="mb-2 text-slate-300">{available.length} entradas com ligação no catálogo mundial. Fontes identificadas no catálogo. Uma ligação não garante que o vídeo esteja em direto.</p>
      <input type="search" aria-label="Pesquisar câmaras de Portugal" placeholder="Pesquisar cidade ou câmara" value={search} onChange={event => setSearch(event.target.value)}
        className="mb-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-2 text-white"/>
      <div className="mb-3 grid grid-cols-4 gap-1">
        {(['todas', 'continente', 'madeira', 'acores'] as const).map(value => <button key={value} type="button" onClick={() => setArea(value)}
          className={`rounded border px-1 py-2 capitalize ${area === value ? 'border-cyan-300 bg-cyan-900/50 text-white' : 'border-slate-700 text-slate-300'}`}>
          {value === 'acores' ? 'Açores' : value === 'todas' ? 'Todas' : value}
        </button>)}
      </div>
      <label className="mb-3 flex items-center gap-2 text-slate-200"><input type="checkbox" checked={onlyDistinct} onChange={event => setOnlyDistinct(event.target.checked)} /> Ocultar ligações genéricas sem câmara identificada</label>
      {shown.map(camera => <div key={camera.id}
        className="mb-1 flex w-full items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-900 p-2 text-left">
        <span><strong>{camera.name || camera.city || 'Câmara pública'}</strong><span className="block text-slate-400">{camera.city || camera.source || 'Portugal'}</span></span>
        <span className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={() => onLocate(Number(camera.lat), Number(camera.lng ?? camera.lon))} className="rounded border border-slate-500 px-2 py-1 text-cyan-300">Mapa</button>
          {(camera.external_url || camera.feed_url || camera.stream_url) && <a href={camera.external_url || camera.feed_url || camera.stream_url} target="_blank" rel="noopener noreferrer" className="rounded border border-cyan-500 px-2 py-1 text-cyan-300">Abrir ↗</a>}
        </span>
      </div>)}
      {shown.length === 0 && <p className="p-2 text-slate-400">Não existem câmaras correspondentes no catálogo carregado. Não serão criados pins fictícios.</p>}
      <p className="mt-2 text-slate-400">Inclui continente, Madeira e Açores. Apenas fontes públicas integradas no catálogo mundial.</p>
    </section>}
  </div>;
}
