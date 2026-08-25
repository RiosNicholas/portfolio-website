import Link from "next/link";
import {
	getCaseStudies,
	getFeaturedCaseStudies,
} from "~/server/data/case-studies";
import type { CaseStudy } from "../../../generated/prisma";

function CaseRow({ study }: { study: CaseStudy }) {
	return (
		<Link
			className="group relative flex items-center gap-5 border-border border-t py-7 text-foreground no-underline transition-[padding] duration-300 hover:pl-2.5"
			href={`/work#${study.id}`}
		>
			<span className="w-15 shrink-0 font-mono text-(--ink-4) text-xs">
				{study.num}
			</span>
			<div className="flex flex-1 flex-col gap-1.5">
				<span className="font-medium font-mono text-(--accent-text) text-xs uppercase tracking-wider">
					{study.role}
				</span>
				<h3 className="m-0 font-display font-semibold text-2xl text-foreground leading-none tracking-tighter transition-colors duration-300 group-hover:text-(--accent-text) sm:text-3xl md:text-4xl">
					{study.title}
					<em className="text-(--accent-text) not-italic">{study.titleEm}</em>
					{study.titleSuffix}
				</h3>
			</div>
			<span className="shrink-0 font-mono text-(--ink-3) text-sm">
				{study.year}
			</span>
			<span className="shrink-0 font-mono text-(--ink-3) text-lg transition duration-300 ease-out group-hover:translate-x-2 group-hover:text-(--accent-text)">
				→
			</span>
		</Link>
	);
}

export async function WorkTeaser() {
	const [cases, featuredCases] = await Promise.all([
		getCaseStudies(),
		getFeaturedCaseStudies(),
	]);
	const count = String(cases.length).padStart(2, "0");

	return (
		<div className="flex flex-col">
			{featuredCases.map((study) => (
				<CaseRow key={study.id} study={study} />
			))}
			<div className="border-border border-t" />
			<div className="flex justify-center py-10">
				<Link
					className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-(--r-md) bg-(--cta-bg) px-5.5 py-3.25 font-display font-semibold text-(--cta-ink) text-base tracking-tight no-underline shadow-(--shadow-pop) transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-(--cta-bg-hover)"
					href="/work"
				>
					<span>Selected works &middot; {count} projects</span>
					<span>↗</span>
				</Link>
			</div>
		</div>
	);
}
