import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "~/components/admin/login-form";
import { isAdminUserId } from "~/server/api/trpc";
import { auth } from "~/server/auth";

export const metadata: Metadata = {
	title: "Sign in",
	robots: { index: false, follow: false },
};

/** Only allow same-origin, absolute-path redirects. Rejects anything that
 * isn't a single leading `/` (protocol-relative `//host`, backslash tricks,
 * or a bare relative path) to prevent `?returnUrl=` from being used as an
 * open redirect. */
function safeReturnUrl(value: string | string[] | undefined): string {
	if (typeof value !== "string") return "/admin";
	if (
		!value.startsWith("/") ||
		value.startsWith("//") ||
		value.startsWith("/\\")
	) {
		return "/admin";
	}
	return value;
}

export default async function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ returnUrl?: string | string[] }>;
}) {
	const params = await searchParams;
	const returnUrl = safeReturnUrl(params.returnUrl);

	const session = await auth();
	if (session?.user && isAdminUserId(session.user.id)) {
		redirect(returnUrl);
	}

	return (
		<main className="shell min-h-screen" id="main-content">
			{/* Nav clearance lives on this wrapper, not on `<main>`: `.shell`
			    (globals.css) is unlayered CSS and its `padding: 0 clamp(...)`
			    shorthand beats any Tailwind `pt-*`/`pb-*` utility, which Tailwind
			    emits inside `@layer utilities`. Unlayered always wins over layered,
			    regardless of specificity — so `pt-28` on the `.shell` element
			    computes to 0px. Same split every public page uses (see
			    admin/layout.tsx). */}
			<div className="mx-auto w-full max-w-md pt-24 pb-16 md:pt-28 md:pb-20">
				<h1 className="m-0 font-display font-semibold text-3xl text-foreground leading-none tracking-tighter md:text-4xl">
					Sign in
				</h1>
				<p className="mt-3 max-w-prose font-normal font-sans text-(--ink-2) text-sm leading-relaxed">
					Admin access only.
				</p>

				<LoginForm returnUrl={returnUrl} />
			</div>
		</main>
	);
}
