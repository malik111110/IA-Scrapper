import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, TrendingUp, Cpu } from 'lucide-react';
import type { Opportunity } from '../types';

interface Props {
    opportunity: Opportunity;
}

export const OpportunityCard: React.FC<Props> = ({ opportunity }) => {
    const isHighProb = opportunity.classification.toLowerCase().includes('high');

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, borderColor: 'var(--primary)' }}
            onClick={() => window.open(opportunity.url, '_blank')}
            className="glass p-6 cursor-pointer group transition-colors duration-300"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {opportunity.company_name}
                    </h3>
                    <p className="text-sm text-text-muted mt-1 flex items-center gap-1">
                        <TrendingUp size={14} className="text-secondary" />
                        {opportunity.sector || 'Emerging Tech'}
                    </p>
                </div>
                <div className="flex flex-col items-end">
                    <div className="text-2xl font-black text-primary dropping-shadow">
                        {opportunity.score.toFixed(1)}
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold">
                        Radar Score
                    </span>
                </div>
            </div>

            <p className="text-sm text-text-muted line-clamp-3 mb-6 leading-relaxed">
                {opportunity.summary}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
                {opportunity.tech_stack.slice(0, 4).map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[11px] font-medium flex items-center gap-1">
                        <Cpu size={12} className="text-primary/70" />
                        {tech}
                    </span>
                ))}
                {opportunity.tech_stack.length > 4 && (
                    <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[11px] font-medium text-text-muted">
                        +{opportunity.tech_stack.length - 4} more
                    </span>
                )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isHighProb ? 'bg-success shadow-[0_0_8px_#10b981]' : 'bg-warning shadow-[0_0_8px_#f59e0b]'}`} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${isHighProb ? 'text-success' : 'text-warning'}`}>
                        {opportunity.classification}
                    </span>
                </div>
                <ExternalLink size={16} className="text-text-muted group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
        </motion.div>
    );
};
