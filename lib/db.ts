import * as dotenv from "dotenv";
// Only load .env if not in a Next.js environment (Next.js loads it automatically)
if (process.env.NODE_ENV !== 'production' && !process.env.NEXT_RUNTIME) {
  dotenv.config({ path: ".env" });
}

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema"; // adjust path

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL not set in .env");
  // Don't throw immediately in edge/serverless if it might be cold start, but good for local
} else {
    console.log("✅ DATABASE_URL is set");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Needed for Neon
});

export const db = drizzle(pool, { schema });
