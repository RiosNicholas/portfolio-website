import { architectureWork } from "~/lib/portfolio-data";
import { SectionShell } from "~/components/ui/section-shell";

export function ArchitectureSection() {
	return (
		<SectionShell
			description="How I shape frontend systems so teams can move quickly without sacrificing maintainability."
			eyebrow="System Thinking"
			id="architecture"
			title="Frontend Architecture"
		>
			<div className="grid gap-3 md:grid-cols-3">
				{architectureWork.map((item) => (
					<article
						className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-zinc-200"
						key={item}
					>
						<h3 className="font-medium text-zinc-100">Practice</h3>
						<p className="mt-2 text-sm">{item}</p>
					</article>
				))}
			</div>
		</SectionShell>
	);
}
