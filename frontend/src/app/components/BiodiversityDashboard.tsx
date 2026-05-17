import { TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  status: 'healthy' | 'vulnerable' | 'critical';
  trend?: number;
  subtitle?: string;
}

function MetricCard({ title, value, status, trend, subtitle }: MetricCardProps) {
  const statusColors = {
    healthy: 'text-green-400 border-green-500/30',
    vulnerable: 'text-yellow-400 border-yellow-500/30',
    critical: 'text-red-400 border-red-500/30',
  };

  const glowColors = {
    healthy: 'glow-green',
    vulnerable: 'border-yellow-500/50',
    critical: 'glow-red',
  };

  const StatusIcon = status === 'healthy' ? CheckCircle : AlertTriangle;

  return (
    <div className={`glass rounded-xl p-4 border ${statusColors[status]} ${status !== 'vulnerable' ? glowColors[status] : ''}`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm text-muted-foreground uppercase tracking-wider">{title}</h3>
        <StatusIcon className={`w-5 h-5 ${statusColors[status]}`} />
      </div>
      <div className={`text-3xl font-bold ${statusColors[status]} mb-1`}>
        {value}
      </div>
      {subtitle && (
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      )}
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          <TrendingDown className={`w-4 h-4 ${trend < 0 ? 'text-red-400' : 'text-green-400'}`} />
          <span className={`text-xs ${trend < 0 ? 'text-red-400' : 'text-green-400'}`}>
            {Math.abs(trend)}% vs last year
          </span>
        </div>
      )}
    </div>
  );
}

interface SpeciesThreatProps {
  species: string;
  threatLevel: number;
  population: string;
}

function SpeciesThreatCard({ species, threatLevel, population }: SpeciesThreatProps) {
  const getColor = () => {
    if (threatLevel > 70) return 'bg-red-500';
    if (threatLevel > 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="glass rounded-lg p-3 border border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">{species}</span>
        <span className="text-xs text-muted-foreground">{population}</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-500`}
          style={{ width: `${threatLevel}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        Threat: {threatLevel}%
      </div>
    </div>
  );
}

export default function BiodiversityDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-blue-300">Global Health Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Planetary Resilience"
            value="67.8%"
            status="vulnerable"
            trend={-3.2}
            subtitle="Moderate ecosystem stress"
          />
          <MetricCard
            title="Active Biomes"
            value="14/18"
            status="healthy"
            subtitle="Stable functioning"
          />
          <MetricCard
            title="Critical Zones"
            value="23"
            status="critical"
            trend={8}
            subtitle="Immediate intervention needed"
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-blue-300">Species Threat Assessment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SpeciesThreatCard
            species="Amphibians"
            threatLevel={84}
            population="~8,000 species"
          />
          <SpeciesThreatCard
            species="Coral Reefs"
            threatLevel={76}
            population="~800 species"
          />
          <SpeciesThreatCard
            species="Large Mammals"
            threatLevel={62}
            population="~5,500 species"
          />
          <SpeciesThreatCard
            species="Pollinators"
            threatLevel={58}
            population="~20,000 species"
          />
        </div>
      </div>

      <div className="glass-strong rounded-xl p-4 border border-blue-500/30 glow-blue">
        <h3 className="font-bold text-lg mb-2 text-blue-300">Fragility Score by Region</h3>
        <div className="space-y-3">
          {[
            { region: 'Amazon Basin', score: 89, status: 'critical' },
            { region: 'Arctic Circle', score: 82, status: 'critical' },
            { region: 'Great Barrier Reef', score: 78, status: 'critical' },
            { region: 'Congo Rainforest', score: 65, status: 'vulnerable' },
            { region: 'North America', score: 52, status: 'vulnerable' },
            { region: 'Europe', score: 48, status: 'vulnerable' },
          ].map((item) => (
            <div key={item.region} className="flex items-center justify-between">
              <span className="text-sm">{item.region}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-secondary rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${item.score > 70 ? 'bg-red-500' : 'bg-yellow-500'}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <span className={`text-sm font-medium w-12 ${item.score > 70 ? 'text-red-400' : 'text-yellow-400'}`}>
                  {item.score}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
