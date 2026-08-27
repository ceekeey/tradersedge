export const CHART_TIMEFRAMES = Object.freeze([
  { label: "1M", granularity: 60 },
  { label: "5M", granularity: 300 },
  { label: "30M", granularity: 1800 },
  { label: "1H", granularity: 3600 },
  { label: "4H", granularity: 14400 },
  { label: "1D", granularity: 86400 },
  { label: "1W", granularity: 604800 },
]);

export const DEFAULT_TIMEFRAME = "1H";

export const getTimeframe = (label) =>
  CHART_TIMEFRAMES.find((timeframe) => timeframe.label === label) ??
  CHART_TIMEFRAMES[3];
