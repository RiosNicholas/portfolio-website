import "~/styles/globals.css";

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { FloatingHeader } from "~/components/layout/floating-header";
import { CustomCursor } from "~/components/ui/custom-cursor";
import { RevealObserver } from "~/components/ui/reveal-observer";
import { cn } from "~/lib/utils";
import { TRPCReactProvider } from "~/trpc/react";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-jetbrains-mono",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Nicholas Rios — Software Engineer",
	description:
		"Nicholas Rios — Front-End Software Engineer, UI Architecture & Platform Development. Based in Jersey City, NJ.",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			className={cn(inter.variable, jetbrainsMono.variable)}
			lang="en"
			suppressHydrationWarning
		>
			<body
				className="antialiased"
				style={{ background: "#000000", color: "#ffffff" }}
			>
				<div aria-hidden className="paper-bg" />
				<div aria-hidden className="grain" />
				<CustomCursor />
				<TRPCReactProvider>
					<FloatingHeader />
					<RevealObserver />
					<div className="relative z-10">{children}</div>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
