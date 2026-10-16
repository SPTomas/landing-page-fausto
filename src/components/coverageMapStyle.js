import { maplibreGL } from '@maplibre/maplibre-gl-leaflet';
import { setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

setWorkerUrl(workerUrl);

// Vector labels can be translated before drawing, unlike raster OSM tiles.
const spanishName = [
  'match', ['get', 'iso_a2'],
  'AR', 'Argentina', 'BR', 'Brasil', 'CL', 'Chile', 'BO', 'Bolivia',
  'PY', 'Paraguay', 'UY', 'Uruguay', 'FK', 'Islas Malvinas',
  [
    'match', ['get', 'name'],
    ['Falkland Islands', 'Falkland Islands (Malvinas)'], 'Islas Malvinas',
    ['Stanley', 'Port Stanley'], 'Puerto Argentino',
    'Atlantic Ocean', 'Océano Atlántico',
    'South Atlantic Ocean', 'Océano Atlántico Sur',
    'Pacific Ocean', 'Océano Pacífico',
    'South Pacific Ocean', 'Océano Pacífico Sur',
    ['coalesce', ['get', 'name:es'], ['get', 'name_es'], ['get', 'name'], ['get', 'name:latin'], ''],
  ],
];

const textPaint = {
  'text-color': '#e7d7be',
  'text-halo-color': '#191e19',
  'text-halo-width': 1.5,
};

function placeLayer(id, classes, minzoom, size, maxzoom = 24) {
  return {
    id, type: 'symbol', source: 'openmaptiles', 'source-layer': 'place', minzoom, maxzoom,
    filter: ['all', ['in', ['get', 'class'], ['literal', classes]], ['!=', ['get', 'iso_a2'], 'FK']],
    layout: {
      'text-field': spanishName,
      'text-font': ['Noto Sans Regular'],
      'text-size': size,
      'text-max-width': 9,
      'text-padding': 5,
    },
    paint: textPaint,
  };
}

export function createCoverageBasemap(data) {
  // Check before adding a Leaflet layer: a failed MapLibre constructor would
  // otherwise leave a partially initialized layer that cannot be removed.
  const context = document.createElement('canvas').getContext('webgl2');
  if (!context) throw new Error('Este navegador no admite el fondo vectorial.');
  context.getExtension('WEBGL_lose_context')?.loseContext();

  const covered = ['in', ['get', 'shapeName'], ['literal', data.features
    .filter(feature => feature.properties.covered)
    .map(feature => feature.properties.shapeName)]];

  return maplibreGL({
    interactive: false,
    attributionControl: false,
    style: {
      version: 8,
      glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
      sources: {
        openmaptiles: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' },
        coverage: { type: 'geojson', data: {
          ...data,
          features: data.features.filter(feature => feature.properties.kind !== 'context'),
        } },
      },
      layers: [
        { id: 'land', type: 'background', paint: { 'background-color': '#222a21' } },
        { id: 'water', type: 'fill', source: 'openmaptiles', 'source-layer': 'water', paint: { 'fill-color': '#252c30' } },
        { id: 'woods', type: 'fill', source: 'openmaptiles', 'source-layer': 'landcover', paint: { 'fill-color': '#273125', 'fill-opacity': 0.35 } },
        { id: 'rivers', type: 'line', source: 'openmaptiles', 'source-layer': 'waterway', paint: { 'line-color': '#35434b', 'line-width': 1 } },
        { id: 'coverage-fill', type: 'fill', source: 'coverage', paint: {
          'fill-color': ['case', covered, '#e7d7be', '#111610'],
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 2, ['case', covered, 0.85, 0.4], 7, ['case', covered, 0.2, 0.08]],
        } },
        { id: 'roads', type: 'line', source: 'openmaptiles', 'source-layer': 'transportation', minzoom: 5,
          filter: ['in', ['get', 'class'], ['literal', ['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'minor']]],
          paint: { 'line-color': '#9a8769', 'line-opacity': 0.55, 'line-width': ['interpolate', ['linear'], ['zoom'], 5, 0.3, 16, 3] },
        },
        { id: 'boundaries', type: 'line', source: 'openmaptiles', 'source-layer': 'boundary',
          paint: { 'line-color': '#858777', 'line-opacity': 0.45, 'line-width': 0.7 },
        },
        { id: 'coverage-border', type: 'line', source: 'coverage', paint: { 'line-color': '#e7d7be', 'line-width': 0.7, 'line-opacity': 0.5 } },
        { id: 'road-labels', type: 'symbol', source: 'openmaptiles', 'source-layer': 'transportation_name', minzoom: 12,
          layout: { 'symbol-placement': 'line', 'text-field': spanishName, 'text-font': ['Noto Sans Regular'], 'text-size': 10 }, paint: textPaint,
        },
        placeLayer('country-labels', ['country'], 1, 12, 4),
        // Separate provinces from cities that share their names at closer zooms.
        placeLayer('province-labels', ['state'], 4, 11, 7),
        placeLayer('city-labels', ['city'], 7, 12),
        placeLayer('town-labels', ['town', 'village'], 7, 11),
        placeLayer('neighbourhood-labels', ['suburb', 'neighbourhood'], 12, 10),
      ],
    },
  });
}
