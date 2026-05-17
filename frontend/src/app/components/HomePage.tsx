import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

interface HomePageProps {
  onNavigate?: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="max-w-6xl w-full mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-label-caps text-primary-container"
              >
                Live Biometric Monitoring
              </motion.div>
              <h1 className="text-display-hero text-on-surface">
                Predicting{" "}
                <span className="text-primary-container">Ecosystem</span>{" "}
                Collapse Before It Happens.
              </h1>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-body-lg text-on-surface-variant max-w-xl"
            >
              Harnessing satellite telemetries and organic sensor arrays to map
              the drift of planetary health. Join the orbital stewards in
              real-time ecological defense.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => onNavigate?.('stations')}
                className="px-8 py-4 bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container rounded-lg transition-all glow-cyan flex items-center gap-2 group"
              >
                <span className="font-medium uppercase tracking-wider text-sm">
                  Initiate Scan
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate?.('dashboard')}
                className="px-8 py-4 glass hover:glass-strong text-on-surface rounded-lg transition-all border border-outline-variant hover:border-primary-container/50 flex items-center gap-2"
              >
                <span className="font-medium uppercase tracking-wider text-sm">
                  View Protocols
                </span>
              </button>
            </motion.div>

            {/* System Diagnostics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="pt-8 border-t border-outline-variant/30"
            >
              <div className="text-label-caps text-on-surface-variant mb-4">
                System Diagnostics
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-lg p-4">
                  <div className="text-label-caps text-on-surface-variant mb-1">
                    Fragility Index
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-tertiary-container">
                      84.2
                    </span>
                    <span className="text-sm text-on-surface-variant">%</span>
                  </div>
                  <div className="text-xs text-error mt-1">
                    Critical threshold reached
                  </div>
                </div>
                <div className="glass rounded-lg p-4">
                  <div className="text-label-caps text-on-surface-variant mb-1">
                    Biome Health
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-secondary">72</span>
                    <span className="text-sm text-on-surface-variant">%</span>
                  </div>
                  <div className="text-xs text-secondary">Optimal</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Realistic Globe Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-[500px] mx-auto">
              {/* Outer glow rings */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary-container/20"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border border-primary-container/10"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />

              {/* Realistic Earth */}
              <div className="absolute inset-[10%] rounded-full overflow-hidden">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    backgroundImage:
                      "url('https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "50%",
                    boxShadow:
                      "0 0 80px rgba(0, 240, 255, 0.4), inset 0 0 80px rgba(0, 0, 0, 0.6)",
                    animation: "spin 120s linear infinite",
                  }}
                />

                {/* Ecosystem overlays */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `
                      radial-gradient(ellipse at 30% 40%, rgba(74, 225, 118, 0.3) 0%, transparent 35%),
                      radial-gradient(ellipse at 60% 55%, rgba(255, 213, 70, 0.3) 0%, transparent 30%),
                      radial-gradient(ellipse at 75% 35%, rgba(255, 180, 171, 0.4) 0%, transparent 25%)
                    `,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                />
              </div>

              {/* Fragility Score Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
                className="absolute -right-4 top-1/4 glass-strong rounded-xl p-4 border border-tertiary-container/30 glow-yellow"
              >
                <div className="text-label-caps text-on-surface-variant mb-1">
                  Fragility Score
                </div>
                <div className="text-4xl font-bold text-tertiary-container">78%</div>
                <div className="text-xs text-on-surface-variant mt-1">Critical</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
