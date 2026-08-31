import { Reveal } from "~/components/ui/reveal";

export function ContactCta() {
	return (
		<section
			aria-labelledby="contact-heading"
			className="relative mt-10 border-border border-t pt-16 md:mt-12 md:pt-20 lg:mt-16 lg:pt-28"
			id="contact"
		>
			<Reveal
				as="h2"
				className="m-0 font-display font-semibold text-(--ink) text-5xl leading-none tracking-tighter md:text-7xl lg:text-9xl"
				id="contact-heading"
			>
				Let&apos;s build
				<br />
				something{" "}
				<em className="inline-block -rotate-1 rounded-lg bg-(--accent) box-decoration-clone px-2 py-px text-(--marker-ink) not-italic md:px-3 lg:px-3.5">
					good
				</em>
				.
			</Reveal>

			<Reveal className="mt-12">
				<a
					className="border-(--accent) border-b-2 pb-0.5 font-display font-semibold text-(--ink) text-2xl tracking-tight no-underline transition-colors duration-200 hover:text-(--accent-text) md:text-3xl"
					href="mailto:rios.nicholas@protonmail.com"
				>
					rios.nicholas@protonmail.com
				</a>
			</Reveal>
		</section>
	);
}
