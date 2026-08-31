import { cn } from "~/lib/utils";

export function SkipToContent() {
	return (
		<a
			className={cn(
				"sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-(--r-md) focus:bg-(--cta-bg) focus:px-4 focus:py-2.5 focus:font-display focus:font-semibold focus:text-(--cta-ink) focus:text-sm",
			)}
			href="#main-content"
		>
			Skip to content
		</a>
	);
}
