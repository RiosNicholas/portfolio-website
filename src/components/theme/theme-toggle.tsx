"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { themeStorageKeys } from "~/lib/theme";

export function ThemeToggle() {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		setIsDark(document.documentElement.dataset.theme === "dark");
	}, []);

	const toggle = () => {
		const next = isDark ? "light" : "dark";
		document.documentElement.dataset.theme = next;
		try {
			localStorage.setItem(themeStorageKeys.theme, next);
		} catch {}
		setIsDark(!isDark);
	};

	return (
		<button
			aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
			aria-pressed={isDark}
			className="inline-flex h-8 w-8 items-center justify-center rounded-full text-(--ink-3) transition-colors hover:bg-(--frosted) hover:text-(--ink)"
			onClick={toggle}
			type="button"
		>
			{isDark ? <Moon size={16} /> : <Sun size={16} />}
		</button>
	);
}
