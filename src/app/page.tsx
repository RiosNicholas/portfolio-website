import { AboutSection } from "~/components/sections/about-section";
import { ArchitectureSection } from "~/components/sections/architecture-section";
import { ContactSection } from "~/components/sections/contact-section";
import { HeroSection } from "~/components/sections/hero-section";
import { PhotographySection } from "~/components/sections/photography-section";
import { PlatformSection } from "~/components/sections/platform-section";

export default function HomePage() {
	return (
		<main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 py-10 md:px-8">
			<HeroSection />
			<PlatformSection />
			<ArchitectureSection />
			<PhotographySection />
			<AboutSection />
			<ContactSection />
		</main>
	);
}
