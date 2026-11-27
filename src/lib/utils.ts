import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// globals.css adds a custom `text-display` size. Without it tailwind-merge
// reads the class as a color and drops a real color class.
const twMerge = extendTailwindMerge({
	extend: {
		theme: { text: ["display"] },
	},
});

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
