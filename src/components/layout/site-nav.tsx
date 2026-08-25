"use client";

import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "~/components/theme/theme-toggle";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "~/components/ui/navigation-menu";
import { navLinks, profileLinks } from "~/lib/site-links";
import { cn } from "~/lib/utils";

const socialIconCls = "size-4 shrink-0";

const socialLinks = [
	{
		href: profileLinks.github,
		label: "Visit my GitHub profile",
		icon: <GitHubLogoIcon aria-hidden="true" className={socialIconCls} />,
	},
	{
		href: profileLinks.linkedin,
		label: "Visit my LinkedIn profile",
		icon: <LinkedInLogoIcon aria-hidden="true" className={socialIconCls} />,
	},
];

const socialLinkCls =
	"inline-flex h-8 w-8 items-center justify-center rounded-full text-(--ink-3) transition-colors hover:bg-(--frosted) hover:text-(--ink)";

function navItemCls(active: boolean) {
	return cn(
		"inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-medium text-sm tracking-normal no-underline transition-colors",
		"focus-visible:outline-none focus-visible:ring-(--accent) focus-visible:ring-2",
		// `NavigationMenuLink`'s shadcn base classes (navigation-menu.tsx) ship
		// unconditional `hover:bg-muted focus:bg-muted`. tailwind-merge dedupes
		// our `hover:` override against the base one correctly, but there's no
		// `focus:` override here to dedupe against — so clicking a link (which
		// focuses it, standard browser behavior) left `focus:bg-muted` as the
		// only rule for that pseudo-class, visibly stuck until the link lost
		// focus. Mirroring each state's hover color under `focus:` fixes it.
		active
			? "bg-(--ink) text-(--paper) hover:bg-(--ink) hover:text-(--paper) focus:bg-(--ink) focus:text-(--paper)"
			: "text-(--ink-3) hover:bg-(--frosted) hover:text-(--ink) focus:bg-(--frosted) focus:text-(--ink)",
	);
}

export function SiteNav() {
	const pathname = usePathname();

	return (
		<nav
			aria-label="Primary"
			className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-6 border-border border-b bg-[color-mix(in_srgb,var(--paper)_92%,transparent)] px-5 py-4 font-medium font-sans text-(--ink-3) text-sm tracking-normal backdrop-blur-sm md:px-8 lg:px-10"
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

			{/* Profile links + theme toggle */}
			<div className="flex items-center gap-0.5">
				<div className="hidden items-center gap-0.5 sm:flex">
					{socialLinks.map(({ href, label, icon }) => (
						<a
							aria-label={label}
							className={socialLinkCls}
							href={href}
							key={href}
							rel="noopener noreferrer"
							target="_blank"
						>
							{icon}
						</a>
					))}
				</div>
				<span
					aria-hidden="true"
					className="mx-1 hidden h-4 w-px bg-border sm:block"
				/>
				<ThemeToggle />
			</div>
		</nav>
	);
}
