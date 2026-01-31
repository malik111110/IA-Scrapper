import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCw, Radio, Search, TrendingUp, Zap } from 'lucide-react';
import type { Opportunity } from '../types';
import { api } from '../services/api';
import { OpportunityCard } from './OpportunityCard';

interface RadarViewProps {
    onEmptyStateAction?: () => void;
}

export const RadarView: React.FC<RadarViewProps> = ({ onEmptyStateAction }) => {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [stats, setStats] = useState({ total: 0, highProb: 0 });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await api.getOpportunities();
            setOpportunities(data.opportunities);
            setStats({
                total: data.total,
                highProb: data.opportunities.filter(o => o.classification.toLowerCase().includes('high')).length
            });
        } catch (error) {
            console.error('Failed to fetch radar data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
                <div className="flex-1 grid grid-cols-2 gap-6">
                    <div className="premium-card p-6 flex flex-col justify-between">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <Search size={18} />
                            </div>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Scanned</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-slate-900 leading-none">{stats.total}</span>
                            <span className="text-xs font-bold text-slate-400">Signals Found</span>
                        </div>
                    </div>

                    <div className="premium-card p-6 flex flex-col justify-between border-l-4 border-l-green-500">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                <TrendingUp size={18} />
                            </div>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">High Probability</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-green-600 leading-none">{stats.highProb}</span>
                            <span className="text-xs font-bold text-slate-400">High Score</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center">
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="btn-premium btn-premium-primary h-full min-h-[100px] px-10 group"
                    >
                        <RefreshCw size={20} className={`${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                        <div className="text-left">
                            <span className="block text-sm font-bold">{loading ? 'Analyzing Ecosytem...' : 'Refresh Radar'}</span>
                            <span className="block text-[10px] font-black uppercase tracking-widest opacity-60">Last scan: Just now</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Opportunities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {loading && opportunities.length === 0 ? (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center">
                            <div className="relative mb-8">
                                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
                                    <Zap size={40} className="text-blue-500 fill-blue-500/20" />
                                </div>
                                <div className="absolute inset-0 border-4 border-blue-100/50 rounded-full animate-[ping_2s_infinite]"></div>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">Scanning the Ecosystem</h3>
                            <p className="text-slate-500 font-medium mt-2">Our AI is parsing live market signals...</p>
                        </div>
                    ) : opportunities.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="col-span-full py-24 px-10 flex flex-col items-center justify-center text-center bg-white border-2 border-dashed border-slate-200 rounded-[2rem]"
                        >
                            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-8 rotate-12">
                                <Radio size={32} className="text-slate-300" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-3">No Active Targets Found</h3>
                            <p className="text-slate-500 max-w-lg mb-10 text-lg font-medium">
                                Your radar is currently clear. Leverage the Strategic Matchmaker to define new high-value search signatures.
                            </p>
                            <button
                                onClick={onEmptyStateAction}
                                className="btn-premium btn-premium-primary py-4 px-8 text-lg"
                            >
                                <Zap size={20} className="fill-white/20" />
                                Launch Strategic Matchmaker
                            </button>
                        </motion.div>
                    ) : (
                        opportunities.map((opp) => (
                            <OpportunityCard key={opp.id} opportunity={opp} />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

