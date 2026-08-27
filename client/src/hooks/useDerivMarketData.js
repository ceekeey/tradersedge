import { useCallback, useEffect, useMemo, useState } from 'react';
import { derivMarketData } from '../services/derivMarketData';

const normalizeSymbol = (item) => {
    const symbol = item?.underlying_symbol ?? item?.symbol;
    if (!symbol) return null;

    return {
        symbol,
        displayName: item.underlying_symbol_name ?? item.display_name ?? symbol,
        market: item.market ?? item.underlying_symbol_type ?? 'Market',
        pipSize: item.pip_size ?? item.pip,
    };
};

export default function useDerivMarketData() {
    const [symbols, setSymbols] = useState([]);
    const [watchlistSymbols, setWatchlistSymbols] = useState([]);
    const [selectedSymbol, setSelectedSymbol] = useState(null);
    const [quotes, setQuotes] = useState({});
    const [status, setStatus] = useState('loading');
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        derivMarketData.getActiveSymbols()
            .then((response) => {
                if (cancelled) return;
                const available = (response.active_symbols ?? []).map(normalizeSymbol).filter(Boolean);
                if (!available.length) throw new Error('Deriv returned no active symbols.');

                setSymbols(available);
                // These defaults come from the live active_symbols response, not hard-coded IDs.
                const currencyPairs = available.filter((item) => item.market === 'forex');
                const initialWatchlist = (currencyPairs.length ? currencyPairs : available).slice(0, 4);
                setWatchlistSymbols(initialWatchlist.map((item) => item.symbol));
                setSelectedSymbol(initialWatchlist[0]?.symbol ?? available[0].symbol);
                setStatus('ready');
            })
            .catch((requestError) => {
                if (cancelled) return;
                setError(requestError.message);
                setStatus('error');
            });

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const unsubscribers = watchlistSymbols.map((symbol) =>
            derivMarketData.subscribeTicks(symbol, (tick) => {
                if (tick.error) {
                    setQuotes((current) => ({ ...current, [symbol]: { ...current[symbol], error: tick.error.message } }));
                    return;
                }

                const price = Number(tick.quote);
                if (!Number.isFinite(price)) return;
                setQuotes((current) => {
                    const previous = current[symbol]?.price;
                    const difference = Number.isFinite(previous) ? price - previous : null;
                    return {
                        ...current,
                        [symbol]: {
                            price,
                            previous,
                            difference,
                            percentage: difference !== null && previous !== 0 ? (difference / previous) * 100 : null,
                            error: null,
                        },
                    };
                });
            })
        );

        return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
    }, [watchlistSymbols]);

    const addToWatchlist = useCallback((symbol) => {
        setWatchlistSymbols((current) => (current.includes(symbol) ? current : [...current, symbol]));
        setSelectedSymbol(symbol);
    }, []);

    const removeFromWatchlist = useCallback((symbol) => {
        setWatchlistSymbols((current) => {
            const next = current.filter((item) => item !== symbol);
            if (selectedSymbol === symbol) setSelectedSymbol(next[0] ?? null);
            return next;
        });
        setQuotes((current) => {
            const remaining = { ...current };
            delete remaining[symbol];
            return remaining;
        });
    }, [selectedSymbol]);

    const watchlist = useMemo(
        () => watchlistSymbols.map((symbol) => ({ ...symbols.find((item) => item.symbol === symbol), quote: quotes[symbol] })).filter((item) => item.symbol),
        [quotes, symbols, watchlistSymbols]
    );

    return { symbols, watchlist, selectedSymbol, setSelectedSymbol, addToWatchlist, removeFromWatchlist, status, error };
}
