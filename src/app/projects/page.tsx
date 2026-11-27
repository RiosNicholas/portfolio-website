import type { Metadata } from "next";

import { CaseStudy } from "~/components/features/case-study";
import { CaseStudyIndex } from "~/components/features/case-study-index";
import { ContactCta } from "~/components/features/contact-cta";
import { ProjectsHero } from "~/components/features/projects-hero";
import { getCaseStudies } from "~/server/data/case-studies";

const description =
	"Projects by Nicholas Rios, a New York City area software engineer: web apps, sites, and experiments designed and built outside the day job.";

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
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
					<CaseStudyIndex studies={cases} />
					<div className="flex flex-col gap-6 md:gap-8 lg:col-span-9">
						{cases.map((study) => (
							<CaseStudy key={study.id} study={study} />
						))}
					</div>
				</div>
			</section>

			<ContactCta />
		</main>
	);
}
