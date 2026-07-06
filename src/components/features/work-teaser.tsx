"use client";

import Link from "next/link";

const cases = [
	{
		num: "001",
		role: "Platform · Lead UI",
		title: "Risk Tech",
		titleEm: "Agents",
		year: "2025 —",
		href: "/work#risk-agents",
	},
	{
		num: "002",
		role: "Freelance · Full-stack",
		title: "",
		titleEm: "Evangeliu",
		titleSuffix: " Coffee",
		year: "2025",
		href: "/work#evangeliu",
	},
	{
		num: "003",
		role: "Solo · Product & Engineering",
		title: "",
		titleEm: "Acountabuddy",
		year: "2024",
		href: "/work#acountabuddy",
	},
];

function CaseRow({ c }: { c: (typeof cases)[0] }) {
	return (
		<Link
			className="group relative grid cursor-none grid-cols-[60px_1fr_auto_24px] items-center gap-5 border-border border-t py-7 text-foreground no-underline transition-[padding] duration-300 hover:pl-2.5"
			href={c.href}
		>
			<span className="font-mono text-(--ink-4) text-xs">{c.num}</span>
			<div className="flex flex-col gap-1.5">
				<span className="font-medium font-mono text-(--accent-text) text-[11px] uppercase tracking-[0.04em]">
					{c.role}
				</span>
				<h3 className="m-0 font-display font-semibold text-[clamp(28px,3.4vw,46px)] text-foreground leading-none tracking-[-0.04em] transition-colors duration-300 group-hover:text-(--accent-text)">
					{c.title}
					<em className="text-(--accent-text) not-italic">{c.titleEm}</em>
					{c.titleSuffix}
				</h3>
			</div>
			<span className="font-mono text-(--ink-3) text-[13px]">{c.year}</span>
			<span className="justify-self-end font-mono text-(--ink-3) text-lg transition-[transform,color] duration-400 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:translate-x-2 group-hover:text-(--accent-text)">
				→
			</span>
		</Link>
	);
}

export function WorkTeaser() {
	return (
		<div className="flex flex-col">
			{cases.map((c) => (
				<CaseRow c={c} key={c.num} />
			))}
			<div className="border-border border-t" />
			<div className="flex justify-center py-10">
				<Link
					className="inline-flex cursor-none items-center gap-2.5 whitespace-nowrap rounded-(--r-md) bg-(--cta-bg) px-5.5 py-3.25 font-display font-semibold text-(--cta-ink) text-base tracking-[-0.015em] no-underline shadow-(--shadow-pop) transition-[transform,background] duration-300 ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-0.5 hover:bg-(--cta-bg-hover)"
					href="/work"
				>
					<span>Selected works &middot; 04 projects</span>
					<span>↗</span>
				</Link>
			</div>
		</div>
	);
}
