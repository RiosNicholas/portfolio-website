import { AboutSection } from "~/components/features/about-section";
import { SectionShell } from "~/components/layout/section-panel";

export default function AboutPage() {
	return (
		<main className="mx-auto flex min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
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
		</main>
	);
}
