import { describe, it, expect } from "vitest";
import { rateLimit } from "../src/lib/rate-limit";

describe("Sliding Window Rate Limiter", () => {
  it("permits requests within allowed limit", () => {
    const testKey = `test-ip-${Date.now()}`;
    const limit = 3;
    const windowMs = 5000;

    const r1 = rateLimit(testKey, limit, windowMs);
    expect(r1.success).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = rateLimit(testKey, limit, windowMs);
    expect(r2.success).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = rateLimit(testKey, limit, windowMs);
    expect(r3.success).toBe(true);
    expect(r3.remaining).toBe(0);

    // 4th request exceeds limit
    const r4 = rateLimit(testKey, limit, windowMs);
    expect(r4.success).toBe(false);
    expect(r4.remaining).toBe(0);
  });
});
