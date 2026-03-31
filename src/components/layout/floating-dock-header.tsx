import Link from "next/link";

const navItems = [
	{ href: "/", label: "Home" },
	{ href: "#work", label: "Work" },
	{ href: "#photography", label: "Photography" },
	{ href: "#about", label: "About" },
	{ href: "#contact", label: "Contact" },
];

export function FloatingDockHeader() {
	return (
		<header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
			<div className="flex w-full max-w-4xl items-center justify-between rounded-full border border-zinc-800/80 bg-zinc-900/75 px-4 py-2 backdrop-blur">
				<nav className="flex items-center gap-2 sm:gap-3">
					{navItems.map((item) => (
						<Link
							className="rounded-full px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
							href={item.href}
							key={item.href}
						>
							{item.label}
						</Link>
					))}
				</nav>
			</div>
		</header>
	);
}
