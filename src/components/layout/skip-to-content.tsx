import { cn } from "~/lib/utils";

export function SkipToContent() {
	return (
		<a
			className={cn(
				"sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-full focus:bg-brand focus:px-5 focus:py-3 focus:font-semibold focus:text-on-brand",
			)}
			href="#main-content"
		>
			Skip to content
		</a>
	);
}
