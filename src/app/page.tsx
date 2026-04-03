import { HeroSection } from "~/components/features/hero-section";
import BentoGrid from "~/components/features/bento-grid";
import { Globe, LANDING_GLOBE_CONFIG } from "~/components/ui/globe";
import { DrawingPinIcon, LightningBoltIcon, MagicWandIcon } from "@radix-ui/react-icons";
import { SectionHeader } from "~/components/layout/section-header";

export default function HomePage() {
	return (
		<main className="w-full">
			<HeroSection />

			<section
				className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 md:px-8"
				id="overview"
			>
				<SectionHeader 
				  description="Role, work samples, architecture notes, photography, and how to connect."
				  title="At a Glance"
				/>
				<BentoGrid
					items={[
						{
							icon: <LightningBoltIcon />,
							label: "Industry Experience",
						},
						{
							icon: <DrawingPinIcon />,
							label: "New York, New York",
							// content: (
								// <div className="relative mt-2 h-56 w-full overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-950">
									// {/* <Globe config={LANDING_GLOBE_CONFIG} /> */}
								// {/* </div> */}
							// ),
						},
						{ 
							icon: <MagicWandIcon />,
							label: "Skills"
						},
					]}
				/>
			</section>

			<section
				className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 md:px-8"
				id="photography-preview"
			>
				<SectionHeader 
					description="Outside of engineering, I'm passionate about photography and use it as a creative medium"
					title="Photography"
				/>
				{/* TODO:
				  - add a few randomized pictures from photography 
					- motion animated cards from scrolling in 
					- button to see selected works
				 **/}
				
			</section>

			<section
				className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 md:px-8"
				id="endorsements"
			>
				<SectionHeader 
					description="Something should probably go here"
					title="Endorsements"
				/>
				{/* TODO: 
				  - api call to linkedin for recommendations and endorsements on key skills
					- use magic ui marquee component
				 **/}
			</section>
		</main>
	);
}
