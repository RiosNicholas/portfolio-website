import { Reveal } from "~/components/ui/reveal";
import { getCvEntries } from "~/server/data/cv-entries";
import type { CvEntry } from "../../../generated/prisma";

function CvList({ entries }: { entries: CvEntry[] }) {
	return (
		<ul className="m-0 mt-6 flex list-none flex-col gap-6 p-0">
			{entries.map(({ id, years, title, where }) => (
				<li key={id}>
					<span className="block font-semibold text-lead">{title}</span>
					<span className="block text-body text-ink-muted">
						{where} · <span className="tabular-nums">{years}</span>
					</span>
				</li>
			))}
		</ul>
	);
}

const sectionHeading = "m-0 font-semibold text-statement";

export async function AboutBio() {
	const entries = await getCvEntries();
	const experience = entries.filter((e) => e.category === "EXPERIENCE");
	const education = entries.filter((e) => e.category === "EDUCATION");
	const activities = entries.filter((e) => e.category === "ACTIVITY");
	const awards = entries.filter((e) => e.category === "AWARD");

	return (
		<section aria-labelledby="summary" className="shell pt-24 md:pt-40">
			<div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-24">
				<Reveal className="lg:col-span-5">
					<h2 className={sectionHeading} id="summary">
						Summary
					</h2>
					<div className="mt-6 flex max-w-[34em] flex-col gap-5 text-lead">
						<p className="m-0">
							I specialize in frontend development and platform engineering -
							design systems, developer tooling, and scalable frontend
							architecture. I enjoy building systems that improve developer
							experience and enable teams to move faster.
						</p>
						<p className="m-0">
							I'm currently in risk technology at JPMorganChase, where I build
							platform infrastructure on two fronts: the shared UI foundation
							(component libraries, design systems, architecture, and tooling)
							that product teams build on, and the agentic AI platform that's
							making AI a core part of how we ship.
						</p>
						<p className="m-0">
							Outside of engineering, I enjoy street photography and
							occasionally publish my work.
						</p>
					</div>
				</Reveal>

				<Reveal className="lg:col-span-7" delay={0.08}>
					<h2 className={sectionHeading}>Relevant work experience</h2>
					<CvList entries={experience} />
				</Reveal>

				<Reveal className="lg:col-span-5">
					<h2 className={sectionHeading}>Education</h2>
					<CvList entries={education} />
				</Reveal>

				{(activities.length > 0 || awards.length > 0) && (
					<Reveal className="flex flex-col gap-14 lg:col-span-7" delay={0.08}>
						{activities.length > 0 && (
							<div>
								<h2 className={sectionHeading}>Activities</h2>
								<CvList entries={activities} />
							</div>
						)}
						{awards.length > 0 && (
							<div>
								<h2 className={sectionHeading}>Awards & certifications</h2>
								<CvList entries={awards} />
							</div>
						)}
					</Reveal>
				)}
			</div>
		</section>
	);
}
