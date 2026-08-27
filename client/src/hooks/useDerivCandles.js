import { useEffect, useRef, useState } from "react";
import { derivMarketData } from "../services/derivMarketData";

export const toCandles = (candles) =>
  (candles ?? [])
    .map((candle) => ({
      time: Number(candle.epoch),
      open: Number(candle.open),
      high: Number(candle.high),
      low: Number(candle.low),
      close: Number(candle.close),
    }))
    .filter((candle) => Object.values(candle).every(Number.isFinite));

// Owns a chart consumer's historical request and live tick listener. On a symbol
// or timeframe change, React runs cleanup first, so stale data cannot update the chart.
export default function useDerivCandles({
  symbol,
  granularity,
  enabled = true,
  count = 1000, // <--- Increased default from 150 to 1000
  onStart,
  onHistory,
  onTick,
}) {
  const callbacksRef = useRef({ onStart, onHistory, onTick });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    callbacksRef.current = { onStart, onHistory, onTick };
  }, [onStart, onHistory, onTick]);

  useEffect(() => {
    // Allow string timeframe labels here (e.g. '1M') — the service will
    // normalize them to integer seconds. Only bail out when disabled or
    // missing symbol.
    if (!enabled || !symbol) return undefined;

    let cancelled = false;
    let unsubscribe = () => {};
    callbacksRef.current.onStart?.();

    // Schedule visual state after this effect commits. The series is cleared
    // synchronously above, preventing stale candles during the transition.
    queueMicrotask(() => {
      if (!cancelled) {
        setError(null);
        setStatus("loading");
      }
    });

    derivMarketData
      .getCandles(symbol, granularity, count)
      .then((response) => {
        if (cancelled) return;
        const candles = toCandles(response.candles);
        if (!candles.length)
          throw new Error(
            "Deriv returned no candles for this market and timeframe.",
          );

        callbacksRef.current.onHistory?.(candles);
        setStatus("live");
        unsubscribe = derivMarketData.subscribeTicks(symbol, (tick) => {
          if (cancelled) return;
          if (tick.error) {
            setError(tick.error.message);
            setStatus("error");
            return;
          }
          callbacksRef.current.onTick?.(tick);
        });
      })
      .catch((requestError) => {
        if (cancelled) return;
        setError(requestError.message);
        setStatus("error");
      });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [count, enabled, granularity, symbol]);

  return { status, error };
}
