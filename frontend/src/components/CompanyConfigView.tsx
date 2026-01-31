import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Sparkles, BrainCircuit, Rocket, Building2, ExternalLink, Mail, Briefcase } from 'lucide-react';
import { api } from '../services/api';
import type { CompanyProfile } from '../types';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export const CompanyConfigView: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Welcome to the Strategic Command. I am your Digital Onboarding Agent. Together, we will calibrate your company's digital twin to ensure perfect alignment with market opportunities. \n\nWhat is the name of your organization, and what vision do you carry?"
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [profile, setProfile] = useState<CompanyProfile | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const profiles = await api.getCompanyProfiles();
            if (profiles.length > 0) {
                setProfile(profiles[0]);
            }
        } catch (err) {
            console.error("Failed to fetch profile", err);
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMsg = inputValue;
        setInputValue('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const history = messages.map(m => ({ role: m.role, content: m.content }));
            const response = await api.onboard({ message: userMsg, history });

            setMessages(prev => [...prev, { role: 'assistant', content: response.agent_response }]);
            if (response.extracted_profile) {
                // Background refresh profile
                fetchProfile();
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: "I encountered a synchronization error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-200px)] flex gap-8">
            {/* Left Column: Chat Interface */}
            <div className="flex-1 flex flex-col premium-card bg-white overflow-hidden border-none shadow-2xl shadow-blue-500/5">
                <div className="p-6 bg-slate-900 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <BrainCircuit size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white tracking-tight">Onboarding Agent</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active System Calibration</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-elegant">
                    <AnimatePresence>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-900 shadow-sm' : 'bg-blue-600 shadow-lg shadow-blue-500/20'
                                        }`}>
                                        {msg.role === 'user' ? <User size={16} className="text-white" /> : <Sparkles size={16} className="text-white" />}
                                    </div>
                                    <div className={`px-5 py-4 rounded-2xl text-sm font-semibold leading-relaxed ${msg.role === 'user'
                                        ? 'bg-slate-900 text-white shadow-xl'
                                        : 'bg-slate-50 text-slate-700 border border-slate-100'
                                        }`}>
                                        {msg.content.split('\n').map((line, j) => (
                                            <p key={j} className={j > 0 ? 'mt-3' : ''}>{line}</p>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                            <div className="flex gap-4 items-center px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Processing</span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                    <div className="relative group">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type your response to the agent..."
                            className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-6 pr-20 text-sm font-bold text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isLoading}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white p-3 rounded-xl hover:bg-black transition-all disabled:opacity-30"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Column: Live Profile Preview (Semantic Data Normalization visualization) */}
            <div className="w-[380px] space-y-6">
                <div className="premium-card p-6 bg-slate-900 text-white border-none shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                            <Rocket size={20} className="text-blue-400" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Live Agent Mapping</h4>
                            <p className="text-xs font-bold text-slate-500">Semantic Data Normalization Active</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {profile ? (
                            <>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-500">Identity</label>
                                        {profile.website && <ExternalLink size={12} className="text-slate-500" />}
                                    </div>
                                    <p className="text-xl font-black truncate">{profile.name}</p>
                                    <div className="flex items-center gap-2 mt-2 opacity-60">
                                        <Mail size={12} />
                                        <span className="text-[10px] font-bold">{profile.contact_email || 'Not configured'}</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 block mb-3">Core Expertise (Mapped)</label>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.services.length > 0 ? profile.services.map((s, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate-300">
                                                {s}
                                            </span>
                                        )) : <span className="text-[10px] text-slate-600 font-bold">Awaiting extraction...</span>}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 block mb-3">Vision Engine</label>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                        <p className="text-[11px] font-medium leading-relaxed text-slate-400 italic">
                                            "{profile.description || 'Describe your agency to initialize the vision engine...'}"
                                        </p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="py-20 text-center space-y-4">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto border border-white/10 border-dashed">
                                    <Building2 size={24} className="text-slate-700" />
                                </div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Profile Offline</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="premium-card p-6 bg-white border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        <Briefcase size={20} className="text-blue-600" />
                    </div>
                    <h5 className="text-sm font-black text-slate-900 tracking-tight">Need Manual Override?</h5>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Coming in Enterprise v2.0</p>
                </div>
            </div>
        </div>
    );
};
