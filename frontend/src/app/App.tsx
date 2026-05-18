import { useState } from 'react';
import { motion } from 'motion/react';
import HomePage from './components/HomePage';
import DashboardPage from './components/DashboardPage';
import RiskMapPage from './components/RiskMapPage';
import InsightsPage from './components/InsightsPage';
import EcoIntelligencePage from './components/EcoIntelligencePage';
import { SideNavigation, BottomNavigation } from './components/Navigation';

type PageType = 'home' | 'dashboard' | 'risk-map' | 'insights' | 'stations';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PageType);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Cosmic background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-surface via-surface-dim to-surface-container-lowest pointer-events-none" />

      {/* Atmospheric glow overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at 20% 20%, rgba(0, 240, 255, 0.15), transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(74, 225, 118, 0.1), transparent 50%)',
        }}
      />

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 glass border-b border-outline-variant"
      >
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => setCurrentPage('home')}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
              <h1 className="text-xl font-bold text-primary-container uppercase tracking-wider">
                EcoSentinels
              </h1>
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <div className="glass rounded-full px-4 py-2 border border-secondary/30">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  <span className="text-xs text-secondary font-medium uppercase tracking-wider">
                    System Online
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Side Navigation (Desktop) */}
      <div className="hidden lg:block">
        <SideNavigation currentPage={currentPage} onNavigate={handleNavigate} />
      </div>

      {/* Main Content — pr-20 leaves room for the 64px icon rail */}
      <main className="relative z-10 max-w-screen-2xl mx-auto px-6 py-8 lg:pr-20">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'risk-map' && <RiskMapPage />}
        {currentPage === 'insights' && <InsightsPage />}
        {currentPage === 'stations' && <EcoIntelligencePage />}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <div className="lg:hidden">
        <BottomNavigation currentPage={currentPage} onNavigate={handleNavigate} />
      </div>
    </div>
  );
}