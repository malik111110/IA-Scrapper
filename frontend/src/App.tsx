import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, Target, LayoutDashboard } from 'lucide-react';
import { RadarView } from './components/RadarView';
import { MatchmakerView } from './components/MatchmakerView';

function App() {
  const [activeTab, setActiveTab] = useState<'radar' | 'matchmaker'>('radar');

  return (
    <div className="app-container">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <header className="mb-12 text-center md:text-left flex flex-col md:flex-row md:justify-between md:items-end gap-8">
        <div>
          <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Radar className="text-primary animate-pulse" size={32} />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Intelligence System</span>
          </div>
          <h1>B2B Opportunity Radar</h1>
          <p className="text-text-muted max-w-xl">
            Real-time strategic intelligence platform for detecting high-probability outsourcing signals
            and strategic partnership synergies.
          </p>
        </div>

        <nav className="flex gap-2 p-1.5 glass rounded-2xl">
          <button
            onClick={() => setActiveTab('radar')}
            className={`btn ${activeTab === 'radar' ? 'btn-primary' : 'btn-ghost'}`}
          >
            <LayoutDashboard size={18} />
            Opportunity Radar
          </button>
          <button
            onClick={() => setActiveTab('matchmaker')}
            className={`btn ${activeTab === 'matchmaker' ? 'btn-primary' : 'btn-ghost'}`}
          >
            <Target size={18} />
            Strategic Matchmaker
          </button>
        </nav>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {activeTab === 'radar' ? (
            <motion.div
              key="radar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <RadarView />
            </motion.div>
          ) : (
            <motion.div
              key="matchmaker"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <MatchmakerView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 py-8 border-t border-white/5 text-center">
        <p className="text-text-muted text-xs font-medium uppercase tracking-[0.2em]">
          &copy; 2026 IA-Scrapper Advanced Business Intelligence
        </p>
      </footer>
    </div>
  );
}

export default App;
