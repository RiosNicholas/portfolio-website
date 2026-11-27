import type { Metadata } from "next";

import { ContactCta } from "~/components/features/contact-cta";
import { WritingFeed } from "~/components/features/writing-feed";
import { WritingHero } from "~/components/features/writing-hero";
import { getWritingFeed } from "~/server/data/writing";

const description =
	"Articles by Nicholas Rios and the places his work has been featured: frontend, design systems and agentic AI.";

export const metadata: Metadata = {
	title: "Writing",
	description,
	alternates: { canonical: "/writing" },
	openGraph: {
		type: "website",
		url: "/writing",
		title: "Writing - Nicholas Rios",
		description,
	},
};

export default async function WritingPage() {
	const items = await getWritingFeed();

	return (
		<main id="main-content">
			<WritingHero />

			<section aria-label="Writing feed" className="shell pt-section">
				<WritingFeed items={items} />
			</section>

			<ContactCta />
		</main>
	);
}
