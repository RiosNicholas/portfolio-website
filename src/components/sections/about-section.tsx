import { SectionShell } from "~/components/ui/section-shell";

export function AboutSection() {
	return (
		<SectionShell
			description="I work at the intersection of design systems and frontend architecture, partnering with design, product, and engineering to build resilient interfaces."
			eyebrow="Profile"
			id="about"
			title="About"
		>
			<p className="max-w-3xl text-zinc-300">
				My day-to-day includes evolving component APIs, setting adoption standards,
				and improving developer experience for UI teams. I care deeply about
				accessibility, performance, and operational clarity.
			</p>
		</SectionShell>
	);
}
