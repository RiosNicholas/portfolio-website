import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		// Required: `/`, `/work`, and `/about` are Server Components that read
		// content from Postgres via Prisma at request/prerender time (see
		// `src/server/data/*.ts`), and `/admin` requires a working NextAuth +
		// Discord session. A build with these unset now fails fast instead of
		// silently shipping a broken deploy — see README.md "Deploying".
		AUTH_SECRET: z.string(),
		AUTH_DISCORD_ID: z.string(),
		AUTH_DISCORD_SECRET: z.string(),
		DATABASE_URL: z.string().url(),
		// Direct (non-pooled) connection, used only by `prisma migrate`. Can be
		// the same value as DATABASE_URL for local dev.
		DIRECT_URL: z.string().url(),
		// Comma-separated NextAuth `User.id`s allowed to use `/admin` and
		// adminProcedure mutations. Sign in once via Discord in dev, then read
		// the created User.id with `npm run db:studio`.
		ADMIN_USER_IDS: z.string(),
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
		DIRECT_URL: process.env.DIRECT_URL,
		ADMIN_USER_IDS: process.env.ADMIN_USER_IDS,
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
