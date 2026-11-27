import {
	HeroField,
	pageHeroClass,
	RisingWords,
} from "~/components/layout/hero-field";
import { Reveal } from "~/components/ui/reveal";
import { getProfile } from "~/server/data/profile";

export async function WritingHero() {
	const profile = await getProfile();
	return (
		<HeroField className={pageHeroClass} labelledBy="writing-title">
			<h1
				className="m-0 font-semibold text-2xl tracking-tight md:text-4xl lg:text-5xl"
				id="writing-title"
			>
				<RisingWords text="Writing" />
			</h1>
			<div className="mt-card grid grid-cols-1 gap-card md:grid-cols-12 md:items-end">
				<Reveal
					as="p"
					className="m-0 max-w-[36rem] text-base text-hero-muted md:col-span-8 md:text-lg"
					delay={0.3}
				>
					{profile.writingLede}
				</Reveal>
			</div>
		</HeroField>
	);
}
