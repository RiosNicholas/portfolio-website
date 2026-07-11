import { Reveal } from "~/components/ui/reveal";

export function WorkHero() {
	return (
		<section className="hero-min relative flex min-h-[42vh] flex-col justify-center pt-[clamp(96px,14vh,148px)] pb-[clamp(32px,5vw,64px)]">
			{/* Eyebrow */}
			<Reveal className="mb-8 inline-flex w-max items-center gap-2.5 rounded-full border border-(--border-2) bg-card px-4 py-2 font-medium font-mono text-(--ink-2) text-xs tracking-normal shadow-(--shadow-card)">
				<span className="h-2 w-2 shrink-0 animate-[breathe_2.4s_ease-in-out_infinite] rounded-full bg-(--c-lime) shadow-[0_0_0_3px_color-mix(in_srgb,var(--c-lime)_30%,transparent)]" />
				04 projects · 2023 — 2026
			</Reveal>

			{/* Headline */}
			<Reveal
				as="h1"
				className="hero-name-min m-0 font-display font-semibold text-[clamp(48px,9vw,128px)] text-foreground leading-[0.92] tracking-[-0.04em]"
			>
				Selected{" "}
				<em className="no-underline! inline-block -rotate-[1.4deg] rounded-lg bg-(--accent) box-decoration-clone px-[0.16em] py-[0.01em] text-(--marker-ink) not-italic">
					work
				</em>
			</Reveal>

			{/* Subtitle */}
			<Reveal
				as="p"
				className="hero-lead mt-6 max-w-[52ch] font-normal font-sans text-(--ink-2) text-[clamp(16px,1.3vw,18px)] leading-relaxed tracking-[-0.005em]"
			>
				UI &amp; platform engineering across agentic tooling, editorial
				commerce, and small apps built solo.
			</Reveal>
		</section>
	);
}
