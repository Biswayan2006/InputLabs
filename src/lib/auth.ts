/**
 * Full Auth.js config — runs in Node.js runtime only (API routes, server components).
 * Includes the MongoDB adapter for persisting accounts/sessions to the DB.
 * Do NOT import this file from middleware.ts — use auth.config.ts there instead.
 */
import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import { authConfig } from "./auth.config";

// ─── MongoDB client for the adapter ──────────────────────────────────────────
const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
const clientPromise = client.connect();

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
});

// Re-export the helper so callers don't need to import auth.config separately
export { isAdminEmail } from "./auth.config";
