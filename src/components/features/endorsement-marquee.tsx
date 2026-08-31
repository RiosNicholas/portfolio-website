"use client";

import { useState } from "react";
import { Marquee } from "~/components/ui/marquee";
import { Reveal } from "~/components/ui/reveal";
import { getAvatarColor, getInitials } from "~/lib/avatar";
import { useAnimationsEnabled } from "~/lib/use-animations-enabled";
import { cn } from "~/lib/utils";
import type { Endorsement } from "../../../generated/prisma";

function EndorsementCard({ e }: { e: Endorsement }) {
	const [imageFailed, setImageFailed] = useState(false);

	return (
		<a
			className="flex min-h-112 w-70 shrink-0 flex-col justify-between gap-2.5 rounded-(--r-lg) border border-border bg-card px-5 py-4.5 shadow-(--shadow-card) transition-shadow duration-300 ease-out hover:shadow-(--shadow-pop) md:min-h-100 md:w-80 lg:min-h-84 lg:w-96"
			draggable={false}
			href={e.linkedinUrl}
			rel="noopener noreferrer"
			target="_blank"
		>
			<p className="m-0 font-normal font-sans text-foreground text-sm leading-normal tracking-normal">
				&ldquo;{e.quote}&rdquo;
			</p>
			<div className="flex items-center gap-2.5 border-border border-t pt-2.5 font-sans text-xs tracking-normal">
				{e.avatarUrl && !imageFailed ? (
					// biome-ignore lint/performance/noImgElement: avatarUrl is a Vercel Blob URL, not configured in next.config image domains
					<img
						alt=""
						className="h-7 w-7 shrink-0 rounded-full object-cover"
						draggable={false}
						loading="lazy"
						onError={() => setImageFailed(true)}
						src={e.avatarUrl}
					/>
				) : (
					<span
						className="grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-white text-xs"
						style={{ backgroundColor: getAvatarColor(e.name) }}
					>
						{getInitials(e.name)}
					</span>
				)}
				<span className="font-semibold text-foreground">{e.name}</span>
				<span className="ml-auto text-(--ink-3)">{e.role}</span>
			</div>
		</a>
	);
}

export function EndorsementMarquee({
	endorsements,
}: {
	endorsements: Endorsement[];
}) {
	const enabled = useAnimationsEnabled();

	// Below 4 endorsements, a 2/2 row split leaves one row with a single
	// card looping alone against a mostly-empty track. Render one row
	// instead; the two-row split comes back automatically once there are
	// enough cards for both rows to feel populated.
	const singleRow = endorsements.length < 4;
	const mid = Math.ceil(endorsements.length / 2);
	const rowA = singleRow ? endorsements : endorsements.slice(0, mid);
	const rowB = singleRow ? [] : endorsements.slice(mid);

	return (
		<Reveal
			className={cn(
				"relative my-12 flex flex-col gap-3.5 overflow-hidden border-border border-y py-8.5 md:my-16 lg:my-20",
				enabled &&
					"mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
			)}
		>
			<Marquee
				aria-label={singleRow ? "Endorsements" : "Endorsements, part 1"}
				ariaHideDuplicates
				className={cn(
					"p-0",
					singleRow
						? "[--duration:35s] [--gap:14px]"
						: "[--duration:45s] [--gap:14px] md:[--duration:65s] lg:[--duration:80s]",
				)}
				draggable
				pauseOnHover
				repeat={singleRow ? 4 : 3}
			>
				{rowA.map((e) => (
					<EndorsementCard e={e} key={e.id} />
				))}
			</Marquee>
			{!singleRow && (
				<Marquee
					aria-label="Endorsements, part 2"
					ariaHideDuplicates
					className="p-0 [--duration:40s] [--gap:14px] md:[--duration:58s] lg:[--duration:70s]"
					draggable
					pauseOnHover
					repeat={3}
					reverse
				>
					{rowB.map((e) => (
						<EndorsementCard e={e} key={e.id} />
					))}
				</Marquee>
			)}
		</Reveal>
	);
}
