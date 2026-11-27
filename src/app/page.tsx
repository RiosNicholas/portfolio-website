import { BentoGrid } from "~/components/features/bento-grid";
import { ContactCta } from "~/components/features/contact-cta";
import { Endorsements } from "~/components/features/endorsements";
import { HeroSection } from "~/components/features/hero-section";
import { Reveal } from "~/components/ui/reveal";
import { yearsOfExperience } from "~/lib/dates";
import { getCvEntries } from "~/server/data/cv-entries";
import { getPublishedEndorsements } from "~/server/data/endorsements";
import { getPublishedLanguages } from "~/server/data/languages";
import { getProfile } from "~/server/data/profile";
import { getSkillsByKind } from "~/server/data/skills";

export default async function HomePage() {
	const [skills, tools, endorsements, languages, profile, entries] =
		await Promise.all([
			getSkillsByKind("SKILL"),
			getSkillsByKind("TOOL"),
			getPublishedEndorsements(),
			getPublishedLanguages(),
			getProfile(),
			getCvEntries(),
		]);
	const years = yearsOfExperience(
		entries.filter((e) => e.category === "EXPERIENCE"),
	);

	return (
		<main id="main-content">
			<HeroSection />

			<section aria-labelledby="at-a-glance" className="shell pt-section">
				<Reveal
					as="h2"
					className="m-0 font-semibold text-2xl tracking-tight md:text-3xl lg:text-4xl"
					id="at-a-glance"
				>
					At a glance
				</Reveal>
				<BentoGrid
					languages={languages}
					profile={{
						status: profile.status,
						city: profile.city,
						region: profile.region,
						employer: profile.employer,
						team: profile.team,
					}}
					skills={skills}
					tools={tools}
					years={years}
				/>
			</section>

			<Endorsements endorsements={endorsements} />
			<ContactCta />
		</main>
	);
}
