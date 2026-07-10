/**
 * Runs in the Edge runtime — must only use edge-safe imports.
 * We use NextAuth built with the edge-safe authConfig (no MongoDB adapter).
 */
import NextAuth from "next-auth";
import { authConfig, isAdminEmail } from "@/lib/auth.config";
import { NextResponse } from "next/server";

// Build a lightweight NextAuth instance using only the edge-safe config.
// This gives us the `auth` wrapper which reads the JWT from the cookie.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // ── /admin — must be logged in AND be an admin ────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdminEmail(session.user?.email)) {
      return NextResponse.redirect(new URL("/?error=unauthorized", req.url));
    }
  }

  // ── /login — redirect already-authenticated users to home ────────────────
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|images|shapes).*)"],
};
