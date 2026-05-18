import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import {
  Brain,
  TrendingDown,
  Zap,
  Leaf,
  Loader2,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  fetchInsightsAnalysis,
  INSIGHTS_LOCATIONS,
  type InsightsAnalysisResponse,
} from '../lib/insightsApi';

interface InsightCardProps {
  icon: React.ReactNode;
  title: string;
  metric: string;
  change: string;
  trend: 'up' | 'down';
  severity: 'critical' | 'warning' | 'info';
}

function InsightCard({
  icon,
  title,
  metric,
  change,
  trend,
  severity,
}: InsightCardProps) {
  const severityColors = {
    critical: 'border-error/30 bg-error-container/5',
    warning: 'border-tertiary-container/30 bg-tertiary/5',
    info: 'border-primary-container/30 bg-primary-container/5',
  };

  return (
    <div className={`glass rounded-xl p-5 border ${severityColors[severity]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="text-primary-container">{icon}</div>
        <div
          className={`flex items-center gap-1 text-sm ${
            trend === 'down' ? 'text-error' : 'text-secondary'
          }`}
        >
          <TrendingDown
            className={`w-4 h-4 ${trend === 'up' ? 'rotate-180' : ''}`}
          />
          <span className="font-medium">{change}</span>
        </div>
      </div>
      <div className="text-label-caps text-on-surface-variant mb-2">
        {title}
      </div>
      <div className="text-3xl font-bold text-on-surface">{metric}</div>
    </div>
  );
}

function severityStyle(level?: string) {
  switch (level) {
    case 'critical':
      return 'bg-error-container/20 text-error';
    case 'high':
      return 'bg-error-container/10 text-error';
    case 'moderate':
      return 'bg-tertiary/20 text-tertiary-container';
    default:
      return 'bg-secondary/20 text-secondary';
  }
}

export default function InsightsPage() {
  const [selectedLocationId, setSelectedLocationId] = useState(
    INSIGHTS_LOCATIONS[0].id,
  );
  const [analysis, setAnalysis] = useState<InsightsAnalysisResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);

  const selectedLocation =
    INSIGHTS_LOCATIONS.find((item) => item.id === selectedLocationId) ??
    INSIGHTS_LOCATIONS[0];

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchInsightsAnalysis(selectedLocation);
        if (mounted) {
          setAnalysis(result);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : 'Unable to load live insights',
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [selectedLocation]);

  const trendData = useMemo(() => {
    const severity = analysis?.overall_severity ?? 'low';
    const aqi = analysis?.air_quality?.aqi ?? 80;
    const temp = analysis?.weather?.temperature_c ?? 28;

    const severityConfig = {
      low: { start: 84, drop: 10 },
      moderate: { start: 81, drop: 14 },
      high: { start: 78, drop: 18 },
      critical: { start: 75, drop: 24 },
    } as const;

    const config = severityConfig[severity];

    const aqiPressure = Math.min(12, Math.floor(aqi / 80));
    const heatPressure = temp >= 38 ? 5 : temp >= 34 ? 3 : temp >= 30 ? 2 : 0;

    const totalDrop = config.drop + aqiPressure + heatPressure;
    const start = config.start - Math.min(6, Math.floor(aqi / 150));

    const points = [
      start,
      start - Math.round(totalDrop * 0.12),
      start - Math.round(totalDrop * 0.28),
      start - Math.round(totalDrop * 0.52),
      start - Math.round(totalDrop * 0.76),
      start - totalDrop,
    ].map((value) => Math.max(52, Math.min(86, value)));

    return [
      { month: 'Jan', biodiversity: points[0], temperature: temp - 2.0 },
      { month: 'Feb', biodiversity: points[1], temperature: temp - 1.5 },
      { month: 'Mar', biodiversity: points[2], temperature: temp - 1.0 },
      { month: 'Apr', biodiversity: points[3], temperature: temp - 0.6 },
      { month: 'May', biodiversity: points[4], temperature: temp - 0.3 },
      { month: 'Jun', biodiversity: points[5], temperature: temp },
    ];
  }, [analysis]);

  const lineColor = useMemo(() => {
    switch (analysis?.overall_severity) {
      case 'critical':
        return '#ef4444';
      case 'high':
        return '#f97316';
      case 'moderate':
        return '#facc15';
      default:
        return '#4ae176';
    }
  }, [analysis]);

  const fragilityMetric = useMemo(() => {
    const aqi = analysis?.air_quality?.aqi ?? 80;
    return `${Math.min(99, Math.max(12, Math.round(aqi / 4)))}%`;
  }, [analysis]);

  const resilienceMetric = useMemo(() => {
    const aqi = analysis?.air_quality?.aqi ?? 80;
    return `${Math.max(12, 100 - Math.round(aqi / 3))}`;
  }, [analysis]);

  const summaryText =
    analysis?.summary ?? 'Waiting for live environmental analysis.';
  const riskFlags = analysis?.risk_flags ?? [];

  return (
    <div className="space-y-8 pb-24">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-label-caps text-primary-container mb-2">
          Neural Analysis Engine
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-headline-lg text-on-surface">
              Predictive Insights
            </h1>
            <p className="text-body-md text-on-surface-variant mt-2">
              AI-powered trend detection and ecosystem collapse forecasting.
            </p>
          </div>

          <div className="w-full md:w-[280px]">
            <label className="text-label-caps text-on-surface-variant mb-2 block">
              Monitoring Location
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLocationMenuOpen((open) => !open)}
                className="w-full rounded-xl border border-outline-variant bg-surface-container/60 px-4 py-3 text-sm text-on-surface outline-none transition-all hover:border-primary-container/40 focus:border-primary-container/60 flex items-center justify-between"
              >
                <span>{selectedLocation.label}</span>
                <ChevronDown
                  className={`h-4 w-4 text-on-surface-variant transition-transform ${
                    isLocationMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isLocationMenuOpen && (
                <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-outline-variant bg-[#102131] shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                  {INSIGHTS_LOCATIONS.map((location) => {
                    const isActive = location.id === selectedLocationId;

                    return (
                      <button
                        key={location.id}
                        type="button"
                        onClick={() => {
                          setSelectedLocationId(location.id);
                          setIsLocationMenuOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                          isActive
                            ? 'bg-primary-container/20 text-primary-container'
                            : 'text-on-surface hover:bg-white/5'
                        }`}
                      >
                        {location.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {isLoading && (
        <div className="glass rounded-xl p-6 border border-primary-container/30 flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary-container" />
          <span className="text-on-surface-variant">
            Loading live environmental analysis...
          </span>
        </div>
      )}

      {error && (
        <div className="glass rounded-xl p-6 border border-error/40 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-error mt-0.5" />
          <div>
            <div className="font-bold text-error mb-1">Insights unavailable</div>
            <div className="text-sm text-on-surface-variant">{error}</div>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <InsightCard
          icon={<Leaf className="w-6 h-6" />}
          title="Fragility Index"
          metric={fragilityMetric}
          change={
            analysis?.air_quality?.aqi ? `AQI ${analysis.air_quality.aqi}` : '+0.0%'
          }
          trend="down"
          severity={
            analysis?.overall_severity === 'critical' ||
            analysis?.overall_severity === 'high'
              ? 'critical'
              : 'warning'
          }
        />
        <InsightCard
          icon={<Zap className="w-6 h-6" />}
          title="Ecosystem Resilience"
          metric={resilienceMetric}
          change={
            analysis?.weather?.temperature_c
              ? `${analysis.weather.temperature_c}°C`
              : '-0.0'
          }
          trend="down"
          severity={analysis?.overall_severity === 'moderate' ? 'warning' : 'info'}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-strong rounded-2xl p-6 border border-primary-container/20 glow-cyan"
      >
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary-container" />
            <h3 className="text-headline-md text-on-surface">
              6-Month Biodiversity Trend
            </h3>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${severityStyle(
              analysis?.overall_severity,
            )}`}
          >
            {analysis?.overall_severity ?? 'live'}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <defs>
              <linearGradient id="biodiversityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(132, 148, 149, 0.1)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="#b9cacb"
              style={{ fontSize: '12px', fontFamily: 'Space Grotesk' }}
            />
            <YAxis
              stroke="#b9cacb"
              style={{ fontSize: '12px', fontFamily: 'Space Grotesk' }}
              domain={[52, 86]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(18, 33, 49, 0.95)',
                border: '1px solid rgba(132, 148, 149, 0.2)',
                borderRadius: '8px',
                fontFamily: 'Inter',
              }}
            />
            <Line
              type="monotone"
              dataKey="biodiversity"
              stroke={lineColor}
              strokeWidth={3}
              dot={{ fill: lineColor, r: 4 }}
              activeDot={{ r: 6, fill: lineColor }}
              fill="url(#biodiversityGradient)"
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 pt-4 border-t border-outline-variant/30 text-sm text-on-surface-variant">
          {summaryText}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-headline-md text-on-surface mb-4">Live Risk Signals</h3>
        <div className="space-y-3">
          {riskFlags.length > 0 ? (
            riskFlags.slice(0, 3).map((flag, index) => (
              <div
                key={index}
                className="glass rounded-xl p-4 border border-outline-variant"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-bold text-on-surface">Signal {index + 1}</div>
                  <div
                    className={`px-2 py-1 rounded text-xs font-bold uppercase ${severityStyle(
                      analysis?.overall_severity,
                    )}`}
                  >
                    {analysis?.overall_severity ?? 'live'}
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant">{flag}</p>
              </div>
            ))
          ) : (
            <div className="glass rounded-xl p-4 border border-outline-variant">
              <p className="text-sm text-on-surface-variant">
                No live risk flags returned yet.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-xl p-6 border border-outline-variant"
      >
        <h3 className="text-headline-md text-on-surface mb-4">
          Live Monitoring Snapshot
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-label-caps text-on-surface-variant mb-1">
              Location
            </div>
            <div className="text-xl font-bold text-on-surface">
              {analysis?.location ?? selectedLocation.label}
            </div>
          </div>
          <div>
            <div className="text-label-caps text-on-surface-variant mb-1">
              Weather
            </div>
            <div className="text-xl font-bold text-on-surface">
              {analysis?.weather?.weather_description ?? 'Monitoring'}
            </div>
          </div>
          <div>
            <div className="text-label-caps text-on-surface-variant mb-1">AQI</div>
            <div className="text-xl font-bold text-primary-container">
              {analysis?.air_quality?.aqi ?? 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-label-caps text-on-surface-variant mb-1">
              Temperature
            </div>
            <div className="text-xl font-bold text-on-surface">
              {analysis?.weather?.temperature_c != null
                ? `${analysis.weather.temperature_c}°C`
                : 'N/A'}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}