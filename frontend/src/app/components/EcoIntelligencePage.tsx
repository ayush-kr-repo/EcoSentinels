import { motion } from 'motion/react';
import { MapPin, AlertTriangle, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import CommunityBriefingPanel from './CommunityBriefingPanel';

const hotspots = [
  {
    id: 1,
    name: 'Amazon Alpha Cluster',
    location: 'Northern Brazil • Grid-32',
    description:
      'Rapid deforestation detected. Symbiotic fungi networks at risk. Immediate drone swarm deployment recommended.',
    image: 'https://images.unsplash.com/photo-1705998989555-87ed424a269d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWF6b24lMjByYWluZm9yZXN0JTIwYWVyaWFsfGVufDF8fHx8MTc3Nzc4NzAyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'critical',
    fragility: 87,
  },
  {
    id: 2,
    name: 'Great Barrier Reefs',
    location: 'Queensland Coast • Sector-8',
    description:
      'Mass bleaching event in progress. Ocean temperatures 2.1°C above seasonal average. Coral mortality accelerating.',
    image: 'https://images.unsplash.com/photo-1719042575585-e9d866f43210?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JhbCUyMHJlZWYlMjB1bmRlcndhdGVyfGVufDF8fHx8MTc3Nzc4NzAyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'critical',
    fragility: 92,
  },
  {
    id: 3,
    name: 'Himalayan Zenith Basin',
    location: 'Nepal-Tibet Border • Zone-14',
    description:
      'Glacial retreat exceeding projections. Meltwater supply critical for 240M people downstream. Monitoring intensified.',
    image: 'https://images.unsplash.com/photo-1669995654053-533bbaa7b6bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaW1hbGF5YW4lMjBtb3VudGFpbnMlMjBnbGFjaWVyfGVufDF8fHx8MTc3Nzc4NzAyNXww&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'warning',
    fragility: 76,
  },
];

export default function EcoIntelligencePage() {
  return (
    <div className="space-y-6 pb-24">
      <CommunityBriefingPanel />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-label-caps text-primary-container mb-2">
          Eco-Intelligence
        </div>
        <h1 className="text-headline-lg text-on-surface">Active Hotspots</h1>
        <p className="text-body-md text-on-surface-variant mt-2">
          Priority AI-detected ecological crisis zones requiring immediate steward response.
        </p>
      </motion.div>

      {/* Hotspot Cards */}
      <div className="space-y-6">
        {hotspots.map((hotspot, index) => (
          <motion.div
            key={hotspot.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className={`glass rounded-2xl overflow-hidden border ${
              hotspot.status === 'critical'
                ? 'border-error/30 glow-red'
                : 'border-tertiary-container/30'
            }`}
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <ImageWithFallback
                src={hotspot.image}
                alt={hotspot.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/50 to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <div
                  className={`px-3 py-1.5 rounded-full border backdrop-blur-md ${
                    hotspot.status === 'critical'
                      ? 'bg-error-container/30 border-error text-error'
                      : 'bg-tertiary/30 border-tertiary-container text-tertiary-container'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {hotspot.status}
                  </span>
                </div>
              </div>

              {/* Fragility Score */}
              <div className="absolute bottom-4 right-4 glass-strong rounded-lg px-4 py-2">
                <div className="text-xs text-label-caps text-on-surface-variant mb-0.5">
                  Fragility
                </div>
                <div
                  className={`text-2xl font-bold ${
                    hotspot.fragility > 85
                      ? 'text-error'
                      : hotspot.fragility > 70
                      ? 'text-tertiary-container'
                      : 'text-secondary'
                  }`}
                >
                  {hotspot.fragility}%
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-headline-md text-on-surface">{hotspot.name}</h3>
                {hotspot.status === 'critical' && (
                  <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 ml-2" />
                )}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-on-surface-variant" />
                <span className="text-sm text-on-surface-variant">{hotspot.location}</span>
              </div>

              <p className="text-body-md text-on-surface-variant mb-4">
                {hotspot.description}
              </p>

              <div className="pt-2">
                <div className="text-xs uppercase tracking-wider text-on-surface-variant">
                  Monitoring only
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-xl p-6 border border-outline-variant"
      >
        <h3 className="text-headline-md text-on-surface mb-4">Global Hotspot Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <div className="text-label-caps text-on-surface-variant mb-1">Critical Zones</div>
            <div className="text-2xl font-bold text-error">18</div>
          </div>
          <div>
            <div className="text-label-caps text-on-surface-variant mb-1">Under Watch</div>
            <div className="text-2xl font-bold text-tertiary-container">47</div>
          </div>
          <div>
            <div className="text-label-caps text-on-surface-variant mb-1">Recovering</div>
            <div className="text-2xl font-bold text-secondary">12</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
