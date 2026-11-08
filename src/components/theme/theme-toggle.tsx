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
			className="inline-flex size-10 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface hover:text-ink active:bg-surface-hover"
			onClick={toggle}
			type="button"
		>
			{isDark ? <Moon size={18} /> : <Sun size={18} />}
		</button>
	);
}
