import { Shield, Trees, Beaker, MapPin, CheckCircle2, XCircle } from 'lucide-react';

interface ProtocolCardProps {
  icon: React.ReactNode;
  title: string;
  status: 'active' | 'pending' | 'violated';
  coverage: number;
  description: string;
}

function ProtocolCard({ icon, title, status, coverage, description }: ProtocolCardProps) {
  const statusConfig = {
    active: {
      color: 'border-green-500/30 bg-green-500/10',
      textColor: 'text-green-400',
      icon: <CheckCircle2 className="w-5 h-5 text-green-400" />,
      label: 'Active',
    },
    pending: {
      color: 'border-yellow-500/30 bg-yellow-500/10',
      textColor: 'text-yellow-400',
      icon: <Activity className="w-5 h-5 text-yellow-400" />,
      label: 'Pending',
    },
    violated: {
      color: 'border-red-500/30 bg-red-500/10',
      textColor: 'text-red-400',
      icon: <XCircle className="w-5 h-5 text-red-400" />,
      label: 'Violated',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`glass rounded-xl p-4 border ${config.color}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-blue-400">{icon}</div>
          <h3 className="font-bold">{title}</h3>
        </div>
        <div className="flex items-center gap-1">
          {config.icon}
          <span className={`text-xs ${config.textColor}`}>{config.label}</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-3">{description}</p>

      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground">Global Coverage</span>
          <span className={config.textColor}>{coverage}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${status === 'active' ? 'bg-green-500' : status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${coverage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

interface EnforcementItemProps {
  region: string;
  compliance: number;
  violations: number;
}

function EnforcementItem({ region, compliance, violations }: EnforcementItemProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-blue-400" />
        <span className="text-sm">{region}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className={`text-sm font-medium ${compliance >= 80 ? 'text-green-400' : compliance >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
            {compliance}%
          </div>
          <div className="text-xs text-muted-foreground">Compliance</div>
        </div>
        {violations > 0 && (
          <div className="text-right">
            <div className="text-sm font-medium text-red-400">{violations}</div>
            <div className="text-xs text-muted-foreground">Violations</div>
          </div>
        )}
      </div>
    </div>
  );
}

function Activity({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

export default function PreservationProtocols() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-blue-300">Strategic Directives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProtocolCard
            icon={<Trees className="w-6 h-6" />}
            title="Land Restoration Initiative"
            status="active"
            coverage={67}
            description="Global reforestation and habitat reconstruction across degraded ecosystems"
          />
          <ProtocolCard
            icon={<Beaker className="w-6 h-6" />}
            title="Species Banking Protocol"
            status="active"
            coverage={82}
            description="Genetic preservation and seed vault maintenance for endangered species"
          />
          <ProtocolCard
            icon={<Shield className="w-6 h-6" />}
            title="Protected Zone Expansion"
            status="pending"
            coverage={45}
            description="Expansion of marine and terrestrial conservation areas to 30% global coverage"
          />
          <ProtocolCard
            icon={<Activity className="w-6 h-6" />}
            title="Ecosystem Monitoring Grid"
            status="active"
            coverage={91}
            description="AI-powered sensor network for real-time biodiversity tracking"
          />
        </div>
      </div>

      <div className="glass-strong rounded-xl p-6 border border-border">
        <h3 className="text-xl font-bold mb-4 text-blue-300">Enforcement Mandates</h3>

        <div className="mb-4">
          <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wider">
            Chemical Runoff Compliance
          </h4>
          <div className="space-y-1">
            <EnforcementItem region="North America" compliance={78} violations={12} />
            <EnforcementItem region="Europe" compliance={89} violations={3} />
            <EnforcementItem region="Asia-Pacific" compliance={62} violations={28} />
            <EnforcementItem region="South America" compliance={71} violations={15} />
            <EnforcementItem region="Africa" compliance={54} violations={34} />
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wider">
            Habitat Encroachment
          </h4>
          <div className="space-y-1">
            <EnforcementItem region="Amazon Basin" compliance={43} violations={89} />
            <EnforcementItem region="Congo Rainforest" compliance={58} violations={45} />
            <EnforcementItem region="Southeast Asia" compliance={51} violations={67} />
            <EnforcementItem region="Arctic Regions" compliance={94} violations={2} />
            <EnforcementItem region="Oceania" compliance={82} violations={8} />
          </div>
        </div>
      </div>
    </div>
  );
}
