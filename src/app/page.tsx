import BentoGrid from "~/components/features/bento-grid";
import { ContactStrip } from "~/components/features/contact-strip";
import { EndorsementMarquee } from "~/components/features/endorsement-marquee";
import { HeroSection } from "~/components/features/hero-section";
import { WorkTeaser } from "~/components/features/work-teaser";
import { SectionHeader } from "~/components/layout/section-header";

export default function HomePage() {
	return (
		<main className="shell">
			{/* Hero */}
			<HeroSection />

			{/* Bento */}
			<section aria-label="Quick facts">
				<BentoGrid />
			</section>

			{/* Work teaser */}
			<section
				aria-label="Selected work"
				style={{ padding: "clamp(56px, 8vw, 112px) 0" }}
			>
				<SectionHeader
					meta={
						<a
							href="/work"
							style={{
								color: "var(--accent-text)",
								textDecoration: "none",
							}}
						>
							View all →
						</a>
					}
					num="01 — Selected"
					title={
						<>
							Recent <em className="mark">work</em>
						</>
					}
				/>
				<div className="reveal">
					<WorkTeaser />
				</div>
			</section>

			{/* Endorsements */}
			<section
				aria-label="Endorsements"
				style={{ padding: "clamp(56px, 8vw, 112px) 0" }}
			>
				<div className="reveal">
					<SectionHeader
						meta="12 endorsements · cont."
						num="02 — Kind words"
						title={
							<>
								People I&apos;ve <em className="mark">worked with</em>
							</>
						}
					/>
				</div>
				<EndorsementMarquee />
			</section>

			{/* Contact */}
			<ContactStrip />
		</main>
	);
}
