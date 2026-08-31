import { BentoGrid } from "~/components/features/bento-grid";
import { EndorsementMarquee } from "~/components/features/endorsement-marquee";
import { HeroSection } from "~/components/features/hero-section";
import { SectionHeader } from "~/components/layout/section-header";
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
		<main className="shell" id="main-content">
			{/* Hero */}
			<HeroSection />

			{/* Bento */}
			<section aria-label="Quick facts">
				<BentoGrid languages={languages} skills={skills} tools={tools} />
			</section>

			{/* Endorsements */}
			<section aria-label="Endorsements" className="pt-14 sm:pt-20 lg:pt-28">
				<Reveal>
					<SectionHeader
						meta={`${endorsements.length} endorsements.`}
						title={
							<>
								People I&apos;ve <em className="mark">worked with</em>
							</>
						}
					/>
				</Reveal>
				<EndorsementMarquee endorsements={endorsements} />
			</section>
		</main>
	);
}
