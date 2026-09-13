export const FIB_LEVELS = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1.0];

export const DRAWING_TOOLS = Object.freeze({
  select: {
    id: "select",
    label: "Pointer",
    icon: "pointer",
    cursor: "default",
    pointsRequired: 0,
  },
  trendline: {
    id: "trendline",
    label: "Trendline",
    icon: "trendline",
    cursor: "crosshair",
    pointsRequired: 2,
  },
  fib: {
    id: "fib",
    label: "Fibonacci",
    icon: "fib",
    cursor: "crosshair",
    pointsRequired: 2,
  },
  long: {
    id: "long",
    label: "Long",
    icon: "long",
    cursor: "crosshair",
    pointsRequired: 2,
  },
  short: {
    id: "short",
    label: "Short",
    icon: "short",
    cursor: "crosshair",
    pointsRequired: 2,
  },
});

export const createDrawingId = () =>
  `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;

export const toChartPoint = (time, price) => ({
  time,
  price: Number(price),
});

export const screenToLogicalPoint = (x, y, chart, series) => {
  if (!Number.isFinite(x) || !Number.isFinite(y) || !chart || !series)
    return null;

  const time = chart.timeScale().coordinateToTime(x);
  const price = series.coordinateToPrice(y);

  if (time === null || price === null || !Number.isFinite(price)) return null;
  return { time, price };
};

export const logicalToScreenPoint = (point, chart, series) => {
  if (!point || !chart || !series) return null;

  const x = chart.timeScale().timeToCoordinate(point.time);
  const y = series.priceToCoordinate(point.price);

  if (x === null || y === null) return null;
  return { x, y };
};

export const translateDrawing = (drawing, deltaTime = 0, deltaPrice = 0) => {
  if (!drawing) return drawing;

  return {
    ...drawing,
    start: {
      ...drawing.start,
      time: Number(drawing.start?.time ?? 0) + Number(deltaTime || 0),
      price: Number(drawing.start?.price ?? 0) + Number(deltaPrice || 0),
    },
    end: {
      ...drawing.end,
      time: Number(drawing.end?.time ?? 0) + Number(deltaTime || 0),
      price: Number(drawing.end?.price ?? 0) + Number(deltaPrice || 0),
    },
  };
};

const getDistanceToSegment = (px, py, x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    return Math.hypot(px - x1, py - y1);
  }

  const t = Math.max(
    0,
    Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSquared),
  );
  const projectionX = x1 + t * dx;
  const projectionY = y1 + t * dy;

  return Math.hypot(px - projectionX, py - projectionY);
};

export const hitTestDrawing = (
  drawing,
  pointer,
  chart,
  series,
  tolerance = 12,
) => {
  if (!drawing || !pointer || !chart || !series) return false;

  const start = logicalToScreenPoint(drawing.start, chart, series);
  const end = logicalToScreenPoint(drawing.end, chart, series);
  if (!start || !end) return false;

  const distance = getDistanceToSegment(
    pointer.x,
    pointer.y,
    start.x,
    start.y,
    end.x,
    end.y,
  );
  return distance <= tolerance;
};

export const hitTestDrawings = (
  drawings = [],
  pointer,
  chart,
  series,
  tolerance = 12,
) => {
  if (!pointer || !chart || !series) return null;

  let hit = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  drawings.forEach((drawing) => {
    const start = logicalToScreenPoint(drawing.start, chart, series);
    const end = logicalToScreenPoint(drawing.end, chart, series);

    if (!start || !end) return;

    const distance = getDistanceToSegment(
      pointer.x,
      pointer.y,
      start.x,
      start.y,
      end.x,
      end.y,
    );
    if (distance <= tolerance && distance < bestDistance) {
      bestDistance = distance;
      hit = drawing;
    }
  });

  return hit;
};

const drawSelectedHighlight = (ctx, start, end) => {
  if (!start || !end) return;

  ctx.save();
  ctx.strokeStyle = "#F5F5F0";
  ctx.lineWidth = 2.2;
  ctx.setLineDash([7, 5]);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.restore();
};

const renderTrendline = (ctx, drawing, chart, series, selected = false) => {
  const start = logicalToScreenPoint(drawing.start, chart, series);
  const end = logicalToScreenPoint(drawing.end, chart, series);
  if (!start || !end) return;

  ctx.strokeStyle = selected ? "#F5F5F0" : "#D4AF37";
  ctx.lineWidth = selected ? 2.5 : 2;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();

  ctx.fillStyle = selected ? "#F5F5F0" : "#D4AF37";
  ctx.beginPath();
  ctx.arc(start.x, start.y, selected ? 4 : 3, 0, Math.PI * 2);
  ctx.arc(end.x, end.y, selected ? 4 : 3, 0, Math.PI * 2);
  ctx.fill();

  if (selected) {
    drawSelectedHighlight(ctx, start, end);
  }
};

const renderFibonacci = (ctx, drawing, chart, series, selected = false) => {
  const start = logicalToScreenPoint(drawing.start, chart, series);
  const end = logicalToScreenPoint(drawing.end, chart, series);
  if (!start || !end) return;

  const minX = Math.min(start.x, end.x);
  const maxX = Math.max(start.x, end.x);
  const priceDiff = drawing.end.price - drawing.start.price;

  FIB_LEVELS.forEach((lvl) => {
    const priceAtLvl = drawing.start.price + priceDiff * lvl;
    const y = series.priceToCoordinate(priceAtLvl);
    if (y === null) return;

    const lineColor =
      lvl === 0.5 || lvl === 0.618 ? "#D4AF37" : "rgba(245, 245, 240, 0.45)";
    ctx.strokeStyle = selected ? "#F5F5F0" : lineColor;
    ctx.lineWidth = lvl === 0.5 || lvl === 0.618 ? 1.8 : 1;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(minX, y);
    ctx.lineTo(maxX, y);
    ctx.stroke();

    ctx.fillStyle = selected ? "#F5F5F0" : "#A8A8A0";
    ctx.font = "10px monospace";
    ctx.fillText(
      `${(lvl * 100).toFixed(1)}% (${priceAtLvl.toFixed(2)})`,
      maxX + 5,
      y + 3,
    );
  });

  if (selected) {
    drawSelectedHighlight(ctx, start, end);
  }
};

const renderPosition = (ctx, drawing, chart, series, selected = false) => {
  const start = logicalToScreenPoint(drawing.start, chart, series);
  const end = logicalToScreenPoint(drawing.end, chart, series);
  if (!start || !end) return;

  const isLong = drawing.type === "long";
  const entryPrice = drawing.start.price;
  const targetPrice = drawing.end.price;
  const riskDist = Math.abs(targetPrice - entryPrice);
  const stopLossPrice = isLong
    ? entryPrice - riskDist / 2
    : entryPrice + riskDist / 2;
  const stopLossY = series.priceToCoordinate(stopLossPrice);

  if (stopLossY === null) return;

  const minX = Math.min(start.x, end.x);
  const maxX = Math.max(start.x, end.x);
  const baseColor = isLong ? "#10B981" : "#EF4444";
  const fillColor = isLong
    ? "rgba(16, 185, 129, 0.14)"
    : "rgba(239, 68, 68, 0.14)";

  ctx.fillStyle = fillColor;
  ctx.strokeStyle = selected ? "#F5F5F0" : baseColor;
  ctx.lineWidth = selected ? 2.2 : 1.5;
  ctx.setLineDash([]);

  const tpTop = Math.min(start.y, end.y);
  const tpHeight = Math.abs(start.y - end.y);
  ctx.fillRect(minX, tpTop, Math.max(1, maxX - minX), tpHeight);
  ctx.strokeRect(minX, tpTop, Math.max(1, maxX - minX), tpHeight);

  ctx.fillStyle = isLong
    ? "rgba(16, 185, 129, 0.12)"
    : "rgba(239, 68, 68, 0.12)";
  const slTop = Math.min(start.y, stopLossY);
  const slHeight = Math.abs(start.y - stopLossY);
  ctx.fillRect(minX, slTop, Math.max(1, maxX - minX), slHeight);
  ctx.strokeRect(minX, slTop, Math.max(1, maxX - minX), slHeight);

  const rr = (
    Math.abs(targetPrice - entryPrice) / Math.abs(entryPrice - stopLossPrice)
  ).toFixed(2);
  ctx.fillStyle = selected ? "#F5F5F0" : "#F5F5F0";
  ctx.font = "bold 11px sans-serif";
  ctx.fillText(
    `R:R ${rr} (${isLong ? "LONG" : "SHORT"})`,
    minX + 6,
    start.y - 6,
  );

  if (selected) {
    drawSelectedHighlight(ctx, start, end);
  }
};

export const renderDrawing = (ctx, drawing, chart, series, options = {}) => {
  if (!drawing || !ctx || !chart || !series) return;
  const { selected = false, preview = false } = options;

  if (drawing.type === "trendline") {
    renderTrendline(ctx, drawing, chart, series, selected || preview);
    return;
  }

  if (drawing.type === "fib") {
    renderFibonacci(ctx, drawing, chart, series, selected || preview);
    return;
  }

  if (drawing.type === "long" || drawing.type === "short") {
    renderPosition(ctx, drawing, chart, series, selected || preview);
    return;
  }

  renderTrendline(ctx, drawing, chart, series, selected || preview);
};

export const renderDrawingScene = ({
  ctx,
  chart,
  series,
  drawings = [],
  selectedDrawingId = null,
  preview = null,
}) => {
  if (!ctx || !chart || !series) return;

  const dpr = window.devicePixelRatio || 1;
  const cssWidth = ctx.canvas.clientWidth;
  const cssHeight = ctx.canvas.clientHeight;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssWidth, cssHeight);

  drawings.forEach((drawing) => {
    renderDrawing(ctx, drawing, chart, series, {
      selected: drawing.id === selectedDrawingId,
    });
  });

  if (preview && preview.start && preview.current) {
    const previewDrawing = {
      id: "preview",
      type: preview.tool,
      start: preview.start,
      end: preview.current,
    };

    renderDrawing(ctx, previewDrawing, chart, series, {
      preview: true,
      selected: false,
    });
  }
};
