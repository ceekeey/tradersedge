import React, { useState } from 'react';
import {
    User,
    Key,
    Sliders,
    ShieldCheck,
    Info,
    Camera,
    Save,
    Lock,
    Smartphone,
    CheckCircle2,
    AlertTriangle,
    ExternalLink
} from 'lucide-react';

export default function Profile() {
    const [activeTab, setActiveTab] = useState('profile');

    // Profile Form State
    const [profile, setProfile] = useState({
        name: 'Alex Mercer',
        email: 'alex.mercer@traderedge.io',
        bio: 'Discipline-focused intraday trader operating on Deriv synthetic indices.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });

    // API Keys State
    const [apiKey, setApiKey] = useState('deriv_live_app_1089_test_token');
    const [appId, setAppId] = useState('1089');

    // Trading Preferences State
    const [riskPerTrade, setRiskPerTrade] = useState('2.0');
    const [defaultDuration, setDefaultDuration] = useState('1H');
    const [maxDrawdownLimit, setMaxDrawdownLimit] = useState('5.0');
    const [soundEffects, setSoundEffects] = useState(true);

    // 2FA State
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        alert('Settings updated successfully!');
    };

    return (
        <div className="flex min-h-[calc(100vh-6rem)] w-full flex-col gap-6 bg-[#070707] p-4 text-[#F5F5F0] lg:p-6">

            {/* Header Banner */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img
                            src={profile.avatar}
                            alt="Profile"
                            className="h-14 w-14 rounded-full border-2 border-[#D4AF37] object-cover"
                        />
                        <button className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37] text-black shadow">
                            <Camera className="h-3 w-3" />
                        </button>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-[#F5F5F0]">{profile.name}</h1>
                        <p className="text-xs text-[#A8A8A0]">{profile.email}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#10B981]/10 px-3 py-1 text-xs font-semibold text-[#10B981] border border-[#10B981]/20">
                        Pro Account
                    </span>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-[#29251B] overflow-x-auto pb-2">
                {[
                    { id: 'profile', label: 'Profile Details', icon: User },
                    { id: 'api', label: 'Deriv API Keys', icon: Key },
                    { id: 'trading', label: 'Trading Preferences', icon: Sliders },
                    { id: 'security', label: 'Security & 2FA', icon: ShieldCheck },
                    { id: 'about', label: 'About & Author', icon: Info },
                ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-semibold transition ${activeTab === tab.id
                                ? 'bg-[#D4AF37] text-black'
                                : 'border border-[#29251B] bg-[#0D0D0D] text-[#A8A8A0] hover:text-[#F5F5F0]'
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-6">

                {/* 1. PROFILE DETAILS */}
                {activeTab === 'profile' && (
                    <form onSubmit={handleSave} className="max-w-2xl space-y-4">
                        <h2 className="text-base font-bold text-[#F5F5F0]">Personal Information</h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs text-[#A8A8A0]">Full Name</label>
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    className="w-full rounded-xl border border-[#29251B] bg-[#151515] px-3.5 py-2 text-xs text-[#F5F5F0] focus:border-[#D4AF37] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs text-[#A8A8A0]">Email Address</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full rounded-xl border border-[#29251B] bg-[#151515] px-3.5 py-2 text-xs text-[#F5F5F0] focus:border-[#D4AF37] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs text-[#A8A8A0]">Trading Bio</label>
                            <textarea
                                rows={3}
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                className="w-full rounded-xl border border-[#29251B] bg-[#151515] px-3.5 py-2 text-xs text-[#F5F5F0] focus:border-[#D4AF37] focus:outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-2 text-xs font-bold text-black hover:bg-[#b8952b]"
                        >
                            <Save className="h-4 w-4" /> Save Changes
                        </button>
                    </form>
                )}

                {/* 2. API CONFIGURATION */}
                {activeTab === 'api' && (
                    <form onSubmit={handleSave} className="max-w-2xl space-y-4">
                        <h2 className="text-base font-bold text-[#F5F5F0]">Deriv API Connection</h2>
                        <p className="text-xs text-[#A8A8A0]">
                            Configure your custom Deriv App ID and Read/Trade API Tokens for live market execution.
                        </p>

                        <div>
                            <label className="mb-1 block text-xs text-[#A8A8A0]">Deriv App ID</label>
                            <input
                                type="text"
                                value={appId}
                                onChange={(e) => setAppId(e.target.value)}
                                className="w-full rounded-xl border border-[#29251B] bg-[#151515] px-3.5 py-2 text-xs text-[#F5F5F0] focus:border-[#D4AF37] focus:outline-none"
                            />
                            <span className="mt-1 block text-[10px] text-[#6F6F68]">Default testing ID is 1089.</span>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs text-[#A8A8A0]">API Read/Trade Token</label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="w-full rounded-xl border border-[#29251B] bg-[#151515] px-3.5 py-2 text-xs text-[#F5F5F0] focus:border-[#D4AF37] focus:outline-none"
                            />
                        </div>

                        <div className="rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-3 text-xs text-[#D4AF37]">
                            <div className="flex items-center gap-2 font-semibold">
                                <AlertTriangle className="h-4 w-4" /> Security Note
                            </div>
                            <p className="mt-1 text-[11px] text-[#A8A8A0]">
                                API tokens are stored locally in your browser memory and are never sent to external third-party servers.
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-2 text-xs font-bold text-black hover:bg-[#b8952b]"
                        >
                            <Save className="h-4 w-4" /> Save API Config
                        </button>
                    </form>
                )}

                {/* 3. TRADING PREFERENCES */}
                {activeTab === 'trading' && (
                    <form onSubmit={handleSave} className="max-w-2xl space-y-4">
                        <h2 className="text-base font-bold text-[#F5F5F0]">Execution Parameters</h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs text-[#A8A8A0]">Default Risk Per Trade (%)</label>
                                <input
                                    type="number"
                                    step="0.5"
                                    value={riskPerTrade}
                                    onChange={(e) => setRiskPerTrade(e.target.value)}
                                    className="w-full rounded-xl border border-[#29251B] bg-[#151515] px-3.5 py-2 text-xs text-[#F5F5F0] focus:border-[#D4AF37] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs text-[#A8A8A0]">Max Daily Drawdown Guard (%)</label>
                                <input
                                    type="number"
                                    step="0.5"
                                    value={maxDrawdownLimit}
                                    onChange={(e) => setMaxDrawdownLimit(e.target.value)}
                                    className="w-full rounded-xl border border-[#29251B] bg-[#151515] px-3.5 py-2 text-xs text-[#F5F5F0] focus:border-[#D4AF37] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs text-[#A8A8A0]">Default Candle Timeframe</label>
                            <select
                                value={defaultDuration}
                                onChange={(e) => setDefaultDuration(e.target.value)}
                                className="w-full rounded-xl border border-[#29251B] bg-[#151515] px-3.5 py-2 text-xs text-[#F5F5F0] focus:border-[#D4AF37] focus:outline-none"
                            >
                                <option value="1M">1 Minute</option>
                                <option value="5M">5 Minutes</option>
                                <option value="15M">15 Minutes</option>
                                <option value="1H">1 Hour</option>
                                <option value="4H">4 Hours</option>
                            </select>
                        </div>

                        <div className="pt-2">
                            <label className="flex cursor-pointer items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={soundEffects}
                                    onChange={(e) => setSoundEffects(e.target.checked)}
                                    className="h-4 w-4 rounded border-[#29251B] bg-[#151515] text-[#D4AF37] focus:ring-[#D4AF37]"
                                />
                                <span className="text-xs text-[#F5F5F0]">Enable Trade Execution Sound Effects</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-2 text-xs font-bold text-black hover:bg-[#b8952b]"
                        >
                            <Save className="h-4 w-4" /> Save Preferences
                        </button>
                    </form>
                )}

                {/* 4. SECURITY & 2FA */}
                {activeTab === 'security' && (
                    <div className="max-w-2xl space-y-6">
                        <h2 className="text-base font-bold text-[#F5F5F0]">Security Settings</h2>

                        {/* 2FA Toggle Card */}
                        <div className="flex items-center justify-between rounded-xl border border-[#29251B] bg-[#151515] p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                                    <Smartphone className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-[#F5F5F0]">Two-Factor Authentication (2FA)</h3>
                                    <p className="text-[11px] text-[#A8A8A0]">Protect your account with Google Authenticator.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                                className={`rounded-xl px-4 py-1.5 text-xs font-bold transition ${is2FAEnabled ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-[#D4AF37] text-black'
                                    }`}
                            >
                                {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                            </button>
                        </div>

                        {/* Password Update Form */}
                        <form onSubmit={handleSave} className="space-y-4 pt-2">
                            <h3 className="text-xs font-bold text-[#A8A8A0]">Change Master Password</h3>

                            <div>
                                <label className="mb-1 block text-xs text-[#A8A8A0]">Current Password</label>
                                <input
                                    type="password"
                                    className="w-full rounded-xl border border-[#29251B] bg-[#151515] px-3.5 py-2 text-xs text-[#F5F5F0] focus:border-[#D4AF37] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs text-[#A8A8A0]">New Password</label>
                                <input
                                    type="password"
                                    className="w-full rounded-xl border border-[#29251B] bg-[#151515] px-3.5 py-2 text-xs text-[#F5F5F0] focus:border-[#D4AF37] focus:outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="flex items-center gap-2 rounded-xl bg-[#151515] px-5 py-2 text-xs font-bold text-[#F5F5F0] border border-[#29251B] hover:border-[#D4AF37]"
                            >
                                <Lock className="h-4 w-4 text-[#D4AF37]" /> Update Password
                            </button>
                        </form>
                    </div>
                )}

                {/* 5. ABOUT APP & AUTHOR */}
                {activeTab === 'about' && (
                    <div className="max-w-2xl space-y-6">
                        <div>
                            <h2 className="text-lg font-bold text-[#F5F5F0]">Traders Edge Terminal</h2>
                            <p className="mt-1 text-xs text-[#A8A8A0]">
                                Professional synthetic indices trading workspace engineered for Deriv integration.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 rounded-xl border border-[#29251B] bg-[#151515] p-4 text-xs">
                            <div>
                                <span className="text-[#6F6F68]">Application Version</span>
                                <div className="font-mono font-bold text-[#F5F5F0]">v2.4.0 (Build 2026)</div>
                            </div>
                            <div>
                                <span className="text-[#6F6F68]">Chart Engine</span>
                                <div className="font-mono font-bold text-[#F5F5F0]">Lightweight Charts v4.0</div>
                            </div>
                        </div>

                        <div className="border-t border-[#29251B] pt-4">
                            <h3 className="text-xs font-bold text-[#F5F5F0]">Author & Developer Info</h3>
                            <p className="mt-2 text-xs text-[#A8A8A0]">
                                Built by continuous traders and web engineers dedicated to building clean, low-latency execution interfaces and stress-management tools for financial markets.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}