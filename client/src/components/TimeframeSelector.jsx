import { CHART_TIMEFRAMES } from '../constants/chartTimeframes';

export default function TimeframeSelector({ selectedTimeframe, onChange, className = '' }) {
    return (
        <div aria-label="Chart timeframe" className={`flex shrink-0 rounded-lg border border-[#29251B] bg-[#0D0D0D] p-0.5 ${className}`}>
            {CHART_TIMEFRAMES.map((timeframe) => {
                const isSelected = selectedTimeframe === timeframe.label;
                return (
                    <button
                        key={timeframe.label}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => onChange(timeframe.label)}
                        className={`rounded-md px-2 py-1 text-[10px] transition sm:px-2.5 sm:text-xs ${isSelected
                            ? 'bg-[#D4AF37] font-bold text-black'
                            : 'text-[#A8A8A0] hover:bg-[#151515] hover:text-[#F5F5F0]'
                            }`}
                    >
                        {timeframe.label}
                    </button>
                );
            })}
        </div>
    );
}
