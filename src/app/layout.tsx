import "~/styles/globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { JsonLd } from "~/components/layout/json-ld";
import { SiteFooter } from "~/components/layout/site-footer";
import { SiteNav } from "~/components/layout/site-nav";
import { SkipToContent } from "~/components/layout/skip-to-content";
import { ThemeInitScript } from "~/components/layout/theme-init-script";
import { CustomCursor } from "~/components/ui/custom-cursor";
import { MotionProvider } from "~/components/ui/motion-provider";
import { profileLinks, siteUrl } from "~/lib/site-links";
import { personJsonLd } from "~/lib/structured-data";
import { themeDefaults } from "~/lib/theme";

const schibstedGrotesk = Schibsted_Grotesk({
	subsets: ["latin"],
	variable: "--font-schibsted",
	weight: ["400", "500", "600", "700"],
	display: "swap",
});

const description =
	"Nicholas Rios is a software engineer building web applications, component libraries, developer tools and agentic AI tooling at JPMorganChase.";

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

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			className={schibstedGrotesk.variable}
			data-motion={themeDefaults.motion}
			data-theme={themeDefaults.theme}
			lang="en"
			suppressHydrationWarning
		>
			<body className="antialiased" suppressHydrationWarning>
				<ThemeInitScript />
				<JsonLd data={personJsonLd} />
				<SkipToContent />
				<MotionProvider>
					<CustomCursor />
					<SiteNav />
					{children}
					<SiteFooter />
				</MotionProvider>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
