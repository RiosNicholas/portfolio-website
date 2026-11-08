"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "~/components/theme/theme-toggle";
import { navLinks } from "~/lib/site-links";
import { cn } from "~/lib/utils";

// Lazy so `next-auth/react` (and the badge/sign-out UI it powers) never
// lands in the shared client bundle every public page loads — only
// `/admin` routes render this. See agentWork/admin-signin-badge/02-plan.md.
const AdminSessionControls = dynamic(
	() =>
		import("~/components/admin/admin-session-controls").then(
			(m) => m.AdminSessionControls,
		),
	{ ssr: false },
);

// The wordmark already links home, so the bar lists the other pages only.
const pageLinks = navLinks.filter(({ href }) => href !== "/");

export function SiteNav() {
	const pathname = usePathname();
	const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

	return (
		<header className="shell relative z-50">
			<nav
				aria-label="Primary"
				className="flex items-center justify-between gap-4 py-6 text-body"
			>
				<Link
					className="group flex items-center gap-3 font-semibold text-ink no-underline"
					href="/"
				>
					<span
						aria-hidden
						className="size-5 shrink-0 rounded bg-brand transition-transform duration-300 ease-out group-hover:rotate-45"
					/>
					Nicholas Rios
				</Link>

				<div className="flex items-center gap-1 sm:gap-3">
					<ul className="m-0 flex list-none items-center gap-1 p-0 sm:gap-2">
						{pageLinks.map(({ href, label }) => {
							const active = pathname.startsWith(href);
							return (
								<li key={href}>
									<Link
										aria-current={active ? "page" : undefined}
										className={cn(
											"inline-flex px-2 py-2 font-medium no-underline transition-colors sm:px-3",
											active
												? "text-ink underline decoration-2 decoration-brand underline-offset-[0.4em]"
												: "text-ink-muted hover:text-ink",
										)}
										href={href}
									>
										{label}
									</Link>
								</li>
							);
						})}
					</ul>

					<ThemeToggle />
					{isAdminRoute && <AdminSessionControls />}
				</div>
			</nav>
		</header>
	);
}
