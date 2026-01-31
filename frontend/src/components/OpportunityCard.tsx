import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Cpu, ShieldCheck, Building2, Calendar } from 'lucide-react';
import type { Opportunity } from '../types';

interface Props {
    opportunity: Opportunity;
}

export const OpportunityCard: React.FC<Props> = ({ opportunity }) => {
    const isHighProb = opportunity.classification.toLowerCase().includes('high');

    return (
        <motion.div
            layout
            whileHover={{ y: -6, boxShadow: 'var(--shadow-active)' }}
            className="premium-card p-0 flex flex-col group overflow-hidden bg-white cursor-pointer group"
            onClick={() => window.open(opportunity.url, '_blank')}
        >
            {/* Header / Score Section */}
            <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border transition-colors duration-300
                                ${isHighProb
                                    ? 'bg-green-50 text-green-700 border-green-100 group-hover:bg-green-100'
                                    : 'bg-amber-50 text-amber-700 border-amber-100 group-hover:bg-amber-100'}`}>
                                {opportunity.classification}
                            </span>
                            <span className="text-slate-300 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                                <Calendar size={10} />
                                Live Signal
                            </span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 leading-[1.15] group-hover:text-blue-600 transition-colors duration-300">
                            {opportunity.company_name}
                        </h3>
                    </div>
                    <div className="text-right ml-4">
                        <div className={`text-3xl font-black tracking-tighter transition-transform duration-300 group-hover:scale-110 ${isHighProb ? 'text-green-600' : 'text-amber-500'}`}>
                            {opportunity.score.toFixed(1)}
                        </div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Match Score</p>
                    </div>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed font-medium line-clamp-3 mb-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 italic group-hover:bg-white transition-colors">
                    "{opportunity.summary}"
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                    {opportunity.tech_stack.slice(0, 4).map((tech) => (
                        <span key={tech} className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-tighter rounded-xl flex items-center gap-1.5 transition-all group-hover:border-blue-200 group-hover:text-blue-600">
                            <Cpu size={12} className="text-slate-400 group-hover:text-blue-400" />
                            {tech}
                        </span>
                    ))}
                    {opportunity.tech_stack.length > 4 && (
                        <span className="px-2.5 py-1.5 bg-slate-100 text-slate-500 text-[10px] font-black rounded-xl">
                            +{opportunity.tech_stack.length - 4} More
                        </span>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between group-hover:bg-blue-600 transition-colors duration-300">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <Building2 size={12} className="text-slate-400 group-hover:text-white/70" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white/90">
                            {opportunity.sector || 'Technology'}
                        </span>
                    </div>
                </div>
                <div className="bg-white p-2 rounded-xl text-slate-400 transition-all duration-300 group-hover:scale-110 group-hover:text-blue-600 shadow-sm">
                    <ExternalLink size={14} />
                </div>
            </div>
        </motion.div>
    );
};

