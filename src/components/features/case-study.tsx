import { Reveal } from "~/components/ui/reveal";
import type { CaseStudy as CaseStudyData } from "~/lib/work-data";

export function CaseStudy({ study }: { study: CaseStudyData }) {
	return (
		<article
			className="scroll-mt-28 border-border border-t py-[clamp(40px,6vw,80px)]"
			id={study.id}
		>
			<Reveal className="grid grid-cols-1 gap-[clamp(24px,4vw,48px)] md:grid-cols-[0.8fr_1.2fr]">
				{/* Left */}
				<div>
					<span className="font-mono text-(--ink-4) text-xs">
						{study.num} — {study.year}
					</span>
					<h3 className="mt-3 font-display font-semibold text-[clamp(28px,3.4vw,46px)] text-foreground leading-none tracking-[-0.04em]">
						{study.title}
						<em className="text-(--accent-text) not-italic">{study.titleEm}</em>
						{study.titleSuffix}
					</h3>
					<div className="mt-4 font-medium font-mono text-(--accent-text) text-[11px] uppercase tracking-[0.04em]">
						{study.role}
					</div>
					<div className="mt-1 font-mono text-(--ink-3) text-xs">
						{study.org}
					</div>
				</div>

				{/* Right */}
				<div>
					<p className="font-normal font-sans text-(--ink-2) text-[clamp(16px,1.3vw,18px)] leading-relaxed tracking-[-0.005em]">
						{study.description}
					</p>
					<div className="mt-5 font-mono text-(--ink-3) text-xs">
						{study.tags.join(", ")}
					</div>
					<div className="mt-8 grid grid-cols-3 gap-4 border-(--border) border-t pt-6">
						{study.stats.map((stat) => (
							<div key={stat.k}>
								<div className="font-medium font-mono text-(--ink-3) text-[11px] uppercase tracking-[0.04em]">
									{stat.k}
								</div>
								<div className="mt-1 font-display font-semibold text-[clamp(18px,1.8vw,24px)] text-foreground">
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
