import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { RadarView } from './components/RadarView';
import { MatchmakerView } from './components/MatchmakerView';
import { Bell, ChevronDown } from 'lucide-react';

type ViewState = 'opportunities' | 'matchmaker';

function App() {
  const [activeView, setActiveView] = useState<ViewState>('opportunities');

  return (
    <div className="flex bg-[#F4F7FB] min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900 bg-mesh">
      {/* Sidebar with dark theme */}
      <Sidebar activeView={activeView} onNavigate={setActiveView} />

      {/* Main Content Area */}
      <main className="flex-1 ml-[280px] p-10 max-w-[1600px] transition-all duration-300">
        <header className="flex justify-between items-start mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
              {activeView === 'opportunities' ? 'Opportunity Radar' : 'Strategic Matchmaker'}
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              {activeView === 'opportunities'
                ? 'Real-time detection of high-probability outsourcing signals.'
                : 'AI-powered synergy analysis for targeted client acquisition.'}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/30 transition-all shadow-sm relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-10 w-px bg-slate-200"></div>

            <div className="flex items-center gap-3.5 group cursor-pointer p-1 pr-3 rounded-2xl hover:bg-white/50 transition-all">
              <div className="relative">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold text-sm">
                  JD
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-[#F4F7FB] rounded-full"></div>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-black text-slate-900 leading-tight">John Doe</p>
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-tight mt-0.5">Admin Workspace</p>
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 200
            }}
            className="w-full"
          >
            {activeView === 'opportunities' ? (
              <RadarView onEmptyStateAction={() => setActiveView('matchmaker')} />
            ) : (
              <MatchmakerView />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;

