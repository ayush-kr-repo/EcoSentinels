import { motion } from 'motion/react';
import { Brain, TrendingDown, Zap, Leaf } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const trendData = [
  { month: 'Jan', biodiversity: 78, temperature: 1.2 },
  { month: 'Feb', biodiversity: 76, temperature: 1.3 },
  { month: 'Mar', biodiversity: 74, temperature: 1.5 },
  { month: 'Apr', biodiversity: 71, temperature: 1.6 },
  { month: 'May', biodiversity: 68, temperature: 1.8 },
  { month: 'Jun', biodiversity: 65, temperature: 2.0 },
];

interface InsightCardProps {
  icon: React.ReactNode;
  title: string;
  metric: string;
  change: string;
  trend: 'up' | 'down';
  severity: 'critical' | 'warning' | 'info';
}

function InsightCard({ icon, title, metric, change, trend, severity }: InsightCardProps) {
  const severityColors = {
    critical: 'border-error/30 bg-error-container/5',
    warning: 'border-tertiary-container/30 bg-tertiary/5',
    info: 'border-primary-container/30 bg-primary-container/5',
  };

  return (
    <div className={`glass rounded-xl p-5 border ${severityColors[severity]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="text-primary-container">{icon}</div>
        <div className={`flex items-center gap-1 text-sm ${trend === 'down' ? 'text-error' : 'text-secondary'}`}>
          <TrendingDown className={`w-4 h-4 ${trend === 'up' ? 'rotate-180' : ''}`} />
          <span className="font-medium">{change}</span>
        </div>
      </div>
      <div className="text-label-caps text-on-surface-variant mb-2">{title}</div>
      <div className="text-3xl font-bold text-on-surface">{metric}</div>
    </div>
  );
}

export default function InsightsPage() {
  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-label-caps text-primary-container mb-2">
          Neural Analysis Engine
        </div>
        <h1 className="text-headline-lg text-on-surface">Predictive Insights</h1>
        <p className="text-body-md text-on-surface-variant mt-2">
          AI-powered trend detection and ecosystem collapse forecasting.
        </p>
      </motion.div>

      {/* Key Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <InsightCard
          icon={<Leaf className="w-6 h-6" />}
          title="Biomass Decline Rate"
          metric="3.2%"
          change="+0.8%"
          trend="down"
          severity="critical"
        />
        <InsightCard
          icon={<Zap className="w-6 h-6" />}
          title="Ecosystem Resilience"
          metric="64.5"
          change="-4.2"
          trend="down"
          severity="warning"
        />
      </motion.div>

      {/* Biodiversity Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-strong rounded-2xl p-6 border border-primary-container/20 glow-cyan"
      >
        <div className="flex items-center gap-2 mb-6">
          <Brain className="w-6 h-6 text-primary-container" />
          <h3 className="text-headline-md text-on-surface">6-Month Biodiversity Trend</h3>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <defs>
              <linearGradient id="biodiversityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ae176" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4ae176" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(132, 148, 149, 0.1)" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#b9cacb"
              style={{ fontSize: '12px', fontFamily: 'Space Grotesk' }}
            />
            <YAxis
              stroke="#b9cacb"
              style={{ fontSize: '12px', fontFamily: 'Space Grotesk' }}
              domain={[60, 80]}
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
              stroke="#4ae176"
              strokeWidth={3}
              dot={{ fill: '#4ae176', r: 4 }}
              activeDot={{ r: 6 }}
              fill="url(#biodiversityGradient)"
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 pt-4 border-t border-outline-variant/30">
          <div className="text-sm text-on-surface-variant">
            <span className="text-error font-medium">↓ 13% decline</span> in global biodiversity
            health over the past 6 months. Acceleration pattern detected.
          </div>
        </div>
      </motion.div>

      {/* AI Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-headline-md text-on-surface mb-4">Next 30 Days Forecast</h3>
        <div className="space-y-3">
          <div className="glass rounded-xl p-4 border border-error/30">
            <div className="flex items-start justify-between mb-2">
              <div className="font-bold text-on-surface">Amazon Tipping Point</div>
              <div className="px-2 py-1 bg-error-container/20 rounded text-xs text-error font-bold">
                HIGH
              </div>
            </div>
            <p className="text-sm text-on-surface-variant mb-2">
              48% probability of irreversible ecosystem shift in Northern Amazon by June 2026.
            </p>
            <div className="text-xs text-data-mono text-primary-container">
              AI CONFIDENCE: 92.4%
            </div>
          </div>

          <div className="glass rounded-xl p-4 border border-tertiary-container/30">
            <div className="flex items-start justify-between mb-2">
              <div className="font-bold text-on-surface">Arctic Methane Release</div>
              <div className="px-2 py-1 bg-tertiary/20 rounded text-xs text-tertiary-container font-bold">
                MEDIUM
              </div>
            </div>
            <p className="text-sm text-on-surface-variant mb-2">
              Permafrost thaw acceleration could trigger feedback loop. 34% probability spike.
            </p>
            <div className="text-xs text-data-mono text-primary-container">
              AI CONFIDENCE: 87.1%
            </div>
          </div>

          <div className="glass rounded-xl p-4 border border-secondary/30">
            <div className="flex items-start justify-between mb-2">
              <div className="font-bold text-on-surface">Ocean Alkalinity Shift</div>
              <div className="px-2 py-1 bg-secondary/20 rounded text-xs text-secondary font-bold">
                LOW
              </div>
            </div>
            <p className="text-sm text-on-surface-variant mb-2">
              pH stabilization detected in 12 monitoring zones. Positive intervention signal.
            </p>
            <div className="text-xs text-data-mono text-primary-container">
              AI CONFIDENCE: 79.8%
            </div>
          </div>
        </div>
      </motion.div>

      {/* Model Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-xl p-6 border border-outline-variant"
      >
        <h3 className="text-headline-md text-on-surface mb-4">Neural Model Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-label-caps text-on-surface-variant mb-1">Accuracy</div>
            <div className="text-2xl font-bold text-secondary">94.2%</div>
          </div>
          <div>
            <div className="text-label-caps text-on-surface-variant mb-1">Data Points</div>
            <div className="text-2xl font-bold text-on-surface">8.4M</div>
          </div>
          <div>
            <div className="text-label-caps text-on-surface-variant mb-1">Model Version</div>
            <div className="text-2xl font-bold text-primary-container">v4.2</div>
          </div>
          <div>
            <div className="text-label-caps text-on-surface-variant mb-1">Last Update</div>
            <div className="text-2xl font-bold text-on-surface">2h</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
