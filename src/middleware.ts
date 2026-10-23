import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const DEFAULT_SECRET = "dev-secret-super-key-portfolio-minimum-32-chars-long-x!";
const SECRET_KEY = new TextEncoder().encode(process.env.AUTH_SECRET || DEFAULT_SECRET);
const SESSION_COOKIE_NAME = "portfolio_admin_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    let isAuthenticated = false;
    if (token) {
      try {
        await jwtVerify(token, SECRET_KEY);
        isAuthenticated = true;
      } catch {
        isAuthenticated = false;
      }
    }

    // If on login page and already authenticated -> redirect to dashboard
    if (isLoginPage && isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    // If on protected admin route and NOT authenticated -> redirect to login
    if (!isLoginPage && !isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Set standard security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
