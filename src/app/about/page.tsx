import type { Metadata } from "next";

import { AboutBio } from "~/components/features/about-bio";
import { AboutHero } from "~/components/features/about-hero";
import { ContactCta } from "~/components/features/contact-cta";
import { getYearsOfExperience } from "~/server/data/cv-entries";

export async function generateMetadata(): Promise<Metadata> {
	const years = await getYearsOfExperience();
	const tenure =
		years === "<1"
			? "under a year"
			: `${years} ${years === "1" ? "year" : "years"}`;
	const description = `About Nicholas Rios - ${tenure} building software, focused on frontend platform engineering, design systems, and agentic AI. Based in New York City area.`;

	return {
		title: "About",
		description,
		alternates: { canonical: "/about" },
		openGraph: {
			type: "profile",
			url: "/about",
			title: "About - Nicholas Rios",
			description,
		},
	};
}

export default function AboutPage() {
	return (
		<main id="main-content">
			<AboutHero />
			<AboutBio />
			<ContactCta />
		</main>
	);
}
