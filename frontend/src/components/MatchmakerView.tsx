import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BrainCircuit, Target, Send, Sparkles, Zap, Info } from 'lucide-react';
import { api } from '../services/api';
import { MatchCard } from './MatchCard';
import type { MatchResponse } from '../types';

export const MatchmakerView: React.FC = () => {
    const [businessInfo, setBusinessInfo] = useState('');
    const [query, setQuery] = useState('');
    const [matches, setMatches] = useState<MatchResponse[]>([]);
    const [loading, setLoading] = useState(false);

    const handleRunMatchmaker = async () => {
        if (!businessInfo || !query) return;
        setLoading(true);
        try {
            const results = await api.runMatchmaker(businessInfo, query);
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
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="premium-card p-8 bg-white relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                        <BrainCircuit size={160} className="text-blue-600" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-blue-600 w-11 h-11 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Zap size={22} className="text-white fill-blue-200/20" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Expertise Profile</h3>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-0.5">Core Value Proposition</p>
                            </div>
                        </div>

                        <p className="text-slate-500 text-sm font-semibold mb-6 leading-relaxed">
                            Define your agency's unique advantages. Our Neural Engine will leverage this to calculate hyper-specific synergy scores.
                        </p>

                        <textarea
                            value={businessInfo}
                            onChange={(e) => setBusinessInfo(e.target.value)}
                            placeholder="e.g., Boutique React & Node.js agency focusing on FinTech security and high-concurrency architectures..."
                            className="w-full h-44 bg-slate-50/50 border border-slate-200 rounded-2xl p-6 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all resize-none shadow-sm"
                        />
                    </div>
                </motion.div>

                <div className="flex flex-col gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="premium-card p-8 bg-white relative overflow-hidden group flex-1"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-slate-900 w-11 h-11 rounded-xl flex items-center justify-center shadow-lg shadow-black/10">
                                <Target size={22} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Target</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Market Opportunity</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="relative">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    type="text"
                                    placeholder="e.g. 'Senior Architect'"
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm"
                                />
                            </div>

                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                                <Info size={16} className="text-amber-500 mt-1 shrink-0" />
                                <p className="text-[11px] font-bold text-amber-800 leading-relaxed uppercase tracking-wider">
                                    Strategic search scans 50+ job boards and market signals in real-time.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleRunMatchmaker}
                            disabled={loading || !businessInfo || !query}
                            className="w-full mt-10 btn-premium btn-premium-primary py-5 text-[13px] font-black uppercase tracking-[0.2em]"
                        >
                            {loading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Synthesizing Market Data...</span>
                                </div>
                            ) : (
                                <>
                                    <Send size={18} className="fill-white/20" />
                                    Execute Neural Scan
                                </>
                            )}
                        </button>
                    </motion.div>
                </div>
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
                            <div className="premium-card bg-white py-32 flex flex-col items-center justify-center">
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

