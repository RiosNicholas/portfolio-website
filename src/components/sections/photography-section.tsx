import { photographyCategories } from "~/lib/portfolio-data";
import { SectionShell } from "~/components/ui/section-shell";

export function PhotographySection() {
	return (
		<SectionShell
			description="A secondary practice that influences my product work: composition, rhythm, hierarchy, and visual storytelling."
			eyebrow="Creative Practice"
			id="photography"
			title="Photography"
		>
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{photographyCategories.map((category) => (
					<div
						className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-5"
						key={category}
					>
						<p className="text-sm text-zinc-200">{category}</p>
					</div>
				))}
			</div>
		</SectionShell>
	);
}
