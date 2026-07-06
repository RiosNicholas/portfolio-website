"use client";

import Link from "next/link";

export function HeroSection() {
	return (
		<section className="hero-min relative flex min-h-[84vh] flex-col justify-center pt-[clamp(118px,16vh,168px)] pb-[clamp(48px,7vw,96px)]">
			{/* Geometric decorations */}
			<div
				aria-hidden
				className="geo geo-ring float no-low top-[13%] right-[5%] h-29.5 w-29.5 text-(--c-cobalt) opacity-65 [--geo-rot:-8deg]"
			/>
			<div
				aria-hidden
				className="geo geo-tri float no-low top-[33%] right-[20%] text-(--c-lime) text-[62px] opacity-85 [--geo-rot:10deg]"
			/>
			<div
				aria-hidden
				className="geo geo-dotsq spin no-low right-[9%] bottom-[15%] h-23 w-23 text-(--c-grape) opacity-45"
			/>
			<div
				aria-hidden
				className="geo geo-circle fill float no-low bottom-[32%] left-[43%] h-4 w-4 text-(--c-yellow) opacity-90"
			/>

			<div className="relative z-10">
				{/* Eyebrow */}
				<div className="reveal mb-8 inline-flex w-max items-center gap-2.5 rounded-full border border-(--border-2) bg-card px-4 py-2 font-medium font-mono text-(--ink-2) text-xs tracking-normal shadow-(--shadow-card)">
					<span className="h-2 w-2 shrink-0 animate-[breathe_2.4s_ease-in-out_infinite] rounded-full bg-(--c-lime) shadow-[0_0_0_3px_color-mix(in_srgb,var(--c-lime)_30%,transparent)]" />
					Available · Open to new opportunities
				</div>

				{/* Headline */}
				<h1 className="reveal m-0 font-display font-semibold text-[clamp(50px,10.5vw,142px)] text-foreground leading-[0.92] tracking-[-0.04em]">
					Software
					<br />
					engineer &amp;
					<br />
					<em className="no-underline! inline-block -rotate-[1.4deg] rounded-lg bg-(--accent) box-decoration-clone px-[0.16em] py-[0.01em] text-(--marker-ink) not-italic">
						interface
					</em>{" "}
					craftsman.
				</h1>

				{/* Lead */}
				<p className="reveal mt-[clamp(28px,4vw,40px)] max-w-[54ch] font-normal font-sans text-(--ink-2) text-[clamp(17px,1.4vw,21px)] leading-normal tracking-[-0.005em]">
					I&apos;m Nick — a frontend engineer building{" "}
					<em className="no-underline! font-semibold text-foreground not-italic">
						shared UI infrastructure
					</em>{" "}
					and developer tooling in risk tech at JPMorganChase, from platform
					components to specialized AI agents.
				</p>

				{/* Footer row */}
				<div className="reveal mt-[clamp(48px,7vw,78px)] grid grid-cols-[1fr_auto] items-end gap-6 border-border border-t pt-6">
					<div className="flex flex-wrap gap-7 font-mono text-muted-foreground text-xs tracking-normal">
						<div>
							<span className="text-foreground">Jersey City, NJ</span> — 40.72°
							N
						</div>
						<div>
							<span className="text-foreground">EST · UTC−5</span>
						</div>
						<div>
							<span className="text-foreground">2026</span> · vol. vii
						</div>
					</div>

					<Link
						className="inline-flex cursor-none items-center gap-2.5 whitespace-nowrap rounded-(--r-md) bg-(--cta-bg) px-5.5 py-3.25 font-display font-semibold text-(--cta-ink) text-base tracking-[-0.015em] no-underline shadow-(--shadow-pop) transition-[transform,background] duration-300 ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-0.5 hover:bg-(--cta-bg-hover)"
						href="/work"
					>
						<span>See selected work</span>
						<span>↗</span>
					</Link>
				</div>
			</div>
		</section>
	);
}
