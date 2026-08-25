import "~/styles/globals.css";

import type { Metadata } from "next";
import {
	Hanken_Grotesk,
	JetBrains_Mono,
	Schibsted_Grotesk,
} from "next/font/google";
import { SiteFooter } from "~/components/layout/site-footer";
import { SiteNav } from "~/components/layout/site-nav";
import { CustomCursor } from "~/components/ui/custom-cursor";
import { MotionProvider } from "~/components/ui/motion-provider";
import { profileLinks, siteUrl } from "~/lib/site-links";
import { personJsonLd } from "~/lib/structured-data";
import { cn } from "~/lib/utils";

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

const description =
	"Nicholas Rios — full-stack engineer, UI & platform. Based in Jersey City.";

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: "Nicholas Rios — Software Engineer",
		template: "%s — Nicholas Rios",
	},
	description,
	authors: [{ name: "Nicholas Rios", url: profileLinks.github }],
	keywords: [
		"Nicholas Rios",
		"software engineer",
		"frontend engineer",
		"platform engineering",
		"design systems",
		"agentic AI",
	],
	icons: [{ rel: "icon", url: "/favicon.ico" }],
	alternates: { canonical: "/" },
	openGraph: {
		type: "website",
		url: "/",
		siteName: "Nicholas Rios",
		title: "Nicholas Rios — Software Engineer",
		description,
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: "Nicholas Rios — Software Engineer",
		description,
	},
	robots: { index: true, follow: true },
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
				<script
					dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
					type="application/ld+json"
				/>
				<div aria-hidden className="paper-bg" />
				<div aria-hidden className="grain" />
				<MotionProvider>
					<CustomCursor />
					<SiteNav />
					{children}
					<SiteFooter />
				</MotionProvider>
			</body>
		</html>
	);
}
