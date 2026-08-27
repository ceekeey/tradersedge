export const CHART_TIMEFRAMES = Object.freeze([
    { label: '1M', granularity: 60 },
    { label: '15M', granularity: 900 },
    { label: '1H', granularity: 3600 },
    { label: '4H', granularity: 14400 },
    { label: '1D', granularity: 86400 },
]);

export const DEFAULT_TIMEFRAME = '15M';

export const getTimeframe = (label) =>
    CHART_TIMEFRAMES.find((timeframe) => timeframe.label === label) ?? CHART_TIMEFRAMES[1];
