import { themeDefaults, themeStorageKeys } from "~/lib/theme";

const themeInitScript = `(function(){try{var t=localStorage.getItem('${themeStorageKeys.theme}');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var a=localStorage.getItem('${themeStorageKeys.accent}')||'${themeDefaults.accent}';var g=localStorage.getItem('${themeStorageKeys.grid}')||'${themeDefaults.grid}';var m=localStorage.getItem('${themeStorageKeys.motion}')||'${themeDefaults.motion}';var el=document.documentElement;el.dataset.theme=t;el.dataset.accent=a;el.dataset.grid=g;el.dataset.motion=m;}catch(e){}})();`;

/**
 * Runs before paint to avoid FOUC. Must stay a Server Component rendered as
 * the first child of `<body>` — no `"use client"`, no `next/script`. A
 * hydrated client component or a deferred script tag would run after first
 * paint, reintroducing the flash this exists to prevent.
 */
export function ThemeInitScript() {
	return <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />;
}
