import { Reveal } from "~/components/ui/reveal";
import { StatusDot } from "~/components/ui/status-dot";

export function AboutHero() {
	return (
		<section className="relative flex flex-col pt-24 pb-8 md:pt-28 md:pb-10 lg:pt-32 lg:pb-16">
			{/* Eyebrow */}
			<Reveal className="mb-8 inline-flex w-max items-center gap-2.5 rounded-full border border-(--border-2) bg-card px-4 py-2 font-medium font-mono text-(--ink-2) text-xs tracking-normal shadow-(--shadow-card)">
				<StatusDot />
				About · 3 years building software
			</Reveal>

			{/* Headline */}
			<Reveal
				as="h1"
				className="m-0 font-display font-semibold text-5xl text-foreground leading-none tracking-tighter md:text-7xl lg:text-9xl"
			>
				A short{" "}
				<em className="no-underline! inline-block -rotate-1 rounded-lg bg-(--accent) box-decoration-clone px-2 py-px text-(--marker-ink) not-italic md:px-3 lg:px-4">
					bio
				</em>
				.
			</Reveal>
		</section>
	);
}
