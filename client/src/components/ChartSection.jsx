import { useCallback, useEffect, useRef, useState } from 'react';
import { CandlestickSeries, createChart } from 'lightweight-charts';
import { TrendingUp, RotateCcw, Trash2, Percent, ArrowUpRight, ArrowDownRight, MousePointer } from 'lucide-react';
import { DEFAULT_TIMEFRAME, getTimeframe } from '../constants/chartTimeframes';
import useDerivCandles from '../hooks/useDerivCandles';
import TimeframeSelector from './TimeframeSelector';

const formatPrice = (price, pipSize) => {
    if (!Number.isFinite(price)) return '--';
    const decimals = Number.isFinite(Number(pipSize))
        ? Math.max(0, Math.min(10, Math.round(-Math.log10(Number(pipSize)))))
        : undefined;
    return decimals === undefined ? String(price) : price.toFixed(decimals);
};

const FIB_LEVELS = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1.0];

export default function ChartSection({ symbol, symbolInfo }) {
    const containerRef = useRef(null);
    const overlayCanvasRef = useRef(null);
    const chartRef = useRef(null);
    const seriesRef = useRef(null);
    const currentCandleRef = useRef(null);

    const [price, setPrice] = useState(null);
    const [selectedTimeframe, setSelectedTimeframe] = useState(DEFAULT_TIMEFRAME);
    const selectedGranularity = getTimeframe(selectedTimeframe).granularity;

    // Active Drawing Tool: 'select' | 'trendline' | 'fib' | 'long' | 'short'
    const [activeTool, setActiveTool] = useState('select');
    const [drawings, setDrawings] = useState([]); // [{ id, type, start: {time, price}, end: {time, price} }]
    const [activeStart, setActiveStart] = useState(null); // First click point
    const [mousePos, setMousePos] = useState(null);

    // 1. Initialize Lightweight Chart
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
                        width,
                        height,
                        layout: { background: { color: '#0D0D0D' }, textColor: '#A8A8A0' },
                        grid: { vertLines: { color: '#1B1812' }, horzLines: { color: '#1B1812' } },
                        crosshair: {
                            vertLine: { color: '#D4AF37', labelBackgroundColor: '#151515' },
                            horzLine: { color: '#D4AF37', labelBackgroundColor: '#151515' },
                        },
                        rightPriceScale: { borderColor: '#29251B' },
                        timeScale: { borderColor: '#29251B', timeVisible: true, secondsVisible: false },
                    });

                    series = chart.addSeries(CandlestickSeries, {
                        upColor: '#10B981',
                        downColor: '#EF4444',
                        borderUpColor: '#10B981',
                        borderDownColor: '#EF4444',
                        wickUpColor: '#10B981',
                        wickDownColor: '#EF4444',
                    });

                    chartRef.current = chart;
                    seriesRef.current = series;

                    chart.timeScale().subscribeVisibleLogicalRangeChange(() => {
                        requestAnimationFrame(drawOverlayCanvas);
                    });

                    resizeObserver = new ResizeObserver(() => {
                        requestAnimationFrame(() => {
                            if (container.clientWidth > 0 && container.clientHeight > 0) {
                                chart.resize(container.clientWidth, container.clientHeight);
                                drawOverlayCanvas();
                            }
                        });
                    });
                    resizeObserver.observe(container);
                });
            } else {
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

    // 2. Canvas Drawing Engine
    const drawOverlayCanvas = useCallback(() => {
        const canvas = overlayCanvasRef.current;
        const chart = chartRef.current;
        const series = seriesRef.current;
        if (!canvas || !chart || !series) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const timeScale = chart.timeScale();

        const toCoords = (point) => {
            if (!point) return null;
            const x = timeScale.timeToCoordinate(point.time);
            const y = series.priceToCoordinate(point.price);
            if (x === null || y === null) return null;
            return { x, y };
        };

        const drawTool = (tool) => {
            const start = toCoords(tool.start);
            const end = toCoords(tool.end);
            if (!start || !end) return;

            if (tool.type === 'trendline') {
                ctx.strokeStyle = '#D4AF37';
                ctx.lineWidth = 2;
                ctx.setLineDash([]);
                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();

                ctx.fillStyle = '#D4AF37';
                ctx.beginPath();
                ctx.arc(start.x, start.y, 3, 0, Math.PI * 2);
                ctx.arc(end.x, end.y, 3, 0, Math.PI * 2);
                ctx.fill();
            } else if (tool.type === 'fib') {
                const minX = Math.min(start.x, end.x);
                const maxX = Math.max(start.x, end.x);
                const priceDiff = tool.end.price - tool.start.price;

                FIB_LEVELS.forEach((lvl) => {
                    const priceAtLvl = tool.start.price + priceDiff * lvl;
                    const y = series.priceToCoordinate(priceAtLvl);
                    if (y === null) return;

                    ctx.strokeStyle = lvl === 0.5 || lvl === 0.618 ? '#D4AF37' : 'rgba(245, 245, 240, 0.4)';
                    ctx.lineWidth = lvl === 0.5 || lvl === 0.618 ? 1.5 : 1;
                    ctx.setLineDash([]);

                    ctx.beginPath();
                    ctx.moveTo(minX, y);
                    ctx.lineTo(maxX, y);
                    ctx.stroke();

                    // Text Label
                    ctx.fillStyle = '#A8A8A0';
                    ctx.font = '10px monospace';
                    ctx.fillText(`${(lvl * 100).toFixed(1)}% (${priceAtLvl.toFixed(2)})`, maxX + 5, y + 3);
                });
            } else if (tool.type === 'long' || tool.type === 'short') {
                const minX = Math.min(start.x, end.x);
                const maxX = Math.max(start.x, end.x);

                const entryPrice = tool.start.price;
                const targetPrice = tool.end.price;
                const entryY = start.y;
                const targetY = end.y;

                // Stop loss auto-calculated symmetrically for initial draft
                const riskDist = Math.abs(targetPrice - entryPrice);
                const slPrice = tool.type === 'long' ? entryPrice - riskDist / 2 : entryPrice + riskDist / 2;
                const slY = series.priceToCoordinate(slPrice);

                if (slY !== null) {
                    const isLong = tool.type === 'long';

                    // Profit Box
                    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
                    ctx.strokeStyle = '#10B981';
                    const tpTop = Math.min(entryY, targetY);
                    const tpHeight = Math.abs(entryY - targetY);
                    ctx.fillRect(minX, tpTop, maxX - minX, tpHeight);
                    ctx.strokeRect(minX, tpTop, maxX - minX, tpHeight);

                    // Stop Box
                    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
                    ctx.strokeStyle = '#EF4444';
                    const slTop = Math.min(entryY, slY);
                    const slHeight = Math.abs(entryY - slY);
                    ctx.fillRect(minX, slTop, maxX - minX, slHeight);
                    ctx.strokeRect(minX, slTop, maxX - minX, slHeight);

                    // Risk / Reward Ratio Text
                    const rr = (Math.abs(targetPrice - entryPrice) / Math.abs(entryPrice - slPrice)).toFixed(2);
                    ctx.fillStyle = '#F5F5F0';
                    ctx.font = 'bold 11px sans-serif';
                    ctx.fillText(`R:R ${rr} (${isLong ? 'LONG' : 'SHORT'})`, minX + 6, entryY - 6);
                }
            }
        };

        // Render saved tools
        drawings.forEach(drawTool);

        // Render live preview tool
        if (activeStart && mousePos) {
            const timeScaleVal = chart.timeScale();
            const currTime = timeScaleVal.coordinateToTime(mousePos.x);
            const currPrice = series.coordinateToPrice(mousePos.y);

            if (currTime !== null && currPrice !== null) {
                drawTool({
                    type: activeTool,
                    start: activeStart,
                    end: { time: currTime, price: currPrice },
                });
            }
        }
    }, [drawings, activeStart, mousePos, activeTool]);

    useEffect(() => {
        drawOverlayCanvas();
    }, [drawOverlayCanvas, drawings, activeStart, mousePos]);

    useEffect(() => {
        const canvas = overlayCanvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawOverlayCanvas();
    }, [drawOverlayCanvas]);

    // Canvas Mouse Click Events
    const handleCanvasClick = (e) => {
        if (activeTool === 'select' || !chartRef.current || !seriesRef.current) return;

        const rect = overlayCanvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const clickedTime = chartRef.current.timeScale().coordinateToTime(x);
        const clickedPrice = seriesRef.current.coordinateToPrice(y);

        if (clickedTime === null || clickedPrice === null) return;

        const point = { time: clickedTime, price: clickedPrice };

        if (!activeStart) {
            setActiveStart(point);
        } else {
            setDrawings((prev) => [
                ...prev,
                { id: Date.now(), type: activeTool, start: activeStart, end: point },
            ]);
            setActiveStart(null);
            setActiveTool('select'); // Auto reset to select mode after drawing
        }
    };

    const handleCanvasMouseMove = (e) => {
        if (!activeStart) return;
        const rect = overlayCanvasRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    // Actions
    const handleResetView = () => {
        if (chartRef.current) {
            chartRef.current.timeScale().fitContent();
            chartRef.current.priceScale('right').applyOptions({ autoScale: true });
        }
    };

    const handleClearDrawings = () => {
        setDrawings([]);
        setActiveStart(null);
        setActiveTool('select');
    };

    // WebSocket Handlers
    const handleStart = useCallback(() => {
        setPrice(null);
        seriesRef.current?.setData([]);
        currentCandleRef.current = null;
    }, []);

    const handleHistory = useCallback((candles) => {
        requestAnimationFrame(() => {
            seriesRef.current?.setData(candles);
            chartRef.current?.timeScale().fitContent();
            drawOverlayCanvas();
        });
        currentCandleRef.current = candles.at(-1);
        setPrice(candles.at(-1).close);
    }, [drawOverlayCanvas]);

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
        count: 1000,
        onStart: handleStart,
        onHistory: handleHistory,
        onTick: handleTick,
    });

    return (
        <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-[#29251B] bg-[#0D0D0D]">
            {/* Header Controls */}
            <div className="flex min-h-12 shrink-0 items-center justify-between gap-3 border-b border-[#29251B] px-4 py-2">
                <div className="min-w-0">
                    <div className="truncate text-xs font-semibold text-[#F5F5F0]">
                        {symbolInfo?.displayName ?? 'No market selected'}
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.15em] text-[#A8A8A0]">
                        {symbol ?? 'Watchlist'} · {selectedTimeframe} · {status}
                    </div>
                </div>

                {/* Drawing Toolbar */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {/* Cursor Mode */}
                    <button
                        onClick={() => { setActiveTool('select'); setActiveStart(null); }}
                        className={`rounded-lg border p-1.5 transition ${activeTool === 'select'
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                            : 'border-[#29251B] bg-[#151515] text-[#A8A8A0] hover:text-[#F5F5F0]'}`}
                        title="Pointer Mode"
                    >
                        <MousePointer className="h-3.5 w-3.5" />
                    </button>

                    {/* Trendline */}
                    <button
                        onClick={() => { setActiveTool('trendline'); setActiveStart(null); }}
                        className={`rounded-lg border p-1.5 transition ${activeTool === 'trendline'
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                            : 'border-[#29251B] bg-[#151515] text-[#A8A8A0] hover:text-[#F5F5F0]'}`}
                        title="Trendline"
                    >
                        <TrendingUp className="h-3.5 w-3.5" />
                    </button>

                    {/* Fibonacci Retracement */}
                    <button
                        onClick={() => { setActiveTool('fib'); setActiveStart(null); }}
                        className={`rounded-lg border p-1.5 transition ${activeTool === 'fib'
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                            : 'border-[#29251B] bg-[#151515] text-[#A8A8A0] hover:text-[#F5F5F0]'}`}
                        title="Fibonacci Retracement"
                    >
                        <Percent className="h-3.5 w-3.5" />
                    </button>

                    {/* Long Position (R:R) */}
                    <button
                        onClick={() => { setActiveTool('long'); setActiveStart(null); }}
                        className={`rounded-lg border p-1.5 transition ${activeTool === 'long'
                            ? 'border-[#10B981] bg-[#10B981]/10 text-[#10B981]'
                            : 'border-[#29251B] bg-[#151515] text-[#A8A8A0] hover:text-[#F5F5F0]'}`}
                        title="Long Position (R:R)"
                    >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>

                    {/* Short Position (R:R) */}
                    <button
                        onClick={() => { setActiveTool('short'); setActiveStart(null); }}
                        className={`rounded-lg border p-1.5 transition ${activeTool === 'short'
                            ? 'border-[#EF4444] bg-[#EF4444]/10 text-[#EF4444]'
                            : 'border-[#29251B] bg-[#151515] text-[#A8A8A0] hover:text-[#F5F5F0]'}`}
                        title="Short Position (R:R)"
                    >
                        <ArrowDownRight className="h-3.5 w-3.5" />
                    </button>

                    <div className="mx-1 h-4 w-px bg-[#29251B]" />

                    {/* Clear Drawings */}
                    {drawings.length > 0 && (
                        <button
                            onClick={handleClearDrawings}
                            className="rounded-lg border border-[#29251B] bg-[#151515] p-1.5 text-[#A8A8A0] transition hover:border-red-500/40 hover:text-red-400"
                            title="Clear All Drawings"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    )}

                    {/* Reset Zoom */}
                    <button
                        onClick={handleResetView}
                        className="flex items-center gap-1 rounded-lg border border-[#29251B] bg-[#151515] px-2 py-1 text-[11px] font-medium text-[#A8A8A0] transition hover:border-[#D4AF37]/40 hover:text-[#F5F5F0]"
                        title="Reset View"
                    >
                        <RotateCcw className="h-3 w-3" />
                        <span className="hidden sm:inline">Reset</span>
                    </button>

                    <TimeframeSelector selectedTimeframe={selectedTimeframe} onChange={setSelectedTimeframe} />

                    <div className="hidden font-mono text-xs font-bold text-[#10B981] sm:block">
                        {formatPrice(price, symbolInfo?.pipSize)}
                    </div>
                </div>
            </div>

            {error && <div className="border-b border-[#EF4444]/20 bg-[#EF4444]/5 px-4 py-2 text-xs text-[#EF4444]">{error}</div>}

            {/* Chart + Canvas Overlay Layer */}
            <div className="relative w-full flex-1 min-h-[400px]">
                <div ref={containerRef} className="h-full w-full" />

                <canvas
                    ref={overlayCanvasRef}
                    onClick={handleCanvasClick}
                    onMouseMove={handleCanvasMouseMove}
                    className={`absolute inset-0 z-10 ${activeTool !== 'select' ? 'cursor-crosshair' : 'pointer-events-none'}`}
                />

                {status === 'loading' && (
                    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0D0D0D]/80 backdrop-blur-xs">
                        <span className="h-7 w-7 animate-spin rounded-full border-2 border-b-[#D4AF37]/20 border-l-transparent border-r-transparent border-t-[#D4AF37]" />
                        <span className="mt-2 font-mono text-[11px] tracking-wide text-[#A8A8A0]">
                            Loading {selectedTimeframe} candles…
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}