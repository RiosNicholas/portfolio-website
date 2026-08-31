"use client";

import { LogOut } from "lucide-react";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

import { AdminBadge, AdminButton } from "~/components/admin/admin-ui";

/** Rendered only on `/admin` routes (see `SiteNav`). Resolves its own
 * session client-side rather than receiving it as a prop from the root
 * layout — see `agentWork/admin-signin-badge/02-plan.md` for why: a
 * root-layout `auth()` call would de-static-ify `/`, `/about`, and `/work`. */
export function AdminSessionControls() {
	const [signedIn, setSignedIn] = useState(false);
	const [pending, setPending] = useState(false);

	useEffect(() => {
		let cancelled = false;
		getSession()
			.then((session) => {
				if (!cancelled) setSignedIn(Boolean(session?.user));
			})
			.catch(() => {
				if (!cancelled) setSignedIn(false);
			});
		return () => {
			cancelled = true;
		};
	}, []);

	if (!signedIn) return null;

	async function handleSignOut() {
		setPending(true);
		try {
			await signOut({ redirectTo: "/" });
		} catch {
			setPending(false);
		}
	}

	return (
		<>
			<span
				aria-hidden="true"
				className="mx-1 hidden h-4 w-px bg-border sm:block"
			/>
			<span className="hidden sm:inline-flex">
				<AdminBadge tone="accent">Signed in</AdminBadge>
			</span>
			<AdminButton
				aria-label="Sign out"
				disabled={pending}
				onClick={handleSignOut}
				size="sm"
				variant="ghost"
			>
				<LogOut aria-hidden="true" className="size-3.5" />
				<span className="hidden sm:inline">
					{pending ? "Signing out…" : "Sign out"}
				</span>
			</AdminButton>
		</>
	);
}
