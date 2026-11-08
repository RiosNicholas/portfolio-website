"use client";

import Link from "next/link";
import { useEffect } from "react";
import { buttonVariants, textLinkClass } from "~/components/ui/button-link";

export default function RouteError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error.digest ?? error);
	}, [error]);

	return (
		<main
			className="shell flex min-h-[60vh] flex-col justify-center gap-8 py-24"
			id="main-content"
		>
			<h1 className="m-0 font-semibold text-display">Something broke</h1>
			<p className="m-0 max-w-[32rem] text-lead">
				This page hit an unexpected error. You can try again, or head back home.
			</p>
			<div className="flex flex-wrap items-center gap-x-8 gap-y-4">
				<button
					className={buttonVariants()}
					onClick={() => reset()}
					type="button"
				>
					Try again
				</button>
				<Link className={`${textLinkClass} text-body`} href="/">
					Go home
				</Link>
			</div>
		</main>
	);
}
