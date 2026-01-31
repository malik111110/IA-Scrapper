import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BrainCircuit, Target, Send, Sparkles, Info } from 'lucide-react';
import { api } from '../services/api';
import { MatchCard } from './MatchCard';
import type { MatchResponse } from '../types';

export const MatchmakerView: React.FC = () => {
    const [query, setQuery] = useState('');
    const [matches, setMatches] = useState<MatchResponse[]>([]);
    const [loading, setLoading] = useState(false);

    const handleRunMatchmaker = async () => {
        if (!query) return;
        setLoading(true);
        try {
            // businessInfo is now optional and handled by backend from DB
            const results = await api.runMatchmaker(query);
            setMatches(results);
        } catch (error) {
            console.error('Matchmaking failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            {/* Input Section */}
            <div className="flex justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="premium-card p-10 bg-white relative overflow-hidden group w-full max-w-2xl"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                        <Target size={160} className="text-blue-600" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-slate-900 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-black/10">
                                <Search size={24} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Search Opportunities</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Enterprise Neural Scan</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="relative">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleRunMatchmaker()}
                                    type="text"
                                    placeholder="e.g. 'Cloud Security Architect' or 'Digital Transformation'"
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-6 pl-16 pr-8 text-lg font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm"
                                />
                            </div>

                            <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
                                <Info size={20} className="text-blue-500 mt-1 shrink-0" />
                                <p className="text-xs font-bold text-blue-800 leading-relaxed uppercase tracking-wider">
                                    The engine will automatically use your <strong>Company Profile</strong> to calculate synergy scores and strategic fit.
                                </p>
                            </div>

                            <button
                                onClick={handleRunMatchmaker}
                                disabled={loading || !query}
                                className="w-full btn-premium btn-premium-primary py-6 text-sm font-black uppercase tracking-[0.2em]"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Analyzing Market Signals...</span>
                                    </div>
                                ) : (
                                    <>
                                        <Send size={20} className="fill-white/20" />
                                        Execute Analysis
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Results Section */}
            <div className="space-y-8">
                <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-400/10 rounded-lg">
                            <Sparkles className="text-yellow-600 fill-yellow-500/20" size={20} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Synergy Rankings</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Top Strategic Matches</p>
                        </div>
                    </div>
                    {matches.length > 0 && (
                        <div className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-black/10">
                            {matches.length} Targets Detected
                        </div>
                    )}
                </div>

                <div className="space-y-6 min-h-[500px]">
                    <AnimatePresence mode='popLayout'>
                        {loading ? (
                            <div className="premium-card bg-white py-32 flex flex-col items-center justify-center border-none">
                                <div className="relative w-32 h-32 mb-10">
                                    <div className="absolute inset-0 border-8 border-slate-100 rounded-[2.5rem] rotate-45"></div>
                                    <div className="absolute inset-0 border-8 border-blue-600 rounded-[2.5rem] rotate-45 border-t-transparent border-r-transparent animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <BrainCircuit className="text-blue-600 animate-pulse" size={48} />
                                    </div>
                                </div>
                                <div className="text-center space-y-3">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Neural Ranking Engine Active</h3>
                                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest animate-pulse">Calculating Synergy Coefficients...</p>
                                </div>
                            </div>
                        ) : matches.length === 0 ? (
                            <div className="premium-card bg-white/50 border-2 border-dashed border-slate-200 py-32 flex flex-col items-center justify-center group opacity-60">
                                <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mb-8 rotate-12 transition-transform group-hover:rotate-0 duration-500">
                                    <Search className="text-slate-300" size={32} />
                                </div>
                                <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">Awaiting Strategy</h3>
                            </div>
                        ) : (
                            matches.map((match, i) => (
                                <MatchCard key={i} match={match} />
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
