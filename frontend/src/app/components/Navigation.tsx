import { motion, AnimatePresence } from 'motion/react';
import { Eye, Droplet, TrendingUp, Radio, X, Menu, Bell } from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function SideNavigation({ currentPage, onNavigate }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: Eye },
    { id: 'risk-map', label: 'Risk Map', icon: Droplet },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'stations', label: 'Eco-Intel', icon: Radio },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-50 lg:hidden glass-strong p-3 rounded-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop Sidebar - Always Visible */}
      <div className="hidden lg:block fixed right-0 top-0 h-full w-80 glass-strong border-l border-outline-variant z-40">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-outline-variant">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-container to-secondary glow-cyan flex items-center justify-center">
                <Radio className="w-6 h-6 text-on-primary" />
              </div>
              <div>
                <div className="font-bold text-on-surface">ORBITAL NODE 01</div>
                <div className="text-xs text-primary-container uppercase tracking-wider">
                  System Administrator
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-6 space-y-2">
            <div className="text-label-caps text-on-surface-variant mb-4">Navigation</div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary-container/20 text-primary-container border border-primary-container/30'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium uppercase text-sm tracking-wider">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Emergency Alert Button */}
          <div className="p-6 border-t border-outline-variant">
            <button className="w-full px-6 py-4 bg-error-container/20 hover:bg-error-container/30 border-2 border-error text-error rounded-lg transition-all glow-red flex items-center justify-center gap-2">
              <Bell className="w-5 h-5" />
              <span className="font-bold uppercase tracking-wider">Emergency Alert</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar - Slides In */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="lg:hidden fixed right-0 top-0 h-full w-80 glass-strong border-l border-outline-variant z-40 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-outline-variant">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-container to-secondary glow-cyan flex items-center justify-center">
                  <Radio className="w-6 h-6 text-on-primary" />
                </div>
                <div>
                  <div className="font-bold text-on-surface">ORBITAL NODE 01</div>
                  <div className="text-xs text-primary-container uppercase tracking-wider">
                    System Administrator
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 p-6 space-y-2">
              <div className="text-label-caps text-on-surface-variant mb-4">Navigation</div>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-primary-container/20 text-primary-container border border-primary-container/30'
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium uppercase text-sm tracking-wider">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Emergency Alert Button */}
            <div className="p-6 border-t border-outline-variant">
              <button className="w-full px-6 py-4 bg-error-container/20 hover:bg-error-container/30 border-2 border-error text-error rounded-lg transition-all glow-red flex items-center justify-center gap-2">
                <Bell className="w-5 h-5" />
                <span className="font-bold uppercase tracking-wider">Emergency Alert</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
    </>
  );
}

export function BottomNavigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Eye },
    { id: 'risk-map', label: 'Risk Map', icon: Droplet },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'stations', label: 'Eco-Intel', icon: Radio },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-strong border-t border-outline-variant z-30">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all ${
                  isActive
                    ? 'text-primary-container'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs uppercase tracking-wider font-medium">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
