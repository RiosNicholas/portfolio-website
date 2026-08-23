"use client";

import { Marquee } from "~/components/ui/marquee";
import { Reveal } from "~/components/ui/reveal";
import {
	type Endorsement,
	endorsements,
	getAvatarColor,
	getInitials,
} from "~/lib/endorsements";
import { useAnimationsEnabled } from "~/lib/use-animations-enabled";
import { cn } from "~/lib/utils";

function EndorsementCard({ e }: { e: Endorsement }) {
	return (
		<a
			className="flex w-70 shrink-0 flex-col gap-2.5 rounded-(--r-lg) border border-border bg-card px-5 py-4.5 shadow-(--shadow-card) transition-shadow duration-300 ease-out hover:shadow-(--shadow-pop) md:w-80 lg:w-96"
			href={e.linkedinUrl}
			rel="noopener noreferrer"
			target="_blank"
		>
			<p className="m-0 font-normal font-sans text-foreground text-sm leading-normal tracking-normal">
				&ldquo;{e.quote}&rdquo;
			</p>
			<div className="flex items-center gap-2.5 border-border border-t pt-2.5 font-sans text-xs tracking-normal">
				{e.avatarUrl ? (
					// biome-ignore lint/performance/noImgElement: avatarUrl is an arbitrary external host (e.g. LinkedIn CDN), not configured in next.config image domains
					<img
						alt=""
						className="h-7 w-7 shrink-0 rounded-full object-cover"
						loading="lazy"
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

export function EndorsementMarquee() {
	const enabled = useAnimationsEnabled();
	const mid = Math.ceil(endorsements.length / 2);
	const rowA = endorsements.slice(0, mid);
	const rowB = endorsements.slice(mid);

	return (
		<Reveal
			className={cn(
				"relative my-12 flex flex-col gap-3.5 overflow-hidden border-border border-y py-8.5 md:my-16 lg:my-20",
				enabled &&
					"mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
			)}
		>
			<Marquee
				aria-label="Endorsements, part 1"
				className="p-0 [--duration:80s] [--gap:14px]"
				pauseOnHover
				repeat={2}
			>
				{rowA.map((e) => (
					<EndorsementCard e={e} key={e.name} />
				))}
			</Marquee>
			<Marquee
				aria-label="Endorsements, part 2"
				className="p-0 [--duration:70s] [--gap:14px]"
				pauseOnHover
				repeat={2}
				reverse
			>
				{rowB.map((e) => (
					<EndorsementCard e={e} key={e.name} />
				))}
			</Marquee>
		</Reveal>
	);
}
