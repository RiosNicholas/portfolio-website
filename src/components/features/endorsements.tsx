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
		<section aria-labelledby="endorsements" className="shell pt-32 md:pt-48">
			<Reveal
				as="h2"
				className="m-0 max-w-[16ch] font-semibold text-title"
				id="endorsements"
			>
				What people I&apos;ve worked with say
			</Reveal>
			<ul className="m-0 mt-10 grid list-none grid-cols-1 gap-3 p-0 md:mt-14 lg:grid-cols-3">
				{endorsements.slice(0, 3).map((e, index) => (
					<li key={e.id}>
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
