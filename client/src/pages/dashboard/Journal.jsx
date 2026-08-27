import React, { useState } from 'react';
import { Link } from "react-router-dom"
import {
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    TrendingDown,
    X,
    Calendar,
    Filter,
    DollarSign,
    Percent,
    BarChart3
} from 'lucide-react';

// Sample Trade Data (Aug 2026)
const MOCK_TRADES = {
    '2026-08-02': [
        { id: 't1', time: '10:15 AM', asset: 'Volatility 100 Index', type: 'SELL', duration: '15m', pnl: -24.00, win: false },
        { id: 't2', time: '02:30 PM', asset: 'Boom 1000 Index', type: 'BUY', duration: '45m', pnl: -15.00, win: false },
    ],
    '2026-08-05': [
        { id: 't3', time: '09:00 AM', asset: 'Volatility 75 Index', type: 'BUY', duration: '1h 20m', pnl: 180.50, win: true },
    ],
    '2026-08-12': [
        { id: 't4', time: '11:45 AM', asset: 'EUR/USD', type: 'SELL', duration: '30m', pnl: 95.00, win: true },
        { id: 't5', time: '04:10 PM', asset: 'Crash 500 Index', type: 'BUY', duration: '10m', pnl: -30.00, win: false },
    ],
    '2026-08-18': [
        { id: 't6', time: '08:00 AM', asset: 'Volatility 100 Index', type: 'BUY', duration: '2h', pnl: 310.00, win: true },
    ],
    '2026-08-21': [
        { id: 't7', time: '01:15 PM', asset: 'Gold (XAU/USD)', type: 'SELL', duration: '50m', pnl: -85.00, win: false },
    ]
};

