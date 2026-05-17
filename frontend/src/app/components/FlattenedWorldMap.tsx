import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface FlattenedWorldMapProps {
  isOpen: boolean;
  onClose: () => void;
}

type RiskFilter = 'all' | 'hotspots' | 'stable' | 'at-risk';

const riskRegions = [
  { id: 1, name: 'Amazon Basin', x: 25, y: 58, risk: 'hotspots', size: 'large' },
  { id: 2, name: 'Arctic Circle', x: 50, y: 12, risk: 'hotspots', size: 'xlarge' },
  { id: 3, name: 'Great Barrier Reef', x: 82, y: 68, risk: 'hotspots', size: 'medium' },
  { id: 4, name: 'Congo Basin', x: 54, y: 55, risk: 'at-risk', size: 'large' },
  { id: 5, name: 'Southeast Asia', x: 70, y: 50, risk: 'at-risk', size: 'medium' },
  { id: 6, name: 'Madagascar', x: 58, y: 68, risk: 'at-risk', size: 'small' },
  { id: 7, name: 'North America', x: 18, y: 32, risk: 'stable', size: 'large' },
  { id: 8, name: 'Europe', x: 50, y: 30, risk: 'stable', size: 'medium' },
  { id: 9, name: 'Antarctica', x: 50, y: 92, risk: 'stable', size: 'xlarge' },
  { id: 10, name: 'Greenland', x: 30, y: 18, risk: 'at-risk', size: 'medium' },
];

