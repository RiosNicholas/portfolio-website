import Link from "next/link";

import { HeroSection } from "~/components/features/hero-section";

export default function HomePage() {
	return (
		<main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 py-10 md:px-8">
			<HeroSection />
			<section className="grid gap-3 md:grid-cols-3">
				{[
					{ href: "/role", label: "Role Overview" },
					{ href: "/work", label: "UI Platform Work" },
					{ href: "/architecture", label: "Frontend Architecture" },
					{ href: "/photography", label: "Photography" },
					{ href: "/about", label: "About" },
					{ href: "/connect", label: "Connect" },
				].map((item) => (
					<Link
						className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-zinc-200 transition hover:bg-zinc-800"
						href={item.href}
						key={item.href}
					>
						{item.label}
					</Link>
				))}
			</section>
		</main>
	);
}
