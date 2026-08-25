import { Reveal } from "~/components/ui/reveal";
import type { CaseStudy as CaseStudyData } from "~/lib/work-data";

export function CaseStudy({ study }: { study: CaseStudyData }) {
	return (
		<article
			aria-labelledby={`${study.id}-title`}
			className="scroll-mt-28 border-border border-t py-10 md:py-16 lg:py-20"
			id={study.id}
		>
			<Reveal className="grid grid-cols-1 gap-9 md:grid-cols-[0.8fr_1.2fr]">
				{/* Left */}
				<div>
					<span className="font-mono text-(--ink-4) text-xs">
						{study.num} — {study.year}
					</span>
					<h2
						className="mt-3 font-display font-semibold text-3xl text-foreground leading-none tracking-tighter md:text-4xl lg:text-5xl"
						id={`${study.id}-title`}
					>
						{study.title}
						<em className="text-(--accent-text) not-italic">{study.titleEm}</em>
						{study.titleSuffix}
					</h2>
					<div className="mt-4 font-medium font-mono text-(--accent-text) text-xs uppercase tracking-wider">
						{study.role}
					</div>
					<div className="mt-1 font-mono text-(--ink-3) text-xs">
						{study.org}
					</div>
				</div>

				{/* Right */}
				<div>
					<p className="font-normal font-sans text-(--ink-2) text-base leading-relaxed tracking-normal">
						{study.description}
					</p>
					<div className="mt-5 font-mono text-(--ink-3) text-xs">
						{study.tags.join(", ")}
					</div>
					<div className="mt-8 grid grid-cols-1 gap-4 border-(--border) border-t pt-6 sm:grid-cols-3">
						{study.stats.map((stat) => (
							<div key={stat.k}>
								<div className="font-medium font-mono text-(--ink-3) text-xs uppercase tracking-wider">
									{stat.k}
								</div>
								<div className="mt-1 font-display font-semibold text-foreground text-lg md:text-xl">
									{stat.v}
								</div>
							</div>
						))}
					</div>
				</div>
			</Reveal>
		</article>
	);
}
