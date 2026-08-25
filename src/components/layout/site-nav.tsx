"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { ThemeToggle } from "~/components/theme/theme-toggle";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "~/components/ui/navigation-menu";
import { navLinks } from "~/lib/site-links";
import { cn } from "~/lib/utils";

function navItemCls(active: boolean) {
	return cn(
		"inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-medium text-sm tracking-normal no-underline transition-colors",
		"focus-visible:outline-none focus-visible:ring-(--accent) focus-visible:ring-2",
		active
			? "bg-(--ink) text-(--paper) hover:bg-(--ink) hover:text-(--paper)"
			: "text-(--ink-3) hover:bg-(--frosted) hover:text-(--ink)",
	);
}

export function SiteNav() {
	const pathname = usePathname();
	const navRef = useRef<HTMLElement>(null);

	// Client-side route changes reuse the same <a> DOM nodes (React keys them
	// by href), so the browser's cached `:hover` paint from the click that
	// triggered navigation can persist on an item whose active/inactive state
	// just changed underneath it — it looks "stuck" until a genuine pointer
	// event forces a recompute. Toggling `pointer-events` off and back on for
	// a frame is the standard workaround: it makes the browser drop the stale
	// hover match and repaint from the element's real (current) state.
	// biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the intentional re-run trigger, not a value read inside the effect
	useEffect(() => {
		const nav = navRef.current;
		if (!nav) return;
		nav.style.pointerEvents = "none";
		const raf = requestAnimationFrame(() => {
			nav.style.pointerEvents = "";
		});
		return () => cancelAnimationFrame(raf);
	}, [pathname]);

	return (
		<nav
			aria-label="Primary"
			className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-6 border-border border-b bg-[color-mix(in_srgb,var(--paper)_92%,transparent)] px-5 py-4 font-medium font-sans text-(--ink-3) text-sm tracking-normal backdrop-blur-sm md:px-8 lg:px-10"
			ref={navRef}
		>
			{/* Logo */}
			<Link
				className="group flex items-center gap-3 font-display font-semibold text-(--ink) text-base tracking-tight no-underline"
				href="/"
			>
				<span className="h-5 w-5 shrink-0 rounded bg-(--accent) transition-transform duration-300 ease-out group-hover:rotate-45" />
				<span>Nicholas&nbsp;Rios</span>
			</Link>

			{/* Nav links */}
			<NavigationMenu viewport={false}>
				<NavigationMenuList className="gap-0.5">
					{navLinks.map(({ href, label }) => {
						const active =
							href === "/" ? pathname === "/" : pathname.startsWith(href);
						return (
							<NavigationMenuItem key={href}>
								<NavigationMenuLink asChild className={navItemCls(active)}>
									<Link href={href}>
										{active && (
											<span className="h-1.5 w-1.5 rounded-full bg-(--accent)" />
										)}
										{label}
									</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
						);
					})}
				</NavigationMenuList>
			</NavigationMenu>

			{/* Theme toggle */}
			<div className="flex items-center">
				<ThemeToggle />
			</div>
		</nav>
	);
}
