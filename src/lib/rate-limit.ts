interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < 600000); // 10 minutes
    if (entry.timestamps.length === 0) {
      rateLimitStore.delete(key);
    }
  }
}, 300000);

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

export function rateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier) || { timestamps: [] };

  // Filter timestamps within current window
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= limit) {
    const oldest = entry.timestamps[0];
    const resetMs = Math.max(0, windowMs - (now - oldest));
    return {
      success: false,
      limit,
      remaining: 0,
      resetMs,
    };
  }

  entry.timestamps.push(now);
  rateLimitStore.set(identifier, entry);

  return {
    success: true,
    limit,
    remaining: limit - entry.timestamps.length,
    resetMs: windowMs,
  };
}
