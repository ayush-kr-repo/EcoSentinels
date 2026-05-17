import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, XCircle, Leaf, Droplets, Wind, Trees, Fish, Bird } from 'lucide-react';

interface ProtocolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const protocols = {
  dos: [
    {
      icon: Trees,
      title: 'Preserve Natural Habitats',
      description: 'Maintain existing forests, wetlands, and natural ecosystems without disruption.',
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      icon: Leaf,
      title: 'Support Native Species',
      description: 'Plant indigenous flora and protect native fauna to maintain ecological balance.',
      color: 'text-primary-container',
      bg: 'bg-primary-container/10',
    },
    {
      icon: Droplets,
      title: 'Conserve Water Resources',
      description: 'Practice sustainable water usage and protect natural water bodies from pollution.',
      color: 'text-primary-container',
      bg: 'bg-primary-container/10',
    },
    {
      icon: Wind,
      title: 'Reduce Carbon Footprint',
      description: 'Minimize emissions and support renewable energy to combat climate change.',
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
  ],
  donts: [
    {
      icon: Fish,
      title: 'Avoid Ecosystem Disruption',
      description: 'Never introduce invasive species or pollutants that harm local biodiversity.',
      color: 'text-error',
      bg: 'bg-error/10',
    },
    {
      icon: Trees,
      title: 'Stop Deforestation',
      description: 'Prevent illegal logging and habitat destruction in critical biodiversity zones.',
      color: 'text-error',
      bg: 'bg-error/10',
    },
    {
      icon: Droplets,
      title: 'No Chemical Runoff',
      description: 'Eliminate pesticide and industrial waste discharge into natural water systems.',
      color: 'text-error',
      bg: 'bg-error/10',
    },
    {
      icon: Bird,
      title: 'Prevent Overexploitation',
      description: 'Avoid unsustainable hunting, fishing, or harvesting of natural resources.',
      color: 'text-error',
      bg: 'bg-error/10',
    },
  ],
  driftCauses: [
    'Climate change causing habitat temperature shifts',
    'Pollution introducing toxic substances to ecosystems',
    'Land use changes fragmenting natural habitats',
    'Invasive species outcompeting native organisms',
    'Overexploitation depleting species populations',
    'Ocean acidification affecting marine life',
  ],
};

export default function ProtocolsModal({ isOpen, onClose }: ProtocolsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-strong rounded-2xl max-w-4xl w-full max-h-[90vh] border border-primary-container/30 relative overflow-hidden">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full glass border border-outline-variant hover:border-error/50 transition-all z-10"
              >
                <X className="w-5 h-5 text-on-surface" />
              </button>

              {/* Scrollable content */}
              <div className="overflow-y-auto max-h-[90vh] p-8">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h2 className="text-headline-lg text-on-surface">Biodiversity Preservation Protocols</h2>
                      <p className="text-sm text-on-surface-variant">Essential guidelines for maintaining peaceful biodiversity</p>
                    </div>
                  </div>
                </div>

                {/* DO's Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    <h3 className="text-headline-md text-on-surface">What to DO</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {protocols.dos.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`glass rounded-xl p-5 border border-secondary/20 ${item.bg}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                            <div>
                              <h4 className="font-medium text-on-surface mb-1">{item.title}</h4>
                              <p className="text-sm text-on-surface-variant">{item.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* DON'T's Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle className="w-5 h-5 text-error" />
                    <h3 className="text-headline-md text-on-surface">What NOT to DO</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {protocols.donts.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className={`glass rounded-xl p-5 border border-error/20 ${item.bg}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                            <div>
                              <h4 className="font-medium text-on-surface mb-1">{item.title}</h4>
                              <p className="text-sm text-on-surface-variant">{item.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Understanding Biodiversity Drift */}
                <div className="glass-strong rounded-xl p-6 border border-tertiary-container/30 bg-tertiary-container/5">
                  <h3 className="text-headline-md text-on-surface mb-4 flex items-center gap-2">
                    <Wind className="w-5 h-5 text-tertiary-container" />
                    Understanding Biodiversity Drift
                  </h3>
                  <p className="text-sm text-on-surface-variant mb-4">
                    Biodiversity drift occurs when ecosystems shift from their natural state due to environmental stressors.
                    Common causes include:
                  </p>
                  <div className="space-y-2">
                    {protocols.driftCauses.map((cause, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.05 }}
                        className="flex items-start gap-3 text-sm text-on-surface"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-tertiary-container mt-2 flex-shrink-0" />
                        <span>{cause}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
