import type { DefaultSession, NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

import { env } from "~/env";
import { verifyPassword } from "./password";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			// ...other properties
			// role: UserRole;
		} & DefaultSession["user"];
	}

	// interface User {
	//   // ...other properties
	//   // role: UserRole;
	// }
}

/** The only identity this app can ever mint. `authorize()` returns it and
 * `isAdminUserId()` (src/server/api/trpc.ts) checks against it — one
 * constant, two consumers, so they cannot drift. Credentials sessions are
 * JWT-only, so this is never a database row. */
export const ADMIN_USER_ID = "admin";

const credentialsSchema = z.object({
	username: z.string(),
	password: z.string(),
});

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
	providers: [
		CredentialsProvider({
			name: "Admin",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const parsed = credentialsSchema.safeParse(credentials);
				if (!parsed.success) return null;
				const { username, password } = parsed.data;
				// Always run the KDF, even on a username miss, so the response
				// time doesn't distinguish the two cases.
				const passwordOk = await verifyPassword(
					password,
					env.ADMIN_PASSWORD_HASH,
				);
				if (username !== env.ADMIN_USERNAME || !passwordOk) return null;
				return { id: ADMIN_USER_ID, name: "Admin" };
			},
		}),
	],
	// No adapter: Auth.js does not persist Credentials logins to the database
	// under any adapter — Credentials auth is JWT-only by design. Re-add
	// PrismaAdapter(db) only if an OAuth-style provider comes back.
	session: { strategy: "jwt" },
	callbacks: {
		// JWT strategy: `token`, not `user`. Auth.js copies authorize()'s
		// `user.id` onto `token.sub` at sign-in. Falling back to "" rather than
		// ADMIN_USER_ID keeps this fail-closed.
		session: ({ session, token }) => ({
			...session,
			user: { ...session.user, id: token.sub ?? "" },
		}),
	},
} satisfies NextAuthConfig;
