"use client";

import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import { useState } from "react";

import { getInitials } from "~/lib/avatar";
import { cn } from "~/lib/utils";

export type TestimonialCardProps = {
	quote: string;
	name: string;
	role: string;
	/** The person's LinkedIn profile; the name links to it. */
	profileUrl: string;
	/** Hosted photo (e.g. Vercel Blob). Falls back to initials on error. */
	avatarUrl?: string | null;
	className?: string;
};

function Avatar({ name, src }: { name: string; src?: string | null }) {
	const [failed, setFailed] = useState(false);

	if (src && !failed) {
		return (
			// biome-ignore lint/performance/noImgElement: avatars are remote Blob URLs not listed in next.config image domains
			<img
				alt=""
				className="size-12 shrink-0 rounded-full bg-surface-hover object-cover"
				decoding="async"
				height={48}
				loading="lazy"
				onError={() => setFailed(true)}
				src={src}
				width={48}
			/>
		);
	}
	return (
		<span
			aria-hidden
			className="grid size-12 shrink-0 place-items-center rounded-full bg-brand-soft font-semibold text-body text-brand-strong"
		>
			{getInitials(name)}
		</span>
	);
}

/** A quotation held in a card: the words first, then who said it. */
export function TestimonialCard({
	quote,
	name,
	role,
	profileUrl,
	avatarUrl,
	className,
}: TestimonialCardProps) {
	return (
		<figure
			className={cn(
				"m-0 flex h-full flex-col justify-between gap-8 rounded-3xl bg-surface p-7 transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:hover:translate-y-0 md:p-8",
				className,
			)}
		>
			<blockquote className="m-0">
				<p className="m-0 text-body">&ldquo;{quote}&rdquo;</p>
			</blockquote>
			<figcaption className="flex items-center gap-4">
				<Avatar name={name} src={avatarUrl} />
				<span className="min-w-0 text-body">
					<a
						className="inline-flex items-center gap-1.5 font-semibold text-ink no-underline transition-colors hover:text-brand-strong"
						href={profileUrl}
						rel="noopener noreferrer"
						target="_blank"
					>
						{name}
						<LinkedInLogoIcon aria-hidden className="size-4 text-ink-muted" />
						<span className="sr-only">on LinkedIn</span>
					</a>
					<span className="block text-ink-muted">{role}</span>
				</span>
			</figcaption>
		</figure>
	);
}
