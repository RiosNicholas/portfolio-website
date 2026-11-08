import {
	HeroField,
	pageHeroClass,
	RisingWords,
} from "~/components/layout/hero-field";
import { ButtonLink } from "~/components/ui/button-link";
import { Reveal } from "~/components/ui/reveal";
import { profileLinks } from "~/lib/site-links";

/** Same pattern as the About hero: title, one statement, one link out. */
export function ProjectsHero() {
	return (
		<HeroField className={pageHeroClass} labelledBy="projects-title">
			<h1 className="m-0 font-semibold text-display" id="projects-title">
				<RisingWords text="Selected works" />
			</h1>
			<div className="mt-6 grid grid-cols-1 gap-8 md:mt-14 md:grid-cols-12 md:items-end md:gap-10">
				<Reveal
					as="p"
					className="m-0 max-w-[30em] font-medium text-statement md:col-span-8"
					delay={0.3}
				>
					Apps, sites and experiments I&apos;ve designed and built outside my
					day job.
				</Reveal>
				<Reveal className="md:col-span-4 md:flex md:justify-end" delay={0.4}>
					<ButtonLink external href={profileLinks.github} variant="pop">
						View GitHub
					</ButtonLink>
				</Reveal>
			</div>
		</HeroField>
	);
}
