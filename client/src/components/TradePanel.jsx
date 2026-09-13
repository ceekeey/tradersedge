import { useState } from 'react';
import { Layers, Clock, ListFilter, ChevronDown, ChevronUp } from 'lucide-react';

export default function TradePanel({ isCollapsed = false, onToggle = () => { } }) {
    const [bottomTab, setBottomTab] = useState('positions');

    const containerHeightClass = isCollapsed ? 'h-9' : 'h-44';

    return (
        <div className={`flex ${containerHeightClass} flex-col overflow-hidden rounded-2xl border border-[#29251B] bg-[#0D0D0D] transition-all duration-300`}>
            {/* Bottom Tabs + Collapse Toggle */}
            <div className="flex h-9 shrink-0 items-center border-b border-[#29251B] px-2">
                <div className="flex-1 flex items-center">
                    {[
                        { id: 'positions', label: 'Open Positions (1)', icon: Layers },
                        { id: 'pending', label: 'Pending Orders (2)', icon: Clock },
                        { id: 'history', label: 'Closed Positions', icon: ListFilter },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setBottomTab(tab.id)}
                                className={`flex h-9 items-center gap-1.5 border-b-2 px-2 py-1 text-[11px] font-semibold transition ${bottomTab === tab.id
                                    ? 'border-[#D4AF37] text-[#D4AF37]'
                                    : 'border-transparent text-[#A8A8A0] hover:text-[#F5F5F0]'
                                    }`}
                            >
                                <Icon className="h-3 w-3" />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center">
                    <button
                        onClick={onToggle}
                        aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
                        className="mr-1 inline-flex items-center justify-center rounded p-1 text-[#A8A8A0] hover:text-[#D4AF37]"
                    >
                        {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className={`flex-1 overflow-x-auto overflow-y-auto p-2 ${isCollapsed ? 'hidden' : 'block'}`}>
                {bottomTab === 'positions' && (
                    <table className="w-full text-left text-[11px]">
                        <thead>
                            <tr className="border-b border-[#29251B] text-[#A8A8A0]">
                                <th className="pb-2">Asset</th>
                                <th className="pb-2">Type</th>
                                <th className="pb-2">Entry</th>
                                <th className="pb-2">Current</th>
                                <th className="pb-2">SL</th>
                                <th className="pb-2">TP</th>
                                <th className="pb-2">PnL</th>
                                <th className="pb-2 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#29251B]/50 text-[#F5F5F0]">
                            <tr>
                                <td className="py-1.5 font-medium">Vol 100 (1s)</td>
                                <td className="py-1.5 font-bold text-[#10B981]">BUY</td>
                                <td className="py-1.5">842.80</td>
                                <td className="py-1.5">854.10</td>
                                <td className="py-1.5 text-red-400">838.00</td>
                                <td className="py-1.5 text-[#10B981]">860.00</td>
                                <td className="py-1.5 font-bold text-[#10B981]">+$113.00</td>
                                <td className="py-1.5 text-right">
                                    <button className="rounded border border-red-500/40 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400 hover:bg-red-500/20">
                                        Close
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}

                {bottomTab === 'pending' && (
                    <div className="py-4 text-center text-[11px] text-[#A8A8A0]">
                        2 Limit orders active for Volatility 75 Index.
                    </div>
                )}

                {bottomTab === 'history' && (
                    <div className="py-4 text-center text-[11px] text-[#A8A8A0]">
                        Today's Realized PnL: <span className="font-bold text-[#10B981]">+$142.00</span> (2 Trades)
                    </div>
                )}
            </div>
        </div>
    );
}
