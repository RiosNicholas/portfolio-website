import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { FloatingDockHeader } from "~/components/layout/floating-dock-header";
import { TRPCReactProvider } from "~/trpc/react";

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
		<html className={`${geist.variable}`} lang="en">
			<body className="bg-zinc-950 text-zinc-100 antialiased">
				<TRPCReactProvider>
					<FloatingDockHeader />
					<div className="pt-24">{children}</div>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
