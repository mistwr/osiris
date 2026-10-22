export const ANACOM_ARCGIS = 'https://geo.anacom.pt/server/rest/services/publico/CoberturaQoS_Pub/MapServer';
export const OPERATORS = ['MEO', 'NOS', 'VODAFONE', 'DIGI'] as const;
export const TECHNOLOGIES = ['2G', '4G', '5G'] as const;
export type Operator = typeof OPERATORS[number];
export type Technology = typeof TECHNOLOGIES[number];
type Layer = { id: number; name: string; parentLayerId: number; subLayerIds?: number[] | null };
type Catalogue = { layers?: Layer[] };
export type CoverageLayer = { operator: Operator; technology: Technology; layerId: number; title: string };

export async function fetchAnacomLayers(): Promise<CoverageLayer[]> {
  const response = await fetch(ANACOM_ARCGIS + '?f=json', {
    next: { revalidate: 86400 },
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error('ANACOM catalogue unavailable');
  const json: Catalogue = await response.json();
  const layers = Array.isArray(json.layers) ? json.layers : [];
  const byId = new Map(layers.map(layer => [layer.id, layer]));
  function ancestors(layer: Layer): string {
    const names = [layer.name];
    const visited = new Set<number>([layer.id]);
    let parent = layer.parentLayerId;
    while (parent >= 0 && !visited.has(parent)) {
      visited.add(parent);
      const found = byId.get(parent);
      if (!found) break;
      names.push(found.name);
      parent = found.parentLayerId;
    }
    return names.join(' / ').toUpperCase();
  }
  const result: CoverageLayer[] = [];
  for (const layer of layers) {
    if (layer.subLayerIds?.length) continue;
    const hierarchy = ancestors(layer);
    const operator = OPERATORS.find(value => hierarchy.includes(value));
    const technology = TECHNOLOGIES.find(value => new RegExp('(^|[^0-9])' + value + '([^0-9]|$)').test(hierarchy));
    if (operator && technology && hierarchy.includes('MÓVEL')) {
      result.push({ operator, technology, layerId: layer.id, title: hierarchy });
    }
  }
  return result;
}
