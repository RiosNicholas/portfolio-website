import Link from "next/link";

import { HeroSocialIcons } from "~/components/features/hero-social-icons";

export function HeroSection() {
	return (
		<section
			className="relative flex min-h-[calc(100dvh-6rem)] flex-col justify-center border-zinc-800/80 border-b px-4 py-16 md:px-8"
			id="hero"
		>
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.18),transparent)]" />

			<div className="relative mx-auto flex w-full max-w-4xl flex-col gap-8">
				<div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
					<div className="space-y-1">
						<p className="text-xs text-zinc-400 uppercase tracking-[0.18em]">
							Software Engineer · UI Architecture & Platform Engineering · Street Photography
						</p>
						<h1 className="font-semibold text-4xl text-white tracking-tight md:text-6xl md:leading-[1.08]">
							Hey, I&apos;m{" "}
							<span className="bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
								Nicholas Rios
							</span>
							.
						</h1>
					</div>
					<HeroSocialIcons />
				</div>

				<div className="max-w-2xl space-y-4">
					<p className="text-lg text-zinc-300 leading-relaxed md:text-xl">
						I help teams ship resilient product UI: design systems, shared
						platform primitives, and frontend architecture that scales across
						squads—without sacrificing velocity, accessibility, or DX.
					</p>
				</div>

				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
					<Link
						className="inline-flex items-center justify-center rounded-full border border-zinc-500 bg-zinc-100 px-6 py-3 font-medium text-sm text-zinc-900 shadow-sm transition hover:bg-white"
						href="/work"
					>
						See how I&apos;ve built UI platforms &amp; scaled frontends
					</Link>
					<Link
						className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-6 py-3 text-sm text-zinc-200 transition hover:bg-zinc-800"
						href="#more"
					>
						Scroll for overview
					</Link>
				</div>
			</div>

			<div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-zinc-500">
				<span className="text-xs uppercase tracking-widest">More</span>
				<svg
					aria-hidden="true"
					className="size-5 animate-bounce"
					fill="none"
					focusable="false"
					stroke="currentColor"
					strokeWidth="2"
					viewBox="0 0 24 24"
				>
					<path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</div>
		</section>
	);
}
