import { AboutBio } from "~/components/features/about-bio";
import { AboutHero } from "~/components/features/about-hero";
import { ContactStrip } from "~/components/features/contact-strip";

export default function AboutPage() {
	return (
		<main className="shell" id="main-content">
			<AboutHero />
			<AboutBio />
			<ContactStrip />
		</main>
	);
}
