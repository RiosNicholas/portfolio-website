import { ButtonLink } from "~/components/ui/button-link";

export default function NotFound() {
	return (
		<main
			className="shell flex min-h-[60vh] flex-col justify-center gap-8 py-24"
			id="main-content"
		>
			<h1 className="m-0 font-semibold text-display">Page not found</h1>
			<p className="m-0 max-w-[32rem] text-lead">
				The page you&apos;re looking for doesn&apos;t exist or has moved.
			</p>
			<div>
				<ButtonLink href="/">Back to home</ButtonLink>
			</div>
		</main>
	);
}
