import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface FlattenedWorldMapProps {
  isOpen: boolean;
  onClose: () => void;
}

type RiskFilter = 'all' | 'hotspots' | 'stable' | 'at-risk';

const riskRegions = [
  { id: 1,  name: 'Amazon Basin',      x: 25, y: 58, risk: 'hotspots', size: 'large'  },
  { id: 2,  name: 'Arctic Circle',      x: 50, y: 12, risk: 'hotspots', size: 'xlarge' },
  { id: 3,  name: 'Great Barrier Reef', x: 82, y: 68, risk: 'hotspots', size: 'medium' },
  { id: 4,  name: 'Congo Basin',        x: 54, y: 55, risk: 'at-risk',  size: 'large'  },
  { id: 5,  name: 'Southeast Asia',     x: 70, y: 50, risk: 'at-risk',  size: 'medium' },
  { id: 6,  name: 'Madagascar',         x: 58, y: 68, risk: 'at-risk',  size: 'small'  },
  { id: 7,  name: 'North America',      x: 18, y: 32, risk: 'stable',   size: 'large'  },
  { id: 8,  name: 'Europe',            x: 50, y: 30, risk: 'stable',   size: 'medium' },
  { id: 9,  name: 'Antarctica',         x: 50, y: 92, risk: 'stable',   size: 'xlarge' },
  { id: 10, name: 'Greenland',          x: 30, y: 18, risk: 'at-risk',  size: 'medium' },
];

const FILTERS = [
  {
    key: 'hotspots' as RiskFilter,
    label: 'Hotspots',
    Icon: AlertTriangle,
    active: 'bg-red-500 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]',
    idle: 'border-red-500/40 text-red-400 hover:bg-red-500/10',
  },
  {
    key: 'stable' as RiskFilter,
    label: 'Stable',
    Icon: CheckCircle,
    active: 'bg-green-500 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)]',
    idle: 'border-green-500/40 text-green-400 hover:bg-green-500/10',
  },
  {
    key: 'at-risk' as RiskFilter,
    label: 'At Risk',
    Icon: AlertCircle,
    active: 'bg-yellow-500 border-yellow-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.5)]',
    idle: 'border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10',
  },
  {
    key: 'all' as RiskFilter,
    label: 'View All',
    Icon: null,
    active: 'bg-primary-container border-primary-container text-on-primary shadow-[0_0_20px_rgba(0,240,255,0.4)]',
    idle: 'border-primary-container/40 text-primary-container hover:bg-primary-container/10',
  },
];

function getRegionColor(risk: string) {
  if (risk === 'hotspots') return 'bg-red-500';
  if (risk === 'at-risk')  return 'bg-yellow-500';
  if (risk === 'stable')   return 'bg-green-500';
  return 'bg-blue-500';
}

function getRegionGlow(risk: string) {
  if (risk === 'hotspots') return 'shadow-[0_0_30px_rgba(239,68,68,0.8)]';
  if (risk === 'at-risk')  return 'shadow-[0_0_25px_rgba(245,158,11,0.7)]';
  if (risk === 'stable')   return 'shadow-[0_0_20px_rgba(34,197,94,0.6)]';
  return '';
}

function getRegionSize(size: string) {
  if (size === 'small')  return 'w-3 h-3';
  if (size === 'large')  return 'w-7 h-7';
  if (size === 'xlarge') return 'w-10 h-10';
  return 'w-5 h-5'; // medium
}

