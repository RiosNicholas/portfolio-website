import Link from "next/link";

import { GeoDecoration } from "~/components/ui/geo-decoration";
import { Reveal } from "~/components/ui/reveal";
import { StatusDot } from "~/components/ui/status-dot";

export function HeroSection() {
	return (
		<section className="relative flex min-h-screen flex-col justify-center pt-24 pb-12 md:pt-32 md:pb-16 lg:pt-36 lg:pb-20">
			{/* Geometric decorations */}
			<GeoDecoration
				className="geo geo-ring no-low top-[13%] right-[5%] h-29.5 w-29.5 text-(--c-cobalt) opacity-65"
				rot={-8}
				variant="float"
			/>
			<GeoDecoration
				className="geo geo-tri no-low top-1/3 right-[20%] text-(--c-lime) text-6xl opacity-85"
				rot={10}
				variant="float"
			/>
			<GeoDecoration
				className="geo geo-dotsq no-low right-[9%] bottom-[15%] h-23 w-23 text-(--c-grape) opacity-45"
				variant="spin"
			/>
			<GeoDecoration
				className="geo geo-circle fill no-low bottom-[32%] left-[43%] h-4 w-4 text-(--c-yellow) opacity-90"
				variant="float"
			/>

			<div className="relative z-10">
				{/* Eyebrow */}
				<Reveal className="mb-8 inline-flex w-max items-center gap-2.5 rounded-full border border-(--border-2) bg-card px-4 py-2 font-medium font-mono text-(--ink-2) text-xs tracking-normal shadow-(--shadow-card)">
					<StatusDot />
					Available · Open to new opportunities
				</Reveal>

				{/* Headline */}
				<Reveal
					as="h1"
					className="m-0 font-display font-semibold text-5xl text-foreground leading-none tracking-tighter md:text-7xl lg:text-9xl"
				>
					Software
					<br />
					engineer &amp;
					<br />
					<em className="no-underline! inline-block -rotate-1 rounded-lg bg-(--accent) box-decoration-clone px-2 py-px text-(--marker-ink) not-italic md:px-3 lg:px-4">
						interface
					</em>{" "}
					craftsman.
				</Reveal>

				{/* Lead */}
				<Reveal
					as="p"
					className="mt-6 max-w-xl font-normal font-sans text-(--ink-2) text-base leading-normal tracking-normal md:mt-8 md:text-lg"
				>
					I&apos;m Nicholas — a Software Engineer specializing in{" "}
					<em className="no-underline! font-semibold text-foreground not-italic">
						UI platform engineering
					</em>
					, building infrastructure and{" "}
					<em className="no-underline! font-semibold text-foreground not-italic">
						agentic AI systems
					</em>{" "}
					in Risk Tech at JPMorganChase, from shared components to production
					agents.
				</Reveal>

				{/* Footer row */}
				<Reveal className="mt-10 flex flex-wrap items-end justify-between gap-6 border-border border-t pt-6 md:mt-12 lg:mt-16">
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
						className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-(--r-md) bg-(--cta-bg) px-5.5 py-3.25 font-display font-semibold text-(--cta-ink) text-base tracking-tight no-underline shadow-(--shadow-pop) transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-(--cta-bg-hover)"
						href="/work"
					>
						<span>See selected work</span>
						<span>↗</span>
					</Link>
				</Reveal>
			</div>
		</section>
	);
}
