import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, X, Building2, Mail, Globe, Briefcase, Ruler, Lightbulb, Users, Rocket } from 'lucide-react';
import { api } from '../services/api';
import type { CompanyProfile, CompanyProfileUpdate } from '../types';

export const CompanyConfigView: React.FC = () => {
    const [profile, setProfile] = useState<CompanyProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form states for arrays
    const [newService, setNewService] = useState('');
    const [newEquipment, setNewEquipment] = useState('');
    const [newSpecialty, setNewSpecialty] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const profiles = await api.getCompanyProfiles();
            if (profiles.length > 0) {
                setProfile(profiles[0]);
            } else {
                // Initialize empty profile if none exists
                setProfile({
                    id: 0,
                    name: '',
                    description: '',
                    services: [],
                    equipment: [],
                    experience_years: 0,
                    specialties: [],
                    mission: '',
                    target_audience: '',
                    website: '',
                    contact_email: '',
                    created_at: '',
                    updated_at: ''
                });
            }
        } catch (error) {
            console.error('Failed to fetch profile', error);
            setMessage({ type: 'error', text: 'Failed to load company profile.' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateField = (field: keyof CompanyProfile, value: any) => {
        if (!profile) return;
        setProfile({ ...profile, [field]: value });
    };

    const handleAddItem = (field: 'services' | 'equipment' | 'specialties', value: string, setter: (v: string) => void) => {
        if (!profile || !value.trim()) return;
        if (profile[field].includes(value.trim())) return;
        setProfile({ ...profile, [field]: [...profile[field], value.trim()] });
        setter('');
    };

    const handleRemoveItem = (field: 'services' | 'equipment' | 'specialties', index: number) => {
        if (!profile) return;
        const newList = [...profile[field]];
        newList.splice(index, 1);
        setProfile({ ...profile, [field]: newList });
    };

    const handleSave = async () => {
        if (!profile) return;
        setSaving(true);
        setMessage(null);
        try {
            const updateData: CompanyProfileUpdate = { ...profile };
            if (profile.id === 0) {
                // Create
                const newProfile = await api.createCompanyProfile(updateData as any);
                setProfile(newProfile);
            } else {
                // Update
                const updated = await api.updateCompanyProfile(profile.id, updateData);
                setProfile(updated);
            }
            setMessage({ type: 'success', text: 'Profile saved successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Failed to save profile', error);
            setMessage({ type: 'error', text: 'Failed to save profile. Please check your inputs.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Company Configuration</h2>
                    <p className="text-slate-500 font-medium">Define your core identity to power the matching engine.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-premium btn-premium-primary px-8 py-3 flex items-center gap-2"
                >
                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                    {saving ? 'Saving...' : 'Save Configuration'}
                </button>
            </div>

            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl font-bold flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                        }`}
                >
                    <Info size={18} />
                    {message.text}
                </motion.div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column: Basic Info */}
                <div className="space-y-8">
                    <section className="premium-card p-8 bg-white space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <Building2 size={20} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900">General Identity</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
                                <input
                                    type="text"
                                    value={profile?.name || ''}
                                    onChange={(e) => handleUpdateField('name', e.target.value)}
                                    placeholder="e.g. Acme Innovations"
                                    className="input-premium"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Website</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            value={profile?.website || ''}
                                            onChange={(e) => handleUpdateField('website', e.target.value)}
                                            placeholder="https://acme.com"
                                            className="input-premium pl-11"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="email"
                                            value={profile?.contact_email || ''}
                                            onChange={(e) => handleUpdateField('contact_email', e.target.value)}
                                            placeholder="contact@acme.com"
                                            className="input-premium pl-11"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Elevator Pitch / Description</label>
                                <textarea
                                    value={profile?.description || ''}
                                    onChange={(e) => handleUpdateField('description', e.target.value)}
                                    placeholder="Describe what you do in one paragraph..."
                                    className="input-premium h-32 resize-none"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="premium-card p-8 bg-white space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                                <Rocket size={20} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900">Vision & Market</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Mission</label>
                                <textarea
                                    value={profile?.mission || ''}
                                    onChange={(e) => handleUpdateField('mission', e.target.value)}
                                    placeholder="What drives your company forward?"
                                    className="input-premium h-24 resize-none"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Audience</label>
                                <input
                                    type="text"
                                    value={profile?.target_audience || ''}
                                    onChange={(e) => handleUpdateField('target_audience', e.target.value)}
                                    placeholder="e.g. Mid-sized FinTech firms, Series A Startups"
                                    className="input-premium"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Dynamic Lists */}
                <div className="space-y-8">
                    {/* Services Tag Input */}
                    <section className="premium-card p-8 bg-white space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                <Briefcase size={20} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900">Services Offered</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newService}
                                    onChange={(e) => setNewService(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddItem('services', newService, setNewService)}
                                    placeholder="e.g. Cloud Migration"
                                    className="input-premium"
                                />
                                <button
                                    onClick={() => handleAddItem('services', newService, setNewService)}
                                    className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2 min-h-[40px]">
                                {profile?.services.map((item, i) => (
                                    <span key={i} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100 group">
                                        {item}
                                        <button onClick={() => handleRemoveItem('services', i)} className="hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                                {profile?.services.length === 0 && <p className="text-xs text-slate-400 font-medium italic">No services added yet.</p>}
                            </div>
                        </div>
                    </section>

                    {/* Equipment/Stack Tag Input */}
                    <section className="premium-card p-8 bg-white space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                <Ruler size={20} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900">Equipment & Tech Stack</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newEquipment}
                                    onChange={(e) => setNewEquipment(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddItem('equipment', newEquipment, setNewEquipment)}
                                    placeholder="e.g. AWS Multi-Region, Drone Fleet"
                                    className="input-premium"
                                />
                                <button
                                    onClick={() => handleAddItem('equipment', newEquipment, setNewEquipment)}
                                    className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2 min-h-[40px]">
                                {profile?.equipment.map((item, i) => (
                                    <span key={i} className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-100 group">
                                        {item}
                                        <button onClick={() => handleRemoveItem('equipment', i)} className="hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                                {profile?.equipment.length === 0 && <p className="text-xs text-slate-400 font-medium italic">No equipment listed.</p>}
                            </div>
                        </div>
                    </section>

                    {/* Specialties Tag Input */}
                    <section className="premium-card p-8 bg-white space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                <Lightbulb size={20} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900">Unique Specialties</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newSpecialty}
                                    onChange={(e) => setNewSpecialty(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddItem('specialties', newSpecialty, setNewSpecialty)}
                                    placeholder="e.g. High-Load Backend"
                                    className="input-premium"
                                />
                                <button
                                    onClick={() => handleAddItem('specialties', newSpecialty, setNewSpecialty)}
                                    className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2 min-h-[40px]">
                                {profile?.specialties.map((item, i) => (
                                    <span key={i} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 group">
                                        {item}
                                        <button onClick={() => handleRemoveItem('specialties', i)} className="hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                                {profile?.specialties.length === 0 && <p className="text-xs text-slate-400 font-medium italic">Add special skills.</p>}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

// Internal Info icon mapping for the alert
const Info = ({ size, className }: { size: number, className?: string }) => (
    <div className={className}>
        <Users size={size} />
    </div>
);
