"use client";

import { LogOut } from "lucide-react";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

/** Rendered only on `/admin` routes (see `SiteNav`). Resolves its own
 * session client-side rather than receiving it as a prop from the root
 * layout — see `agentWork/admin-signin-badge/02-plan.md` for why: a
 * root-layout `auth()` call would de-static-ify `/`, `/about`, and `/work`. */
export function AdminSessionControls() {
	const [userName, setUserName] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	useEffect(() => {
		let cancelled = false;
		getSession()
			.then((session) => {
				if (!cancelled) {
					setUserName(session?.user ? (session.user.name ?? "Admin") : null);
				}
			})
			.catch(() => {
				if (!cancelled) setUserName(null);
			});
		return () => {
			cancelled = true;
		};
	}, []);

	if (!userName) return null;

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
			<DropdownMenu>
				<DropdownMenuTrigger
					aria-label="Account menu"
					className="rounded-full focus-visible:outline-none focus-visible:ring-(--accent) focus-visible:ring-2 focus-visible:ring-offset-(--paper) focus-visible:ring-offset-2"
				>
					<Avatar size="sm">
						<AvatarFallback className="bg-(--accent) font-display font-semibold text-(--marker-ink)">
							{userName.trim().charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					className="w-auto min-w-40 rounded-(--r-lg) font-sans"
					sideOffset={8}
				>
					<DropdownMenuItem
						className="rounded-(--r-md)"
						disabled={pending}
						onSelect={(e) => {
							e.preventDefault();
							void handleSignOut();
						}}
						variant="destructive"
					>
						<LogOut aria-hidden="true" className="size-4" />
						{pending ? "Signing out…" : "Sign out"}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
