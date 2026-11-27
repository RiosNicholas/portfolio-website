"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { cn } from "~/lib/utils";
import type { WritingItem } from "~/server/data/writing";

export function WritingFeed({ items }: { items: WritingItem[] }) {
	const [tag, setTag] = useState<string | null>(null);

	if (items.length === 0) {
		return (
			<p className="m-0 text-ink-muted text-lg md:text-xl">
				First pieces are on the way.
			</p>
		);
	}

	const tags = [...new Set(items.flatMap((item) => item.tags))].sort();
	const visible = tag ? items.filter((item) => item.tags.includes(tag)) : items;

	return (
		<>
			{tags.length > 0 && (
				<div className="flex flex-wrap gap-2">
					<FilterChip active={tag === null} onClick={() => setTag(null)}>
						All
					</FilterChip>
					{tags.map((name) => (
						<FilterChip
							active={tag === name}
							key={name}
							onClick={() => setTag(name)}
						>
							{name}
						</FilterChip>
					))}
				</div>
			)}

			<ul className="m-0 mt-12 flex list-none flex-col gap-4 p-0 md:mt-14">
				{visible.map((item) => {
					const external = item.kind === "mention";
					return (
						<li
							className="rounded-3xl bg-surface p-6 md:p-8"
							key={`${item.kind}-${item.id}`}
						>
							<p className="m-0 flex flex-wrap gap-x-3 text-ink-muted text-sm">
								<span className="font-semibold text-ink">
									{external ? "Mention" : "Article"}
								</span>
								{external && (
									<>
										<span aria-hidden>·</span>
										<span>{item.outlet}</span>
									</>
								)}
								<span aria-hidden>·</span>
								<time dateTime={item.publishedAt}>
									{new Date(item.publishedAt).toLocaleDateString("en-US", {
										year: "numeric",
										month: "short",
										day: "numeric",
										timeZone: "UTC",
									})}
								</time>
							</p>
							<h2 className="m-0 mt-3 font-semibold text-2xl tracking-tight md:text-3xl">
								<Link
									className="inline-flex items-start gap-2 text-ink no-underline hover:text-brand-strong"
									href={item.href}
									rel={external ? "noopener noreferrer" : undefined}
									target={external ? "_blank" : undefined}
								>
									{item.title}
									{external && (
										<>
											<ArrowUpRight
												aria-hidden
												className="mt-2 size-5 shrink-0"
											/>
											<span className="sr-only">(opens in a new tab)</span>
										</>
									)}
								</Link>
							</h2>
							{item.summary && (
								<p className="m-0 mt-4 max-w-[36em] text-ink-muted">
									{item.summary}
								</p>
							)}
							{item.tags.length > 0 && (
								<ul className="m-0 mt-6 flex list-none flex-wrap gap-2 p-0">
									{item.tags.map((name) => (
										<li
											className="rounded-full bg-surface-raised px-3 py-1 text-ink text-sm"
											key={name}
										>
											{name}
										</li>
									))}
								</ul>
							)}
						</li>
					);
				})}
			</ul>
		</>
	);
}

function FilterChip({
	active,
	children,
	onClick,
}: {
	active: boolean;
	children: React.ReactNode;
	onClick: () => void;
}) {
	return (
		<button
			aria-pressed={active}
			className={cn(
				"rounded-full px-4 py-2 font-medium text-base transition-colors duration-200",
				active
					? "bg-brand text-on-brand"
					: "bg-surface text-ink hover:bg-surface-hover",
			)}
			onClick={onClick}
			type="button"
		>
			{children}
		</button>
	);
}
