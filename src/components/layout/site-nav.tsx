"use client";

import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "~/components/ui/navigation-menu";
import { cn } from "~/lib/utils";

const navLinks = [
	{ href: "/", label: "Home" },
	{ href: "/work", label: "Work" },
	{ href: "/about", label: "About" },
] as const;

function ThemeToggle() {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		setIsDark(document.documentElement.dataset.theme === "dark");
	}, []);

	const toggle = () => {
		const next = isDark ? "light" : "dark";
		document.documentElement.dataset.theme = next;
		try {
			localStorage.setItem("theme", next);
		} catch {}
		setIsDark(!isDark);
	};

	return (
		<button
			aria-label="Toggle theme"
			className="inline-flex h-8 w-8 cursor-none items-center justify-center rounded-full text-(--ink-3) transition-colors hover:bg-(--frosted) hover:text-(--ink)"
			onClick={toggle}
			type="button"
		>
			{isDark ? <Moon size={16} /> : <Sun size={16} />}
		</button>
	);
}

function navItemCls(active: boolean) {
	return cn(
		"inline-flex cursor-none items-center gap-1.5 rounded-full px-4 py-2 font-medium text-sm tracking-[-0.01em] no-underline transition-colors",
		"focus-visible:outline-none focus-visible:ring-(--accent) focus-visible:ring-2",
		active
			? "bg-(--ink) text-(--paper) hover:bg-(--ink) hover:text-(--paper)"
			: "text-(--ink-3) hover:bg-(--frosted) hover:text-(--ink)",
	);
}

export function SiteNav() {
	const pathname = usePathname();

	return (
		<nav
			aria-label="Primary"
			className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-6 border-border border-b bg-[color-mix(in_srgb,var(--paper)_80%,transparent)] px-[clamp(20px,3vw,40px)] py-4 font-medium font-sans text-(--ink-3) text-sm tracking-[-0.01em] backdrop-blur-md [-webkit-backdrop-filter:blur(12px)]"
		>
			{/* Logo */}
			<Link
				className="group flex items-center gap-3 font-display font-semibold text-(--ink) text-base tracking-[-0.02em] no-underline"
				href="/"
			>
				<span className="h-5 w-5 shrink-0 rounded bg-(--accent) transition-transform duration-400 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:rotate-45" />
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