export default function FlattenedWorldMap({ isOpen, onClose }: FlattenedWorldMapProps) {
  const [filter, setFilter] = useState<RiskFilter>('all');

  const getRegionColor = (risk: string) => {
    switch (risk) {
      case 'hotspots':
        return 'bg-red-500';
      case 'at-risk':
        return 'bg-yellow-500';
      case 'stable':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getRegionGlow = (risk: string) => {
    switch (risk) {
      case 'hotspots':
        return 'shadow-[0_0_30px_rgba(239,68,68,0.8)]';
      case 'at-risk':
        return 'shadow-[0_0_25px_rgba(245,158,11,0.7)]';
      case 'stable':
        return 'shadow-[0_0_20px_rgba(34,197,94,0.6)]';
      default:
        return '';
    }
  };

  const getRegionSize = (size: string) => {
    switch (size) {
      case 'small':
        return 'w-3 h-3';
      case 'medium':
        return 'w-5 h-5';
      case 'large':
        return 'w-7 h-7';
      case 'xlarge':
        return 'w-10 h-10';
      default:
        return 'w-5 h-5';
    }
  };

  const filteredRegions =
    filter === 'all' ? riskRegions : riskRegions.filter((region) => region.risk === filter);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-strong rounded-2xl max-w-6xl w-full border border-primary-container/30 relative p-8">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full glass border border-outline-variant hover:border-error/50 transition-all z-10"
              >
                <X className="w-5 h-5 text-on-surface" />
              </button>
{/* Header */}
              <div className="mb-6">
                <h2 className="text-headline-lg text-on-surface mb-2">Global Risk Map - Real Time</h2>
                <p className="text-sm text-on-surface-variant">
                  Live visualization of biodiversity risk levels across the planet
                </p>
              </div>

              {/* World Map Container */}
              <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden border border-outline-variant mb-6">
                {/* Map background - representing continents */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `
                      radial-gradient(circle at 20% 35%, rgba(100, 150, 100, 0.2) 0%, transparent 8%),
                      radial-gradient(circle at 24% 32%, rgba(100, 150, 100, 0.2) 0%, transparent 5%),
                      radial-gradient(circle at 15% 40%, rgba(100, 150, 100, 0.15) 0%, transparent 7%),
                      radial-gradient(circle at 52% 28%, rgba(100, 150, 100, 0.2) 0%, transparent 6%),
                      radial-gradient(circle at 55% 32%, rgba(100, 150, 100, 0.15) 0%, transparent 4%),
                      radial-gradient(circle at 72% 48%, rgba(100, 150, 100, 0.2) 0%, transparent 7%),
                      radial-gradient(circle at 82% 70%, rgba(100, 150, 100, 0.2) 0%, transparent 5%),
                      radial-gradient(circle at 26% 60%, rgba(100, 150, 100, 0.2) 0%, transparent 9%),
                      radial-gradient(circle at 54% 56%, rgba(100, 150, 100, 0.2) 0%, transparent 8%),
                      linear-gradient(to bottom, rgba(10, 30, 50, 1), rgba(5, 20, 35, 1))
                    `,
                  }}
                >
                  {/* Grid overlay */}
                  <svg className="absolute inset-0 w-full h-full opacity-10">
                    <defs>
                      <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path
                          d="M 40 0 L 0 0 0 40"
                          fill="none"
                          stroke="rgba(212, 228, 250, 0.5)"
                          strokeWidth="0.5"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#map-grid)" />
                    {/* Latitude lines */}
                    {[20, 40, 60, 80].map((y) => (
                      <line
                        key={y}
                        x1="0"
                        y1={`${y}%`}
                        x2="100%"
                        y2={`${y}%`}
                        stroke="rgba(212, 228, 250, 0.3)"
                        strokeWidth="1"
                      />
                    ))}
                  </svg>
                </div>

                {/* Risk regions markers */}
                {filteredRegions.map((region) => (
                  <motion.div
                    key={region.id}
                    className={`absolute ${getRegionSize(region.size)} rounded-full ${getRegionColor(region.risk)} ${getRegionGlow(region.risk)} cursor-pointer border-2 border-white/50`}
                    style={{
                      left: `${region.x}%`,
                      top: `${region.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                    transition={{
                      delay: region.id * 0.05,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    whileHover={{
                      scale: 1.3,
                    }}
                  >
                    {/* Pulsing effect for hotspots */}
                    {region.risk === 'hotspots' && (
                      <motion.div
                        className={`absolute inset-0 rounded-full ${getRegionColor(region.risk)} opacity-50`}
                        animate={{
                          scale: [1, 1.8, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                    )}
                  </motion.div>
                ))}

                {/* Real-time indicator */}
                <div className="absolute top-4 right-4 glass-strong rounded-full px-4 py-2 border border-primary-container/30">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-secondary"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-xs text-label-caps text-secondary">Live Data</span>
                  </div>
                </div>
              </div>

              {/* Filter buttons - color-coded */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => setFilter('hotspots')}
                  className={`px-6 py-3 rounded-full border-2 transition-all font-medium text-sm ${
                    filter === 'hotspots'
                      ? 'bg-red-500 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)]'
                      : 'glass border-red-500/50 text-red-500 hover:bg-red-500/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Hotspots
                  </div>
                </button>
                <button
                  onClick={() => setFilter('stable')}
                  className={`px-6 py-3 rounded-full border-2 transition-all font-medium text-sm ${
                    filter === 'stable'
                      ? 'bg-green-500 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.6)]'
                      : 'glass border-green-500/50 text-green-500 hover:bg-green-500/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Stable
                  </div>
                </button>
                <button
                  onClick={() => setFilter('at-risk')}
                  className={`px-6 py-3 rounded-full border-2 transition-all font-medium text-sm ${
                    filter === 'at-risk'
                      ? 'bg-yellow-500 border-yellow-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.6)]'
                      : 'glass border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    At Risk
                  </div>
                </button>
                <button
                  onClick={() => setFilter('all')}
                  className={`px-6 py-3 rounded-full border-2 transition-all font-medium text-sm ${
                    filter === 'all'
                      ? 'bg-primary-container border-primary-container text-on-primary shadow-[0_0_20px_rgba(0,240,255,0.6)]'
                      : 'glass border-primary-container/50 text-primary-container hover:bg-primary-container/10'
                  }`}
                >
                  View All
                </button>
              </div>

              {/* Legend */}
              <div className="mt-6 glass rounded-lg p-4 border border-outline-variant">
                <div className="text-xs text-label-caps text-on-surface-variant mb-3">Risk Level Index</div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                    <span className="text-xs text-on-surface">Critical Risk (Hotspots)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                    <span className="text-xs text-on-surface">Moderate Risk (At Risk)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                    <span className="text-xs text-on-surface">Low Risk (Stable)</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}