import { useState, useCallback } from 'react';
import ChartSection from './../../components/ChartSection';
import TradePanel from './../../components/TradePanel';
import SidebarPanel from './../../components/SidebarPanel';
import useDerivMarketData from '../../hooks/useDerivMarketData';

export default function Trade() {
    const [isBottomCollapsed, setIsBottomCollapsed] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const marketData = useDerivMarketData();
    const selectedSymbolInfo = marketData.symbols.find((item) => item.symbol === marketData.selectedSymbol);

    const triggerResize = useCallback(() => {
        // Dispatch a resize event immediately and again after the CSS transition
        // so ResizeObserver inside ChartSection recalculates the canvas.
        window.dispatchEvent(new Event('resize'));
        setTimeout(() => window.dispatchEvent(new Event('resize')), 350);
    }, []);

    const toggleBottom = useCallback(() => {
        setIsBottomCollapsed((s) => !s);
        triggerResize();
    }, [triggerResize]);

    const toggleSidebar = useCallback(() => {
        setIsSidebarCollapsed((s) => !s);
        triggerResize();
    }, [triggerResize]);

    // Use a responsive flex layout: stack on mobile, row on xl. Main area grows
    // and sidebar uses a fixed width when expanded (w-72 ≈ 288px) and compact
    // width when collapsed (w-12 ≈ 48px). This avoids mixing grid columns
    // and max-widths which caused conflicting constraints.
    return (
        <div className="flex h-[calc(100vh-6rem)] w-full flex-col gap-4 overflow-hidden xl:flex-row">
            {/* Left & Center: Chart (Top) + Orders/Positions (Bottom) */}
            <div className="flex flex-1 min-h-0 min-w-0 flex-col gap-3 overflow-hidden transition-all duration-300">
                <ChartSection symbol={marketData.selectedSymbol} symbolInfo={selectedSymbolInfo} />
                <TradePanel isCollapsed={isBottomCollapsed} onToggle={toggleBottom} />
            </div>

            {/* Right: Watchlist / Alerts / Trade Plan */}
            <div className={`h-full min-w-0 overflow-hidden transition-all duration-300 flex-shrink-0 ${isSidebarCollapsed ? 'w-12' : 'w-full xl:w-[300px]'}`}>
                <SidebarPanel isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} symbols={marketData.symbols} watchlist={marketData.watchlist} selectedSymbol={marketData.selectedSymbol} onSelectSymbol={marketData.setSelectedSymbol} onAddSymbol={marketData.addToWatchlist} onRemoveSymbol={marketData.removeFromWatchlist} status={marketData.status} error={marketData.error} />
            </div>
        </div>
    );
}
