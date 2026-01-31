import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { RefreshCw, Radio } from 'lucide-react';
import type { Opportunity } from '../types';
import { api } from '../services/api';
import { OpportunityCard } from './OpportunityCard';

export const RadarView: React.FC = () => {
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
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 glass p-6">
                <div className="flex gap-12">
                    <div className="flex flex-col">
                        <span className="text-4xl font-black text-primary">{stats.total}</span>
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Total Opportunities</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-4xl font-black text-success">{stats.highProb}</span>
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">High Probability</span>
                    </div>
                </div>
                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="btn btn-primary min-w-[180px] justify-center"
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    {loading ? 'Scanning...' : 'Refresh Radar'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {loading && opportunities.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 animate-pulse-soft">
                            <Radio size={64} className="text-primary mb-4" />
                            <p className="text-xl font-medium text-text-muted">Interpreting market signals...</p>
                        </div>
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
