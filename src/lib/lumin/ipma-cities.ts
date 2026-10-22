export const IPMA_CITIES_URL = 'https://api.ipma.pt/open-data/distrits-islands.json';
export type IpmaCity = { idGlobal: number; local: string; latitude: string; longitude: string };
export async function fetchIpmaCities(): Promise<IpmaCity[]> {
  const response = await fetch(IPMA_CITIES_URL, { next: { revalidate: 86400 } });
  if (!response.ok) throw new Error('IPMA city catalogue unavailable');
  const data: unknown = await response.json();
  if (!Array.isArray(data)) throw new Error('Invalid IPMA city catalogue');
  return data.filter((city): city is IpmaCity => typeof city?.idGlobal === 'number' && typeof city?.local === 'string');
}
