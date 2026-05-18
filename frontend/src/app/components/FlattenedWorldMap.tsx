import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface FlattenedWorldMapProps {
  isOpen: boolean;
  onClose: () => void;
}

type RiskFilter = 'all' | 'hotspots' | 'stable' | 'at-risk';

const riskRegions = [
  { id: 1,  name: 'Amazon Basin',        lat: -3.47,  lng: -62.22, risk: 'hotspots', detail: 'Deforestation +18.4% YoY, AQI Critical' },
  { id: 2,  name: 'Arctic Circle',        lat: 69.65,  lng: 18.96,  risk: 'hotspots', detail: 'Glacial melt accelerating, permafrost loss' },
  { id: 3,  name: 'Great Barrier Reef',   lat: -18.29, lng: 147.70, risk: 'hotspots', detail: 'Ocean temp +2.1°C, coral bleaching active' },
  { id: 4,  name: 'Congo Basin',          lat: -0.50,  lng: 23.50,  risk: 'at-risk',  detail: 'Deforestation pressure increasing' },
  { id: 5,  name: 'Southeast Asia',       lat: 12.00,  lng: 105.00, risk: 'at-risk',  detail: 'AQI elevated, biodiversity under stress' },
  { id: 6,  name: 'Madagascar',           lat: -18.77, lng: 46.87,  risk: 'at-risk',  detail: 'Species loss accelerating' },
  { id: 7,  name: 'Greenland',            lat: 71.70,  lng: -42.60, risk: 'at-risk',  detail: 'Ice sheet thinning detected' },
  { id: 8,  name: 'Scandinavian Forest',  lat: 64.00,  lng: 17.00,  risk: 'stable',   detail: 'Reforestation active, risk LOW' },
  { id: 9,  name: 'New Zealand Alpine',   lat: -43.50, lng: 170.50, risk: 'stable',   detail: 'Ecosystem resilience HIGH' },
  { id: 10, name: 'North America Plains', lat: 40.00,  lng: -100.00,risk: 'stable',   detail: 'Biodiversity index stable' },
];

const FILTERS = [
  { key: 'hotspots' as RiskFilter, label: 'Hotspots', Icon: AlertTriangle,
    active: 'bg-red-500 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]',
    idle: 'border-red-500/40 text-red-400 hover:bg-red-500/10' },
  { key: 'stable' as RiskFilter, label: 'Stable', Icon: CheckCircle,
    active: 'bg-green-500 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)]',
    idle: 'border-green-500/40 text-green-400 hover:bg-green-500/10' },
  { key: 'at-risk' as RiskFilter, label: 'At Risk', Icon: AlertCircle,
    active: 'bg-yellow-500 border-yellow-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.5)]',
    idle: 'border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10' },
  { key: 'all' as RiskFilter, label: 'View All', Icon: null,
    active: 'bg-primary-container border-primary-container text-on-primary shadow-[0_0_20px_rgba(0,240,255,0.4)]',
    idle: 'border-primary-container/40 text-primary-container hover:bg-primary-container/10' },
];

function getMarkerColor(risk: string) {
  if (risk === 'hotspots') return '#ef4444';
  if (risk === 'at-risk')  return '#f59e0b';
  return '#22c55e';
}

function getMarkerRadius(risk: string) {
  if (risk === 'hotspots') return 14;
  if (risk === 'at-risk')  return 10;
  return 8;
}

export default function FlattenedWorldMap({ isOpen, onClose }: FlattenedWorldMapProps) {
  const [filter, setFilter] = useState<RiskFilter>('all');
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); },
    [onClose],
  );
  useEffect(() => {
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // Init map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;
    if (mapRef.current) return; // already initialized

    const map = L.map(mapContainerRef.current, {
      center: [20, 10],
      zoom: 2,
      minZoom: 2,
      maxZoom: 6,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CARTO',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [isOpen]);

  // Update markers on filter change
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const filtered = filter === 'all' ? riskRegions : riskRegions.filter((r) => r.risk === filter);

    filtered.forEach((region) => {
      const marker = L.circleMarker([region.lat, region.lng], {
        radius: getMarkerRadius(region.risk),
        color: getMarkerColor(region.risk),
        fillColor: getMarkerColor(region.risk),
        fillOpacity: 0.85,
        weight: 2,
      })
        .bindPopup(`
          <div style="font-family:Inter,sans-serif;min-width:160px">
            <div style="font-weight:700;font-size:13px;margin-bottom:4px">${region.name}</div>
            <div style="font-size:11px;color:${getMarkerColor(region.risk)};text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">
              ${region.risk === 'hotspots' ? 'Critical' : region.risk === 'at-risk' ? 'At Risk' : 'Stable'}
            </div>
            <div style="font-size:12px;color:#999">${region.detail}</div>
          </div>
        `)
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
  }, [filter, isOpen]);

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col glass-strong rounded-2xl border border-primary-container/30 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-7 pt-6 pb-4 border-b border-outline-variant/40 flex-shrink-0">
              <div>
                <h2 className="text-headline-lg text-on-surface leading-tight">Global Risk Map</h2>
                <p className="text-sm text-on-surface-variant mt-1">
                  Live visualization of biodiversity risk levels across the planet
                </p>
              </div>
              <button
                onClick={onClose}
                className="ml-4 mt-0.5 flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full border border-outline-variant hover:border-error/60 hover:bg-error/10 transition-all"
              >
                <X className="w-4 h-4 text-on-surface" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-7 py-6 space-y-6">

              {/* Map */}
              <div className="relative w-full rounded-xl overflow-hidden border border-outline-variant" style={{ height: '420px' }}>
                <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />

                {/* Live indicator */}
                <div className="absolute top-3 right-3 z-[1000] glass-strong rounded-full px-3 py-1.5 border border-primary-container/30 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-secondary"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-[11px] text-label-caps text-secondary">Live Data</span>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 justify-center">
                {FILTERS.map(({ key, label, Icon, active, idle }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`px-5 py-2.5 rounded-full border-2 transition-all font-medium text-sm flex items-center gap-2 ${
                      filter === key ? active : `glass ${idle}`
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {label}
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="glass rounded-xl p-4 border border-outline-variant">
                <div className="text-xs text-label-caps text-on-surface-variant mb-3">Risk Level Index</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { color: 'bg-red-500',    glow: 'shadow-[0_0_10px_rgba(239,68,68,0.8)]',  label: 'Critical Risk (Hotspots)' },
                    { color: 'bg-yellow-500', glow: 'shadow-[0_0_10px_rgba(245,158,11,0.8)]', label: 'Moderate Risk (At Risk)'  },
                    { color: 'bg-green-500',  glow: 'shadow-[0_0_10px_rgba(34,197,94,0.8)]',  label: 'Low Risk (Stable)'        },
                  ].map(({ color, glow, label }) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${color} ${glow}`} />
                      <span className="text-xs text-on-surface">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-center text-xs text-on-surface-variant/50 pb-1">
                Press <kbd className="px-1.5 py-0.5 rounded border border-outline-variant text-[11px]">Esc</kbd> or click outside to close · Click markers for details
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}