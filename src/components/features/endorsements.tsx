import { Reveal } from "~/components/ui/reveal";
import { TestimonialCard } from "~/components/ui/testimonial-card";
import type { Endorsement } from "../../../generated/prisma";

export function Endorsements({
	endorsements,
}: {
	endorsements: Endorsement[];
}) {
	if (endorsements.length === 0) return null;

	return (
		<section aria-labelledby="recommendations" className="shell pt-section">
			<Reveal
				as="h2"
				className="m-0 font-semibold text-3xl tracking-tight md:text-4xl lg:text-5xl"
				id="recommendations"
			>
				Recommendations
			</Reveal>
			{/* Below lg the cards become a swipeable row: one card in view
			    with the next peeking in, instead of three long quotes stacked.
			    The row bleeds to the screen edges and snaps to the shell's
			    gutter. From lg it is the three-column grid. */}
			<ul
				aria-label="Recommendations"
				className="m-0 -mx-(--gutter) mt-10 flex snap-x snap-mandatory scroll-px-(--gutter) list-none items-start gap-3 overflow-x-auto px-(--gutter) pb-2 [--gutter:clamp(20px,4vw,64px)] [scrollbar-width:none] md:mt-14 lg:mx-0 lg:grid lg:grid-cols-3 lg:items-stretch lg:overflow-visible lg:px-0 lg:pb-0"
			>
				{endorsements.slice(0, 3).map((e, index) => (
					<li
						className="w-[85%] shrink-0 snap-start sm:w-[60%] lg:w-auto"
						key={e.id}
					>
						<Reveal className="h-full" delay={index * 0.08}>
							<TestimonialCard
								avatarUrl={e.avatarUrl}
								name={e.name}
								profileUrl={e.linkedinUrl}
								quote={e.quote}
								role={e.role}
							/>
						</Reveal>
					</li>
				))}
			</ul>
		</section>
	);
}
