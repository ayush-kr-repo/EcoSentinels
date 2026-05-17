import { useState } from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingDown, Activity, Camera, FileText } from 'lucide-react';
import Realistic3DEarth from './Realistic3DEarth';
import ScanUploadModal from './ScanUploadModal';
import ProtocolsModal from './ProtocolsModal';

const biodiversityData = [
  { year: '2017', value: 78, fill: '#4ae176' },
  { year: '2018', value: 75, fill: '#4ae176' },
  { year: '2019', value: 71, fill: '#6bff8f' },
  { year: '2020', value: 68, fill: '#ffd546' },
  { year: '2021', value: 64, fill: '#ffd546' },
  { year: '2022', value: 59, fill: '#ffe083' },
  { year: '2023', value: 54, fill: '#ffb4ab' },
  { year: '2024', value: 48, fill: '#ffb4ab' },
  { year: '2025', value: 43, fill: '#ffb4ab' },
  { year: '2026', value: 38, fill: '#ff8a80' },
];

interface AlertCardProps {
  icon: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  location: string;
}

function AlertCard({ icon, title, description, location }: AlertCardProps) {
  const iconConfig = {
    critical: { Icon: AlertTriangle, color: 'text-error', bg: 'bg-error-container/10', border: 'border-error/50' },
    warning: { Icon: TrendingDown, color: 'text-tertiary-container', bg: 'bg-tertiary/10', border: 'border-tertiary-container/50' },
    info: { Icon: Activity, color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/50' },
  };

  const config = iconConfig[icon];
  const IconComponent = config.Icon;

  return (
    <div className={`glass rounded-xl p-4 border ${config.border} ${config.bg}`}>
      <div className="flex items-start gap-3">
        <div className={`${config.color} mt-0.5`}>
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-on-surface mb-1">{title}</h4>
          <p className="text-sm text-on-surface-variant mb-2">{description}</p>
          <div className="text-xs text-data-mono text-on-surface-variant">{location}</div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isProtocolsModalOpen, setIsProtocolsModalOpen] = useState(false);

  return (
    <div className="space-y-8 pb-24">
      <ScanUploadModal isOpen={isScanModalOpen} onClose={() => setIsScanModalOpen(false)} />
      <ProtocolsModal isOpen={isProtocolsModalOpen} onClose={() => setIsProtocolsModalOpen(false)} />
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-label-caps text-primary-container mb-2">
          Ecosystem Fragility Analysis
        </div>
        <h1 className="text-headline-lg text-on-surface">Neural Modeling Score</h1>
      </motion.div>

      {/* Main Score Card with 3D Earth */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-strong rounded-2xl p-8 border border-primary-container/20 glow-cyan"
      >
        <div className="flex flex-col items-center">
          {/* 3D Earth Model */}
          <div className="w-full max-w-md mb-8">
            <Realistic3DEarth />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6 w-full max-w-md">
            <div className="text-center">
              <div className="text-2xl font-bold text-on-surface">94.5%</div>
              <div className="text-xs text-label-caps text-on-surface-variant mt-1">
                Accuracy
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-on-surface">54,602</div>
              <div className="text-xs text-label-caps text-on-surface-variant mt-1">
                Data Points
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 w-full max-w-md mt-8">
            <button
              onClick={() => setIsScanModalOpen(true)}
              className="flex-1 glass rounded-xl px-6 py-4 border border-primary-container/30 hover:border-primary-container/60 transition-all group"
            >
              <div className="flex items-center justify-center gap-2">
                <Camera className="w-5 h-5 text-primary-container group-hover:scale-110 transition-transform" />
                <span className="font-medium text-on-surface">Initiate Scan</span>
              </div>
            </button>
            <button
              onClick={() => setIsProtocolsModalOpen(true)}
              className="flex-1 glass rounded-xl px-6 py-4 border border-secondary/30 hover:border-secondary/60 transition-all group"
            >
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform" />
                <span className="font-medium text-on-surface">View Protocols</span>
              </div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Biodiversity Drift Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl p-6 border border-outline-variant"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-headline-md text-on-surface mb-1">
              Biodiversity Drift Timeline
            </h3>
            <p className="text-sm text-on-surface-variant">(2017-2026)</p>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary"></div>
            <div className="w-3 h-3 rounded-full bg-tertiary-container"></div>
            <div className="w-3 h-3 rounded-full bg-error"></div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={biodiversityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(132, 148, 149, 0.1)" vertical={false} />
            <XAxis
              dataKey="year"
              stroke="#b9cacb"
              style={{ fontSize: '12px', fontFamily: 'Space Grotesk' }}
            />
            <YAxis
              stroke="#b9cacb"
              style={{ fontSize: '12px', fontFamily: 'Space Grotesk' }}
              domain={[0, 100]}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Early Warning Cluster */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-error" />
          <h3 className="text-headline-md text-on-surface">Early Warning Cluster</h3>
        </div>

        <div className="space-y-3">
          <AlertCard
            icon="critical"
            title="Microbiome Collapse"
            description="Symbiotic fungi networks degraded by 44% in the last 12 hours. Immediate intervention required."
            location="Amazon Basin • Detected 3h ago"
          />
          <AlertCard
            icon="warning"
            title="Hydraulic Stress"
            description="Target pressure declining in 85% of monitored aquifers. Groundwater depletion accelerating."
            location="Central Valley, California • Detected 8h ago"
          />
          <AlertCard
            icon="info"
            title="Drone Swarm Beta"
            description="Autonomous reforestation units have planted 2,000 saplings. Tap to initialize deep scan."
            location="Congo Basin • Completed 1d ago"
          />
        </div>
      </motion.div>

      {/* System Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="glass rounded-lg p-4">
          <div className="text-label-caps text-on-surface-variant mb-2">Active Stations</div>
          <div className="text-2xl font-bold text-primary-container">12,840</div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="text-label-caps text-on-surface-variant mb-2">Species Indexed</div>
          <div className="text-2xl font-bold text-secondary">2.1M</div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="text-label-caps text-on-surface-variant mb-2">Risk Threshold</div>
          <div className="text-2xl font-bold text-error">342</div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="text-label-caps text-on-surface-variant mb-2">AI Confidence</div>
          <div className="text-2xl font-bold text-on-surface">99.8%</div>
        </div>
      </motion.div>
    </div>
  );
}
