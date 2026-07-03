import "~/styles/globals.css";

import type { Metadata } from "next";
import {
	Hanken_Grotesk,
	JetBrains_Mono,
	Schibsted_Grotesk,
} from "next/font/google";
import { SiteNav } from "~/components/layout/site-nav";
import { CustomCursor } from "~/components/ui/custom-cursor";
import { RevealObserver } from "~/components/ui/reveal-observer";
import { cn } from "~/lib/utils";
import { TRPCReactProvider } from "~/trpc/react";

const schibstedGrotesk = Schibsted_Grotesk({
	subsets: ["latin"],
	variable: "--font-schibsted",
	weight: ["400", "500", "600", "700", "800"],
	display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
	subsets: ["latin"],
	variable: "--font-hanken",
	weight: ["400", "500", "600", "700"],
	display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-jetbrains-mono",
	weight: ["400", "500"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Nicholas Rios — Software Engineer",
	description:
		"Nicholas Rios — full-stack engineer, UI & platform. Based in Jersey City.",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var a=localStorage.getItem('accent')||'cobalt';var g=localStorage.getItem('grid')||'subtle';var m=localStorage.getItem('motion')||'high';var el=document.documentElement;el.dataset.theme=t;el.dataset.accent=a;el.dataset.grid=g;el.dataset.motion=m;}catch(e){}})();`;

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			className={cn(
				schibstedGrotesk.variable,
				hankenGrotesk.variable,
				jetbrainsMono.variable,
			)}
			data-accent="cobalt"
			data-grid="subtle"
			data-motion="high"
			data-theme="light"
			lang="en"
			suppressHydrationWarning
		>
			<body className="antialiased" suppressHydrationWarning>
				{/* Runs before paint to avoid FOUC */}
				<script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
				<div aria-hidden className="paper-bg" />
				<div aria-hidden className="grain" />
				<CustomCursor />
				<TRPCReactProvider>
					<SiteNav />
					<RevealObserver />
					{children}
				</TRPCReactProvider>
			</body>
		</html>
	);
}
