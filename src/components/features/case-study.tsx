import { MediaFigure } from "~/components/ui/media-figure";
import { Reveal } from "~/components/ui/reveal";
import { caseTitle, keyFigure } from "~/lib/case-study";
import { projectMedia } from "~/lib/media";
import type { CaseStudy as CaseStudyData } from "../../../generated/prisma";

export function CaseStudy({ study }: { study: CaseStudyData }) {
	const media = projectMedia[study.id];
	const figure = keyFigure(study);

	return (
		<article
			aria-labelledby={`${study.id}-title`}
			className="scroll-mt-12"
			id={study.id}
		>
			{media && (
				<Reveal className="mb-10 md:mb-14">
					<MediaFigure
						media={media}
						sizes="(min-width: 1440px) 1312px, 100vw"
					/>
				</Reveal>
			)}
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
				<Reveal className="lg:col-span-5">
					<h2 className="m-0 font-semibold text-title" id={`${study.id}-title`}>
						{caseTitle(study)}
					</h2>
					<p className="mt-5 text-body">
						<span className="block font-medium">{study.role}</span>
						<span className="block text-ink-muted">{study.org}</span>
						<span className="block text-ink-muted">{study.year}</span>
					</p>
				</Reveal>
				<Reveal className="lg:col-span-7" delay={0.08}>
					<p className="m-0 max-w-[34em] text-lead">{study.description}</p>
					{figure && (
						<p className="mt-10 mb-0">
							<span className="block font-semibold text-statement">
								{figure.v}
							</span>
							<span className="text-body text-ink-muted">{figure.k}</span>
						</p>
					)}
					<p className="mt-10 mb-0 max-w-[34em] text-body text-ink-muted">
						Built with {study.tags.join(", ")}.
					</p>
				</Reveal>
			</div>
		</article>
	);
}
