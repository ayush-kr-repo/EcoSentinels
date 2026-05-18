import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { MapPin, ThermometerSun, Droplets, Wind } from 'lucide-react';
import Realistic3DEarth from './Realistic3DEarth';
import FlattenedWorldMap from './FlattenedWorldMap';

type RiskCategory = 'hotspots' | 'stable' | 'at-risk';
type RiskStatus = 'critical' | 'stable' | 'warning';

type Region = {
  id: string;
  name: string;
  fragility: number;
  temp: string;
  status: RiskStatus;
  category: RiskCategory;
  precipitation: string;
  deforestation: string;
  soilMoisture: string;
};

const regions: Region[] = [
  {
    id: 'amazon',
    name: 'Amazon Basin',
    fragility: 42,
    temp: '+2.4°C',
    status: 'critical',
    category: 'hotspots',
    precipitation: '-32% (10yr avg)',
    deforestation: '+18.4% YoY',
    soilMoisture: '42% (Low)',
  },
  {
    id: 'arctic',
    name: 'Arctic Circle',
    fragility: 78,
    temp: '+3.8°C',
    status: 'critical',
    category: 'hotspots',
    precipitation: '-14% snowpack',
    deforestation: 'N/A',
    soilMoisture: 'Permafrost thaw',
  },
  {
    id: 'reef',
    name: 'Great Barrier Reef',
    fragility: 65,
    temp: '+1.9°C',
    status: 'warning',
    category: 'at-risk',
    precipitation: 'Storm variance high',
    deforestation: 'N/A',
    soilMoisture: 'Marine stress elevated',
  },
  {
    id: 'congo',
    name: 'Congo Rainforest',
    fragility: 38,
    temp: '+1.6°C',
    status: 'warning',
    category: 'at-risk',
    precipitation: '-11% seasonal',
    deforestation: '+6.2% YoY',
    soilMoisture: '57% (Moderate)',
  },
  {
    id: 'scandinavia',
    name: 'Scandinavian Forest Belt',
    fragility: 18,
    temp: '+0.6°C',
    status: 'stable',
    category: 'stable',
    precipitation: '+4% (10yr avg)',
    deforestation: '-1.3% YoY',
    soilMoisture: '74% (Healthy)',
  },
  {
    id: 'new-zealand',
    name: 'New Zealand Alpine Zone',
    fragility: 22,
    temp: '+0.4°C',
    status: 'stable',
    category: 'stable',
    precipitation: '+2% seasonal',
    deforestation: 'Minimal',
    soilMoisture: '69% (Healthy)',
  },
];

const filterMeta: Record<RiskCategory, { label: string; buttonClass: string; listTitle: string }> = {
  hotspots: {
    label: 'Hotspots',
    buttonClass: 'border-red-500 text-white bg-red-500 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]',
    listTitle: 'Critical Regions',
  },
  stable: {
    label: 'Stable',
    buttonClass: 'border-green-500 text-white bg-green-500 hover:bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.5)]',
    listTitle: 'Stable Regions',
  },
  'at-risk': {
    label: 'At Risk',
    buttonClass: 'border-yellow-500 text-black bg-yellow-500 hover:bg-yellow-600 shadow-[0_0_15px_rgba(245,158,11,0.5)]',
    listTitle: 'At-Risk Regions',
  },
};

// Unified color tokens per status — used everywhere
const statusTokens: Record<RiskStatus, {
  cardBorder: string;
  badge: string;
  fragility: string;     // big number color
  temp: string;          // temp color in list
  listTemp: string;      // temp color in region list
  dot: string;           // colored dot in list
}> = {
  critical: {
    cardBorder: 'border-red-500/30',
    badge: 'bg-red-500/15 border-red-500/50 text-red-400',
    fragility: 'text-red-400',
    temp: 'text-red-400',
    listTemp: 'text-red-400',
    dot: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]',
  },
  warning: {
    cardBorder: 'border-yellow-500/30',
    badge: 'bg-yellow-500/15 border-yellow-500/50 text-yellow-400',
    fragility: 'text-yellow-400',
    temp: 'text-yellow-400',
    listTemp: 'text-yellow-400',
    dot: 'bg-yellow-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]',
  },
  stable: {
    cardBorder: 'border-green-500/30',
    badge: 'bg-green-500/15 border-green-500/50 text-green-400',
    fragility: 'text-green-400',
    temp: 'text-green-400',
    listTemp: 'text-green-400',
    dot: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]',
  },
};

