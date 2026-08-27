import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import { DEFAULT_TIMEFRAME, getTimeframe } from '../constants/chartTimeframes';
import TimeframeSelector from '../components/TimeframeSelector';
import useDerivCandles from '../hooks/useDerivCandles';
import {
    ArrowLeft,
    Target,
    ImageIcon,
    Tag,
    Edit2,
    CheckCircle2,
    XCircle,
    ShieldCheck,
    HeartPulse,
    LineChart,
    Maximize2,
    X
} from 'lucide-react';

export default function TradeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Active View Mode for Chart/Screenshots Section: 'chart' or 'screenshots'
    const [viewMode, setViewMode] = useState('chart');
    const [selectedTimeframe, setSelectedTimeframe] = useState(DEFAULT_TIMEFRAME);
    // Full-screen Image Modal State
    const [modalImage, setModalImage] = useState(null);

    // Mock Single Trade Data (In production, fetch from state/API using `id`)
    const trade = {
        id: id || 'TRD-8092',
        symbol: 'R_100', // Deriv Volatility 100 Index symbol
        asset: 'Volatility 100 Index',
        direction: 'BUY', // BUY or SELL
        win: true,
        pnl: 142.50,
        returnPercent: '+14.25%',
        entryPrice: 1245.80,
        exitPrice: 1289.10,
        stake: '100.00',
        duration: '15 Mins',
        entryTime: '2026-08-24 10:15:00',
        exitTime: '2026-08-24 10:30:00',
        riskReward: '1:2.8',
        planName: 'Volatility Index Breakout Strategy',

        // Plan & Rules Compliance
        planFollowed: true,
        entryCriteriaMet: true,
        exitCriteriaMet: true,

        // Emotional Tracking
        entryEmotion: 'Calm & Patient - Waited for 15M candle close above resistance.',
        exitEmotion: 'Disciplined - Closed at pre-planned 1:2.8 R:R target without greed.',

        // Screenshots (3 Timeframes)
        screenshots: {
            htf: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
            mtf: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80',
            ltf: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
        },

        tags: ['Liquidity Sweep', 'Order Block', 'London Session'],
        notes: 'Clean execution right off the 15M Demand Zone following higher timeframe bullish continuation. Trailed stop loss after price hit 1:2 R:R.'
    };

    // Lightweight Chart References
    const containerRef = useRef(null);
    const chartRef = useRef(null);
    const seriesRef = useRef(null);
    const currentCandleRef = useRef(null);
    const [chartReady, setChartReady] = useState(false);
    const selectedGranularity = getTimeframe(selectedTimeframe).granularity;

    useEffect(() => {
        if (viewMode !== 'chart') return;
        const container = containerRef.current;
        if (!container) return;

        // Initialize Lightweight Chart
        const chart = createChart(container, {
            width: container.clientWidth,
            height: container.clientHeight || 360,
            layout: {
                background: { color: '#0D0D0D' },
                textColor: '#A8A8A0',
            },
            grid: {
                vertLines: { color: '#1B1812' },
                horzLines: { color: '#1B1812' },
            },
            crosshair: {
                vertLine: { color: '#D4AF37', labelBackgroundColor: '#151515' },
                horzLine: { color: '#D4AF37', labelBackgroundColor: '#151515' },
            },
            rightPriceScale: { borderColor: '#29251B' },
            timeScale: { borderColor: '#29251B', timeVisible: true, secondsVisible: false },
        });

        const series = chart.addSeries(CandlestickSeries, {
            upColor: '#10B981',
            downColor: '#EF4444',
            borderUpColor: '#10B981',
            borderDownColor: '#EF4444',
            wickUpColor: '#10B981',
            wickDownColor: '#EF4444',
        });

        chartRef.current = chart;
        seriesRef.current = series;
        setChartReady(true);

        // These lines belong to the series, not a particular candle dataset, so
        // they remain visible while timeframe switches replace series data.
        [
            { price: trade.entryPrice, color: '#3B82F6', lineStyle: 0, title: 'ENTRY' },
            { price: trade.exitPrice, color: trade.win ? '#10B981' : '#EF4444', lineStyle: 2, title: 'EXIT' },
            { price: trade.stopLoss, color: '#EF4444', lineStyle: 2, title: 'STOP LOSS' },
            { price: trade.takeProfit, color: '#D4AF37', lineStyle: 2, title: 'TAKE PROFIT' },
        ].filter(({ price }) => Number.isFinite(price)).forEach((line) => {
            series.createPriceLine({ ...line, lineWidth: 2, axisLabelVisible: true });
        });

        // Resize Listener
        const resizeObserver = new ResizeObserver(() => {
            if (container && chart) {
                requestAnimationFrame(() => chart.resize(container.clientWidth, container.clientHeight || 360));
            }
        });
        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
            setChartReady(false);
            chart.remove();
            chartRef.current = null;
            seriesRef.current = null;
            currentCandleRef.current = null;
        };
    }, [viewMode, trade.symbol, trade.entryPrice, trade.exitPrice, trade.stopLoss, trade.takeProfit, trade.win]);

    const handleChartLoad = useCallback(() => {
        seriesRef.current?.setData([]);
        currentCandleRef.current = null;
    }, []);

    const handleChartHistory = useCallback((candles) => {
        seriesRef.current?.setData(candles);
        chartRef.current?.timeScale().fitContent();
        currentCandleRef.current = candles.at(-1);
    }, []);

    const handleChartTick = useCallback((tick) => {
        const quote = Number(tick.quote);
        const epoch = Number(tick.epoch);
        if (!Number.isFinite(quote) || !Number.isFinite(epoch)) return;

        const candleTime = Math.floor(epoch / selectedGranularity) * selectedGranularity;
        const previous = currentCandleRef.current;
        const candle = !previous || previous.time !== candleTime
            ? { time: candleTime, open: quote, high: quote, low: quote, close: quote }
            : { ...previous, high: Math.max(previous.high, quote), low: Math.min(previous.low, quote), close: quote };
        currentCandleRef.current = candle;
        seriesRef.current?.update(candle);
    }, [selectedGranularity]);

    const { status: chartStatus, error: chartError } = useDerivCandles({
        symbol: trade.symbol,
        granularity: selectedGranularity,
        enabled: viewMode === 'chart' && chartReady,
        onStart: handleChartLoad,
        onHistory: handleChartHistory,
        onTick: handleChartTick,
    });

    return (
        <div className="flex min-h-[calc(100vh-6rem)] w-full flex-col gap-6 bg-[#070707] p-4 text-[#F5F5F0] lg:p-6">

            {/* Top Navigation & Action Bar */}
            <div className="flex items-center justify-between rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-5">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 rounded-xl border border-[#29251B] bg-[#151515] px-4 py-2 text-xs font-bold text-[#A8A8A0] transition hover:text-[#F5F5F0]"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Journal
                </button>

                <div className="flex items-center gap-3">
                    <span className="text-xs text-[#6F6F68]">Trade ID: #{trade.id}</span>
                    <button className="flex items-center gap-1.5 rounded-xl bg-[#D4AF37] px-4 py-2 text-xs font-bold text-black hover:bg-[#b8952b]">
                        <Edit2 className="h-3.5 w-3.5" /> Edit Log
                    </button>
                </div>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-12">

                {/* Left Column: Outcome, Interactive Chart / Screenshots & Review (Col 8) */}
                <div className="space-y-6 lg:col-span-8">

                    {/* Primary Trade Outcome Banner */}
                    <div className="flex flex-col gap-4 rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-bold">{trade.asset}</h1>
                                <span className={`rounded px-2.5 py-0.5 text-xs font-bold ${trade.direction === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                    }`}>
                                    {trade.direction}
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-[#A8A8A0]">Executed on {trade.entryTime}</p>
                        </div>

                        <div className="text-left sm:text-right">
                            <span className="text-xs text-[#A8A8A0]">Realized Outcome</span>
                            <div className={`font-mono text-2xl font-bold ${trade.win ? 'text-[#10B981]' : 'text-red-400'}`}>
                                {trade.pnl >= 0 ? `+$${trade.pnl.toFixed(2)}` : `-$${Math.abs(trade.pnl).toFixed(2)}`}
                            </div>
                            <span className={`text-xs font-bold ${trade.win ? 'text-[#10B981]' : 'text-red-400'}`}>
                                {trade.returnPercent}
                            </span>
                        </div>
                    </div>

                    {/* Interactive Chart & Screenshots Toggle Component */}
                    <div className="rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-5 space-y-4">
                        <div className="flex flex-col gap-3 border-b border-[#29251B] pb-3 xl:flex-row xl:items-center xl:justify-between">
                            <span className="flex items-center gap-2 text-xs font-bold text-[#F5F5F0]">
                                {viewMode === 'chart' ? (
                                    <LineChart className="h-4 w-4 text-[#D4AF37]" />
                                ) : (
                                    <ImageIcon className="h-4 w-4 text-[#D4AF37]" />
                                )}
                                {viewMode === 'chart' ? 'Execution Price Chart' : 'Multi-Timeframe Screenshots'}
                            </span>

                            <div className="flex flex-wrap items-center gap-2">
                                {viewMode === 'chart' && <TimeframeSelector selectedTimeframe={selectedTimeframe} onChange={setSelectedTimeframe} />}
                                {/* View Switcher Tabs */}
                                <div className="flex rounded-xl border border-[#29251B] bg-[#151515] p-1">
                                    <button
                                        onClick={() => setViewMode('chart')}
                                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${viewMode === 'chart'
                                            ? 'bg-[#D4AF37] text-black'
                                            : 'text-[#A8A8A0] hover:text-[#F5F5F0]'
                                            }`}
                                    >
                                        <LineChart className="h-3.5 w-3.5" /> Interactive Chart
                                    </button>
                                    <button
                                        onClick={() => setViewMode('screenshots')}
                                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${viewMode === 'screenshots'
                                            ? 'bg-[#D4AF37] text-black'
                                            : 'text-[#A8A8A0] hover:text-[#F5F5F0]'
                                            }`}
                                    >
                                        <ImageIcon className="h-3.5 w-3.5" /> Screenshots
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Chart Mode */}
                        {viewMode === 'chart' && (
                            <div className="relative h-[360px] w-full overflow-hidden rounded-xl border border-[#29251B] bg-[#0D0D0D]">
                                <div ref={containerRef} className="h-full w-full" />
                                {chartStatus === 'loading' && <div className="pointer-events-none absolute inset-0 grid place-items-center bg-[#0D0D0D]/55"><span className="h-5 w-5 animate-spin rounded-full border-2 border-[#D4AF37]/25 border-t-[#D4AF37]" /></div>}
                                {chartError && <div className="absolute inset-x-3 bottom-3 rounded-lg border border-[#EF4444]/30 bg-[#0D0D0D]/95 px-3 py-2 text-xs text-[#EF4444]">{chartError}</div>}
                            </div>
                        )}

                        {/* Screenshots Mode */}
                        {viewMode === 'screenshots' && (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                {[
                                    { key: 'htf', label: 'Higher Timeframe (HTF)' },
                                    { key: 'mtf', label: 'Medium Timeframe (MTF)' },
                                    { key: 'ltf', label: 'Lower Timeframe (LTF)' },
                                ].map((tf) => (
                                    <div key={tf.key} className="space-y-1.5">
                                        <span className="text-[10px] font-semibold text-[#A8A8A0]">{tf.label}</span>
                                        <div
                                            onClick={() => trade.screenshots[tf.key] && setModalImage(trade.screenshots[tf.key])}
                                            className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl border border-[#29251B] bg-[#151515] transition hover:border-[#D4AF37]/50"
                                        >
                                            {trade.screenshots[tf.key] ? (
                                                <>
                                                    <img
                                                        src={trade.screenshots[tf.key]}
                                                        alt={tf.label}
                                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                                                        <Maximize2 className="h-5 w-5 text-[#D4AF37]" />
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-[10px] text-[#A8A8A0]">
                                                    No Chart Uploaded
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Rules & Plan Alignment Review Section */}
                    <div className="rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#29251B] pb-3">
                            <span className="flex items-center gap-2 text-xs font-bold text-[#F5F5F0]">
                                <ShieldCheck className="h-4 w-4 text-[#D4AF37]" /> Strategy Rule Compliance
                            </span>
                            <span className={`flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-bold border ${trade.planFollowed
                                ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30'
                                : 'bg-red-500/10 text-red-400 border-red-500/30'
                                }`}>
                                {trade.planFollowed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                                {trade.planFollowed ? 'Followed Plan' : 'Plan Violated'}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="flex items-center justify-between rounded-xl border border-[#29251B] bg-[#151515] p-3 text-xs">
                                <span className="text-[#A8A8A0]">Entry Criteria Met?</span>
                                {trade.entryCriteriaMet ? (
                                    <span className="flex items-center gap-1 font-bold text-[#10B981]">
                                        <CheckCircle2 className="h-3.5 w-3.5" /> Yes
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 font-bold text-red-400">
                                        <XCircle className="h-3.5 w-3.5" /> No
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between rounded-xl border border-[#29251B] bg-[#151515] p-3 text-xs">
                                <span className="text-[#A8A8A0]">Exit Criteria Met?</span>
                                {trade.exitCriteriaMet ? (
                                    <span className="flex items-center gap-1 font-bold text-[#10B981]">
                                        <CheckCircle2 className="h-3.5 w-3.5" /> Yes
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 font-bold text-red-400">
                                        <XCircle className="h-3.5 w-3.5" /> No
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Execution Notes */}
                    <div className="rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-5 space-y-2">
                        <h3 className="text-xs font-bold text-[#F5F5F0]">Trade Journal Notes</h3>
                        <p className="text-xs leading-relaxed text-[#A8A8A0]">{trade.notes}</p>
                    </div>

                </div>

                {/* Right Column: Execution Metrics & Emotions (Col 4) */}
                <div className="space-y-6 lg:col-span-4">

                    {/* Execution Metrics */}
                    <div className="rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-5 space-y-4">
                        <h2 className="text-xs font-bold text-[#D4AF37]">Execution Metrics</h2>

                        <div className="space-y-3 font-mono text-xs">
                            <div className="flex justify-between border-b border-[#29251B] pb-2">
                                <span className="text-[#A8A8A0]">Entry Price:</span>
                                <span className="font-bold text-[#F5F5F0]">{trade.entryPrice}</span>
                            </div>

                            <div className="flex justify-between border-b border-[#29251B] pb-2">
                                <span className="text-[#A8A8A0]">Exit Price:</span>
                                <span className="font-bold text-[#F5F5F0]">{trade.exitPrice}</span>
                            </div>

                            <div className="flex justify-between border-b border-[#29251B] pb-2">
                                <span className="text-[#A8A8A0]">Position Stake:</span>
                                <span className="font-bold text-[#F5F5F0]">${trade.stake}</span>
                            </div>

                            <div className="flex justify-between border-b border-[#29251B] pb-2">
                                <span className="text-[#A8A8A0]">Duration:</span>
                                <span className="font-bold text-[#F5F5F0]">{trade.duration}</span>
                            </div>

                            <div className="flex justify-between border-b border-[#29251B] pb-2">
                                <span className="text-[#A8A8A0]">Risk:Reward:</span>
                                <span className="font-bold text-[#10B981]">{trade.riskReward}</span>
                            </div>
                        </div>
                    </div>

                    {/* Linked Strategy Plan */}
                    <div className="rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-5 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#F5F5F0]">
                            <Target className="h-4 w-4 text-[#D4AF37]" /> Linked Strategy Plan
                        </div>
                        <div className="rounded-xl border border-[#29251B] bg-[#151515] p-3 text-xs font-semibold text-[#D4AF37]">
                            {trade.planName}
                        </div>
                    </div>

                    {/* Entry & Exit Emotions */}
                    <div className="rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-5 space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#F5F5F0]">
                            <HeartPulse className="h-4 w-4 text-[#D4AF37]" /> Psychological State
                        </div>

                        <div className="space-y-3">
                            <div>
                                <span className="text-[10px] font-semibold text-[#A8A8A0]">Entry Emotion Note</span>
                                <div className="mt-1 rounded-xl border border-[#29251B] bg-[#151515] p-3 text-xs text-[#F5F5F0]">
                                    {trade.entryEmotion}
                                </div>
                            </div>

                            <div>
                                <span className="text-[10px] font-semibold text-[#A8A8A0]">Exit Emotion Note</span>
                                <div className="mt-1 rounded-xl border border-[#29251B] bg-[#151515] p-3 text-xs text-[#F5F5F0]">
                                    {trade.exitEmotion}
                                </div>
                            </div>
                        </div>

                        {/* Confluence Tags */}
                        <div className="space-y-2 pt-2 border-t border-[#29251B]">
                            <span className="flex items-center gap-2 text-xs font-bold text-[#F5F5F0]">
                                <Tag className="h-4 w-4 text-[#D4AF37]" /> Setup Confluences
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {trade.tags.map((tag, idx) => (
                                    <span key={idx} className="rounded-lg bg-[#151515] border border-[#29251B] px-2.5 py-1 text-[10px] font-semibold text-[#A8A8A0]">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Full Screen Image Preview Modal */}
            {modalImage && (
                <div
                    onClick={() => setModalImage(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                >
                    <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl border border-[#29251B] bg-[#0D0D0D]">
                        <button
                            onClick={() => setModalImage(null)}
                            className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-[#A8A8A0] transition hover:text-[#F5F5F0]"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <img
                            src={modalImage}
                            alt="Screenshot Preview"
                            className="max-h-[85vh] w-auto object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
