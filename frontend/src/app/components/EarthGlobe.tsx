import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface EarthGlobeProps {
  onRegionClick?: (region: string) => void;
}

interface Hotspot {
  id: string;
  region: string;
  x: number;
  y: number;
  status: 'healthy' | 'vulnerable' | 'critical';
}

const hotspots: Hotspot[] = [
  { id: '1', region: 'Amazon Basin', x: 28, y: 62, status: 'critical' },
  { id: '2', region: 'Arctic Circle', x: 50, y: 15, status: 'critical' },
  { id: '3', region: 'Great Barrier Reef', x: 82, y: 70, status: 'critical' },
  { id: '4', region: 'Congo Rainforest', x: 55, y: 58, status: 'vulnerable' },
  { id: '5', region: 'North America', x: 20, y: 35, status: 'vulnerable' },
  { id: '6', region: 'Europe', x: 52, y: 32, status: 'vulnerable' },
  { id: '7', region: 'Asia', x: 72, y: 42, status: 'vulnerable' },
  { id: '8', region: 'South America', x: 32, y: 72, status: 'vulnerable' },
  { id: '9', region: 'Africa', x: 54, y: 55, status: 'healthy' },
  { id: '10', region: 'Australia', x: 82, y: 75, status: 'healthy' },
];

export default function EarthGlobe({ onRegionClick }: EarthGlobeProps) {
  const [rotation, setRotation] = useState(0);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: Hotspot['status']) => {
    switch (status) {
      case 'critical':
        return 'bg-red-500';
      case 'vulnerable':
        return 'bg-yellow-500';
      case 'healthy':
        return 'bg-green-500';
    }
  };

  const getStatusGlow = (status: Hotspot['status']) => {
    switch (status) {
      case 'critical':
        return 'shadow-[0_0_20px_rgba(239,68,68,0.8)]';
      case 'vulnerable':
        return 'shadow-[0_0_20px_rgba(245,158,11,0.8)]';
      case 'healthy':
        return 'shadow-[0_0_20px_rgba(34,197,94,0.8)]';
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative w-[500px] h-[500px]">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.4), rgba(14, 165, 233, 0.2), transparent)',
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div
          className="relative w-full h-full rounded-full overflow-hidden"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #2563eb, #1e40af, #1e3a8a)',
            boxShadow: '0 0 60px rgba(59, 130, 246, 0.6), inset 0 0 60px rgba(0, 0, 0, 0.5)',
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 20% 30%, rgba(34, 197, 94, 0.3) 0%, transparent 40%),
                radial-gradient(ellipse at 60% 50%, rgba(245, 158, 11, 0.3) 0%, transparent 35%),
                radial-gradient(ellipse at 80% 70%, rgba(239, 68, 68, 0.3) 0%, transparent 30%),
                radial-gradient(ellipse at 30% 70%, rgba(34, 197, 94, 0.2) 0%, transparent 40%),
                radial-gradient(ellipse at 70% 30%, rgba(245, 158, 11, 0.2) 0%, transparent 35%)
              `,
            }}
            animate={{
              rotate: rotation,
            }}
            transition={{
              duration: 0.05,
              ease: 'linear',
            }}
          />

          <div className="absolute inset-0">
            <svg width="100%" height="100%" viewBox="0 0 500 500" className="opacity-20">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <circle cx="250" cy="250" r="250" fill="url(#grid)" />
            </svg>
          </div>

          {hotspots.map((hotspot) => {
            const adjustedX = (hotspot.x + rotation / 3.6) % 100;
            const isVisible = adjustedX > 10 && adjustedX < 90;

            return (
              <motion.button
                key={hotspot.id}
                className={`absolute w-4 h-4 rounded-full ${getStatusColor(hotspot.status)} ${getStatusGlow(hotspot.status)} cursor-pointer border-2 border-white transition-all`}
                style={{
                  left: `${adjustedX}%`,
                  top: `${hotspot.y}%`,
                  transform: 'translate(-50%, -50%)',
                  opacity: isVisible ? 1 : 0,
                  pointerEvents: isVisible ? 'auto' : 'none',
                }}
                onClick={() => onRegionClick?.(hotspot.region)}
                onMouseEnter={() => setHoveredHotspot(hotspot.id)}
                onMouseLeave={() => setHoveredHotspot(null)}
                animate={{
                  scale: hoveredHotspot === hotspot.id ? 1.5 : 1,
                }}
                whileHover={{
                  scale: 1.8,
                }}
                whileTap={{
                  scale: 0.9,
                }}
              >
                {hoveredHotspot === hotspot.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: -30 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap glass-strong px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-500/30"
                  >
                    {hotspot.region}
                  </motion.div>
                )}
              </motion.button>
            );
          })}

          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, transparent 30%, rgba(0, 0, 0, 0.3) 100%)',
            }}
          />
        </div>

        <motion.div
          className="absolute inset-0 rounded-full border-2 border-blue-400/30"
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-strong rounded-full px-4 py-2 border border-blue-500/30">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
            <span>Healthy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>
            <span>Vulnerable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
            <span>Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
}
