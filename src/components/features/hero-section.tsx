import { RotatingPhrase } from "~/components/features/rotating-phrase";
import { HeroField, RisingWords } from "~/components/layout/hero-field";
import { ButtonLink } from "~/components/ui/button-link";
import { MediaFigure } from "~/components/ui/media-figure";
import { Reveal } from "~/components/ui/reveal";
import { heroPhoto } from "~/lib/media";
import { cn } from "~/lib/utils";

// Read across one loop, the phrases and the employer line under them make
// one sentence: "Software Engineer building web applications, component
// libraries, developer tools, and agentic AI tooling @JPMorganChase."
const building = [
	"web applications,",
	"component libraries,",
	"developer tools,",
	"and agentic AI tooling",
];

export function HeroSection() {
	return (
		<HeroField
			className={cn(
				"grid grid-cols-1 content-end gap-12 pt-14 pb-12 md:min-h-[72svh] md:pt-32 md:pb-20",
				heroPhoto && "lg:grid-cols-12 lg:items-end lg:gap-10",
			)}
			labelledBy="hero-title"
		>
			<div className={cn(heroPhoto && "lg:col-span-7")}>
				<h1
					className="m-0 font-semibold text-display lg:text-[clamp(6.5rem,8vw,9rem)]"
					id="hero-title"
				>
					<span className="sr-only">
						Software Engineer building web applications, component libraries,
						developer tools, and agentic AI tooling at JPMorganChase.
					</span>
					<span aria-hidden className="block">
						<RisingWords text="Software Engineer" />
					</span>
					<span aria-hidden className="block">
						<RisingWords offset={2} text="building" />
					</span>
					{/* .word-rise makes this an inline-block; align-top stops it
					    leaving descender space above the employer line. */}
					<span
						className="word-rise block align-top"
						style={{ "--i": 3 } as React.CSSProperties}
					>
						<RotatingPhrase phrases={building} still="web applications" />
					</span>
					{/* Closes the sentence. One quiet tone, so it reads as where
					    the work happens without competing with the amber phrase. */}
					<span
						aria-hidden
						className="word-rise block text-hero-subtle"
						style={{ "--i": 4 } as React.CSSProperties}
					>
						@JPMorganChase.
					</span>
				</h1>

				{/* The rotating line already says what Nicholas builds. The
				    sentence below only appears when motion is reduced and the
				    line is frozen on its first phrase. */}
				<div className="mt-8 flex flex-col gap-8 md:mt-16 md:flex-row md:items-end md:justify-between md:gap-10">
					<p className="motion-fallback m-0 max-w-[36rem] text-hero-muted text-lead">
						I&apos;m Nicholas. I build web applications, component libraries,
						developer tools, and agentic AI tooling.
					</p>

					<Reveal className="shrink-0" delay={0.5}>
						<ButtonLink href="/about" variant="pop">
							See my experience
						</ButtonLink>
					</Reveal>
				</div>
			</div>

			{heroPhoto && (
				<Reveal className="lg:col-span-5" delay={0.3}>
					<MediaFigure
						media={heroPhoto}
						priority
						sizes="(min-width: 1024px) 40vw, 100vw"
					/>
				</Reveal>
			)}
		</HeroField>
	);
}
