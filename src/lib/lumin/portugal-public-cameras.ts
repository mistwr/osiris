export type PortugalPublicCamera = { id: string; name: string; city: string; lat: number; lng: number; url: string; source: string };
/** Publicly advertised coastal webcam locations. Coordinates locate the beach, not the exact camera installation.
 * Links open the publisher's page; streams are not scraped, proxied, or embedded.
 */
export const PORTUGAL_PUBLIC_CAMERAS: PortugalPublicCamera[] = [
  { id: 'pt-matosinhos', name: 'Praia de Matosinhos', city: 'Matosinhos', lat: 41.176, lng: -8.694, url: 'https://beachcam.meo.pt/', source: 'MEO Beachcam' },
  { id: 'pt-nazare', name: 'Praia do Norte', city: 'Nazaré', lat: 39.608, lng: -9.084, url: 'https://beachcam.meo.pt/', source: 'MEO Beachcam' },
  { id: 'pt-peniche', name: 'Supertubos', city: 'Peniche', lat: 39.343, lng: -9.363, url: 'https://beachcam.meo.pt/', source: 'MEO Beachcam' },
  { id: 'pt-guincho', name: 'Praia do Guincho', city: 'Cascais', lat: 38.731, lng: -9.473, url: 'https://beachcam.meo.pt/', source: 'MEO Beachcam' },
  { id: 'pt-carcavelos', name: 'Praia de Carcavelos', city: 'Cascais', lat: 38.677, lng: -9.335, url: 'https://beachcam.meo.pt/', source: 'MEO Beachcam' },
  { id: 'pt-cap', name: 'Costa da Caparica', city: 'Almada', lat: 38.642, lng: -9.238, url: 'https://beachcam.meo.pt/', source: 'MEO Beachcam' },
  { id: 'pt-barra', name: 'Praia da Barra', city: 'Ílhavo', lat: 40.638, lng: -8.749, url: 'https://beachcam.meo.pt/', source: 'MEO Beachcam' },
  { id: 'pt-figueira', name: 'Praia do Cabedelo', city: 'Figueira da Foz', lat: 40.135, lng: -8.863, url: 'https://beachcam.meo.pt/', source: 'MEO Beachcam' },
  { id: 'pt-sintra', name: 'Praia Grande', city: 'Sintra', lat: 38.816, lng: -9.475, url: 'https://beachcam.meo.pt/', source: 'MEO Beachcam' },
  { id: 'pt-ericeira', name: 'Ribeira d’Ilhas', city: 'Ericeira', lat: 38.987, lng: -9.420, url: 'https://beachcam.meo.pt/', source: 'MEO Beachcam' },
  { id: 'pt-rocha', name: 'Praia da Rocha', city: 'Portimão', lat: 37.119, lng: -8.537, url: 'https://beachcam.meo.pt/', source: 'MEO Beachcam' },
  { id: 'pt-vilamoura', name: 'Praia de Vilamoura', city: 'Loulé', lat: 37.073, lng: -8.119, url: 'https://beachcam.meo.pt/', source: 'MEO Beachcam' },
  { id: 'pt-carvoeiro', name: 'Praia do Carvoeiro', city: 'Lagoa', lat: 37.096, lng: -8.472, url: 'https://beachcam.meo.pt/', source: 'MEO Beachcam' },
  { id: 'pt-faro', name: 'Praia de Faro', city: 'Faro', lat: 37.006, lng: -7.994, url: 'https://beachcam.meo.pt/', source: 'MEO Beachcam' },
  { id: 'pt-adraga', name: 'Praia da Adraga', city: 'Sintra', lat: 38.803, lng: -9.486, url: 'https://beachcam.meo.pt/', source: 'MEO Beachcam' },
  { id: 'pt-magoito', name: 'Praia do Magoito', city: 'Sintra', lat: 38.865, lng: -9.449, url: 'https://beachcam.meo.pt/', source: 'MEO Beachcam' },
];
