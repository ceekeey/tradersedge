import { useState, useEffect } from 'react';
import { TrendingUp, Bell, CheckSquare, Plus, X, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SidebarPanel({
    isCollapsed = false,
    onToggle = () => { },
    symbols = [],
    watchlist = [],
    selectedSymbol = null,
    onSelectSymbol = () => { },
    onAddSymbol = () => { },
    onRemoveSymbol = () => { },
    status = 'loading',
    error = null,
}) {
    const [rightTab, setRightTab] = useState('watchlist');
    const STORAGE_KEY = 'traders_edge_watchlist';

    const [watchlistSymbols, setWatchlistSymbols] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return JSON.parse(saved);
        } catch (e) {
            // ignore
        }
        return watchlist;
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlistSymbols));
        } catch (e) {
            // ignore quota errors
        }
    }, [watchlistSymbols]);

    const availableSymbols = symbols.filter((item) => !watchlistSymbols.some((watched) => watched.symbol === item.symbol));
    const formatPrice = (price, pipSize) => {
        if (!Number.isFinite(price)) return 'Loading…';
        const decimals = Number.isFinite(Number(pipSize)) ? Math.max(0, Math.min(10, Math.round(-Math.log10(Number(pipSize))))) : undefined;
        return decimals === undefined ? String(price) : price.toFixed(decimals);
    };

    const [checklist, setChecklist] = useState([
        { id: 1, label: 'Higher Timeframe Trend Aligned', checked: true },
        { id: 2, label: 'Risk/Reward >= 1:2', checked: true },
        { id: 3, label: 'Deriv Spread Within Limit', checked: false },
        { id: 4, label: 'Max Drawdown Guard Passed', checked: true },
    ]);

    const toggleChecklist = (id) => {
        setChecklist((prev) =>
            prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
        );
    };

    const handleAddSymbol = (symbol) => {
        const item = symbols.find((s) => s.symbol === symbol);
        if (!item) return;
        setWatchlistSymbols((prev) => {
            if (prev.some((p) => p.symbol === symbol)) return prev;
            return [...prev, item];
        });
        onAddSymbol(symbol);
    };

    const handleRemoveSymbol = (symbol) => {
        setWatchlistSymbols((prev) => prev.filter((p) => p.symbol !== symbol));
        onRemoveSymbol(symbol);
    };

    // Collapsed Rail View
    if (isCollapsed) {
        return (
            <div className="flex h-full w-12 flex-col items-center justify-between overflow-hidden rounded-2xl border border-[#29251B] bg-[#0D0D0D] py-2.5">
                <div className="flex flex-col items-center gap-3">
                    <button
                        onClick={onToggle}
                        title="Expand sidebar"
                        className="rounded-lg p-1.5 text-[#A8A8A0] transition hover:bg-[#151515] hover:text-[#D4AF37]"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <div className="h-px w-6 bg-[#29251B]" />

                    <div className="flex flex-col items-center gap-2.5">
                        {[
                            { id: 'watchlist', label: 'Watchlist', icon: TrendingUp },
                            { id: 'alerts', label: 'Alerts', icon: Bell },
                            { id: 'plan', label: 'Trade Plan', icon: CheckSquare },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            const isActive = rightTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setRightTab(tab.id);
                                        onToggle(); // Auto-expand when tab is clicked in rail mode
                                    }}
                                    title={tab.label}
                                    className={`relative rounded-lg p-2 transition ${isActive
                                        ? 'bg-[#151515] text-[#D4AF37]'
                                        : 'text-[#A8A8A0] hover:bg-[#151515]/60 hover:text-[#F5F5F0]'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {isActive && (
                                        <span className="absolute right-0 top-1/2 h-2 w-1 -translate-y-1/2 rounded-l-full bg-[#D4AF37]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // Expanded View
    return (
        <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#29251B] bg-[#0D0D0D]">
            {/* Header Tabs & Toggle Button */}
            <div className="flex h-10 items-center justify-between border-b border-[#29251B] px-2">
                <div className="flex flex-1 items-center gap-1 overflow-x-auto no-scrollbar">
                    {[
                        { id: 'watchlist', label: 'Watchlist', icon: TrendingUp },
                        { id: 'alerts', label: 'Alerts', icon: Bell },
                        { id: 'plan', label: 'Trade Plan', icon: CheckSquare },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = rightTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setRightTab(tab.id)}
                                title={tab.label}
                                className={`flex flex-1 justify-center py-2 whitespace-nowrap rounded-lg px-1.5 transition ${isActive
                                    ? 'bg-[#151515] text-[#D4AF37] border border-[#D4AF37]/30'
                                    : 'text-[#A8A8A0] hover:bg-[#151515]/50 hover:text-[#F5F5F0]'
                                    }`}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                            </button>
                        );
                    })}
                </div>

                <div className="ml-1 flex items-center border-l border-[#29251B] pl-1">
                    <button
                        onClick={onToggle}
                        title="Collapse sidebar"
                        className="rounded-lg p-1.5 text-[#A8A8A0] transition hover:bg-[#151515] hover:text-[#D4AF37]"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 overflow-y-auto p-2">
                {rightTab === 'watchlist' && (
                    <div className="space-y-1.5">
                        <div className="mb-2 flex items-center gap-2">
                            <select
                                aria-label="Add a market to the watchlist"
                                defaultValue=""
                                disabled={!availableSymbols.length}
                                onChange={(event) => {
                                    const val = event.target.value;
                                    if (val) handleAddSymbol(val);
                                    event.target.value = '';
                                }}
                                className="min-w-0 flex-1 rounded-lg border border-[#29251B] bg-[#151515] px-2 py-1.5 text-[11px] text-[#F5F5F0] focus:border-[#D4AF37] focus:outline-none disabled:opacity-60"
                            >
                                <option value="">{status === 'loading' ? 'Loading Deriv markets…' : 'Add a live market…'}</option>
                                {availableSymbols.map((item) => <option key={item.symbol} value={item.symbol}>{item.displayName} ({item.symbol})</option>)}
                            </select>
                        </div>
                        {error && <p className="rounded-lg border border-red-500/30 bg-red-500/5 p-2 text-[11px] text-red-400">{error}</p>}
                        {!error && !watchlist.length && status !== 'loading' && <p className="rounded-lg border border-[#29251B] bg-[#151515] p-3 text-xs text-[#A8A8A0]">Add a supported Deriv market to begin watching live prices.</p>}
                        {watchlistSymbols.map((item) => {
                            const isSelected = selectedSymbol === item.symbol;
                            const price = item.quote?.price;
                            const percentage = item.quote?.percentage;
                            const isUp = percentage === null || percentage === undefined ? true : percentage >= 0;
                            return (
                                <div
                                    key={item.symbol}
                                    onClick={() => onSelectSymbol(item.symbol)}
                                    className={`flex cursor-pointer items-center justify-between gap-2 rounded-xl border px-2 py-1.5 text-xs transition ${isSelected
                                        ? 'border-[#D4AF37] bg-[#1C180E] shadow-[0_0_10px_rgba(212,175,55,0.05)]'
                                        : 'border-[#29251B] bg-[#151515] hover:border-[#D4AF37]/50'
                                        }`}
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className={`truncate font-semibold ${isSelected ? 'text-[#D4AF37]' : 'text-[#F5F5F0]'}`}>
                                            {item.displayName}
                                        </div>
                                        <div className="text-[10px] text-[#A8A8A0]">{item.symbol} · {item.market}</div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="font-mono text-xs font-medium text-[#F5F5F0]">
                                            {item.quote?.error ? 'Unavailable' : formatPrice(price, item.pipSize)}
                                        </div>
                                        <div className={`text-[10px] font-bold ${isUp ? 'text-[#10B981]' : 'text-red-400'}`}>
                                            {Number.isFinite(percentage) ? `${isUp ? '+' : ''}${percentage.toFixed(3)}% tick` : 'Awaiting tick'}
                                        </div>
                                    </div>
                                    <button onClick={(event) => { event.stopPropagation(); handleRemoveSymbol(item.symbol); }} aria-label={`Remove ${item.displayName} from watchlist`} title="Remove from watchlist" className="rounded p-1 text-[#6F6F68] hover:bg-red-500/10 hover:text-red-400"><X className="h-3.5 w-3.5" /></button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {rightTab === 'alerts' && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#F5F5F0]">Active Price Alerts</span>
                            <button className="inline-flex items-center gap-1 text-[11px] text-[#D4AF37] hover:underline">
                                <Plus className="h-3.5 w-3.5" /> Add Alert
                            </button>
                        </div>
                        <div className="rounded-xl border border-[#29251B] bg-[#151515] p-2 text-xs">
                            <div className="flex items-center justify-between text-[#F5F5F0]">
                                <span className="font-semibold">Vol 75 &gt; 3,450.00</span>
                                <X className="h-4 w-4 cursor-pointer text-[#A8A8A0] transition hover:text-red-400" />
                            </div>
                            <div className="mt-1 text-[10px] text-[#A8A8A0]">Breakout notification</div>
                        </div>
                    </div>
                )}

                {rightTab === 'plan' && (
                    <div className="space-y-3">
                        <div className="rounded-xl border border-[#29251B] bg-[#151515] p-2">
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37]">
                                <Shield className="h-4 w-4 shrink-0" /> Pre-Trade Checklist
                            </div>
                            <p className="mt-1 text-[11px] leading-relaxed text-[#A8A8A0]">
                                Confirm strategy conditions before entering orders.
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            {checklist.map((item) => (
                                <label
                                    key={item.id}
                                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#29251B] bg-[#151515] px-2 py-1.5 text-xs text-[#F5F5F0] transition hover:border-[#D4AF37]/40"
                                >
                                    <input
                                        type="checkbox"
                                        checked={item.checked}
                                        onChange={() => toggleChecklist(item.id)}
                                        className="h-4 w-4 shrink-0 rounded border-[#29251B] bg-[#070707] text-[#D4AF37] focus:ring-[#D4AF37]"
                                    />
                                    <span className={`select-none ${item.checked ? 'text-[#A8A8A0] line-through' : ''}`}>
                                        {item.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
