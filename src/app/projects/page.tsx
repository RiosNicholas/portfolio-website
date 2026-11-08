import type { Metadata } from "next";

import { CaseStudy } from "~/components/features/case-study";
import { ContactCta } from "~/components/features/contact-cta";
import { ProjectsHero } from "~/components/features/projects-hero";
import { getCaseStudies } from "~/server/data/case-studies";

const description =
	"Projects by Nicholas Rios: web apps, sites and experiments designed and built outside the day job.";

export const metadata: Metadata = {
	title: "Projects",
	description,
	alternates: { canonical: "/projects" },
	openGraph: {
		type: "website",
		url: "/projects",
		title: "Projects - Nicholas Rios",
		description,
	},
};

export default async function ProjectsPage() {
	const cases = await getCaseStudies();

	return (
		<main id="main-content">
			<ProjectsHero />

			<section aria-label="Case studies" className="shell pt-24 md:pt-40">
				<div className="flex flex-col gap-32 md:gap-48">
					{cases.map((study) => (
						<CaseStudy key={study.id} study={study} />
					))}
				</div>
			</section>

			<ContactCta />
		</main>
	);
}
