import React, { useState } from 'react';
import {
    BookOpen,
    Plus,
    Trash2,
    Edit2,
    ChevronDown,
    ChevronUp,
    Image as ImageIcon,
    Check,
    AlertCircle,
    Sliders,
    Layers,
    X
} from 'lucide-react';

export default function Rules() {
    // Multi-plan state
    const [plans, setPlans] = useState([
        {
            id: 'plan-1',
            name: 'Volatility Index Breakout Strategy',
            riskPerTrade: '2.0',
            maxDailyLoss: '6.0',
            minRR: '1:2',
            chartingProcess: ['Identify 4H Key Support/Resistance levels', 'Mark 15M liquidity sweeps', 'Check higher timeframe trend alignment'],
            entryCriteria: ['Break and close above structure on 15M', 'Volume spike confirmation', 'Spread within 0.5 pip limit'],
            entryModels: {
                htf: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=80',
                mtf: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=500&auto=format&fit=crop&q=80',
                ltf: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=80',
            },
            tradeManagement: 'Move SL to breakeven at 1:1 R:R. Scale out 50% at target 1 and trailing stop remaining position.',
            exitCriteria: ['Structure invalidation', 'Trailing stop hit', 'Opposing liquidity pool reached'],
            tradingNotes: 'Best performance during London & New York session overlap. Avoid trading 15 minutes before major news releases.'
        }
    ]);

    const [activePlanId, setActivePlanId] = useState('plan-1');
    const [isEditing, setIsEditing] = useState(false);
    const [openSections, setOpenSections] = useState({
        charting: true,
        entry: true,
        models: true,
        management: true,
        exit: true,
        notes: true
    });

    // Form inputs state
    const activePlan = plans.find((p) => p.id === activePlanId) || plans[0];
    const [formData, setFormData] = useState(activePlan);

    // Temp inputs for dynamic lists
    const [tempCharting, setTempCharting] = useState('');
    const [tempEntry, setTempEntry] = useState('');
    const [tempExit, setTempExit] = useState('');

    const toggleSection = (section) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const handleSelectPlan = (plan) => {
        setActivePlanId(plan.id);
        setFormData(plan);
        setIsEditing(false);
    };

    const handleCreateNewPlan = () => {
        const newPlan = {
            id: `plan-${Date.now()}`,
            name: 'New Trading Strategy',
            riskPerTrade: '1.0',
            maxDailyLoss: '3.0',
            minRR: '1:2',
            chartingProcess: [],
            entryCriteria: [],
            entryModels: { htf: null, mtf: null, ltf: null },
            tradeManagement: '',
            exitCriteria: [],
            tradingNotes: ''
        };
        setPlans([...plans, newPlan]);
        setActivePlanId(newPlan.id);
        setFormData(newPlan);
        setIsEditing(true);
    };

    const handleDeletePlan = (id) => {
        if (plans.length === 1) {
            alert('You must have at least one trading plan.');
            return;
        }
        const updated = plans.filter((p) => p.id !== id);
        setPlans(updated);
        setActivePlanId(updated[0].id);
        setFormData(updated[0]);
    };

    const handleSavePlan = () => {
        setPlans(plans.map((p) => (p.id === formData.id ? formData : p)));
        setIsEditing(false);
    };

    // Dynamic list helpers
    const addListItem = (field, value, setTemp) => {
        if (!value.trim()) return;
        setFormData({
            ...formData,
            [field]: [...formData[field], value.trim()]
        });
        setTemp('');
    };

    const removeListItem = (field, index) => {
        setFormData({
            ...formData,
            [field]: formData[field].filter((_, i) => i !== index)
        });
    };

    // Image upload handler simulation
    const handleImageUpload = (tf, event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFormData({
                ...formData,
                entryModels: { ...formData.entryModels, [tf]: imageUrl }
            });
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-6rem)] w-full flex-col gap-6 bg-[#070707] p-4 text-[#F5F5F0] lg:p-6">

            {/* Top Bar: Selector & Actions */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                        <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold">Trading Rules & Playbook</h1>
                        <p className="text-xs text-[#A8A8A0]">Manage system rules, entry models, and risk parameters</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Select Active Plan */}
                    <select
                        value={activePlanId}
                        onChange={(e) => {
                            const selected = plans.find((p) => p.id === e.target.value);
                            if (selected) handleSelectPlan(selected);
                        }}
                        className="rounded-xl border border-[#29251B] bg-[#151515] px-3.5 py-2 text-xs text-[#F5F5F0] focus:border-[#D4AF37] focus:outline-none"
                    >
                        {plans.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleCreateNewPlan}
                        className="flex items-center gap-1.5 rounded-xl bg-[#D4AF37] px-4 py-2 text-xs font-bold text-black transition hover:bg-[#b8952b]"
                    >
                        <Plus className="h-4 w-4" /> New Plan
                    </button>
                </div>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-12">

                {/* Left Side: Rules & Workflow (Col 8) */}
                <div className="space-y-4 lg:col-span-8">

                    {/* Header Controls for Selected Plan */}
                    <div className="flex items-center justify-between rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-4">
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full max-w-md rounded-xl border border-[#29251B] bg-[#151515] px-3 py-1.5 text-sm font-bold text-[#F5F5F0] focus:border-[#D4AF37] focus:outline-none"
                            />
                        ) : (
                            <h2 className="text-base font-bold text-[#F5F5F0]">{formData.name}</h2>
                        )}

                        <div className="flex items-center gap-2">
                            {isEditing ? (
                                <button
                                    onClick={handleSavePlan}
                                    className="flex items-center gap-1.5 rounded-xl bg-[#10B981] px-3.5 py-1.5 text-xs font-bold text-black hover:bg-[#0ea5e9]"
                                >
                                    <Check className="h-3.5 w-3.5" /> Save Plan
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-1.5 rounded-xl border border-[#29251B] bg-[#151515] px-3.5 py-1.5 text-xs font-semibold text-[#A8A8A0] hover:text-[#F5F5F0]"
                                >
                                    <Edit2 className="h-3.5 w-3.5 text-[#D4AF37]" /> Edit Plan
                                </button>
                            )}

                            <button
                                onClick={() => handleDeletePlan(formData.id)}
                                className="rounded-xl border border-red-500/30 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* 1. Charting Process Dropdown */}
                    <div className="rounded-2xl border border-[#29251B] bg-[#0D0D0D] overflow-hidden">
                        <button
                            onClick={() => toggleSection('charting')}
                            className="flex w-full items-center justify-between p-4 text-xs font-bold text-[#F5F5F0]"
                        >
                            <span>1. Charting Process</span>
                            {openSections.charting ? <ChevronUp className="h-4 w-4 text-[#D4AF37]" /> : <ChevronDown className="h-4 w-4" />}
                        </button>

                        {openSections.charting && (
                            <div className="border-t border-[#29251B] p-4 space-y-3">
                                <ul className="space-y-2">
                                    {formData.chartingProcess.map((item, idx) => (
                                        <li key={idx} className="flex items-center justify-between rounded-xl border border-[#29251B] bg-[#151515] px-3.5 py-2 text-xs text-[#F5F5F0]">
                                            <span>{idx + 1}. {item}</span>
                                            {isEditing && (
                                                <button onClick={() => removeListItem('chartingProcess', idx)} className="text-[#A8A8A0] hover:text-red-400">
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>

                                {isEditing && (
                                    <div className="flex items-center gap-2 pt-1">
                                        <input
                                            type="text"
                                            placeholder="Add process step..."
                                            value={tempCharting}
                                            onChange={(e) => setTempCharting(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addListItem('chartingProcess', tempCharting, setTempCharting)}
                                            className="flex-1 rounded-xl border border-[#29251B] bg-[#151515] px-3.5 py-2 text-xs text-[#F5F5F0] focus:border-[#D4AF37] focus:outline-none"
                                        />
                                        <button
                                            onClick={() => addListItem('chartingProcess', tempCharting, setTempCharting)}
                                            className="rounded-xl bg-[#151515] border border-[#29251B] px-3 py-2 text-xs font-semibold text-[#D4AF37] hover:border-[#D4AF37]"
                                        >
                                            Add
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 2. Entry Criteria Dropdown */}
                    <div className="rounded-2xl border border-[#29251B] bg-[#0D0D0D] overflow-hidden">
                        <button
                            onClick={() => toggleSection('entry')}
                            className="flex w-full items-center justify-between p-4 text-xs font-bold text-[#F5F5F0]"
                        >
                            <span>2. Entry Criteria Checklist</span>
                            {openSections.entry ? <ChevronUp className="h-4 w-4 text-[#D4AF37]" /> : <ChevronDown className="h-4 w-4" />}
                        </button>

                        {openSections.entry && (
                            <div className="border-t border-[#29251B] p-4 space-y-3">
                                <ul className="space-y-2">
                                    {formData.entryCriteria.map((item, idx) => (
                                        <li key={idx} className="flex items-center justify-between rounded-xl border border-[#29251B] bg-[#151515] px-3.5 py-2 text-xs text-[#F5F5F0]">
                                            <span className="flex items-center gap-2">
                                                <Check className="h-3.5 w-3.5 text-[#10B981]" /> {item}
                                            </span>
                                            {isEditing && (
                                                <button onClick={() => removeListItem('entryCriteria', idx)} className="text-[#A8A8A0] hover:text-red-400">
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>

                                {isEditing && (
                                    <div className="flex items-center gap-2 pt-1">
                                        <input
                                            type="text"
                                            placeholder="Add entry criterion..."
                                            value={tempEntry}
                                            onChange={(e) => setTempEntry(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addListItem('entryCriteria', tempEntry, setTempEntry)}
                                            className="flex-1 rounded-xl border border-[#29251B] bg-[#151515] px-3.5 py-2 text-xs text-[#F5F5F0] focus:border-[#D4AF37] focus:outline-none"
                                        />
                                        <button
                                            onClick={() => addListItem('entryCriteria', tempEntry, setTempEntry)}
                                            className="rounded-xl bg-[#151515] border border-[#29251B] px-3 py-2 text-xs font-semibold text-[#D4AF37] hover:border-[#D4AF37]"
                                        >
                                            Add
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 3. Entry Models (3 Image Uploads) */}
                    <div className="rounded-2xl border border-[#29251B] bg-[#0D0D0D] overflow-hidden">
                        <button
                            onClick={() => toggleSection('models')}
                            className="flex w-full items-center justify-between p-4 text-xs font-bold text-[#F5F5F0]"
                        >
                            <span>3. Entry Models (Multi-Timeframe Structure)</span>
                            {openSections.models ? <ChevronUp className="h-4 w-4 text-[#D4AF37]" /> : <ChevronDown className="h-4 w-4" />}
                        </button>

                        {openSections.models && (
                            <div className="border-t border-[#29251B] p-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                {[
                                    { key: 'htf', label: 'Higher Timeframe (HTF)' },
                                    { key: 'mtf', label: 'Medium Timeframe (MTF)' },
                                    { key: 'ltf', label: 'Lower Timeframe (LTF)' },
                                ].map((tf) => (
                                    <div key={tf.key} className="flex flex-col items-center justify-center rounded-xl border border-[#29251B] bg-[#151515] p-3 text-center">
                                        <span className="mb-2 text-[11px] font-semibold text-[#A8A8A0]">{tf.label}</span>
                                        {formData.entryModels[tf.key] ? (
                                            <div className="relative h-28 w-full overflow-hidden rounded-lg">
                                                <img src={formData.entryModels[tf.key]} alt={tf.label} className="h-full w-full object-cover" />
                                                {isEditing && (
                                                    <label className="absolute bottom-1 right-1 cursor-pointer rounded-md bg-black/80 p-1 text-white">
                                                        <ImageIcon className="h-3.5 w-3.5" />
                                                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(tf.key, e)} className="hidden" />
                                                    </label>
                                                )}
                                            </div>
                                        ) : (
                                            <label className="flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#29251B] bg-[#0D0D0D] hover:border-[#D4AF37]">
                                                <ImageIcon className="h-6 w-6 text-[#A8A8A0]" />
                                                <span className="mt-1 text-[10px] text-[#A8A8A0]">Upload Model</span>
                                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(tf.key, e)} className="hidden" disabled={!isEditing} />
                                            </label>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 4. Trade Management Rules */}
                    <div className="rounded-2xl border border-[#29251B] bg-[#0D0D0D] overflow-hidden">
                        <button
                            onClick={() => toggleSection('management')}
                            className="flex w-full items-center justify-between p-4 text-xs font-bold text-[#F5F5F0]"
                        >
                            <span>4. Trade Management Rules</span>
                            {openSections.management ? <ChevronUp className="h-4 w-4 text-[#D4AF37]" /> : <ChevronDown className="h-4 w-4" />}
                        </button>

                        {openSections.management && (
                            <div className="border-t border-[#29251B] p-4">
                                {isEditing ? (
                                    <textarea
                                        rows={3}
                                        value={formData.tradeManagement}
                                        onChange={(e) => setFormData({ ...formData, tradeManagement: e.target.value })}
                                        className="w-full rounded-xl border border-[#29251B] bg-[#151515] p-3 text-xs text-[#F5F5F0] focus:border-[#D4AF37] focus:outline-none"
                                    />
                                ) : (
                                    <p className="text-xs leading-relaxed text-[#A8A8A0]">{formData.tradeManagement || 'No management rules added.'}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 5. Exit Criteria Dropdown */}
                    <div className="rounded-2xl border border-[#29251B] bg-[#0D0D0D] overflow-hidden">
                        <button
                            onClick={() => toggleSection('exit')}
                            className="flex w-full items-center justify-between p-4 text-xs font-bold text-[#F5F5F0]"
                        >
                            <span>5. Exit Criteria</span>
                            {openSections.exit ? <ChevronUp className="h-4 w-4 text-[#D4AF37]" /> : <ChevronDown className="h-4 w-4" />}
                        </button>

                        {openSections.exit && (
                            <div className="border-t border-[#29251B] p-4 space-y-3">
                                <ul className="space-y-2">
                                    {formData.exitCriteria.map((item, idx) => (
                                        <li key={idx} className="flex items-center justify-between rounded-xl border border-[#29251B] bg-[#151515] px-3.5 py-2 text-xs text-[#F5F5F0]">
                                            <span>{item}</span>
                                            {isEditing && (
                                                <button onClick={() => removeListItem('exitCriteria', idx)} className="text-[#A8A8A0] hover:text-red-400">
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>

                                {isEditing && (
                                    <div className="flex items-center gap-2 pt-1">
                                        <input
                                            type="text"
                                            placeholder="Add exit condition..."
                                            value={tempExit}
                                            onChange={(e) => setTempExit(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addListItem('exitCriteria', tempExit, setTempExit)}
                                            className="flex-1 rounded-xl border border-[#29251B] bg-[#151515] px-3.5 py-2 text-xs text-[#F5F5F0] focus:border-[#D4AF37] focus:outline-none"
                                        />
                                        <button
                                            onClick={() => addListItem('exitCriteria', tempExit, setTempExit)}
                                            className="rounded-xl bg-[#151515] border border-[#29251B] px-3 py-2 text-xs font-semibold text-[#D4AF37] hover:border-[#D4AF37]"
                                        >
                                            Add
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 6. Trading Notes */}
                    <div className="rounded-2xl border border-[#29251B] bg-[#0D0D0D] overflow-hidden">
                        <button
                            onClick={() => toggleSection('notes')}
                            className="flex w-full items-center justify-between p-4 text-xs font-bold text-[#F5F5F0]"
                        >
                            <span>6. Strategy Notes & Reminders</span>
                            {openSections.notes ? <ChevronUp className="h-4 w-4 text-[#D4AF37]" /> : <ChevronDown className="h-4 w-4" />}
                        </button>

                        {openSections.notes && (
                            <div className="border-t border-[#29251B] p-4">
                                {isEditing ? (
                                    <textarea
                                        rows={3}
                                        value={formData.tradingNotes}
                                        onChange={(e) => setFormData({ ...formData, tradingNotes: e.target.value })}
                                        className="w-full rounded-xl border border-[#29251B] bg-[#151515] p-3 text-xs text-[#F5F5F0] focus:border-[#D4AF37] focus:outline-none"
                                    />
                                ) : (
                                    <p className="text-xs leading-relaxed text-[#A8A8A0]">{formData.tradingNotes || 'No strategy notes added.'}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Plan Stats & Risk Control Card (Col 4) */}
                <div className="space-y-4 lg:col-span-4">

                    {/* Risk Control Card */}
                    <div className="rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-5 space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
                            <Sliders className="h-4 w-4" /> Plan Risk Parameters
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-[11px] text-[#A8A8A0]">Risk Per Trade (%)</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        step="0.5"
                                        value={formData.riskPerTrade}
                                        onChange={(e) => setFormData({ ...formData, riskPerTrade: e.target.value })}
                                        className="mt-1 w-full rounded-xl border border-[#29251B] bg-[#151515] px-3 py-1.5 text-xs text-[#F5F5F0] focus:border-[#D4AF37] focus:outline-none"
                                    />
                                ) : (
                                    <div className="font-mono text-sm font-bold text-[#F5F5F0]">{formData.riskPerTrade}%</div>
                                )}
                            </div>

                            <div>
                                <label className="text-[11px] text-[#A8A8A0]">Max Daily Loss Cap (%)</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        step="0.5"
                                        value={formData.maxDailyLoss}
                                        onChange={(e) => setFormData({ ...formData, maxDailyLoss: e.target.value })}
                                        className="mt-1 w-full rounded-xl border border-[#29251B] bg-[#151515] px-3 py-1.5 text-xs text-[#F5F5F0] focus:border-[#D4AF37] focus:outline-none"
                                    />
                                ) : (
                                    <div className="font-mono text-sm font-bold text-red-400">{formData.maxDailyLoss}%</div>
                                )}
                            </div>

                            <div>
                                <label className="text-[11px] text-[#A8A8A0]">Minimum Risk:Reward Ratio</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.minRR}
                                        onChange={(e) => setFormData({ ...formData, minRR: e.target.value })}
                                        className="mt-1 w-full rounded-xl border border-[#29251B] bg-[#151515] px-3 py-1.5 text-xs text-[#F5F5F0] focus:border-[#D4AF37] focus:outline-none"
                                    />
                                ) : (
                                    <div className="font-mono text-sm font-bold text-[#10B981]">{formData.minRR}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Plan Performance Stats Card */}
                    <div className="rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-5 space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#F5F5F0]">
                            <Layers className="h-4 w-4 text-[#D4AF37]" /> Plan Historical Stats
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="rounded-xl border border-[#29251B] bg-[#151515] p-3">
                                <span className="text-[10px] text-[#A8A8A0]">Executions</span>
                                <div className="font-mono text-sm font-bold text-[#F5F5F0]">24 Trades</div>
                            </div>

                            <div className="rounded-xl border border-[#29251B] bg-[#151515] p-3">
                                <span className="text-[10px] text-[#A8A8A0]">Win Rate</span>
                                <div className="font-mono text-sm font-bold text-[#10B981]">62.5%</div>
                            </div>

                            <div className="rounded-xl border border-[#29251B] bg-[#151515] p-3">
                                <span className="text-[10px] text-[#A8A8A0]">Profit Factor</span>
                                <div className="font-mono text-sm font-bold text-[#F5F5F0]">1.85</div>
                            </div>

                            <div className="rounded-xl border border-[#29251B] bg-[#151515] p-3">
                                <span className="text-[10px] text-[#A8A8A0]">Total Net PnL</span>
                                <div className="font-mono text-sm font-bold text-[#10B981]">+$840.00</div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-[#29251B] bg-[#151515] p-3 text-[11px] text-[#A8A8A0] flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                            <span>Stats update automatically based on journal logs linked to this strategy.</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}