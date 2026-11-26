import type { Metadata } from "next";

import {
	HeroField,
	pageHeroClass,
	RisingWords,
} from "~/components/layout/hero-field";
import { ButtonLink } from "~/components/ui/button-link";
import { Reveal } from "~/components/ui/reveal";
import { profileLinks } from "~/lib/site-links";

const description =
	"Resume of Nicholas Rios, a New York City area platform software engineer: work history, skills and education, with a PDF download.";

export const metadata: Metadata = {
	title: "Resume",
	description,
	alternates: { canonical: "/resume" },
	openGraph: {
		type: "profile",
		url: "/resume",
		title: "Resume - Nicholas Rios",
		description,
	},
};

export default function ResumePage() {
	return (
		<main id="main-content">
			<HeroField className={pageHeroClass} labelledBy="resume-title">
				<h1 className="m-0 font-semibold text-display" id="resume-title">
					<RisingWords text="Resume" />
				</h1>
				<div className="mt-6 grid grid-cols-1 gap-8 md:mt-14 md:grid-cols-12 md:items-end md:gap-10">
					<Reveal
						as="p"
						className="m-0 max-w-[30em] font-medium text-statement md:col-span-8"
						delay={0.3}
					>
						Experience, skills and education, in one PDF.
					</Reveal>
					<Reveal
						className="flex flex-wrap gap-3 md:col-span-4 md:justify-end"
						delay={0.4}
					>
						<ButtonLink download href={profileLinks.resume} variant="pop">
							Download PDF
						</ButtonLink>
						<ButtonLink external href={profileLinks.resume} variant="on-hero">
							Open in new tab
						</ButtonLink>
					</Reveal>
				</div>
			</HeroField>

			{/* Phones skip the frame: iOS Safari embeds show only page 1 of a PDF.
			    85dvh fits one full page with the frame edges still in view. */}
			<div className="shell hidden pb-24 md:block md:pb-40">
				<iframe
					className="h-[85dvh] w-full rounded-3xl bg-surface"
					loading="lazy"
					src={profileLinks.resume}
					title="Resume - Nicholas Rios"
				/>
			</div>
		</main>
	);
}
