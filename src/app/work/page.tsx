import type { Metadata } from "next";

import { CaseStudy } from "~/components/features/case-study";
import { WorkHero } from "~/components/features/work-hero";
import { getCaseStudies } from "~/server/data/case-studies";

const description =
	"Selected projects from Nicholas Rios — product engineering, platform work, and more. Built across fintech, freelance client work, and side projects.";

export const metadata: Metadata = {
	title: "Work",
	description,
	alternates: { canonical: "/work" },
	openGraph: {
		type: "website",
		url: "/work",
		title: "Work — Nicholas Rios",
		description,
	},
};

export default async function WorkPage() {
	const cases = await getCaseStudies();

	return (
		<main className="shell" id="main-content">
			<WorkHero />

			<section aria-label="Case studies">
				{cases.map((study) => (
					<CaseStudy key={study.id} study={study} />
				))}
			</section>
		</main>
	);
}