export default function RiskMapPage() {
  const [selectedFilter, setSelectedFilter] = useState<RiskCategory>('hotspots');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const filteredRegions = useMemo(
    () => regions.filter((r) => r.category === selectedFilter),
    [selectedFilter],
  );

  const [selectedRegion, setSelectedRegion] = useState<Region>(filteredRegions[0]);

  useEffect(() => {
    setSelectedRegion(filteredRegions[0]);
  }, [filteredRegions]);

  const tokens = statusTokens[selectedRegion.status];

  return (
    <div className="space-y-6 pb-24">
      <FlattenedWorldMap isOpen={isMapModalOpen} onClose={() => setIsMapModalOpen(false)} />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-label-caps text-primary-container mb-2">Global Risk Projection</div>
        <h1 className="text-headline-lg text-on-surface">Live Planetary Feed</h1>
      </motion.div>

      {/* Globe + filter buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong rounded-2xl p-8 border border-primary-container/20"
      >
        <div className="relative w-full max-w-md mx-auto">
          <Realistic3DEarth onClick={() => setIsMapModalOpen(true)} />

          <div className="flex justify-center gap-3 mt-8">
            {(Object.keys(filterMeta) as RiskCategory[]).map((key) => {
              const isActive = selectedFilter === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedFilter(key)}
                  className={`text-xs px-4 py-2 rounded-full border-2 font-medium transition-all ${
                    isActive
                      ? filterMeta[key].buttonClass
                      : 'border-outline-variant bg-surface-container text-on-surface hover:border-primary-container/50'
                  }`}
                >
                  {filterMeta[key].label}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Selected region detail card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`glass rounded-xl p-6 border ${tokens.cardBorder}`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className={`w-5 h-5 ${tokens.fragility}`} />
            <h3 className="text-headline-md text-on-surface">{selectedRegion.name}</h3>
          </div>
          <div className={`px-3 py-1 rounded-full border text-xs uppercase tracking-wider font-bold ${tokens.badge}`}>
            {selectedRegion.status}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-label-caps text-on-surface-variant mb-2">Fragility Index</div>
            <span className={`text-4xl font-bold ${tokens.fragility}`}>
              {selectedRegion.fragility}%
            </span>
          </div>
          <div>
            <div className="text-label-caps text-on-surface-variant mb-2">Temperature Anomaly</div>
            <span className={`text-4xl font-bold ${tokens.temp}`}>
              {selectedRegion.temp}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { Icon: Droplets, label: 'Precipitation', value: selectedRegion.precipitation },
            { Icon: Wind,     label: 'Deforestation', value: selectedRegion.deforestation },
            { Icon: ThermometerSun, label: 'Soil Moisture', value: selectedRegion.soilMoisture },
          ].map(({ Icon, label, value }, i, arr) => (
            <div
              key={label}
              className={`flex items-center justify-between py-2 ${i < arr.length - 1 ? 'border-b border-outline-variant/30' : ''}`}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary-container" />
                <span className="text-sm text-on-surface">{label}</span>
              </div>
              <span className="text-sm font-medium text-on-surface-variant">{value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Region list */}
      <div>
        <h3 className="text-headline-md text-on-surface mb-4">
          {filterMeta[selectedFilter].listTitle}
        </h3>
        <div className="space-y-2">
          {filteredRegions.map((region) => {
            const t = statusTokens[region.status];
            const isSelected = selectedRegion.id === region.id;
            return (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region)}
                className={`w-full glass rounded-lg p-4 border transition-all text-left ${
                  isSelected
                    ? `${t.cardBorder} bg-surface-container/40`
                    : 'border-outline-variant hover:border-outline'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Colored status dot */}
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${t.dot}`} />
                    <div>
                      <div className="font-medium text-on-surface">{region.name}</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">
                        Fragility: {region.fragility}%
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${t.listTemp}`}>{region.temp}</div>
                    <div className={`text-xs mt-0.5 uppercase font-semibold tracking-wide ${t.listTemp}`}>
                      {region.status}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}