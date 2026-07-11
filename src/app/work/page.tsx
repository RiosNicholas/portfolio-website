import { CaseStudy } from "~/components/features/case-study";
import { ContactStrip } from "~/components/features/contact-strip";
import { WorkHero } from "~/components/features/work-hero";
import { cases } from "~/lib/work-data";

export default function WorkPage() {
	return (
		<main className="shell">
			<WorkHero />

			<section>
				{cases.map((study) => (
					<CaseStudy key={study.id} study={study} />
				))}
			</section>

			<ContactStrip />
		</main>
	);
}
