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

const filterMeta: Record<
  RiskCategory,
  {
    label: string;
    buttonClass: string;
    activeClass: string;
    listTitle: string;
  }
> = {
  hotspots: {
    label: 'Hotspots',
    buttonClass:
      'border-red-500 text-white bg-red-500 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]',
    activeClass: 'border-red-500 bg-red-500 text-white',
    listTitle: 'Critical Regions',
  },
  stable: {
    label: 'Stable',
    buttonClass:
      'border-green-500 text-white bg-green-500 hover:bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.5)]',
    activeClass: 'border-green-500 bg-green-500 text-white',
    listTitle: 'Stable Regions',
  },
  'at-risk': {
    label: 'At Risk',
    buttonClass:
      'border-yellow-500 text-black bg-yellow-500 hover:bg-yellow-600 shadow-[0_0_15px_rgba(245,158,11,0.5)]',
    activeClass: 'border-yellow-500 bg-yellow-500 text-black',
    listTitle: 'At-Risk Regions',
  },
};

function getStatusClasses(status: RiskStatus) {
  if (status === 'critical') {
    return {
      badge: 'bg-error-container/20 border-error/50 text-error',
      accent: 'text-error',
      card: 'border-error/30',
    };
  }

  if (status === 'warning') {
    return {
      badge: 'bg-tertiary/15 border-tertiary-container/50 text-tertiary-container',
      accent: 'text-tertiary-container',
      card: 'border-tertiary-container/30',
    };
  }

  return {
    badge: 'bg-secondary/15 border-secondary/50 text-secondary',
    accent: 'text-secondary',
    card: 'border-secondary/30',
  };
}

export default function RiskMapPage() {
  const [selectedFilter, setSelectedFilter] = useState<RiskCategory>('hotspots');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const filteredRegions = useMemo(
    () => regions.filter((region) => region.category === selectedFilter),
    [selectedFilter],
  );

  const [selectedRegion, setSelectedRegion] = useState<Region>(filteredRegions[0]);

  useEffect(() => {
    setSelectedRegion(filteredRegions[0]);
  }, [filteredRegions]);

  const statusClasses = getStatusClasses(selectedRegion.status);

  return (
    <div className="space-y-6 pb-24">
      <FlattenedWorldMap isOpen={isMapModalOpen} onClose={() => setIsMapModalOpen(false)} />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-label-caps text-primary-container mb-2">
          Global Risk Projection
        </div>
        <h1 className="text-headline-lg text-on-surface">Live Planetary Feed</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong rounded-2xl p-8 border border-primary-container/20"
      >
        <div className="relative w-full max-w-md mx-auto">
          <Realistic3DEarth onClick={() => setIsMapModalOpen(true)} />

          <div className="flex justify-center gap-3 mt-8">
            {(Object.keys(filterMeta) as RiskCategory[]).map((filterKey) => {
              const meta = filterMeta[filterKey];
              const isActive = selectedFilter === filterKey;

              return (
                <button
                  key={filterKey}
                  onClick={() => setSelectedFilter(filterKey)}
                  className={`text-xs px-4 py-2 rounded-full border-2 font-medium transition-all ${
                    isActive
                      ? meta.buttonClass
                      : 'border-outline-variant bg-surface-container text-on-surface hover:border-primary-container/50'
                  }`}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`glass rounded-xl p-6 border ${statusClasses.card}`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className={`w-5 h-5 ${statusClasses.accent}`} />
            <h3 className="text-headline-md text-on-surface">{selectedRegion.name}</h3>
          </div>
          <div className={`px-3 py-1 rounded-full border ${statusClasses.badge}`}>
            <span className="text-xs uppercase tracking-wider font-bold">
              {selectedRegion.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-label-caps text-on-surface-variant mb-2">Fragility Index</div>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold ${statusClasses.accent}`}>
                {selectedRegion.fragility}%
              </span>
            </div>
          </div>
          <div>
            <div className="text-label-caps text-on-surface-variant mb-2">
              Temperature Anomaly
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-tertiary-container">
                {selectedRegion.temp}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-outline-variant/30">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-primary-container" />
              <span className="text-sm text-on-surface">Precipitation</span>
            </div>
            <span className="text-sm font-medium text-on-surface-variant">
              {selectedRegion.precipitation}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-outline-variant/30">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-primary-container" />
              <span className="text-sm text-on-surface">Deforestation</span>
            </div>
            <span className="text-sm font-medium text-on-surface-variant">
              {selectedRegion.deforestation}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <ThermometerSun className="w-4 h-4 text-primary-container" />
              <span className="text-sm text-on-surface">Soil Moisture</span>
            </div>
            <span className="text-sm font-medium text-on-surface-variant">
              {selectedRegion.soilMoisture}
            </span>
          </div>
        </div>
      </motion.div>

      <div>
        <h3 className="text-headline-md text-on-surface mb-4">
          {filterMeta[selectedFilter].listTitle}
        </h3>
        <div className="space-y-2">
          {filteredRegions.map((region) => {
            const regionClasses = getStatusClasses(region.status);

            return (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region)}
                className={`w-full glass rounded-lg p-4 border transition-all text-left ${
                  selectedRegion.id === region.id
                    ? 'border-primary-container/50 bg-primary-container/5'
                    : 'border-outline-variant hover:border-outline'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-on-surface">{region.name}</div>
                    <div className="text-xs text-on-surface-variant mt-1">
                      Fragility: {region.fragility}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${regionClasses.accent}`}>
                      {region.temp}
                    </div>
                    <div className="text-xs text-on-surface-variant mt-1 uppercase">
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