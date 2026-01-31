import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Info } from 'lucide-react';
import type { MatchResponse } from '../types';

interface Props {
    match: MatchResponse;
}

export const MatchCard: React.FC<Props> = ({ match }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 relative overflow-hidden group hover:border-primary/50 transition-all duration-500"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles size={120} className="text-primary" />
            </div>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-success/10 text-success text-[10px] font-black uppercase tracking-tighter rounded-full border border-success/20">
                            High Synergy
                        </span>
                        <span className="text-text-muted text-xs">•</span>
                        <span className="text-text-muted text-xs font-medium">Strategic Match</span>
                    </div>
                    <h2 className="text-3xl font-black">{match.company_name}</h2>
                </div>
                <div className="flex flex-col items-end">
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary">
                        {match.matching_score}%
                    </div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">
                        Fit Compatibility
                    </span>
                </div>
            </div>

            <div className="grid md:grid-cols-[1.5fr_1fr] gap-8">
                <div className="space-y-6">
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <h4 className="flex items-center gap-2 text-primary font-bold text-sm mb-3">
                            <Info size={16} />
                            STRATEGIC ANALYSIS
                        </h4>
                        <p className="text-text-main/90 leading-relaxed italic">
                            "{match.fit_analysis}"
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
                            DETECTION SIGNALS
                        </h4>
                        <div className="space-y-3">
                            {match.reasoning_signals.map((signal, i) => (
                                <div key={i} className="flex items-start gap-3 text-sm">
                                    <CheckCircle2 size={18} className="text-success mt-0.5 flex-shrink-0" />
                                    <span className="text-text-main/80 font-medium">{signal}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-between">
                    <div>
                        <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
                            TARGET TECH STACK
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {match.tech_stack.map((tech) => (
                                <span key={tech} className="px-3 py-1.5 bg-secondary/5 border border-secondary/20 rounded-lg text-xs font-bold text-secondary">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => window.open(match.url, '_blank')}
                        className="w-full mt-8 btn btn-primary flex justify-center py-4 text-lg"
                    >
                        Review Opportunity
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
