import { useCallback, useEffect, useRef, useState } from 'react';
import { CandlestickSeries, createChart } from 'lightweight-charts';
import { TrendingUp, RotateCcw, Trash2, Percent, ArrowUpRight, ArrowDownRight, MousePointer } from 'lucide-react';
import { DEFAULT_TIMEFRAME, getTimeframe } from '../constants/chartTimeframes';
import useDerivCandles from '../hooks/useDerivCandles';
import TimeframeSelector from './TimeframeSelector';
import {
    createDrawingId,
    hitTestDrawings,
    renderDrawingScene,
    screenToLogicalPoint,
    translateDrawing,
} from './chart/DrawingEngine';

const formatPrice = (price, pipSize) => {
    if (!Number.isFinite(price)) return '--';
    const decimals = Number.isFinite(Number(pipSize))
        ? Math.max(0, Math.min(10, Math.round(-Math.log10(Number(pipSize)))))
        : undefined;
    return decimals === undefined ? String(price) : price.toFixed(decimals);
};

export default function ChartSection({ symbol, symbolInfo }) {
    const containerRef = useRef(null);
    const overlayCanvasRef = useRef(null);
    const chartRef = useRef(null);
    const seriesRef = useRef(null);
    const currentCandleRef = useRef(null);
    const drawingsRef = useRef([]);
    const selectedDrawingIdRef = useRef(null);
    const activeToolRef = useRef('select');
    const activeStartRef = useRef(null);
    const previewRef = useRef(null);
    const dragStateRef = useRef(null);

    const [price, setPrice] = useState(null);
    const [selectedTimeframe, setSelectedTimeframe] = useState(DEFAULT_TIMEFRAME);
    const selectedGranularity = getTimeframe(selectedTimeframe).granularity;

    const [activeTool, setActiveTool] = useState('select');
    const [drawings, setDrawings] = useState([]);
    const [selectedDrawingId, setSelectedDrawingId] = useState(null);

    const resetInteractionState = useCallback(() => {
        activeStartRef.current = null;
        previewRef.current = null;
        dragStateRef.current = null;
    }, []);

    const redrawOverlayCanvas = useCallback(() => {
        const canvas = overlayCanvasRef.current;
        const chart = chartRef.current;
        const series = seriesRef.current;
        if (!canvas || !chart || !series) return;

        const dpr = window.devicePixelRatio || 1;
        const cssWidth = canvas.clientWidth || chart.clientWidth || 0;
        const cssHeight = canvas.clientHeight || chart.clientHeight || 0;

        if (!cssWidth || !cssHeight) return;

        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;
        canvas.width = Math.max(1, Math.floor(cssWidth * dpr));
        canvas.height = Math.max(1, Math.floor(cssHeight * dpr));

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        renderDrawingScene({
            ctx,
            chart,
            series,
            drawings: drawingsRef.current,
            selectedDrawingId: selectedDrawingIdRef.current,
            preview: previewRef.current,
        });
    }, []);

    const changeTool = useCallback((nextTool) => {
        setActiveTool(nextTool);
        activeToolRef.current = nextTool;
        setSelectedDrawingId(null);
        selectedDrawingIdRef.current = null;
        resetInteractionState();
        redrawOverlayCanvas();
    }, [redrawOverlayCanvas, resetInteractionState]);

    useEffect(() => {
        drawingsRef.current = drawings;
    }, [drawings]);

    useEffect(() => {
        selectedDrawingIdRef.current = selectedDrawingId;
    }, [selectedDrawingId]);

    useEffect(() => {
        activeToolRef.current = activeTool;
    }, [activeTool]);

    useEffect(() => {
        if (activeTool !== 'select') {
            setSelectedDrawingId(null);
            selectedDrawingIdRef.current = null;
            resetInteractionState();
        }
    }, [activeTool, resetInteractionState]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return undefined;

        let resizeObserver = null;
        let chart = null;
        let series = null;
        let cancelled = false;

        const initChart = () => {
            if (cancelled) return;
            const cssWidth = container.clientWidth;
            const cssHeight = container.clientHeight;
            if (cssWidth <= 0 || cssHeight <= 0) return;

            chart = createChart(container, {
                width: cssWidth,
                height: cssHeight,
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

            chart.subscribeClick((param) => {
                if (activeToolRef.current !== 'select' || !param?.point || !chart || !series) return;
                const hit = hitTestDrawings(drawingsRef.current, { x: param.point.x, y: param.point.y }, chart, series, 14);
                setSelectedDrawingId(hit?.id ?? null);
            });

            chart.timeScale().subscribeVisibleLogicalRangeChange(() => {
                requestAnimationFrame(() => redrawOverlayCanvas());
            });

            const resizeHandler = () => {
                if (cancelled) return;
                const w = container.clientWidth;
                const h = container.clientHeight;
                if (w <= 0 || h <= 0) return;

                try { chart.resize(w, h); } catch (error) {
                    console.warn('Chart resize error:', error);
                }

                const canvas = overlayCanvasRef.current;
                if (canvas) {
                    const dpr = window.devicePixelRatio || 1;
                    canvas.style.width = `${w}px`;
                    canvas.style.height = `${h}px`;
                    canvas.width = Math.max(1, Math.floor(w * dpr));
                    canvas.height = Math.max(1, Math.floor(h * dpr));
                    const context = canvas.getContext('2d');
                    if (context) {
                        context.setTransform(dpr, 0, 0, dpr, 0, 0);
                        context.clearRect(0, 0, w, h);
                    }
                }

                requestAnimationFrame(() => redrawOverlayCanvas());
            };

            resizeObserver = new ResizeObserver(() => {
                requestAnimationFrame(resizeHandler);
            });
            resizeObserver.observe(container);
            requestAnimationFrame(resizeHandler);
        };

        initChart();

        return () => {
            cancelled = true;
            if (resizeObserver) {
                try { resizeObserver.disconnect(); } catch (error) {
                    console.warn('Resize observer cleanup warning:', error);
                }
            }
            if (chart) {
                try { chart.remove(); } catch (error) {
                    console.warn('Chart cleanup warning:', error);
                }
            }
            chartRef.current = null;
            seriesRef.current = null;
        };
    }, [redrawOverlayCanvas]);

    const handleCanvasPointerDown = (event) => {
        if (!chartRef.current || !seriesRef.current) return;

        const rect = overlayCanvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (activeToolRef.current === 'select') {
            const currentDrawings = drawingsRef.current;
            const hit = hitTestDrawings(currentDrawings, { x, y }, chartRef.current, seriesRef.current, 14);

            if (hit) {
                setSelectedDrawingId(hit.id);
                selectedDrawingIdRef.current = hit.id;
                dragStateRef.current = {
                    drawingId: hit.id,
                    pointerStart: { x, y },
                    logicalStart: screenToLogicalPoint(x, y, chartRef.current, seriesRef.current),
                    baseDrawing: hit,
                };
                event.currentTarget.setPointerCapture?.(event.pointerId);
                return;
            }

            setSelectedDrawingId(null);
            selectedDrawingIdRef.current = null;
            dragStateRef.current = null;
            return;
        }

        const point = screenToLogicalPoint(x, y, chartRef.current, seriesRef.current);
        if (!point) return;

        if (!activeStartRef.current) {
            activeStartRef.current = point;
            previewRef.current = { tool: activeToolRef.current, start: point, current: point };
            redrawOverlayCanvas();
            return;
        }

        const nextDrawing = {
            id: createDrawingId(),
            type: activeToolRef.current,
            start: activeStartRef.current,
            end: point,
        };

        setDrawings((prev) => [...prev, nextDrawing]);
        setSelectedDrawingId(nextDrawing.id);
        selectedDrawingIdRef.current = nextDrawing.id;
        activeStartRef.current = null;
        previewRef.current = null;
        setActiveTool('select');
        activeToolRef.current = 'select';
        redrawOverlayCanvas();
    };

    const handleCanvasPointerMove = (event) => {
        if (!chartRef.current || !seriesRef.current || !overlayCanvasRef.current) return;

        const rect = overlayCanvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (activeToolRef.current !== 'select') {
            if (!activeStartRef.current) return;
            const point = screenToLogicalPoint(x, y, chartRef.current, seriesRef.current);
            if (!point) return;
            previewRef.current = { tool: activeToolRef.current, start: activeStartRef.current, current: point };
            redrawOverlayCanvas();
            return;
        }

        if (!dragStateRef.current) return;

        const logicalPoint = screenToLogicalPoint(x, y, chartRef.current, seriesRef.current);
        if (!logicalPoint) return;

        const deltaTime = logicalPoint.time - dragStateRef.current.logicalStart.time;
        const deltaPrice = logicalPoint.price - dragStateRef.current.logicalStart.price;
        const moved = translateDrawing(dragStateRef.current.baseDrawing, deltaTime, deltaPrice);

        setDrawings((prev) => prev.map((drawing) => (drawing.id === moved.id ? moved : drawing)));
        redrawOverlayCanvas();
    };

    const handleCanvasPointerUp = (event) => {
        if (dragStateRef.current) {
            dragStateRef.current = null;
            event.currentTarget.releasePointerCapture?.(event.pointerId);
        }

        if (activeToolRef.current !== 'select' && activeStartRef.current) {
            previewRef.current = null;
            redrawOverlayCanvas();
        }
    };

    const handleCanvasPointerLeave = (event) => {
        if (activeToolRef.current !== 'select' && activeStartRef.current) {
            activeStartRef.current = null;
            previewRef.current = null;
            redrawOverlayCanvas();
        }

        if (dragStateRef.current) {
            dragStateRef.current = null;
            event.currentTarget.releasePointerCapture?.(event.pointerId);
        }
    };

    const handleCanvasPointerCancel = (event) => {
        activeStartRef.current = null;
        previewRef.current = null;
        dragStateRef.current = null;
        event.currentTarget.releasePointerCapture?.(event.pointerId);
        redrawOverlayCanvas();
    };

    const handleResetView = () => {
        if (chartRef.current) {
            chartRef.current.timeScale().fitContent();
            chartRef.current.priceScale('right').applyOptions({ autoScale: true });
        }
    };

    const handleClearDrawings = () => {
        setDrawings([]);
        setSelectedDrawingId(null);
        selectedDrawingIdRef.current = null;
        resetInteractionState();
        setActiveTool('select');
        activeToolRef.current = 'select';
        redrawOverlayCanvas();
    };

    const handleStart = useCallback(() => {
        setPrice(null);
        seriesRef.current?.setData([]);
        currentCandleRef.current = null;
    }, []);

    const handleHistory = useCallback((candles) => {
        requestAnimationFrame(() => {
            seriesRef.current?.setData(candles);
            chartRef.current?.timeScale().fitContent();
            redrawOverlayCanvas();
        });
        currentCandleRef.current = candles.at(-1);
        setPrice(candles.at(-1)?.close ?? null);
    }, [redrawOverlayCanvas]);

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

    const overlayIsInteractive = activeTool !== 'select' || Boolean(selectedDrawingId);

    return (
        <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-[#29251B] bg-[#0D0D0D]">
            <div className="flex min-h-12 shrink-0 items-center justify-between gap-3 border-b border-[#29251B] px-4 py-2">
                <div className="min-w-0">
                    <div className="truncate text-xs font-semibold text-[#F5F5F0]">
                        {symbolInfo?.displayName ?? 'No market selected'}
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.15em] text-[#A8A8A0]">
                        {symbol ?? 'Watchlist'} · {selectedTimeframe} · {status}
                    </div>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => changeTool('select')}
                        className={`rounded-lg border p-1.5 transition ${activeTool === 'select'
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                            : 'border-[#29251B] bg-[#151515] text-[#A8A8A0] hover:text-[#F5F5F0]'}`}
                        title="Pointer Mode"
                    >
                        <MousePointer className="h-3.5 w-3.5" />
                    </button>

                    <button
                        onClick={() => changeTool('trendline')}
                        className={`rounded-lg border p-1.5 transition ${activeTool === 'trendline'
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                            : 'border-[#29251B] bg-[#151515] text-[#A8A8A0] hover:text-[#F5F5F0]'}`}
                        title="Trendline"
                    >
                        <TrendingUp className="h-3.5 w-3.5" />
                    </button>

                    <button
                        onClick={() => changeTool('fib')}
                        className={`rounded-lg border p-1.5 transition ${activeTool === 'fib'
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                            : 'border-[#29251B] bg-[#151515] text-[#A8A8A0] hover:text-[#F5F5F0]'}`}
                        title="Fibonacci Retracement"
                    >
                        <Percent className="h-3.5 w-3.5" />
                    </button>

                    <button
                        onClick={() => changeTool('long')}
                        className={`rounded-lg border p-1.5 transition ${activeTool === 'long'
                            ? 'border-[#10B981] bg-[#10B981]/10 text-[#10B981]'
                            : 'border-[#29251B] bg-[#151515] text-[#A8A8A0] hover:text-[#F5F5F0]'}`}
                        title="Long Position (R:R)"
                    >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>

                    <button
                        onClick={() => changeTool('short')}
                        className={`rounded-lg border p-1.5 transition ${activeTool === 'short'
                            ? 'border-[#EF4444] bg-[#EF4444]/10 text-[#EF4444]'
                            : 'border-[#29251B] bg-[#151515] text-[#A8A8A0] hover:text-[#F5F5F0]'}`}
                        title="Short Position (R:R)"
                    >
                        <ArrowDownRight className="h-3.5 w-3.5" />
                    </button>

                    <div className="mx-1 h-4 w-px bg-[#29251B]" />

                    {drawings.length > 0 && (
                        <button
                            onClick={handleClearDrawings}
                            className="rounded-lg border border-[#29251B] bg-[#151515] p-1.5 text-[#A8A8A0] transition hover:border-red-500/40 hover:text-red-400"
                            title="Clear All Drawings"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    )}

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

            <div className="relative w-full flex-1 min-h-0">
                <div ref={containerRef} className="h-full w-full" />

                <canvas
                    ref={overlayCanvasRef}
                    onPointerDown={handleCanvasPointerDown}
                    onPointerMove={handleCanvasPointerMove}
                    onPointerUp={handleCanvasPointerUp}
                    onPointerCancel={handleCanvasPointerCancel}
                    onPointerLeave={handleCanvasPointerLeave}
                    className={`absolute inset-0 z-10 ${overlayIsInteractive ? 'pointer-events-auto' : 'pointer-events-none'} ${activeTool !== 'select' ? 'cursor-crosshair' : 'cursor-default'}`}
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