import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';

interface ScanUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScanUploadModal({ isOpen, onClose }: ScanUploadModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        startScan();
      };
      reader.readAsDataURL(file);
    }
  };

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-strong rounded-2xl p-6 max-w-lg w-full border border-primary-container/30 relative">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full glass border border-outline-variant hover:border-error/50 transition-all"
              >
                <X className="w-4 h-4 text-on-surface" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <h2 className="text-headline-md text-on-surface mb-2">Initiate Environmental Scan</h2>
                <p className="text-sm text-on-surface-variant">
                  Capture or upload an image of your environment to scan for biodiversity risks and fragility indicators.
                </p>
              </div>

              {/* Upload options */}
              {!selectedImage ? (
                <div className="space-y-4">
                  {/* Camera button */}
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="w-full glass rounded-xl p-6 border border-primary-container/30 hover:border-primary-container/60 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center group-hover:bg-primary-container/20 transition-all">
                        <Camera className="w-6 h-6 text-primary-container" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-on-surface">Open Camera</div>
                        <div className="text-sm text-on-surface-variant">Capture environment in real-time</div>
                      </div>
                    </div>
                  </button>
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {/* File upload button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full glass rounded-xl p-6 border border-secondary/30 hover:border-secondary/60 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-all">
                        <Upload className="w-6 h-6 text-secondary" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-on-surface">Upload from Files</div>
                        <div className="text-sm text-on-surface-variant">Select from gallery or files</div>
                      </div>
                    </div>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Preview */}
                  <div className="relative rounded-xl overflow-hidden border border-outline-variant">
                    <img src={selectedImage} alt="Scan preview" className="w-full h-64 object-cover" />
                    {isScanning && (
                      <div className="absolute inset-0 bg-gradient-to-b from-primary-container/20 via-transparent to-secondary/20 flex items-center justify-center">
                        <motion.div
                          className="absolute inset-0 border-2 border-primary-container"
                          animate={{
                            opacity: [0.3, 0.8, 0.3],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                          }}
                        />
                        <div className="text-center glass-strong rounded-lg p-4">
                          <div className="text-label-caps text-primary-container mb-2">Scanning...</div>
                          <div className="text-sm text-on-surface-variant">Analyzing biodiversity markers</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Scan results */}
                  {!isScanning && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <div className="glass rounded-lg p-4 border border-secondary/30">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-secondary" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-on-surface">Species Detected</div>
                            <div className="text-xs text-on-surface-variant">12 flora, 5 fauna markers identified</div>
                          </div>
                          <div className="text-xl font-bold text-secondary">17</div>
                        </div>
                      </div>
                      <div className="glass rounded-lg p-4 border border-tertiary-container/30">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-tertiary-container/20 flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-tertiary-container" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-on-surface">Fragility Index</div>
                            <div className="text-xs text-on-surface-variant">Moderate risk detected</div>
                          </div>
                          <div className="text-xl font-bold text-tertiary-container">54%</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="flex-1 glass rounded-lg px-4 py-3 border border-outline-variant hover:border-outline transition-all text-sm font-medium text-on-surface"
                    >
                      Scan Another
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 bg-primary-container/20 rounded-lg px-4 py-3 border border-primary-container hover:bg-primary-container/30 transition-all text-sm font-medium text-primary-container"
                    >
                      View Full Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
