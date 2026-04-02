import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist, Figtree } from "next/font/google";

import { FloatingHeader } from "~/components/layout/floating-header";
import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/lib/utils";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
	title: "UI Platform & Frontend Architecture Portfolio",
	description:
		"Portfolio website for a UI developer focused on platform systems, frontend architecture, and photography.",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			className={cn(geist.variable, "scroll-smooth font-sans", figtree.variable)}
			lang="en"
		>
			<body className="bg-zinc-950 text-zinc-100 antialiased">
				<TRPCReactProvider>
					<FloatingHeader />
					<div>{children}</div>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
