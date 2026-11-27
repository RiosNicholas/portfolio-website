import { MediaFigure } from "~/components/ui/media-figure";
import { Reveal } from "~/components/ui/reveal";
import { caseTitle, keyFigure } from "~/lib/case-study";
import { formatDateRange } from "~/lib/dates";
import { projectMedia } from "~/lib/media";
import type { CaseStudy as CaseStudyData } from "../../../generated/prisma";

export function CaseStudy({ study }: { study: CaseStudyData }) {
	const media = projectMedia[study.id];
	const figure = keyFigure(study);
	const dates = formatDateRange(study);

	return (
		<article
			aria-labelledby={`${study.id}-title`}
			className="scroll-mt-12"
			id={study.id}
		>
			<Reveal className="rounded-3xl bg-surface p-card">
				{media && (
					<MediaFigure
						className="mb-card"
						media={media}
						sizes="(min-width: 1024px) 75vw, 100vw"
					/>
				)}
				<div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-8">
					<h2
						className="m-0 font-semibold text-xl md:text-2xl"
						id={`${study.id}-title`}
					>
						{caseTitle(study)}
					</h2>
					{dates && (
						<p className="m-0 shrink-0 text-ink-muted text-sm">{dates}</p>
					)}
				</div>
				<p className="mt-4 mb-0 text-ink-muted text-sm">
					{study.role} · {study.org}
				</p>
				<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
					<p className="m-0 max-w-prose text-base">{study.description}</p>
					{figure && (
						<p className="m-0 md:text-right">
							<span className="block font-semibold text-xl tracking-tight md:text-2xl">
								{figure.v}
							</span>
							<span className="text-ink-muted text-sm">{figure.k}</span>
						</p>
					)}
				</div>
				<ul
					aria-label="Built with"
					className="mt-4 mb-0 flex list-none flex-wrap gap-2 p-0"
				>
					{study.tags.map((tag) => (
						<li
							className="rounded-full bg-surface-raised px-3 py-1 font-medium text-ink text-sm"
							key={tag}
						>
							{tag}
						</li>
					))}
				</ul>
			</Reveal>
		</article>
	);
}
