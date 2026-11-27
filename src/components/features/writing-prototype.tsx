"use client";

// PROTOTYPE ONLY. Three layouts for the Writing feed, switched with ?variant=a|b|c.
// A: single column, embeds live. B: single column, embeds load on click. C: two-column grid.

import { ArrowUpRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { buttonVariants } from "~/components/ui/button-link";
import { cn } from "~/lib/utils";
import { type SampleEntry, sampleEntries } from "./writing-prototype-data";

// Height that shows one LinkedIn post without an inner scrollbar.
// Placeholder value. Measure at 390px and 1440px before relying on it.
const LINKEDIN_HEIGHT = 560;
// Grid cards clip LinkedIn posts to this height and fade the rest out.
const LINKEDIN_CAP = 320;

const VARIANTS = [
	{ key: "a", name: "Inline" },
	{ key: "b", name: "Click to load" },
	{ key: "c", name: "Grid" },
];

export function WritingPrototype({ variant }: { variant: string }) {
	const current = VARIANTS.some((v) => v.key === variant) ? variant : "a";
	const View =
		current === "b" ? VariantB : current === "c" ? VariantC : VariantA;
	return (
		<>
			<View entries={sampleEntries} />
			<Switcher current={current} />
		</>
	);
}

function VariantA({ entries }: { entries: SampleEntry[] }) {
	return (
		<ul className="m-0 flex list-none flex-col gap-4 p-0 md:gap-6">
			{entries.map((entry) => (
				<li className="rounded-3xl bg-surface p-6 md:p-8" key={entry.id}>
					<Meta entry={entry} />
					{entry.kind === "embed" ? (
						<>
							{entry.title && <Heading entry={entry} />}
							<div className="mt-6">
								<EmbedFrame entry={entry} />
							</div>
						</>
					) : (
						<TextBody entry={entry} />
					)}
					<Footer entry={entry} />
				</li>
			))}
		</ul>
	);
}

function VariantB({ entries }: { entries: SampleEntry[] }) {
	return (
		<ul className="m-0 flex list-none flex-col gap-4 p-0 md:gap-6">
			{entries.map((entry) => (
				<li className="rounded-3xl bg-surface p-6 md:p-8" key={entry.id}>
					<Meta entry={entry} />
					{entry.kind === "embed" ? (
						<>
							{entry.title && <Heading entry={entry} />}
							<div className="mt-6">
								<Facade entry={entry} />
							</div>
						</>
					) : (
						<TextBody entry={entry} />
					)}
					<Footer entry={entry} />
				</li>
			))}
		</ul>
	);
}

function VariantC({ entries }: { entries: SampleEntry[] }) {
	return (
		<ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 md:gap-6">
			{entries.map((entry) => (
				<li
					className="flex flex-col gap-4 rounded-3xl bg-surface p-6 md:p-8"
					key={entry.id}
				>
					<Meta entry={entry} />
					{entry.kind === "embed" ? (
						<>
							{entry.title && <Heading entry={entry} />}
							{entry.embed?.provider === "linkedin" ? (
								<div className="overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
									<div style={{ height: LINKEDIN_CAP }}>
										<EmbedFrame entry={entry} />
									</div>
								</div>
							) : (
								<EmbedFrame entry={entry} />
							)}
						</>
					) : entry.kind === "link" ? (
						<div className="flex gap-4">
							<Preview className="size-20 shrink-0" entry={entry} />
							<Heading entry={entry} />
						</div>
					) : (
						<>
							<Heading entry={entry} />
							{entry.summary && (
								<p className="m-0 line-clamp-3 text-ink-muted">
									{entry.summary}
								</p>
							)}
						</>
					)}
					<Footer entry={entry} />
				</li>
			))}
		</ul>
	);
}

/** Link Mentions and Articles. Same markup in A and B. */
function TextBody({ entry }: { entry: SampleEntry }) {
	if (entry.kind === "link") {
		return (
			<div className="mt-4 flex flex-col gap-6 md:flex-row">
				<Preview
					className="aspect-video w-full md:aspect-auto md:w-56 md:shrink-0"
					entry={entry}
				/>
				<div className="flex min-w-0 flex-col gap-3">
					<Heading entry={entry} />
					{entry.summary && (
						<p className="m-0 text-ink-muted">{entry.summary}</p>
					)}
				</div>
			</div>
		);
	}
	return (
		<>
			<Heading entry={entry} />
			{entry.summary && (
				<p className="m-0 mt-4 max-w-[36em] text-ink-muted">{entry.summary}</p>
			)}
		</>
	);
}

/** Source, date and topic tags sit outside every iframe. */
function Meta({ entry }: { entry: SampleEntry }) {
	return (
		<p className="m-0 flex flex-wrap gap-x-3 text-ink-muted text-sm">
			<span className="font-semibold text-ink">{entry.source}</span>
			<span aria-hidden>·</span>
			<span>{entry.date}</span>
		</p>
	);
}

function Heading({ entry }: { entry: SampleEntry }) {
	const external = entry.kind !== "article";
	return (
		<h2 className="m-0 mt-3 font-semibold text-xl tracking-tight md:text-2xl">
			<Link
				className="inline-flex items-start gap-2 text-ink no-underline hover:text-brand-strong"
				href={entry.href}
				rel={external ? "noopener noreferrer" : undefined}
				target={external ? "_blank" : undefined}
			>
				{entry.title}
				{external && (
					<ArrowUpRight aria-hidden className="mt-2 size-5 shrink-0" />
				)}
			</Link>
		</h2>
	);
}

/** Tags, plus a real link to the original on every embed. */
function Footer({ entry }: { entry: SampleEntry }) {
	return (
		<div className="mt-6 flex flex-wrap items-center gap-2">
			{entry.embed && (
				<Link
					className="mr-2 font-medium text-base text-brand-strong"
					href={entry.href}
					rel="noopener noreferrer"
					target="_blank"
				>
					{entry.embed.provider === "youtube"
						? "Watch on YouTube"
						: "Open on LinkedIn"}
				</Link>
			)}
			{entry.tags.map((name) => (
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

function EmbedFrame({ entry }: { entry: SampleEntry }) {
	const youtube = entry.embed?.provider === "youtube";
	return (
		<iframe
			className={cn("w-full rounded-2xl", youtube && "aspect-video")}
			height={youtube ? undefined : LINKEDIN_HEIGHT}
			loading="lazy"
			src={entry.embed?.src}
			title={entry.title ?? entry.source}
		/>
	);
}

/** Click to load: a poster stands in until the visitor asks for the iframe. */
function Facade({ entry }: { entry: SampleEntry }) {
	const [loaded, setLoaded] = useState(false);
	const youtube = entry.embed?.provider === "youtube";
	if (loaded) {
		return (
			<iframe
				className={cn("w-full rounded-2xl", youtube && "aspect-video")}
				height={youtube ? undefined : LINKEDIN_HEIGHT}
				src={youtube ? `${entry.embed?.src}?autoplay=1` : entry.embed?.src}
				title={entry.title ?? entry.source}
			/>
		);
	}
	return (
		<div className="relative overflow-hidden rounded-2xl bg-surface-raised">
			{youtube ? (
				<Image
					alt=""
					className="aspect-video h-auto w-full object-cover"
					height={360}
					src={`https://i.ytimg.com/vi/${entry.embed?.id}/hqdefault.jpg`}
					width={480}
				/>
			) : (
				<p className="m-0 flex h-40 items-center justify-center text-ink-muted">
					LinkedIn post
				</p>
			)}
			<div className="absolute inset-0 flex items-center justify-center">
				<button
					className={cn(buttonVariants({ variant: "primary" }), "gap-2")}
					onClick={() => setLoaded(true)}
					type="button"
				>
					<Play aria-hidden className="size-4" />
					{youtube ? "Play video" : "Load post"}
				</button>
			</div>
		</div>
	);
}

function Preview({
	className,
	entry,
}: {
	className?: string;
	entry: SampleEntry;
}) {
	if (!entry.image) return null;
	return (
		<div className={cn("relative overflow-hidden rounded-2xl", className)}>
			<Image
				alt=""
				className="object-cover"
				fill
				sizes="(min-width: 768px) 14rem, 100vw"
				src={entry.image}
			/>
		</div>
	);
}

function Switcher({ current }: { current: string }) {
	const router = useRouter();
	const index = VARIANTS.findIndex((v) => v.key === current);
	const step = (delta: number) => {
		const key =
			VARIANTS[(index + delta + VARIANTS.length) % VARIANTS.length]?.key;
		router.replace(`?variant=${key}`, { scroll: false });
	};

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			const target = event.target;
			if (
				target instanceof HTMLElement &&
				target.matches("input, textarea, [contenteditable]")
			)
				return;
			if (event.key === "ArrowLeft") step(-1);
			if (event.key === "ArrowRight") step(1);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});

	return (
		<div className="fixed inset-x-0 bottom-6 z-50 flex justify-center">
			<div className="flex items-center gap-1 rounded-full bg-ink p-1 font-semibold text-ground text-sm">
				<button
					aria-label="Previous variant"
					className="grid size-10 place-items-center rounded-full hover:bg-ground/10"
					onClick={() => step(-1)}
					type="button"
				>
					<ChevronLeft aria-hidden className="size-5" />
				</button>
				<span className="px-3">
					{VARIANTS[index]?.key.toUpperCase()} · {VARIANTS[index]?.name}
				</span>
				<button
					aria-label="Next variant"
					className="grid size-10 place-items-center rounded-full hover:bg-ground/10"
					onClick={() => step(1)}
					type="button"
				>
					<ChevronRight aria-hidden className="size-5" />
				</button>
			</div>
		</div>
	);
}
