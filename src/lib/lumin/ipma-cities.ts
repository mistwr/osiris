export const IPMA_CITIES_URL = 'https://api.ipma.pt/open-data/distrits-islands.json';
export type IpmaCity = { idGlobal: number; local: string; latitude: string | number; longitude: string | number };
export async function fetchIpmaCities(): Promise<IpmaCity[]> {
  const response = await fetch(IPMA_CITIES_URL, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error('IPMA city catalogue unavailable');
  const payload: unknown = await response.json();
  const data = payload && typeof payload === 'object' && 'data' in payload ? payload.data : null;
  if (!Array.isArray(data)) throw new Error('Invalid IPMA city catalogue');
  return data.filter((city): city is IpmaCity =>
    typeof city?.idGlobal === 'number' && typeof city?.local === 'string'
    && Number.isFinite(Number(city?.latitude)) && Number.isFinite(Number(city?.longitude)));
}
