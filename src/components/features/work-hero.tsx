import { Reveal } from "~/components/ui/reveal";
import { StatusDot } from "~/components/ui/status-dot";
import { getCaseStudies } from "~/server/data/case-studies";

export async function WorkHero() {
	const cases = await getCaseStudies();
	const count = String(cases.length);

	return (
		<section className="relative flex min-h-[42vh] flex-col justify-center pt-24 pb-8 md:pt-28 md:pb-10 lg:pt-32 lg:pb-16">
			{/* Eyebrow */}
			<Reveal className="mb-8 inline-flex w-max items-center gap-2.5 rounded-full border border-(--border-2) bg-card px-4 py-2 font-medium font-mono text-(--ink-2) text-xs tracking-normal shadow-(--shadow-card)">
				<StatusDot />
				{count} projects · 2023 — 2026
			</Reveal>

			{/* Headline */}
			<Reveal
				as="h1"
				className="m-0 font-display font-semibold text-5xl text-foreground leading-none tracking-tighter md:text-7xl lg:text-9xl"
			>
				Selected{" "}
				<em className="no-underline! inline-block -rotate-1 rounded-lg bg-(--accent) box-decoration-clone px-2 py-px text-(--marker-ink) not-italic md:px-3 lg:px-4">
					work
				</em>
			</Reveal>

			{/* Subtitle */}
			<Reveal
				as="p"
				className="mt-6 max-w-md font-normal font-sans text-(--ink-2) text-base leading-relaxed tracking-normal md:text-lg"
			>
				Projects ranging from product &amp; platform engineering, design
				systems, fintech, and small apps built solo.
			</Reveal>
		</section>
	);
}
