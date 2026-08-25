import Link from "next/link";

import { BentoGrid } from "~/components/features/bento-grid";
import { EndorsementMarquee } from "~/components/features/endorsement-marquee";
import { HeroSection } from "~/components/features/hero-section";
import { WorkTeaser } from "~/components/features/work-teaser";
import { SectionHeader } from "~/components/layout/section-header";
import { Reveal } from "~/components/ui/reveal";
import { endorsements } from "~/lib/endorsements";

export default function HomePage() {
	return (
		<main className="shell" id="main-content">
			{/* Hero */}
			<HeroSection />

			{/* Bento */}
			<section aria-label="Quick facts">
				<BentoGrid />
			</section>

			{/* Work teaser */}
			<section aria-label="Selected work" className="py-14 sm:py-20 lg:py-28">
				<SectionHeader
					meta={
						<Link className="text-(--accent-text)" href="/work">
							View all →
						</Link>
					}
					num="01 — Selected"
					title={
						<>
							Recent <em className="mark">work</em>
						</>
					}
				/>
				<Reveal>
					<WorkTeaser />
				</Reveal>
			</section>

			{/* Endorsements */}
			<section aria-label="Endorsements" className="py-14 sm:py-20 lg:py-28">
				<Reveal>
					<SectionHeader
						meta={`${endorsements.length} endorsements · cont.`}
						num="02 — Kind words"
						title={
							<>
								People I&apos;ve <em className="mark">worked with</em>
							</>
						}
					/>
				</Reveal>
				<EndorsementMarquee />
			</section>
		</main>
	);
}
