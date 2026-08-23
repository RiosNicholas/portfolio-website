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
			className="group relative flex items-center gap-5 border-border border-t py-7 text-foreground no-underline transition-[padding] duration-300 hover:pl-2.5"
			href={c.href}
		>
			<span className="w-15 shrink-0 font-mono text-(--ink-4) text-xs">
				{c.num}
			</span>
			<div className="flex flex-1 flex-col gap-1.5">
				<span className="font-medium font-mono text-(--accent-text) text-xs uppercase tracking-wider">
					{c.role}
				</span>
				<h3 className="m-0 font-display font-semibold text-2xl text-foreground leading-none tracking-tighter transition-colors duration-300 group-hover:text-(--accent-text) sm:text-3xl md:text-4xl">
					{c.title}
					<em className="text-(--accent-text) not-italic">{c.titleEm}</em>
					{c.titleSuffix}
				</h3>
			</div>
			<span className="shrink-0 font-mono text-(--ink-3) text-sm">
				{c.year}
			</span>
			<span className="shrink-0 font-mono text-(--ink-3) text-lg transition duration-300 ease-out group-hover:translate-x-2 group-hover:text-(--accent-text)">
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
					className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-(--r-md) bg-(--cta-bg) px-5.5 py-3.25 font-display font-semibold text-(--cta-ink) text-base tracking-tight no-underline shadow-(--shadow-pop) transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-(--cta-bg-hover)"
					href="/work"
				>
					<span>Selected works &middot; 04 projects</span>
					<span>↗</span>
				</Link>
			</div>
		</div>
	);
}
