import type { Metadata } from "next";

import { ContactCta } from "~/components/features/contact-cta";
import { WritingFeed } from "~/components/features/writing-feed";
import { WritingHero } from "~/components/features/writing-hero";
import { WritingPrototype } from "~/components/features/writing-prototype";
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

export default async function WritingPage({
	searchParams,
}: {
	searchParams: Promise<{ variant?: string }>;
}) {
	const { variant } = await searchParams;
	// PROTOTYPE: ?variant= only works outside production.
	const prototype = process.env.NODE_ENV !== "production" ? variant : undefined;

	return (
		<main id="main-content">
			<WritingHero />

			<section aria-label="Writing feed" className="shell pt-section">
				{prototype ? (
					<WritingPrototype variant={prototype} />
				) : (
					<WritingFeed items={await getWritingFeed()} />
				)}
			</section>

			<ContactCta />
		</main>
	);
}
