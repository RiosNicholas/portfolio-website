"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

import {
	AdminButton,
	AdminCard,
	AdminField,
	AdminInput,
} from "~/components/admin/admin-ui";

type LoginFormProps = {
	/** Already sanitized server-side (src/app/auth/login/page.tsx) — do not
	 * re-derive this from the URL here. */
	returnUrl: string;
};

export function LoginForm({ returnUrl }: LoginFormProps) {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setPending(true);
		try {
			const result = await signIn("credentials", {
				username,
				password,
				redirect: false,
			});
			// NextAuth returns HTTP 200 with `ok: true` even on a wrong
			// password when `redirect: false` is used — `error` is the only
			// reliable failure signal here, never `ok`.
			if (!result || result.error) {
				setError("Invalid username or password.");
				return;
			}
			// /admin's auth gate is a Server Component that calls auth(); a
			// plain client-side navigation can serve a stale RSC payload
			// rendered before the session cookie existed, so refresh too.
			router.replace(returnUrl);
			router.refresh();
		} catch {
			setError("Something went wrong. Try again.");
		} finally {
			setPending(false);
		}
	}

	return (
		<AdminCard className="mt-8">
			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
				<AdminField htmlFor="username" label="Username">
					<AdminInput
						autoComplete="username"
						id="username"
						name="username"
						onChange={(e) => setUsername(e.target.value)}
						required
						value={username}
					/>
				</AdminField>
				<AdminField htmlFor="password" label="Password">
					<AdminInput
						autoComplete="current-password"
						id="password"
						name="password"
						onChange={(e) => setPassword(e.target.value)}
						required
						type="password"
						value={password}
					/>
				</AdminField>

				{error && (
					<p className="font-mono text-(--destructive) text-xs" role="alert">
						{error}
					</p>
				)}

				<AdminButton disabled={pending} type="submit" variant="primary">
					{pending ? "Signing in…" : "Sign in"}
				</AdminButton>
			</form>
		</AdminCard>
	);
}
