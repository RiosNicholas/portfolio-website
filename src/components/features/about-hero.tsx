import {
	HeroField,
	pageHeroClass,
	RisingWords,
} from "~/components/layout/hero-field";
import { ButtonLink } from "~/components/ui/button-link";
import { Reveal } from "~/components/ui/reveal";
import { profileLinks } from "~/lib/site-links";

export function AboutHero() {
	return (
		<HeroField className={pageHeroClass} labelledBy="about-title">
			<h1 className="m-0 font-semibold text-display" id="about-title">
				<RisingWords text="About me" />
			</h1>
			<div className="mt-6 grid grid-cols-1 gap-8 md:mt-14 md:grid-cols-12 md:items-end md:gap-10">
				<Reveal
					as="p"
					className="m-0 max-w-[30em] font-medium text-statement md:col-span-8"
					delay={0.3}
				>
					I&apos;m Nicholas - a Platform Software Engineer based in the NYC
					area, focused on web development and agentic AI.
				</Reveal>
				<Reveal className="md:col-span-4 md:flex md:justify-end" delay={0.4}>
					<ButtonLink external href={profileLinks.resume} variant="pop">
						View full resume
					</ButtonLink>
				</Reveal>
			</div>
		</HeroField>
	);
}
