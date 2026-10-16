import type { APIRoute } from 'astro';

export const prerender = true;

const PROVINCES_URL = 'https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/9469f09/releaseData/gbHumanitarian/ARG/ADM1/geoBoundaries-ARG-ADM1_simplified.geojson';
const COUNTRIES_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson';

async function loadGeoJSON(url: string) {
  const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
  if (!response.ok) throw new Error(`No se pudo generar el mapa: HTTP ${response.status}`);
  const data = await response.json();
  if (data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
    throw new Error('La fuente del mapa no contiene una colección geográfica válida.');
  }
  return data;
}

// Astro writes coverage boundaries and fallback geometries to dist at build
// time. These overlays remain available if the OSM background cannot load.
export const GET: APIRoute = async () => {
  const [provinces, countries] = await Promise.all([
    loadGeoJSON(PROVINCES_URL),
    loadGeoJSON(COUNTRIES_URL),
  ]);
  const names: Record<string, string> = {
    CHL: 'Chile', BOL: 'Bolivia', PRY: 'Paraguay', BRA: 'Brasil',
    URY: 'Uruguay', FLK: 'Islas Malvinas',
  };
  const features = provinces.features.map((feature: any) => ({
    type: 'Feature',
    properties: { shapeName: feature.properties.shapeName, kind: 'province' },
    geometry: feature.geometry,
  }));
  for (const feature of countries.features) {
    const code = feature.properties.ADM0_A3;
    if (!names[code]) continue;
    features.push({
      type: 'Feature',
      properties: { shapeName: names[code], kind: code === 'FLK' ? 'islands' : 'context' },
      geometry: feature.geometry,
    });
  }
  if (!features.some((feature: any) => feature.properties.kind === 'islands')) {
    throw new Error('Falta la geometría de las Islas Malvinas.');
  }
  return new Response(JSON.stringify({ type: 'FeatureCollection', features }), {
    headers: { 'Content-Type': 'application/geo+json; charset=utf-8' },
  });
};
