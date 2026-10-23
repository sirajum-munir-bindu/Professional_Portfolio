import { describe, it, expect } from "vitest";
import {
  hashPassword,
  comparePassword,
  createSessionToken,
  verifySessionToken,
} from "../src/lib/auth";

describe("Authentication & Security Engine", () => {
  it("securely hashes and verifies passwords with bcrypt", async () => {
    const plain = "SuperSecretAdminPass123!";
    const hashed = await hashPassword(plain);

    expect(hashed).not.toBe(plain);
    expect(hashed.length).toBeGreaterThan(20);

    const matches = await comparePassword(plain, hashed);
    expect(matches).toBe(true);

    const wrong = await comparePassword("WrongPassword123!", hashed);
    expect(wrong).toBe(false);
  });

  it("signs and verifies JWT admin session tokens", async () => {
    const payload = {
      userId: "admin-1",
      email: "admin@portfolio.local",
      name: "Portfolio Architect",
      role: "ADMIN",
    };

    const token = await createSessionToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");

    const verified = await verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.email).toBe(payload.email);
    expect(verified?.role).toBe("ADMIN");
  });

  it("rejects tampered or malformed JWT tokens", async () => {
    const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.token";
    const verified = await verifySessionToken(invalidToken);
    expect(verified).toBeNull();
  });
});
