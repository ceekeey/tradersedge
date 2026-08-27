import { useCallback, useEffect, useRef, useState } from 'react';
import { CandlestickSeries, createChart } from 'lightweight-charts';
import { DEFAULT_TIMEFRAME, getTimeframe } from '../constants/chartTimeframes';
import useDerivCandles from '../hooks/useDerivCandles';
import TimeframeSelector from './TimeframeSelector';

const formatPrice = (price, pipSize) => {
    if (!Number.isFinite(price)) return '--';
    const decimals = Number.isFinite(Number(pipSize)) ? Math.max(0, Math.min(10, Math.round(-Math.log10(Number(pipSize))))) : undefined;
    return decimals === undefined ? String(price) : price.toFixed(decimals);
};

export default function ChartSection({ symbol, symbolInfo }) {
    const containerRef = useRef(null);
    const chartRef = useRef(null);
    const seriesRef = useRef(null);
    const currentCandleRef = useRef(null);
    const [price, setPrice] = useState(null);
    const [selectedTimeframe, setSelectedTimeframe] = useState(DEFAULT_TIMEFRAME);
    const selectedGranularity = getTimeframe(selectedTimeframe).granularity;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return undefined;
        let resizeObserver = null;
        let chart = null;
        let series = null;
        let cancelled = false;

        const tryInit = () => {
            if (cancelled) return;
            const width = container.clientWidth;
            const height = container.clientHeight;
            if (width > 0 && height > 0) {
                requestAnimationFrame(() => {
                    if (cancelled) return;
                    chart = createChart(container, {
                        width, height,
                        layout: { background: { color: '#0D0D0D' }, textColor: '#A8A8A0' },
                        grid: { vertLines: { color: '#1B1812' }, horzLines: { color: '#1B1812' } },
                        crosshair: { vertLine: { color: '#D4AF37', labelBackgroundColor: '#151515' }, horzLine: { color: '#D4AF37', labelBackgroundColor: '#151515' } },
                        rightPriceScale: { borderColor: '#29251B' },
                        timeScale: { borderColor: '#29251B', timeVisible: true, secondsVisible: false },
                    });
                    series = chart.addSeries(CandlestickSeries, { upColor: '#10B981', downColor: '#EF4444', borderUpColor: '#10B981', borderDownColor: '#EF4444', wickUpColor: '#10B981', wickDownColor: '#EF4444' });
                    chartRef.current = chart;
                    seriesRef.current = series;

                    resizeObserver = new ResizeObserver(() => {
                        requestAnimationFrame(() => chart.resize(container.clientWidth, container.clientHeight));
                    });
                    resizeObserver.observe(container);
                });
            } else {
                // Retry after a short delay to wait for layout to settle
                setTimeout(tryInit, 50);
            }
        };

        tryInit();

        return () => {
            cancelled = true;
            if (resizeObserver) try { resizeObserver.disconnect(); } catch (e) { }
            if (chart) try { chart.remove(); } catch (e) { }
            chartRef.current = null;
            seriesRef.current = null;
        };
    }, []);

    const handleStart = useCallback(() => {
        setPrice(null);
        seriesRef.current?.setData([]);
        currentCandleRef.current = null;
    }, []);

    const handleHistory = useCallback((candles) => {
        requestAnimationFrame(() => {
            seriesRef.current?.setData(candles);
            chartRef.current?.timeScale().fitContent();
        });
        currentCandleRef.current = candles.at(-1);
        setPrice(candles.at(-1).close);
    }, []);

    const handleTick = useCallback((tick) => {
        const quote = Number(tick.quote);
        const epoch = Number(tick.epoch);
        if (!Number.isFinite(quote) || !Number.isFinite(epoch)) return;
        setPrice(quote);
        const candleTime = Math.floor(epoch / selectedGranularity) * selectedGranularity;
        const previous = currentCandleRef.current;
        const candle = !previous || previous.time !== candleTime
            ? { time: candleTime, open: quote, high: quote, low: quote, close: quote }
            : { ...previous, high: Math.max(previous.high, quote), low: Math.min(previous.low, quote), close: quote };
        currentCandleRef.current = candle;
        seriesRef.current?.update(candle);
    }, [selectedGranularity]);

    const { status, error } = useDerivCandles({
        symbol,
        granularity: selectedGranularity,
        onStart: handleStart,
        onHistory: handleHistory,
        onTick: handleTick,
    });

    return (
        <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-[#29251B] bg-[#0D0D0D]">
            <div className="flex min-h-12 shrink-0 items-center justify-between gap-3 border-b border-[#29251B] px-4 py-2">
                <div className="min-w-0">
                    <div className="truncate text-xs font-semibold text-[#F5F5F0]">{symbolInfo?.displayName ?? 'No market selected'}</div>
                    <div className="text-[10px] uppercase tracking-[0.15em] text-[#A8A8A0]">{symbol ?? 'Watchlist'} · {selectedTimeframe} · {status}</div>
                </div>
                <div className="flex items-center gap-2">
                    <TimeframeSelector selectedTimeframe={selectedTimeframe} onChange={setSelectedTimeframe} />
                    <div className="hidden font-mono text-xs font-bold text-[#10B981] sm:block">{formatPrice(price, symbolInfo?.pipSize)}</div>
                </div>
            </div>
            {error && <div className="border-b border-[#EF4444]/20 bg-[#EF4444]/5 px-4 py-2 text-xs text-[#EF4444]">{error}</div>}
            <div className="relative w-full flex-1 min-h-[400px]">
                <div ref={containerRef} className="h-full w-full" />
                {status === 'loading' && (
                    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0D0D0D]/80 backdrop-blur-xs">
                        <span className="h-7 w-7 animate-spin rounded-full border-2 border-b-[#D4AF37]/20 border-l-transparent border-r-transparent border-t-[#D4AF37]" />
                        <span className="mt-2 font-mono text-[11px] tracking-wide text-[#A8A8A0]">Loading {selectedTimeframe} candles…</span>
                    </div>
                )}
            </div>
        </div>
    );
}
