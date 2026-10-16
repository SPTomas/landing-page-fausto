import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import 'maplibre-gl/dist/maplibre-gl.css';

// Coverage boundaries and the fallback are generated as a local static asset.
const BOUNDARIES_URL = `${import.meta.env.BASE_URL}mapa-cobertura.json`;
const COVERAGE = ['Córdoba', 'Mendoza', 'Catamarca', 'Buenos Aires', 'Tucumán'];
const COUNTRY_BOUNDS = [[-55.2, -73.7], [-21.7, -53.5]];

export default function CoverageMap() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const provincesRef = useRef(new Map());
  const [status, setStatus] = useState('loading');
  const [basemapStatus, setBasemapStatus] = useState('loading');
  const [selected, setSelected] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let disposed = false;
    let map;
    let observer;
    let basemap;
    let basemapTimeout;
    let vectorReady = false;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 25000);
    setStatus('loading');
    setBasemapStatus('loading');
    setSelected(null);

    async function initialize() {
      try {
        // Leaflet needs the browser DOM; keep it out of Astro's server render.
        const { default: L } = await import('leaflet');
        if (disposed) return;

        map = L.map(containerRef.current, {
          scrollWheelZoom: false,
          zoomControl: false,
          minZoom: 3,
          maxZoom: 17,
          zoomSnap: 0.25,
          fadeAnimation: false,
          attributionControl: false,
        });
        mapRef.current = map;
        map.fitBounds(COUNTRY_BOUNDS, { padding: [18, 18], animate: false });

        L.tooltip({
          permanent: true,
          direction: 'bottom',
          offset: [0, 8],
          className: 'map-place-label',
        }).setLatLng([-51.8, -59.2]).setContent('Islas Malvinas').addTo(map);

        L.control.zoom({ position: 'topright', zoomInTitle: 'Acercar mapa', zoomOutTitle: 'Alejar mapa' }).addTo(map);

        observer = new ResizeObserver(() => {
          map.invalidateSize({ pan: false });
        });
        observer.observe(containerRef.current);

        const response = await fetch(BOUNDARIES_URL, { signal: controller.signal });
        if (!response.ok) throw new Error('Province boundaries unavailable');
        const data = await response.json();
        if (disposed) return;
        if (data.type !== 'FeatureCollection' || !COVERAGE.every(name => data.features?.some(feature => feature.properties?.shapeName === name))) {
          throw new Error('Invalid province boundaries');
        }

        const context = L.geoJSON(data, {
          filter: (feature) => feature.properties.kind === 'context',
          interactive: false,
          style: { color: '#69716d', weight: 0.6, opacity: 0.5, fillColor: '#202720', fillOpacity: 1 },
        }).addTo(map);

        const provinces = L.geoJSON(data, {
          filter: (feature) => feature.properties.kind !== 'context',
          style: (feature) => ({
            color: '#e7d7be',
            weight: 0.7,
            opacity: 0.6,
            fillColor: COVERAGE.includes(feature.properties.shapeName) ? '#e7d7be' : '#111610',
            fillOpacity: 0.97,
            className: COVERAGE.includes(feature.properties.shapeName) ? 'province-covered' : 'province-outline',
          }),
          onEachFeature: (feature, layer) => {
            const name = feature.properties.shapeName;
            const covered = COVERAGE.includes(name);
            const label = document.createElement('span');
            label.textContent = `${name}${covered ? (name === 'Córdoba' ? ' · Sede del estudio' : ' · Profesionales asociados') : ''}`;
            layer.bindTooltip(label, { sticky: true, className: 'province-tooltip' });
            if (!covered) return;

            provincesRef.current.set(name, layer);
            const selectProvince = () => {
              setSelected(name);
              map.fitBounds(layer.getBounds(), { padding: [45, 45], maxZoom: 6, animate: false });
            };
            layer.on('click', selectProvince);
            layer.on('mouseover', () => layer.setStyle({ fillColor: '#f7ecd8', weight: 1.5, opacity: 1 }));
            layer.on('mouseout', () => layer.setStyle({ fillColor: '#e7d7be', weight: 0.7, opacity: vectorReady ? 0 : 0.6 }));
            layer.on('add', () => {
              const path = layer.getElement();
              if (!path) return;
              path.setAttribute('tabindex', '0');
              path.setAttribute('role', 'button');
              path.setAttribute('aria-label', `Ver cobertura en ${name}`);
              L.DomEvent.on(path, 'keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  L.DomEvent.stop(event);
                  selectProvince();
                }
              });
            });
          },
        }).addTo(map);

        L.circleMarker([-31.4167, -64.1833], {
          radius: 5, color: '#fff9ee', weight: 2, fillColor: '#80653e', fillOpacity: 1,
        }).addTo(map).bindTooltip('Córdoba Capital · Sede del estudio', { className: 'province-tooltip' });
        setStatus('ready');

        // Local coverage stays usable while the free OSM vector background loads.
        const restoreLocalMap = () => {
          if (disposed) return;
          window.clearTimeout(basemapTimeout);
          vectorReady = false;
          if (basemap && map.hasLayer(basemap)) map.removeLayer(basemap);
          basemap = null;
          context.addTo(map);
          provinces.setStyle({ fillOpacity: 0.97, opacity: 0.6 });
          setBasemapStatus('fallback');
        };
        try {
          const { createCoverageBasemap } = await import('./coverageMapStyle.js');
          if (disposed) return;
          const coverageData = {
            ...data,
            features: data.features.map(feature => ({
              ...feature,
              properties: { ...feature.properties, covered: COVERAGE.includes(feature.properties.shapeName) },
            })),
          };
          basemapTimeout = window.setTimeout(restoreLocalMap, 20000);
          basemap = createCoverageBasemap(coverageData).addTo(map);
          const glMap = basemap.getMaplibreMap();
          glMap.getCanvas().setAttribute('aria-hidden', 'true');
          glMap.getCanvas().removeAttribute('tabindex');
          glMap.once('load', () => {
            if (disposed || !basemap) return;
            window.clearTimeout(basemapTimeout);
            vectorReady = true;
            map.removeLayer(context);
            // Draw coverage below OSM labels; retain Leaflet paths for keyboard
            // focus, tooltips and province selection.
            provinces.setStyle({ fillOpacity: 0, opacity: 0 });
            setBasemapStatus('ready');
          });
          glMap.on('error', () => queueMicrotask(restoreLocalMap));
        } catch {
          restoreLocalMap();
        }
      } catch {
        if (!disposed) setStatus('error');
      } finally {
        window.clearTimeout(timeout);
      }
    }

    initialize();
    return () => {
      disposed = true;
      controller.abort();
      window.clearTimeout(timeout);
      window.clearTimeout(basemapTimeout);
      observer?.disconnect();
      map?.remove();
      mapRef.current = null;
      provincesRef.current.clear();
    };
  }, [attempt]);

  const showProvince = (name) => {
    const layer = provincesRef.current.get(name);
    if (!layer || !mapRef.current) return;
    setSelected(name);
    mapRef.current.fitBounds(layer.getBounds(), { padding: [45, 45], maxZoom: 6, animate: false });
  };

  const resetView = () => {
    mapRef.current?.fitBounds(COUNTRY_BOUNDS, { padding: [18, 18], animate: false });
    setSelected(null);
  };

  return (
    <div className="coverage-map-card" data-basemap={basemapStatus}>
      <div className="coverage-map-toolbar"><span>ARGENTINA / COBERTURA</span><button type="button" onClick={resetView} disabled={status !== 'ready'}>Ver país <span aria-hidden="true">↗</span></button></div>
      <div className="coverage-map-frame">
        <div ref={containerRef} className="coverage-map-canvas" role="region" aria-label="Mapa interactivo de Argentina. Provincias con cobertura resaltadas en beige." aria-describedby="coverage-map-help" />
        {status !== 'ready' && <div className="coverage-map-message" role="status">
          {status === 'loading' ? <><span className="map-loading-indicator" aria-hidden="true" />Cargando mapa de cobertura…</> : <><p>No pudimos cargar los límites provinciales.</p><button type="button" onClick={() => setAttempt(value => value + 1)}>Volver a intentar ↗</button></>}
        </div>}
      </div>
      <div className="coverage-map-caption">
        <p className="coverage-map-legend"><span aria-hidden="true" /> Provincias con cobertura</p>
        <div className="map-province-buttons" aria-label="Explorar provincias con cobertura">
          {COVERAGE.map(name => <button key={name} type="button" disabled={status !== 'ready'} aria-pressed={selected === name} onClick={() => showProvince(name)}>{name}</button>)}
        </div>
        <p id="coverage-map-help">Elegí una provincia para ver la cobertura.</p>
        {basemapStatus === 'fallback' && status === 'ready' && <button type="button" className="map-retry" onClick={() => setAttempt(value => value + 1)}>Recargar mapa ↗</button>}
        <p className="map-selection" aria-live="polite">{selected ? `${selected} · ${selected === 'Córdoba' ? 'Sede del estudio en Córdoba Capital.' : 'Atención a través de profesionales asociados.'}` : ''}</p>
      </div>
      <noscript><p className="coverage-map-caption">Activá JavaScript para explorar el mapa. Tenemos presencia en Córdoba, Mendoza, Catamarca, Buenos Aires y Tucumán.</p></noscript>
    </div>
  );
}
