import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, ArrowUpRight, Cpu, Target, BrainCircuit } from 'lucide-react';
import type { MatchResponse } from '../types';

interface Props {
    match: MatchResponse;
}

export const MatchCard: React.FC<Props> = ({ match }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="premium-card p-0 flex flex-col group overflow-hidden bg-white hover:border-blue-500/30 transition-all duration-500"
        >
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] group-hover:rotate-12 transition-all duration-700 pointer-events-none">
                <Sparkles size={200} className="text-blue-600" />
            </div>

            {/* Header Section */}
            <div className="p-8 pb-0 flex justify-between items-start relative z-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                            High Synergy
                        </div>
                        <span className="text-slate-300 text-xs">•</span>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            <Target size={12} className="text-blue-500" />
                            Strategic Alignment
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                        {match.company_name}
                    </h2>
                </div>

                <div className="text-right">
                    <div className="relative inline-block">
                        <div className="text-5xl font-black text-blue-600 tracking-tighter tabular-nums group-hover:scale-105 transition-transform">
                            {match.matching_score}%
                        </div>
                        <div className="absolute -right-4 top-0 w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Synergy Index</p>
                </div>
            </div>

            {/* Analysis Box */}
            <div className="p-8 space-y-8 relative z-10">
                <div className="bg-slate-50/80 backdrop-blur-sm rounded-3xl p-6 border border-slate-100/50 group-hover:bg-white group-hover:border-blue-100 transition-all duration-500">
                    <div className="flex items-center gap-2 text-blue-800 font-black text-[10px] uppercase tracking-widest mb-4">
                        <BrainCircuit size={16} className="text-blue-500" />
                        AI Core Analysis
                    </div>
                    <p className="text-slate-700 text-md leading-relaxed font-semibold italic">
                        "{match.fit_analysis}"
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                    {/* Reasoning Signals */}
                    <div className="space-y-5">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]"></div>
                            Validation Signals
                        </h4>
                        <div className="space-y-4">
                            {match.reasoning_signals.map((signal, i) => (
                                <div key={i} className="flex items-start gap-3.5 group/signal">
                                    <div className="mt-0.5 p-1 bg-green-50 rounded-md group-hover/signal:bg-green-100 transition-colors">
                                        <CheckCircle2 size={14} className="text-green-600" />
                                    </div>
                                    <span className="text-slate-600 text-sm font-bold group-hover/signal:text-slate-900 transition-colors leading-tight">{signal}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tech Stack Profile */}
                    <div className="space-y-5">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Cpu size={14} className="text-blue-500" />
                            Target Tech Profile
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {match.tech_stack.map((tech) => (
                                <span key={tech} className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/30 transition-all cursor-default uppercase tracking-tighter">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Footer */}
            <div className="mt-auto px-8 py-6 bg-slate-900 flex items-center justify-between group-hover:bg-blue-600 transition-colors duration-500">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white/50">Next Step</span>
                    <span className="text-sm font-bold text-white">Review Detailed Company Dossier</span>
                </div>
                <button
                    onClick={() => window.open(match.url, '_blank')}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white rounded-xl text-slate-900 text-sm font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20"
                >
                    Infiltrate
                    <ArrowUpRight size={16} />
                </button>
            </div>
        </motion.div>
    );
};

