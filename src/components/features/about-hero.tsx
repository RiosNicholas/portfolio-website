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
			<h1
				className="m-0 font-semibold text-3xl tracking-tight md:text-5xl lg:text-6xl"
				id="about-title"
			>
				<RisingWords text="About me" />
			</h1>
			<div className="mt-card grid grid-cols-1 gap-card md:grid-cols-12 md:items-end">
				<Reveal
					as="p"
					className="m-0 max-w-[36rem] text-hero-muted text-lg md:col-span-8 md:text-xl"
					delay={0.3}
				>
					I&apos;m Nicholas - a Software Engineer based in the NYC area, focused
					on web development and agentic AI.
				</Reveal>
				<Reveal className="md:col-span-4 md:flex md:justify-end" delay={0.4}>
					<ButtonLink href="/resume" variant="pop">
						View full resume
					</ButtonLink>
				</Reveal>
			</div>
		</HeroField>
	);
}
