import { AsciiField } from "~/components/ui/ascii-field";
import { cn } from "~/lib/utils";

/**
 * Shared height for the inner-page heroes (Work, About) so every page opens
 * on the same band regardless of how much copy it holds. Content sits at the
 * bottom of the band. Phones get no minimum: the band hugs its content.
 */
export const pageHeroClass =
	"flex flex-col justify-end pt-14 pb-12 md:min-h-[32rem] md:pt-36 md:pb-20";

/** Full-width cobalt band with a live ASCII field that every page opens on. */
export function HeroField({
	labelledBy,
	className,
	children,
}: {
	labelledBy: string;
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<section
			aria-labelledby={labelledBy}
			className="hero-field relative isolate overflow-hidden"
		>
			<AsciiField />
			<div className={cn("shell relative z-10", className)}>{children}</div>
		</section>
	);
}

/** Splits a heading into words that rise in one after another. */
export function RisingWords({
	text,
	offset = 0,
}: {
	text: string;
	offset?: number;
}) {
	const words = text.split(" ");
	return (
		<>
			{words.map((word, index) => (
				<span
					className="word-rise"
					// words come from a static string; order never changes
					key={index}
					style={{ "--i": index + offset } as React.CSSProperties}
				>
					{word}
					{index < words.length - 1 ? " " : ""}
				</span>
			))}
		</>
	);
}
