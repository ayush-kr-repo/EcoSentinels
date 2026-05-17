import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Brain, TrendingDown, AlertCircle } from 'lucide-react';

const projectionData = [
  { id: 'y2024', year: 2024, health: 72, predicted: null },
  { id: 'y2026', year: 2026, health: 68, predicted: 68 },
  { id: 'y2030', year: 2030, health: null, predicted: 61 },
  { id: 'y2035', year: 2035, health: null, predicted: 54 },
  { id: 'y2040', year: 2040, health: null, predicted: 48 },
  { id: 'y2045', year: 2045, health: null, predicted: 42 },
  { id: 'y2050', year: 2050, health: null, predicted: 38 },
  { id: 'y2055', year: 2055, health: null, predicted: 34 },
  { id: 'y2060', year: 2060, health: null, predicted: 31 },
  { id: 'y2065', year: 2065, health: null, predicted: 28 },
  { id: 'y2070', year: 2070, health: null, predicted: 26 },
  { id: 'y2075', year: 2075, health: null, predicted: 24 },
];

interface EarlyWarningProps {
  title: string;
  severity: 'high' | 'medium' | 'low';
  location: string;
  timestamp: string;
}

function EarlyWarningAlert({ title, severity, location, timestamp }: EarlyWarningProps) {
  const severityColors = {
    high: 'border-red-500/50 bg-red-500/10 text-red-400',
    medium: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400',
    low: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
  };

  return (
    <div className={`rounded-lg p-3 border ${severityColors[severity]} glow-pulse`}>
      <div className="flex items-start gap-2">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium mb-1">{title}</h4>
          <div className="text-xs opacity-80">
            <div>{location}</div>
            <div className="mt-1">{timestamp}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AIPredictiveInsights() {
  return (
    <div className="space-y-6">
      <div className="glass-strong rounded-xl p-6 border border-blue-500/30 glow-blue">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-blue-300">AI Neural Projection</h2>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            50-Year Biodiversity Health Forecast (Deep Learning Model v4.2)
          </p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={projectionData}>
            <defs>
              <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" key="grid" />
            <XAxis
              dataKey="year"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              key="x-axis"
            />
            <YAxis
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
              label={{ value: 'Health Index', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
              key="y-axis"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '8px'
              }}
            />
            <Area
              type="monotone"
              dataKey="health"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#healthGradient)"
              name="Current"
              id="health-area"
            />
            <Area
              type="monotone"
              dataKey="predicted"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#predictedGradient)"
              name="Predicted"
              id="predicted-area"
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="mt-4 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Current Trajectory</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>AI Prediction</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          Early Warning Cluster
        </h3>
        <div className="space-y-3">
          <EarlyWarningAlert
            title="Microbiome Collapse Imminent"
            severity="high"
            location="Amazon Basin, Brazil"
            timestamp="Detected 2h ago • 94% confidence"
          />
          <EarlyWarningAlert
            title="Methane Spike - Permafrost Thaw"
            severity="high"
            location="Arctic Circle, Siberia"
            timestamp="Detected 5h ago • 89% confidence"
          />
          <EarlyWarningAlert
            title="Coral Bleaching Event"
            severity="medium"
            location="Great Barrier Reef, Australia"
            timestamp="Detected 1d ago • 76% confidence"
          />
          <EarlyWarningAlert
            title="Hydraulic Stress - Water Table Drop"
            severity="medium"
            location="Central Valley, California"
            timestamp="Detected 2d ago • 71% confidence"
          />
        </div>
      </div>

      <div className="glass rounded-xl p-4 border border-border">
        <h3 className="font-bold mb-3 text-green-400">Drone Swarm Status</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-green-400">1,247</div>
            <div className="text-xs text-muted-foreground">Active Units</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">3.2M</div>
            <div className="text-xs text-muted-foreground">Trees Planted (2026)</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">89.4%</div>
            <div className="text-xs text-muted-foreground">Mission Success Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">12,450 km²</div>
            <div className="text-xs text-muted-foreground">Restored Area</div>
          </div>
        </div>
      </div>
    </div>
  );
}
