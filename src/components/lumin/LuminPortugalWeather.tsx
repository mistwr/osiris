'use client';
import { useEffect, useState } from 'react';

type Forecast = { forecastDate?: string; tMin?: string; tMax?: string; precipitaProb?: string };
type ResponseData = { source: string; location: string; forecast: Forecast[]; fetchedAt: string };

export default function LuminPortugalWeather() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<ResponseData | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!open || data) return;
    const controller = new AbortController();
    fetch('/api/lumin/portugal/weather', { signal: controller.signal })
      .then(async r => { if (!r.ok) throw new Error('Não foi possível obter a previsão do IPMA.'); return r.json(); })
      .then((value: ResponseData) => setData(value))
      .catch(e => { if (e.name !== 'AbortError') setError(e.message); });
    return () => controller.abort();
  }, [open, data]);
  return <div className="absolute right-3 top-20 z-[350] max-w-[calc(100vw-24px)] text-xs" data-hud>
    <button type="button" onClick={() => setOpen(v => !v)}
      className="rounded-md border border-amber-500/50 bg-slate-950/90 px-3 py-2 text-amber-200 shadow-lg">
      🇵🇹 LUMIN · PORTUGAL {open ? '−' : '+'}
    </button>
    {open && <section className="mt-2 w-64 rounded-lg border border-amber-500/40 bg-slate-950/95 p-3 text-slate-100 shadow-xl" aria-label="Meteorologia Portugal">
      <h2 className="mb-2 font-semibold text-amber-200">IPMA · Porto</h2>
      {error && <p role="alert">{error} <button type="button" className="underline" onClick={() => {setError('');setData(null);setOpen(false);setTimeout(() => setOpen(true), 0);}}>Tentar novamente</button></p>}
      {!data && !error && <p>A consultar previsão…</p>}
      {data && <><p className="mb-2 text-slate-400">Previsão oficial, não observação em tempo real.</p>
        {data.forecast.slice(0, 3).map((day, i) => <div key={day.forecastDate || i} className="border-t border-slate-700 py-2">
          <strong>{day.forecastDate || 'Dia'}</strong>
          <div>{day.tMin ?? '—'}°C / {day.tMax ?? '—'}°C · Chuva {day.precipitaProb ?? '—'}%</div>
        </div>)}
        <a className="text-amber-200 underline" href="https://www.ipma.pt/" target="_blank" rel="noopener noreferrer">Fonte: IPMA</a>
      </>}
    </section>}
  </div>;
}
