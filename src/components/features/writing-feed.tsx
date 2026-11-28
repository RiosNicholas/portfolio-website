"use client";

import { ArrowUpRight, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { buttonVariants } from "~/components/ui/button-link";
import { cn } from "~/lib/utils";
import type { WritingItem } from "~/server/data/writing";

export function WritingFeed({ items }: { items: WritingItem[] }) {
	// Lowercased key of the active topic tag. Tags match case-insensitively.
	const [tag, setTag] = useState<string | null>(null);

	if (items.length === 0) {
		return (
			<p className="m-0 text-base text-ink-muted md:text-lg">
				First pieces are on the way.
			</p>
		);
	}

	const tags = [
		...new Map(
			items.flatMap((item) => item.topicTags).map((t) => [t.toLowerCase(), t]),
		),
	].sort(([a], [b]) => a.localeCompare(b));
	const visible = tag
		? items.filter((item) =>
				item.topicTags.some((t) => t.toLowerCase() === tag),
			)
		: items;

	return (
		<>
			{tags.length > 0 && (
				<div className="flex flex-wrap gap-2">
					<FilterChip active={tag === null} onClick={() => setTag(null)}>
						All
					</FilterChip>
					{tags.map(([key, name]) => (
						<FilterChip
							active={tag === key}
							key={key}
							onClick={() => setTag(key)}
						>
							{name}
						</FilterChip>
					))}
				</div>
			)}

			<ul className="m-0 mt-12 grid list-none grid-cols-1 gap-4 p-0 md:mt-14 md:grid-cols-2 md:gap-6">
				{visible.map((item) => (
					<li
						className="flex flex-col gap-4 rounded-3xl bg-surface p-6 md:p-8"
						key={`${item.kind}-${item.id}`}
					>
						<p className="m-0 flex flex-wrap gap-x-3 text-ink-muted text-sm">
							<span className="font-semibold text-ink">
								{item.source?.name ?? "Article"}
							</span>
							<span aria-hidden>·</span>
							<time dateTime={item.dateTime}>{item.dateLabel}</time>
						</p>
						<CardBody item={item} />
						<Footer item={item} />
					</li>
				))}
			</ul>
		</>
	);
}

function CardBody({ item }: { item: WritingItem }) {
	if (item.embedUrl && item.source) {
		const frameTitle = item.title ?? `${item.source.name} post`;
		return (
			<>
				{item.title && (
					<h2 className="m-0 font-semibold text-xl tracking-tight [overflow-wrap:anywhere] md:text-2xl">
						{item.title}
					</h2>
				)}
				{item.source.name === "YouTube" ? (
					<YouTubeFacade embedUrl={item.embedUrl} title={frameTitle} />
				) : (
					<LinkedInFrame embedUrl={item.embedUrl} title={frameTitle} />
				)}
			</>
		);
	}
	if (item.kind === "mention") {
		return (
			<div className="flex gap-4">
				<Preview item={item} />
				<TitleLink item={item} />
			</div>
		);
	}
	return (
		<>
			<TitleLink item={item} />
			{item.summary && (
				<p className="m-0 line-clamp-3 text-ink-muted">{item.summary}</p>
			)}
		</>
	);
}

function TitleLink({ item }: { item: WritingItem }) {
	const external = item.kind === "mention";
	return (
		<h2 className="m-0 min-w-0 font-semibold text-xl tracking-tight [overflow-wrap:anywhere] md:text-2xl">
			<Link
				className="inline-flex items-start gap-2 text-ink no-underline hover:text-brand-strong"
				href={item.href}
				rel={external ? "noopener noreferrer" : undefined}
				target={external ? "_blank" : undefined}
			>
				{item.title ?? item.source?.name}
				{external && (
					<>
						<ArrowUpRight aria-hidden className="mt-2 size-5 shrink-0" />
						<span className="sr-only">(opens in a new tab)</span>
					</>
				)}
			</Link>
		</h2>
	);
}

function Preview({ item }: { item: WritingItem }) {
	if (!item.imageUrl) {
		// The header already names the Source, so this card only stands in for the image.
		return (
			<div
				aria-hidden
				className="grid size-20 shrink-0 place-items-center rounded-2xl bg-surface-raised p-2 text-center font-semibold text-ink text-sm [overflow-wrap:anywhere]"
			>
				{item.source?.name}
			</div>
		);
	}
	return (
		<div className="relative size-20 shrink-0 overflow-hidden rounded-2xl">
			<Image
				alt=""
				className="object-cover"
				fill
				sizes="5rem"
				src={item.imageUrl}
				unoptimized
			/>
		</div>
	);
}

// LinkedIn never reports its post height, so the frame is taller than the clip
// and the fade hides the cut. Same mask as the skills marquee.
function LinkedInFrame({
	embedUrl,
	title,
}: {
	embedUrl: string;
	title: string;
}) {
	return (
		<div className="mask-[linear-gradient(to_bottom,black_55%,transparent)] h-80 overflow-hidden">
			<iframe
				className="h-140 w-full rounded-2xl"
				loading="lazy"
				src={embedUrl}
				title={title}
			/>
		</div>
	);
}

// No request to YouTube until the visitor clicks Play.
function YouTubeFacade({
	embedUrl,
	title,
}: {
	embedUrl: string;
	title: string;
}) {
	const [loaded, setLoaded] = useState(false);
	if (loaded) {
		return (
			<iframe
				allow="autoplay; encrypted-media; picture-in-picture"
				allowFullScreen
				className="aspect-video w-full rounded-2xl"
				ref={(frame) => frame?.focus()}
				src={`${embedUrl}?autoplay=1`}
				title={title}
			/>
		);
	}
	const id = embedUrl.slice(embedUrl.lastIndexOf("/") + 1);
	return (
		<div className="relative overflow-hidden rounded-2xl bg-surface-raised">
			{/* hqdefault.jpg is 480x360 */}
			<Image
				alt=""
				className="aspect-video h-auto w-full object-cover"
				height={360}
				src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
				width={480}
			/>
			<div className="absolute inset-0 flex items-center justify-center">
				<button
					className={buttonVariants()}
					onClick={() => setLoaded(true)}
					type="button"
				>
					<Play aria-hidden className="size-4" />
					Play video
					<span className="sr-only">: {title}</span>
				</button>
			</div>
		</div>
	);
}

function Footer({ item }: { item: WritingItem }) {
	if (!item.embedUrl && item.topicTags.length === 0) return null;
	return (
		<div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
			{item.embedUrl && (
				<Link
					className="font-medium text-base text-brand-strong"
					href={item.href}
					rel="noopener noreferrer"
					target="_blank"
				>
					{item.source?.name === "YouTube" ? "Watch" : "Open"} on{" "}
					{item.source?.name}
					<span className="sr-only"> (opens in a new tab)</span>
				</Link>
			)}
			{item.topicTags.map((name) => (
				<span
					className="rounded-full bg-surface-raised px-3 py-1 text-ink text-sm"
					key={name}
				>
					{name}
				</span>
			))}
		</div>
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
