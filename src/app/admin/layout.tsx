import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { isAdminUserId } from "~/server/api/trpc";
import { auth } from "~/server/auth";

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
		<main className="shell min-h-screen pt-28 pb-20" id="main-content">
			{children}
		</main>
	);
}
