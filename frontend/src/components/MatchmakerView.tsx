import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BrainCircuit, Target, Send } from 'lucide-react';
import type { MatchResponse } from '../types';
import { api } from '../services/api';
import { MatchCard } from './MatchCard';

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
        <div className="max-w-5xl mx-auto space-y-12">
            <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass p-8 space-y-6"
                >
                    <div className="flex items-center gap-3 text-secondary mb-2">
                        <BrainCircuit size={28} />
                        <h3 className="text-xl font-black uppercase tracking-tight">Your Expertise</h3>
                    </div>
                    <p className="text-text-muted text-sm border-l-2 border-secondary/30 pl-4">
                        Describe your agency's core strengths, tech stack, and typical project scale.
                        The AI uses this to calculate synergy scores.
                    </p>
                    <textarea
                        value={businessInfo}
                        onChange={(e) => setBusinessInfo(e.target.value)}
                        placeholder="Example: We are a high-end Ruby on Rails shop specializing in marketplace scalability..."
                        className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:border-secondary outline-none transition-all"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass p-8 space-y-6"
                >
                    <div className="flex items-center gap-3 text-primary mb-2">
                        <Target size={28} />
                        <h3 className="text-xl font-black uppercase tracking-tight">Ideal Target</h3>
                    </div>
                    <p className="text-text-muted text-sm border-l-2 border-primary/30 pl-4">
                        Which roles or technologies indicate the biggest gap for your clients?
                        We search Indeed & OpenClassrooms for matches.
                    </p>
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                type="text"
                                placeholder="e.g. 'Senior Rails Engineer'"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:border-primary outline-none transition-all"
                            />
                        </div>
                        <button
                            onClick={handleRunMatchmaker}
                            disabled={loading || !businessInfo || !query}
                            className="w-full btn btn-primary flex justify-center py-4 text-lg"
                        >
                            {loading ? (
                                <RefreshCw size={24} className="animate-spin" />
                            ) : (
                                <>
                                    <Send size={20} />
                                    Execute Strategic Search
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>

            <div className="space-y-8">
                <h2 className="text-2xl font-black flex items-center gap-3 px-4">
                    <Sparkles className="text-primary" />
                    SYNERGY RANKINGS
                </h2>

                <div className="space-y-6">
                    <AnimatePresence>
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                                <div className="relative">
                                    <div className="w-20 h-20 border-4 border-primary/20 rounded-full animate-spin border-t-primary" />
                                    <BrainCircuit size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
                                </div>
                                <p className="text-xl font-bold italic text-text-muted animate-pulse">Running neural matchmaker algorithms...</p>
                            </div>
                        ) : matches.length === 0 ? (
                            <div className="text-center py-32 glass border-dashed">
                                <p className="text-text-muted font-medium">Input your business info and search query to find strategic matches.</p>
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

const Sparkles = ({ className }: { className?: string }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor" />
    </svg>
);

const RefreshCw = ({ className, size }: { className?: string, size?: number }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" />
    </svg>
);
