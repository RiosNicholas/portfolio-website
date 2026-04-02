import { platformWork } from "~/lib/portfolio-data";
import { SectionShell } from "~/components/layout/section-panel";

export function PlatformSection() {
	return (
		<SectionShell
			description="Platform-focused projects that improve consistency, speed, and reliability across product surfaces."
			eyebrow="Primary Focus"
			id="work"
			title="UI Platform Work"
		>
			<ul className="grid gap-3 text-zinc-200">
				{platformWork.map((item) => (
					<li className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3" key={item}>
						{item}
					</li>
				))}
			</ul>
		</SectionShell>
	);
}
