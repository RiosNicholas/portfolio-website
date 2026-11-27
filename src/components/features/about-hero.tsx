import {
	HeroField,
	pageHeroClass,
	RisingWords,
} from "~/components/layout/hero-field";
import { ButtonLink } from "~/components/ui/button-link";
import { Reveal } from "~/components/ui/reveal";

export function AboutHero() {
	return (
		<HeroField className={pageHeroClass} labelledBy="about-title">
			<div className="flex flex-wrap items-end justify-between gap-card">
				<h1
					className="m-0 font-semibold text-3xl tracking-tight md:text-5xl lg:text-6xl"
					id="about-title"
				>
					<RisingWords text="About me" />
				</h1>
				<Reveal delay={0.3}>
					<ButtonLink href="/resume" variant="pop">
						View full resume
					</ButtonLink>
				</Reveal>
			</div>
		</HeroField>
	);
}
