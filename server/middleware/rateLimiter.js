// Simple in-memory rate limiter. Not suitable for multi-process deployments.
const rateLimit = (opts = {}) => {
  const windowMs = opts.windowMs || 15 * 60 * 1000; // 15 minutes
  const max = opts.max || 100; // max requests per window
  const hits = new Map();

  setInterval(
    () => {
      // clear expired entries periodically
      const now = Date.now();
      for (const [key, entry] of hits.entries()) {
        if (now - entry.start >= windowMs) hits.delete(key);
      }
    },
    Math.max(60 * 1000, Math.floor(windowMs / 2)),
  );

  return (req, res, next) => {
    try {
      const key =
        req.ip ||
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        "unknown";
      const now = Date.now();
      const entry = hits.get(key);
      if (!entry) {
        hits.set(key, { count: 1, start: now });
        res.setHeader("X-RateLimit-Limit", max);
        res.setHeader("X-RateLimit-Remaining", max - 1);
        return next();
      }

      if (now - entry.start >= windowMs) {
        // reset
        hits.set(key, { count: 1, start: now });
        res.setHeader("X-RateLimit-Limit", max);
        res.setHeader("X-RateLimit-Remaining", max - 1);
        return next();
      }

      entry.count += 1;
      const remaining = Math.max(0, max - entry.count);
      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", remaining);
      if (entry.count > max) {
        res
          .status(429)
          .json({ message: "Too many requests, please try again later." });
      } else next();
    } catch (err) {
      next();
    }
  };
};

export default rateLimit;