export default function Journal() {
    // Current date state: defaults to August 2026
    const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1));
    const [selectedDate, setSelectedDate] = useState(null);
    const [modalFilter, setModalFilter] = useState('ALL'); // ALL, WIN, LOSS

    // Date Logic
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-indexed
    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon...

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    // Calculate Monthly Stats
    let totalPnl = 0;
    let totalTradesCount = 0;
    let winCount = 0;

    Object.keys(MOCK_TRADES).forEach((dateKey) => {
        const [dYear, dMonth] = dateKey.split('-').map(Number);
        if (dYear === year && dMonth === month + 1) {
            MOCK_TRADES[dateKey].forEach((t) => {
                totalPnl += t.pnl;
                totalTradesCount += 1;
                if (t.win) winCount += 1;
            });
        }
    });

    const winRate = totalTradesCount > 0 ? ((winCount / totalTradesCount) * 100).toFixed(1) : '0.0';

    // Modal Details Logic
    const selectedDateKey = selectedDate
        ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`
        : null;

    const selectedDayTrades = selectedDateKey && MOCK_TRADES[selectedDateKey] ? MOCK_TRADES[selectedDateKey] : [];

    const filteredTrades = selectedDayTrades.filter((trade) => {
        if (modalFilter === 'WIN') return trade.win;
        if (modalFilter === 'LOSS') return !trade.win;
        return true;
    });

    return (
        <div className="relative flex min-h-screen flex-col gap-6 bg-[#070707] p-4 text-[#F5F5F0] lg:p-6">

            {/* ================= TOP MONTH FILTER ================= */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                        <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-[#F5F5F0]">{monthName} {year}</h1>
                        <p className="text-xs text-[#A8A8A0]">Performance & Trading Logs</p>
                    </div>
                </div>

                {/* Month Selector Buttons */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                        onClick={prevMonth}
                        className="flex h-9 items-center gap-1 rounded-xl border border-[#29251B] bg-[#151515] px-3 text-xs font-semibold text-[#A8A8A0] transition hover:border-[#D4AF37] hover:text-[#F5F5F0]"
                    >
                        <ChevronLeft className="h-4 w-4" /> Prev
                    </button>
                    <button
                        onClick={() => setCurrentDate(new Date(2026, 7, 1))}
                        className="h-9 rounded-xl border border-[#29251B] bg-[#151515] px-3 text-xs font-semibold text-[#D4AF37] hover:bg-[#29251B]/40"
                    >
                        Current Month
                    </button>
                    <button
                        onClick={nextMonth}
                        className="flex h-9 items-center gap-1 rounded-xl border border-[#29251B] bg-[#151515] px-3 text-xs font-semibold text-[#A8A8A0] transition hover:border-[#D4AF37] hover:text-[#F5F5F0]"
                    >
                        Next <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* ================= CALENDAR GRID ================= */}
            <div className="rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-4">
                {/* Weekday Labels */}
                <div className="mb-2 grid grid-cols-7 text-center text-xs font-semibold text-[#A8A8A0]">
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                </div>

                {/* Day Boxes */}
                <div className="grid grid-cols-7 gap-2">
                    {/* Empty Padding Days */}
                    {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                        <div key={`empty-${idx}`} className="h-24 rounded-xl border border-transparent bg-transparent" />
                    ))}

                    {/* Active Month Days */}
                    {Array.from({ length: daysInMonth }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                        const dayTrades = MOCK_TRADES[dateKey] || [];
                        const hasTrades = dayTrades.length > 0;

                        const dayNetPnl = dayTrades.reduce((acc, t) => acc + t.pnl, 0);

                        return (
                            <div
                                key={dayNum}
                                onClick={() => hasTrades && setSelectedDate(dayNum)}
                                className={`relative flex h-24 flex-col justify-between rounded-xl border p-2 transition ${hasTrades
                                    ? 'cursor-pointer border-[#29251B] bg-[#151515] hover:border-[#D4AF37]'
                                    : 'border-[#29251B]/40 bg-[#0D0D0D]/60 text-[#6F6F68]'
                                    }`}
                            >
                                <span className="text-xs font-bold">{dayNum}</span>

                                {hasTrades && (
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[10px] text-[#A8A8A0]">{dayTrades.length} Trade{dayTrades.length > 1 ? 's' : ''}</span>
                                        <span className={`font-mono text-xs font-bold ${dayNetPnl >= 0 ? 'text-[#10B981]' : 'text-red-400'}`}>
                                            {dayNetPnl >= 0 ? `+$${dayNetPnl.toFixed(2)}` : `-$${Math.abs(dayNetPnl).toFixed(2)}`}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ================= BOTTOM MONTHLY SUMMARY & WEEKLY BREAKDOWN ================= */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

                {/* Monthly Summary */}
                <div className="flex flex-col justify-between rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-5 lg:col-span-4">
                    <h2 className="flex items-center gap-2 text-sm font-bold text-[#F5F5F0]">
                        <BarChart3 className="h-4 w-4 text-[#D4AF37]" /> Monthly Summary
                    </h2>

                    <div className="my-4 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#29251B] pb-2">
                            <span className="text-xs text-[#A8A8A0]">Net PnL</span>
                            <span className={`font-mono text-base font-bold ${totalPnl >= 0 ? 'text-[#10B981]' : 'text-red-400'}`}>
                                {totalPnl >= 0 ? `+$${totalPnl.toFixed(2)}` : `-$${Math.abs(totalPnl).toFixed(2)}`}
                            </span>
                        </div>

                        <div className="flex items-center justify-between border-b border-[#29251B] pb-2">
                            <span className="text-xs text-[#A8A8A0]">Win Rate</span>
                            <span className="font-mono text-sm font-bold text-[#F5F5F0]">{winRate}%</span>
                        </div>

                        <div className="flex items-center justify-between border-b border-[#29251B] pb-2">
                            <span className="text-xs text-[#A8A8A0]">Total Trades</span>
                            <span className="font-mono text-sm font-bold text-[#F5F5F0]">{totalTradesCount}</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-[#29251B] bg-[#151515] p-3 text-[11px] text-[#A8A8A0]">
                        Goal: Keep Win Rate above <span className="font-semibold text-[#D4AF37]">55%</span> with 1:2 R:R.
                    </div>
                </div>

                {/* Weekly Breakdown */}
                <div className="rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-5 lg:col-span-8">
                    <h2 className="mb-4 text-sm font-bold text-[#F5F5F0]">Weekly Performance Breakdown</h2>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {[
                            { week: 'Week 1 (Aug 1 - 7)', pnl: 141.50, winRate: '33%', count: 3 },
                            { week: 'Week 2 (Aug 8 - 14)', pnl: 65.00, winRate: '50%', count: 2 },
                            { week: 'Week 3 (Aug 15 - 21)', pnl: 225.00, winRate: '50%', count: 2 },
                            { week: 'Week 4 (Aug 22 - 31)', pnl: 0.00, winRate: '0%', count: 0 },
                        ].map((w, i) => (
                            <div key={i} className="flex flex-col justify-between rounded-xl border border-[#29251B] bg-[#151515] p-3.5">
                                <span className="text-xs font-semibold text-[#A8A8A0]">{w.week}</span>
                                <div className="my-2">
                                    <div className={`font-mono text-base font-bold ${w.pnl >= 0 ? 'text-[#10B981]' : 'text-red-400'}`}>
                                        {w.pnl >= 0 ? `+$${w.pnl.toFixed(2)}` : `-$${Math.abs(w.pnl).toFixed(2)}`}
                                    </div>
                                </div>
                                <div className="flex justify-between text-[10px] text-[#6F6F68]">
                                    <span>WR: {w.winRate}</span>
                                    <span>{w.count} Trades</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ================= LEFT SLIDE-OVER DRAWER / MODAL ================= */}
            {selectedDate !== null && (
                <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm">
                    {/* Slide-over Drawer Panel */}
                    <div className="relative flex h-full w-full max-w-md flex-col border-r border-[#29251B] bg-[#0D0D0D] p-6 shadow-2xl transition-all">

                        {/* Drawer Header */}
                        <div className="flex items-center justify-between border-b border-[#29251B] pb-4">
                            <div>
                                <h3 className="text-base font-bold text-[#F5F5F0]">
                                    Trades on {monthName} {selectedDate}, {year}
                                </h3>
                                <p className="text-xs text-[#A8A8A0]">{selectedDayTrades.length} Recorded Execution(s)</p>
                            </div>
                            <button
                                onClick={() => { setSelectedDate(null); setModalFilter('ALL'); }}
                                className="rounded-lg p-1 text-[#A8A8A0] hover:bg-[#151515] hover:text-[#F5F5F0]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Drawer Filters (ALL / WIN / LOSS) */}
                        <div className="my-4 flex items-center gap-2">
                            <Filter className="h-3.5 w-3.5 text-[#A8A8A0]" />
                            <span className="text-xs text-[#A8A8A0]">Filter:</span>
                            {['ALL', 'WIN', 'LOSS'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setModalFilter(f)}
                                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${modalFilter === f
                                        ? 'bg-[#D4AF37] text-black'
                                        : 'border border-[#29251B] bg-[#151515] text-[#A8A8A0] hover:text-[#F5F5F0]'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {/* Drawer Trade List */}
                        <div className="flex-1 overflow-y-auto space-y-3">
                            {filteredTrades.length === 0 ? (
                                <div className="py-12 text-center text-xs text-[#A8A8A0]">
                                    No trades match the selected filter.
                                </div>
                            ) : (
                                filteredTrades.map((t) => (
                                    <div
                                        key={t.id}
                                        className="rounded-xl border border-[#29251B] bg-[#151515] p-3.5 transition hover:border-[#D4AF37]/50"
                                    >
                                        <Link to={`/journal/${t.id}`}>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-[#F5F5F0]">{t.asset}</span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${t.win ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-red-500/10 text-red-400'}`}>
                                                    {t.type}
                                                </span>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between text-xs text-[#A8A8A0]">
                                                <span>Time: {t.time}</span>
                                                <span>Duration: {t.duration}</span>
                                            </div>

                                            <div className="mt-2 flex items-center justify-between border-t border-[#29251B]/50 pt-2 font-mono text-xs">
                                                <span className="text-[#6F6F68]">Realized PnL</span>
                                                <span className={`font-bold ${t.win ? 'text-[#10B981]' : 'text-red-400'}`}>
                                                    {t.pnl >= 0 ? `+$${t.pnl.toFixed(2)}` : `-$${Math.abs(t.pnl).toFixed(2)}`}
                                                </span>
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Click Outside Backdrop */}
                    <div className="flex-1" onClick={() => { setSelectedDate(null); setModalFilter('ALL'); }} />
                </div>
            )}
        </div>
    );
}