import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// ─── Admin emails ─────────────────────────────────────────────────────────────
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

/**
 * Edge-safe Auth.js config.
 * NO Node.js-only imports (no MongoClient, no crypto, no mongoose).
 * Used by middleware.ts which runs in the Edge runtime.
 * The full config (with MongoDB adapter) lives in auth.ts.
 */
export const authConfig: NextAuthConfig = {
  providers: [
    // Provider config is needed so Auth.js knows valid providers exist,
    // but credentials are read from env at runtime — no Node modules needed.
    Google({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/login",
    error:  "/login",
  },

  callbacks: {
    /** Used by middleware to gate routes based on session presence + role */
    authorized({ auth }) {
      // We handle route protection manually in middleware, so always allow here.
      // The real gating logic is in middleware.ts using isAdminEmail().
      return !!auth;
    },

    async jwt({ token, user }) {
      if (user?.email) {
        token.role = isAdminEmail(user.email) ? "admin" : "user";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).role = (token.role as string) ?? "user";
      }
      return session;
    },
  },
};
