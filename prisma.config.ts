import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Match Next.js's own env-file precedence: `.env` first, then `.env.local`
// overriding it. Plain `dotenv/config` only loads `.env`, so `next dev`
// (Neon, via `.env.local`) and `npx prisma db seed`/`migrate` (local
// Postgres, via `.env`) silently pointed at two different databases.
config();
config({ path: ".env.local", override: true });

export default defineConfig({});
