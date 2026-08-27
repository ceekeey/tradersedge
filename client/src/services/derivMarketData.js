const WS_URL = "wss://api.derivws.com/trading/v1/options/ws/public";
const REQUEST_TIMEOUT = 15000;

// Explicit map of display timeframes to Deriv API granularity (seconds)
const GRANULARITY_MAP = {
  "1M": 60,
  "5M": 300,
  "30M": 1800,
  "1H": 3600,
  "4H": 14400,
  "1D": 86400,
  "1W": 604800,
};

class DerivMarketData {
  constructor() {
    this.socket = null;
    this.connectionPromise = null;
    this.requestId = 0;
    this.pendingRequests = new Map();
    this.tickListeners = new Map();
    this.tickSubscriptions = new Map();
  }

  connect() {
    if (this.socket?.readyState === WebSocket.OPEN) return Promise.resolve();
    if (this.connectionPromise) return this.connectionPromise;

    this.connectionPromise = new Promise((resolve, reject) => {
      const socket = new WebSocket(WS_URL);
      this.socket = socket;

      socket.onopen = () => {
        this.connectionPromise = null;
        resolve();
      };

      socket.onmessage = (event) => this.handleMessage(event);
      socket.onerror = () => {
        if (socket.readyState !== WebSocket.OPEN) {
          this.connectionPromise = null;
          reject(new Error("Could not connect to Deriv market data."));
        }
      };
      socket.onclose = () => this.handleClose(socket);
    });

    return this.connectionPromise;
  }

  handleClose(socket) {
    if (this.socket !== socket) return;

    this.socket = null;
    this.connectionPromise = null;
    this.tickSubscriptions.clear();
    this.pendingRequests.forEach(({ reject, timeout }) => {
      window.clearTimeout(timeout);
      reject(new Error("Deriv market-data connection closed."));
    });
    this.pendingRequests.clear();
  }

  handleMessage(event) {
    let data;
    try {
      data = JSON.parse(event.data);
    } catch {
      return;
    }

    const requestId = data.req_id;
    if (data.error && requestId && this.pendingRequests.has(requestId)) {
      const request = this.pendingRequests.get(requestId);
      window.clearTimeout(request.timeout);
      this.pendingRequests.delete(requestId);
      request.reject(new Error(`${data.error.code}: ${data.error.message}`));
      return;
    }

    if (requestId && this.pendingRequests.has(requestId)) {
      const request = this.pendingRequests.get(requestId);
      window.clearTimeout(request.timeout);
      this.pendingRequests.delete(requestId);
      request.resolve(data);
    }

    if (data.msg_type === "tick" && data.tick?.symbol) {
      const listeners = this.tickListeners.get(data.tick.symbol);
      listeners?.forEach((listener) => listener(data.tick));
    }

    const subscribedSymbol = data.echo_req?.ticks ?? data.tick?.symbol;
    if (data.subscription?.id && subscribedSymbol) {
      this.tickSubscriptions.set(subscribedSymbol, data.subscription.id);
    }
  }

  async request(payload) {
    await this.connect();
    const req_id = ++this.requestId;

    return new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        this.pendingRequests.delete(req_id);
        reject(new Error("Deriv market-data request timed out."));
      }, REQUEST_TIMEOUT);

      this.pendingRequests.set(req_id, { resolve, reject, timeout });
      try {
        this.socket.send(JSON.stringify({ ...payload, req_id }));
      } catch (error) {
        window.clearTimeout(timeout);
        this.pendingRequests.delete(req_id);
        reject(error);
      }
    });
  }

  getActiveSymbols() {
    return this.request({ active_symbols: "brief" });
  }

  getCandles(symbol, granularity = 900, count = 150) {
    // Ensure granularity is always an integer number of seconds before sending
    // Accept either a numeric seconds value or a timeframe label (e.g. '1M').
    let granInSeconds = granularity;
    if (typeof granularity === "string") {
      granInSeconds = GRANULARITY_MAP[granularity] ?? Number(granularity);
    }
    granInSeconds = Number(granInSeconds);
    if (!Number.isFinite(granInSeconds) || granInSeconds <= 0) {
      granInSeconds = 60; // safe default to 1 minute
    }
    granInSeconds = Math.trunc(granInSeconds);

    return this.request({
      ticks_history: symbol,
      adjust_start_time: 1,
      count,
      end: "latest",
      style: "candles",
      granularity: granInSeconds,
    });
  }

  subscribeTicks(symbol, listener) {
    if (!this.tickListeners.has(symbol))
      this.tickListeners.set(symbol, new Set());
    const listeners = this.tickListeners.get(symbol);
    listeners.add(listener);

    if (listeners.size === 1) {
      this.request({ ticks: symbol, subscribe: 1 }).catch((error) => {
        listeners.forEach((callback) => callback({ error }));
      });
    }

    return () => {
      const symbolListeners = this.tickListeners.get(symbol);
      if (!symbolListeners) return;

      symbolListeners.delete(listener);
      if (symbolListeners.size > 0) return;

      this.tickListeners.delete(symbol);
      const subscriptionId = this.tickSubscriptions.get(symbol);
      this.tickSubscriptions.delete(symbol);
      if (subscriptionId && this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ forget: subscriptionId }));
      }
    };
  }
}

export const derivMarketData = new DerivMarketData();
