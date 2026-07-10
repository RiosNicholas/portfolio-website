"use client";

import { Marquee } from "~/components/ui/marquee";
import { Reveal } from "~/components/ui/reveal";
import {
	type Endorsement,
	endorsements,
	getAvatarColor,
	getInitials,
} from "~/lib/endorsements";

function EndorsementCard({ e }: { e: Endorsement }) {
	return (
		<a
			className="flex w-[clamp(280px,28vw,392px)] shrink-0 flex-col gap-2.5 rounded-(--r-lg) border border-border bg-card px-5 py-4.5 shadow-(--shadow-card) transition-shadow duration-300 ease-[cubic-bezier(.2,.7,.2,1)] hover:shadow-(--shadow-pop)"
			href={e.linkedinUrl}
			rel="noopener noreferrer"
			target="_blank"
		>
			<p className="m-0 font-normal font-sans text-[15px] text-foreground leading-[1.5] tracking-[-0.01em]">
				&ldquo;{e.quote}&rdquo;
			</p>
			<div className="flex items-center gap-2.5 border-border border-t pt-2.5 font-sans text-xs tracking-[-0.01em]">
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
						className="grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[11px] text-white"
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
	const mid = Math.ceil(endorsements.length / 2);
	const rowA = endorsements.slice(0, mid);
	const rowB = endorsements.slice(mid);

	return (
		<Reveal className="mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] relative my-[clamp(48px,7vw,88px)] flex flex-col gap-3.5 overflow-hidden border-border border-y py-8.5">
			<Marquee
				className="p-0 [--duration:80s] [--gap:14px]"
				pauseOnHover
				repeat={2}
			>
				{rowA.map((e) => (
					<EndorsementCard e={e} key={e.name} />
				))}
			</Marquee>
			<Marquee
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
