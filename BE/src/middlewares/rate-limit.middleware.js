export function createRateLimitMiddleware(options = {}) {
  const windowMs = Number(options.windowMs) || 60 * 1000;
  const max = Number(options.max) || 120;
  const store = new Map();

  return function rateLimitMiddleware(req, res, next) {
    const now = Date.now();
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const current = store.get(key);

    if (!current || current.resetAt <= now) {
      store.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return next();
    }

    current.count += 1;

    if (current.count <= max) {
      return next();
    }

    const retryAfterSeconds = Math.ceil((current.resetAt - now) / 1000);
    res.set("Retry-After", String(retryAfterSeconds));

    return res.status(429).json({
      success: false,
      error: {
        code: "RATE_LIMITED",
        message: "Too many requests. Please retry later.",
      },
    });
  };
}

export const defaultRateLimit = createRateLimitMiddleware();