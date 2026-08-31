import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { isAdminUserId } from "~/server/api/trpc";
import { auth } from "~/server/auth";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
	title: "Admin",
	robots: { index: false, follow: false },
};

/**
 * Auth + allowlist gate for `/admin`. Enforced again per-mutation by
 * `adminProcedure` (`src/server/api/trpc.ts`) — this layer's job is purely
 * to keep a non-admin visitor from ever seeing the admin shell render, not
 * just having their mutations rejected.
 */
export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	if (!session?.user || !isAdminUserId(session.user.id)) {
		redirect("/");
	}

	return (
		<TRPCReactProvider>
			<main className="shell min-h-screen" id="main-content">
				{/* Nav clearance lives on this wrapper, not on `<main>`: `.shell`
				    (globals.css) is unlayered CSS and its `padding: 0 clamp(...)`
				    shorthand beats any Tailwind `pt-*`/`pb-*` utility, which Tailwind
				    emits inside `@layer utilities`. Unlayered always wins over layered,
				    regardless of specificity — so `pt-28` on the `.shell` element
				    computes to 0px. Same split every public page uses (see
				    about/page.tsx + about-hero.tsx). */}
				<div className="mx-auto w-full max-w-5xl pt-24 pb-16 md:pt-28 md:pb-20">
					{children}
				</div>
			</main>
		</TRPCReactProvider>
	);
}
