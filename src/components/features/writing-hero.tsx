import {
	HeroField,
	pageHeroClass,
	RisingWords,
} from "~/components/layout/hero-field";
import { Reveal } from "~/components/ui/reveal";

export function WritingHero() {
	return (
		<HeroField className={pageHeroClass} labelledBy="writing-title">
			<h1 className="m-0 font-semibold text-display" id="writing-title">
				<RisingWords text="Writing" />
			</h1>
			<div className="mt-card grid grid-cols-1 gap-card md:grid-cols-12 md:items-end">
				<Reveal
					as="p"
					className="m-0 max-w-[30em] font-medium text-statement md:col-span-8"
					delay={0.3}
				>
					Articles I&apos;ve written, and places my work has been featured.
				</Reveal>
			</div>
		</HeroField>
	);
}
