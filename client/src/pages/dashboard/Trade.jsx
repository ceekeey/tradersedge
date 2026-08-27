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

    // Keep the terminal dense: the chart owns 80%+ of the desktop grid while
    // the sidebar remains available as a compact utility panel.
    const leftCols = isSidebarCollapsed ? 'xl:col-span-11' : 'xl:col-span-10';
    const rightCols = isSidebarCollapsed ? 'xl:col-span-1' : 'xl:col-span-2';

    return (
        <div className="grid h-[calc(100vh-6rem)] w-full grid-cols-1 gap-4 overflow-hidden xl:grid-cols-12">
            {/* Left & Center: Chart (Top) + Orders/Positions (Bottom) */}
            <div className={`flex h-full min-w-0 flex-col gap-3 overflow-hidden transition-all duration-300 ${leftCols}`}>
                <ChartSection symbol={marketData.selectedSymbol} symbolInfo={selectedSymbolInfo} />
                <TradePanel isCollapsed={isBottomCollapsed} onToggle={toggleBottom} />
            </div>

            {/* Right: Watchlist / Alerts / Trade Plan */}
            <div className={`h-full min-w-0 overflow-hidden transition-all duration-300 xl:justify-self-end ${rightCols} ${isSidebarCollapsed ? 'xl:w-12' : 'xl:w-full xl:max-w-72'}`}>
                <SidebarPanel isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} symbols={marketData.symbols} watchlist={marketData.watchlist} selectedSymbol={marketData.selectedSymbol} onSelectSymbol={marketData.setSelectedSymbol} onAddSymbol={marketData.addToWatchlist} onRemoveSymbol={marketData.removeFromWatchlist} status={marketData.status} error={marketData.error} />
            </div>
        </div>
    );
}
