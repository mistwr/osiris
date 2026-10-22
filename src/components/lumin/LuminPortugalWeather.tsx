'use client';
import { useEffect, useState } from 'react';

type City = { id: number; name: string; lat: number; lng: number };
type Forecast = { forecastDate?: string; tMin?: string; tMax?: string; precipitaProb?: string };
type Weather = { location: string; forecast: Forecast[]; sourceUrl: string };

export default function LuminPortugalWeather() {
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [cityId, setCityId] = useState('1131200');
  const [weather, setWeather] = useState<Weather | null>(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const select = (event: Event) => {
      const detail = (event as CustomEvent<{ cityId?: string }>).detail;
      if (!detail?.cityId) return;
      setCityId(detail.cityId);
      setWeather(null);
      setError('');
      setOpen(true);
    };
    window.addEventListener('lumin:select-ipma-city', select);
    return () => window.removeEventListener('lumin:select-ipma-city', select);
  }, []);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    fetch('/api/lumin/portugal/cities', { signal: controller.signal })
      .then(async r => { if (!r.ok) throw new Error('Catálogo IPMA indisponível'); return r.json(); })
      .then(result => setCities(result.cities ?? []))
      .catch(e => { if (e.name !== 'AbortError') setError(e.message); });
    return () => controller.abort();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    fetch('/api/lumin/portugal/weather?city=' + encodeURIComponent(cityId), { signal: controller.signal })
      .then(async r => { if (!r.ok) throw new Error('Previsão indisponível'); return r.json(); })
      .then((result: Weather) => { setWeather(result); setError(''); })
      .catch(e => { if (e.name !== 'AbortError') setError(e.message); });
    return () => controller.abort();
  }, [open, cityId, retry]);

  return <div className="absolute right-3 top-20 z-[350] max-w-[calc(100vw-24px)] text-xs" data-hud>
    <button type="button" onClick={() => setOpen(v => !v)}
      className="rounded-md border border-amber-500/50 bg-slate-950/90 px-3 py-2 text-amber-200 shadow-lg">
      🇵🇹 LUMIN · PORTUGAL {open ? '−' : '+'}
    </button>
    {open && <section className="mt-2 w-64 rounded-lg border border-amber-500/40 bg-slate-950/95 p-3 text-slate-100 shadow-xl" aria-label="Meteorologia Portugal">
      <h2 className="mb-2 font-semibold text-amber-200">Meteorologia · IPMA</h2>
      <label className="mb-1 block" htmlFor="lumin-city">Localidade</label>
      <select id="lumin-city" value={cityId} onChange={e => { setCityId(e.target.value); setWeather(null); setError(''); }}
        className="mb-3 w-full rounded bg-slate-800 p-2 text-white">
        {cities.length === 0 && <option value="1110600">Porto</option>}
        {cities.map(city => <option key={city.id} value={String(city.id)}>{city.name}</option>)}
      </select>
      {error && <p role="alert" className="text-rose-300">{error} <button type="button" className="underline" onClick={() => { setError(''); setRetry(n => n + 1); }}>Tentar novamente</button></p>}
      {!weather && !error && <p>A consultar o IPMA…</p>}
      {weather && <><p className="mb-2 text-slate-300">{weather.location} · Previsão, não observação em tempo real</p>
        {weather.forecast.slice(0, 3).map((day, i) => <div key={day.forecastDate || i} className="border-t border-slate-700 py-2">
          <strong>{day.forecastDate || 'Dia'}</strong>
          <div>{day.tMin ?? '—'}°C / {day.tMax ?? '—'}°C · Chuva {day.precipitaProb ?? '—'}%</div>
        </div>)}
        <a className="text-amber-200 underline" href={weather.sourceUrl} target="_blank" rel="noopener noreferrer">Dados oficiais IPMA</a>
      </>}
    </section>}
  </div>;
}
