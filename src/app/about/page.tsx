import type { Metadata } from "next";

import { AboutBio } from "~/components/features/about-bio";
import { AboutHero } from "~/components/features/about-hero";
import { ContactCta } from "~/components/features/contact-cta";

const description =
	"About Nicholas Rios — 3 years building software, focused on frontend platform engineering, design systems, and agentic AI. Based in New York City area.";

export const metadata: Metadata = {
	title: "About",
	description,
	alternates: { canonical: "/about" },
	openGraph: {
		type: "profile",
		url: "/about",
		title: "About — Nicholas Rios",
		description,
	},
};

export default function AboutPage() {
	return (
		<main className="shell" id="main-content">
			<AboutHero />
			<AboutBio />
			<ContactCta />
		</main>
	);
}
