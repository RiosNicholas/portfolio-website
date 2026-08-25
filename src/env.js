import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		// Optional: no prerendered route reads these. The backend scaffolding
		// (tRPC/Prisma/NextAuth under src/server/, src/trpc/) is retained but
		// unused today (see README.md "Backend scaffolding") — the two routes
		// that do consume it (/api/trpc, /api/auth) are dynamic, so they're
		// never evaluated during `next build`. Requiring these at build time
		// meant `npm run build` failed on a fresh checkout with no database;
		// making them optional is the actual fix, not a workaround.
		AUTH_SECRET: z.string().optional(),
		AUTH_DISCORD_ID: z.string().optional(),
		AUTH_DISCORD_SECRET: z.string().optional(),
		DATABASE_URL: z.string().url().optional(),
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
	},

	/**
	 * Specify your client-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars. To expose them to the client, prefix them with
	 * `NEXT_PUBLIC_`.
	 */
	client: {
		// NEXT_PUBLIC_CLIENTVAR: z.string(),
	},

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
	 * middlewares) or client-side so we need to destruct manually.
	 */
	runtimeEnv: {
		AUTH_SECRET: process.env.AUTH_SECRET,
		AUTH_DISCORD_ID: process.env.AUTH_DISCORD_ID,
		AUTH_DISCORD_SECRET: process.env.AUTH_DISCORD_SECRET,
		DATABASE_URL: process.env.DATABASE_URL,
		NODE_ENV: process.env.NODE_ENV,
	},
	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
	 * useful for Docker builds.
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	/**
	 * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
	 * `SOME_VAR=''` will throw an error.
	 */
	emptyStringAsUndefined: true,
});