export default function FlattenedWorldMap({ isOpen, onClose }: FlattenedWorldMapProps) {
  const [filter, setFilter] = useState<RiskFilter>('all');

  // ── Lock body scroll when modal is open ──
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ── Escape key to close ──
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); },
    [onClose],
  );
  useEffect(() => {
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  const filteredRegions =
    filter === 'all' ? riskRegions : riskRegions.filter((r) => r.risk === filter);

  const modal = (
    <AnimatePresence>
      {isOpen && (
        /* Full-screen fixed overlay — nothing beneath can scroll */
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Card — scrollable internally, never overflows viewport */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col glass-strong rounded-2xl border border-primary-container/30 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Fixed card header with close button ── */}
            <div className="flex items-start justify-between px-7 pt-6 pb-4 border-b border-outline-variant/40 flex-shrink-0">
              <div>
                <h2 className="text-headline-lg text-on-surface leading-tight">
                  Global Risk Map
                </h2>
                <p className="text-sm text-on-surface-variant mt-1">
                  Live visualization of biodiversity risk levels across the planet
                </p>
              </div>

              <button
                onClick={onClose}
                className="ml-4 mt-0.5 flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full border border-outline-variant hover:border-error/60 hover:bg-error/10 transition-all"
                aria-label="Close (Esc)"
                title="Close (Esc)"
              >
                <X className="w-4 h-4 text-on-surface" />
              </button>
            </div>

            {/* ── Scrollable body ── */}
            <div className="overflow-y-auto flex-1 px-7 py-6 space-y-6">

              {/* Map canvas */}
              <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden border border-outline-variant">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `
                      radial-gradient(circle at 20% 35%, rgba(100,150,100,0.2) 0%, transparent 8%),
                      radial-gradient(circle at 24% 32%, rgba(100,150,100,0.2) 0%, transparent 5%),
                      radial-gradient(circle at 15% 40%, rgba(100,150,100,0.15) 0%, transparent 7%),
                      radial-gradient(circle at 52% 28%, rgba(100,150,100,0.2) 0%, transparent 6%),
                      radial-gradient(circle at 55% 32%, rgba(100,150,100,0.15) 0%, transparent 4%),
                      radial-gradient(circle at 72% 48%, rgba(100,150,100,0.2) 0%, transparent 7%),
                      radial-gradient(circle at 82% 70%, rgba(100,150,100,0.2) 0%, transparent 5%),
                      radial-gradient(circle at 26% 60%, rgba(100,150,100,0.2) 0%, transparent 9%),
                      radial-gradient(circle at 54% 56%, rgba(100,150,100,0.2) 0%, transparent 8%),
                      linear-gradient(to bottom, rgba(10,30,50,1), rgba(5,20,35,1))
                    `,
                  }}
                >
                  <svg className="absolute inset-0 w-full h-full opacity-10">
                    <defs>
                      <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(212,228,250,0.5)" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#map-grid)" />
                    {[20, 40, 60, 80].map((y) => (
                      <line key={y} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`}
                        stroke="rgba(212,228,250,0.3)" strokeWidth="1" />
                    ))}
                  </svg>
                </div>

                {filteredRegions.map((region) => (
                  <motion.div
                    key={region.id}
                    className={`absolute ${getRegionSize(region.size)} rounded-full ${getRegionColor(region.risk)} ${getRegionGlow(region.risk)} cursor-pointer border-2 border-white/50`}
                    style={{ left: `${region.x}%`, top: `${region.y}%`, transform: 'translate(-50%, -50%)' }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: region.id * 0.05, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.3 }}
                  >
                    {region.risk === 'hotspots' && (
                      <motion.div
                        className={`absolute inset-0 rounded-full ${getRegionColor(region.risk)} opacity-50`}
                        animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                ))}

                {/* Live indicator */}
                <div className="absolute top-3 right-3 glass-strong rounded-full px-3 py-1.5 border border-primary-container/30">
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

              {/* Filter buttons */}
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
                <div className="text-xs text-label-caps text-on-surface-variant mb-3">
                  Risk Level Index
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { color: 'bg-red-500',    glow: 'shadow-[0_0_10px_rgba(239,68,68,0.8)]',    label: 'Critical Risk (Hotspots)' },
                    { color: 'bg-yellow-500', glow: 'shadow-[0_0_10px_rgba(245,158,11,0.8)]',   label: 'Moderate Risk (At Risk)'  },
                    { color: 'bg-green-500',  glow: 'shadow-[0_0_10px_rgba(34,197,94,0.8)]',    label: 'Low Risk (Stable)'        },
                  ].map(({ color, glow, label }) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${color} ${glow}`} />
                      <span className="text-xs text-on-surface">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hint */}
              <p className="text-center text-xs text-on-surface-variant/50 pb-1">
                Press <kbd className="px-1.5 py-0.5 rounded border border-outline-variant text-[11px]">Esc</kbd> or click outside to close
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // Render into document.body so it's truly outside the page scroll container
  return createPortal(modal, document.body);
}