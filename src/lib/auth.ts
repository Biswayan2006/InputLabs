import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Using JWT strategy — no database adapter needed for sessions.
// The adapter is only required for database sessions, which we're not using.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
});

export { isAdminEmail } from "./auth.config";
