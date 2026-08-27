import React from 'react';
import { motion } from 'framer-motion';
import {
    Wallet,
    TrendingUp,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    ArrowUpRight,
    ArrowDownRight,
    Target,
    Activity,
    Award
} from 'lucide-react';

const stats = [
    {
        title: 'Deriv Account Balance',
        value: '$12,450.80',
        change: '+$1,240.00',
        isPositive: true,
        icon: Wallet,
        subtext: 'Equity: $12,680.12',
    },
    {
        title: 'Monthly PnL',
        value: '+$2,180.50',
        change: '+14.2%',
        isPositive: true,
        icon: TrendingUp,
        subtext: '18 Winning Trades',
    },
    {
        title: 'Discipline Score',
        value: '94 / 100',
        change: '+2 pts',
        isPositive: true,
        icon: Award,
        subtext: '0 Revenge Trades',
    },
    {
        title: 'Max Drawdown Guard',
        value: '1.2%',
        change: 'Limit: 3.0%',
        isPositive: true,
        icon: ShieldAlert,
        subtext: 'Safe Zone',
    },
];

const recentTrades = [
    {
        id: 'TRD-8842',
        symbol: 'Volatility 100 (1s) Index',
        type: 'BUY',
        entry: '842.10',
        exit: '856.40',
        pnl: '+$142.00',
        status: 'WIN',
        time: '10:42 AM',
        ruleCompliant: true,
    },
    {
        id: 'TRD-8841',
        symbol: 'Volatility 75 Index',
        type: 'SELL',
        entry: '3,410.20',
        exit: '3,425.00',
        pnl: '-$68.00',
        status: 'LOSS',
        time: '09:15 AM',
        ruleCompliant: true,
    },
    {
        id: 'TRD-8840',
        symbol: 'Boom 1000 Index',
        type: 'BUY',
        entry: '10,240.00',
        exit: '10,295.50',
        pnl: '+$310.50',
        status: 'WIN',
        time: 'Yesterday',
        ruleCompliant: true,
    },
];

const monthlyBreakdown = [
    { label: 'Win Rate', value: '68.4%', target: 'Target: >60%' },
    { label: 'Average Risk/Reward', value: '1 : 2.4', target: 'Target: >1:2' },
    { label: 'Plan Compliance', value: '96%', target: 'Target: 100%' },
    { label: 'Total Trades Executed', value: '38', target: 'Max: 50/mo' },
];

export default function DashboardHome() {
    return (
        <div className="space-y-8">

            {/* Header Block */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[#F5F5F0]">Execution Command Center</h1>
                    <p className="text-xs text-[#A8A8A0]">
                        Real-time Deriv workspace metrics and monthly discipline analytics.
                    </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl border border-[#29251B] bg-[#0D0D0D] px-3.5 py-2 text-xs text-[#D4AF37]">
                    <Target className="h-4 w-4" />
                    Focus Mode Active
                </div>
            </div>

            {/* Top Stat Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className="relative overflow-hidden rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-5 transition-all hover:border-[#D4AF37]/40"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-[#A8A8A0]">{stat.title}</span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#29251B] bg-[#151515] text-[#D4AF37]">
                                    <Icon className="h-4 w-4" />
                                </div>
                            </div>

                            <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-2xl font-semibold text-[#F5F5F0]">{stat.value}</span>
                                <span className="text-xs font-medium text-[#10B981]">
                                    {stat.change}
                                </span>
                            </div>

                            <div className="mt-2 text-[11px] text-[#A8A8A0]">{stat.subtext}</div>
                        </div>
                    );
                })}
            </div>

            {/* Main Content Grid: Recent Trades & Discipline Summary */}
            <div className="grid gap-8 lg:grid-cols-12">

                {/* Recent Trades Table (8 Cols) */}
                <div className="rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-5 lg:col-span-8">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-[#D4AF37]" />
                            <h2 className="text-sm font-semibold text-[#F5F5F0]">Recent Executions</h2>
                        </div>
                        <button className="text-xs font-medium text-[#D4AF37] hover:underline">
                            View All Logs →
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-[#29251B] text-[#A8A8A0]">
                                    <th className="pb-3 font-medium">Asset</th>
                                    <th className="pb-3 font-medium">Type</th>
                                    <th className="pb-3 font-medium">Entry / Exit</th>
                                    <th className="pb-3 font-medium">PnL</th>
                                    <th className="pb-3 font-medium">Rules</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#29251B]/50 text-[#F5F5F0]">
                                {recentTrades.map((trade) => (
                                    <tr key={trade.id} className="hover:bg-[#151515]/50">
                                        <td className="py-3 font-medium">{trade.symbol}</td>
                                        <td className="py-3">
                                            <span
                                                className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${trade.type === 'BUY'
                                                        ? 'bg-[#10B981]/10 text-[#10B981]'
                                                        : 'bg-red-500/10 text-red-400'
                                                    }`}
                                            >
                                                {trade.type}
                                            </span>
                                        </td>
                                        <td className="py-3 text-[#A8A8A0]">
                                            {trade.entry} → {trade.exit}
                                        </td>
                                        <td
                                            className={`py-3 font-semibold ${trade.status === 'WIN' ? 'text-[#10B981]' : 'text-red-400'
                                                }`}
                                        >
                                            {trade.pnl}
                                        </td>
                                        <td className="py-3">
                                            {trade.ruleCompliant ? (
                                                <span className="inline-flex items-center gap-1 text-[#10B981]">
                                                    <CheckCircle2 className="h-3.5 w-3.5" /> Passed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-red-400">
                                                    <XCircle className="h-3.5 w-3.5" /> Violation
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Monthly Discipline Breakdown (4 Cols) */}
                <div className="rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-5 lg:col-span-4">
                    <h2 className="mb-4 text-sm font-semibold text-[#F5F5F0]">Monthly Discipline Score</h2>

                    <div className="space-y-4">
                        {monthlyBreakdown.map((item) => (
                            <div key={item.label} className="rounded-xl border border-[#29251B] bg-[#151515] p-3.5">
                                <div className="flex items-center justify-between text-xs text-[#A8A8A0]">
                                    <span>{item.label}</span>
                                    <span className="text-[10px] text-[#D4AF37]">{item.target}</span>
                                </div>
                                <div className="mt-1.5 text-lg font-semibold text-[#F5F5F0]">{item.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 rounded-xl border border-[#29251B] bg-[#070707] p-3 text-center text-xs text-[#A8A8A0]">
                        🔥 12 consecutive trades executed within strategy limits.
                    </div>
                </div>

            </div>
        </div>
    );
}