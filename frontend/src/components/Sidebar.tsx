import React from 'react';
import { Target, Settings, HelpCircle, Zap, ShieldCheck, Building2 } from 'lucide-react';

interface SidebarProps {
    currentView: 'matchmaker' | 'company';
    onViewChange: (view: 'matchmaker' | 'company') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
    return (
        <aside className="sidebar p-0 overflow-hidden">
            {/* Brand Section */}
            <div className="p-8 pb-10">
                <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => onViewChange('matchmaker')}>
                    <div className="relative">
                        <div className="bg-blue-600 w-11 h-11 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                            <Zap size={24} className="text-white fill-blue-200/20" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[var(--bg-sidebar)] rounded-full"></div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">Matchmaker</h2>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Enterprise AI</span>
                    </div>
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 px-4 space-y-1.5">
                <p className="px-4 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Platform</p>

                <button
                    onClick={() => onViewChange('company')}
                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all group ${currentView === 'company'
                        ? 'bg-blue-600/10 text-white shadow-sm ring-1 ring-blue-500/20'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                        }`}
                >
                    <Building2 size={20} className={currentView === 'company' ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-300'} />
                    <span className="flex-1 text-left">Company profile</span>
                    {currentView === 'company' && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                    )}
                </button>

                <button
                    onClick={() => onViewChange('matchmaker')}
                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all group ${currentView === 'matchmaker'
                        ? 'bg-blue-600/10 text-white shadow-sm ring-1 ring-blue-500/20'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                        }`}
                >
                    <Target size={20} className={currentView === 'matchmaker' ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-300'} />
                    <span className="flex-1 text-left">Matchmaker</span>
                    {currentView === 'matchmaker' && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                    )}
                </button>
            </nav>

            {/* Bottom Section */}
            <div className="mt-auto p-4 space-y-4">
                <div className="space-y-1">
                    <button className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-800/50 hover:text-slate-300 transition-all group">
                        <Settings size={16} className="text-slate-600 group-hover:text-slate-400" />
                        Settings
                    </button>
                    <button className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-800/50 hover:text-slate-300 transition-all group">
                        <HelpCircle size={16} className="text-slate-600 group-hover:text-slate-400" />
                        Developer Hub
                    </button>
                </div>

                <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-1.5 bg-green-500/10 rounded-lg">
                            <ShieldCheck size={14} className="text-green-500" />
                        </div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">System Operational</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-slate-500">v1.2.0-stable</p>
                        <div className="flex gap-1">
                            <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                            <div className="w-1 h-1 rounded-full bg-blue-500/40"></div>
                            <div className="w-1 h-1 rounded-full bg-blue-500/20"></div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};
