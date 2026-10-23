import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./db";

const DEFAULT_SECRET = "dev-secret-super-key-portfolio-minimum-32-chars-long-x!";
const SECRET_KEY = new TextEncoder().encode(process.env.AUTH_SECRET || DEFAULT_SECRET);
const SESSION_COOKIE_NAME = "portfolio_admin_session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds

export interface AdminSession {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export async function createSessionToken(payload: AdminSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized: Admin authentication required.");
  }
  return session;
}

export async function verifyAdminCredentials(
  email: string,
  plainPassword: string
): Promise<AdminSession | null> {
  // 1. Try PostgreSQL database AdminUser record
  try {
    if (process.env.DATABASE_URL) {
      const user = await prisma.adminUser.findUnique({
        where: { email: email.toLowerCase().trim() },
      });
      if (user) {
        const matches = await comparePassword(plainPassword, user.passwordHash);
        if (matches) {
          return {
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }
      }
    }
  } catch {
    // If DB is offline, continue to fallback check
  }

  // 2. Check environment variable credentials or fallback bootstrap admin
  const envEmail = (process.env.ADMIN_EMAIL || "admin@portfolio.local").toLowerCase().trim();
  const envPassword = process.env.ADMIN_PASSWORD || "SecureAdminPassword123!";
  const envName = process.env.ADMIN_NAME || "Portfolio Architect";

  if (email.toLowerCase().trim() === envEmail && plainPassword === envPassword) {
    return {
      userId: "admin-bootstrap-root",
      email: envEmail,
      name: envName,
      role: "ADMIN",
    };
  }

  return null;
}
