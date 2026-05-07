"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<button
			aria-label="Toggle theme"
			className="rounded-full p-1.5 text-sm transition hover:bg-accent hover:text-accent-foreground"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
			type="button"
		>
			{resolvedTheme === "dark" ? (
				<SunIcon className="size-4" />
			) : (
				<MoonIcon className="size-4" />
			)}
		</button>
	);
}
