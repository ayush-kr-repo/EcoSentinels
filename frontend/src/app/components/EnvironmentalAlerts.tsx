import { Activity, Droplets, Wind, Zap, ThermometerSun } from 'lucide-react';

interface AlertProps {
  icon: React.ReactNode;
  title: string;
  location: string;
  severity: 'critical' | 'warning' | 'info';
  time: string;
}

function AlertItem({ icon, title, location, severity, time }: AlertProps) {
  const severityColors = {
    critical: 'border-l-red-500 bg-red-500/5',
    warning: 'border-l-yellow-500 bg-yellow-500/5',
    info: 'border-l-blue-500 bg-blue-500/5',
  };

  return (
    <div className={`glass rounded-lg p-3 border-l-4 ${severityColors[severity]}`}>
      <div className="flex items-start gap-3">
        <div className="text-blue-400 mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium mb-1">{title}</h4>
          <p className="text-xs text-muted-foreground">{location}</p>
          <p className="text-xs text-muted-foreground mt-1">{time}</p>
        </div>
      </div>
    </div>
  );
}

export default function EnvironmentalAlerts() {
  return (
    <div className="glass-strong rounded-xl p-6 border border-border h-full">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-blue-400" />
        <h2 className="text-xl font-bold text-blue-300">Live Environmental Feed</h2>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent">
        <AlertItem
          icon={<ThermometerSun className="w-5 h-5" />}
          title="Temperature Anomaly Detected"
          location="Eastern Mediterranean Sea"
          severity="critical"
          time="12 minutes ago"
        />
        <AlertItem
          icon={<Droplets className="w-5 h-5" />}
          title="Heavy Rainfall - Flood Risk"
          location="Bangladesh Delta Region"
          severity="warning"
          time="1 hour ago"
        />
        <AlertItem
          icon={<Wind className="w-5 h-5" />}
          title="Air Quality Index - Hazardous"
          location="New Delhi, India"
          severity="critical"
          time="2 hours ago"
        />
        <AlertItem
          icon={<Zap className="w-5 h-5" />}
          title="Wildfire Ignition Risk - Extreme"
          location="California Coast, USA"
          severity="warning"
          time="3 hours ago"
        />
        <AlertItem
          icon={<Droplets className="w-5 h-5" />}
          title="Groundwater Depletion Alert"
          location="Punjab Region, India"
          severity="warning"
          time="5 hours ago"
        />
        <AlertItem
          icon={<ThermometerSun className="w-5 h-5" />}
          title="Heatwave Onset - Duration 7+ days"
          location="Southern Europe"
          severity="critical"
          time="8 hours ago"
        />
        <AlertItem
          icon={<Wind className="w-5 h-5" />}
          title="Dust Storm Formation"
          location="Sahara Desert, North Africa"
          severity="info"
          time="12 hours ago"
        />
        <AlertItem
          icon={<Droplets className="w-5 h-5" />}
          title="Glacier Melt Acceleration"
          location="Greenland Ice Sheet"
          severity="critical"
          time="1 day ago"
        />
        <AlertItem
          icon={<Activity className="w-5 h-5" />}
          title="Ocean Acidification Spike"
          location="Coral Triangle, Pacific"
          severity="warning"
          time="1 day ago"
        />
        <AlertItem
          icon={<Wind className="w-5 h-5" />}
          title="Deforestation Rate Increase"
          location="Congo Basin, DRC"
          severity="critical"
          time="2 days ago"
        />
      </div>
    </div>
  );
}
