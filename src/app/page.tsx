import { BentoGrid } from "~/components/features/bento-grid";
import { ContactCta } from "~/components/features/contact-cta";
import { Endorsements } from "~/components/features/endorsements";
import { HeroSection } from "~/components/features/hero-section";
import { Reveal } from "~/components/ui/reveal";
import { getPublishedEndorsements } from "~/server/data/endorsements";
import { getPublishedLanguages } from "~/server/data/languages";
import { getSkillsByKind } from "~/server/data/skills";

export default async function HomePage() {
	const [skills, tools, endorsements, languages] = await Promise.all([
		getSkillsByKind("SKILL"),
		getSkillsByKind("TOOL"),
		getPublishedEndorsements(),
		getPublishedLanguages(),
	]);

	return (
		<main id="main-content">
			<HeroSection />

			<section aria-labelledby="at-a-glance" className="shell pt-24 md:pt-40">
				<Reveal
					as="h2"
					className="m-0 font-semibold text-title"
					id="at-a-glance"
				>
					At a glance
				</Reveal>
				<BentoGrid languages={languages} skills={skills} tools={tools} />
			</section>

			<Endorsements endorsements={endorsements} />
			<ContactCta />
		</main>
	);
}
