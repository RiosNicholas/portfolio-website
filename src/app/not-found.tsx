import Link from "next/link";

export default function NotFound() {
	return (
		<main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 py-10 md:px-8">
			<h1 className="text-4xl font-bold">Not Found</h1>
			<p className="text-lg">The page you are looking for does not exist.</p>
			<Link href="/" className="text-blue-500">Go back to the home page</Link>
		</main>
	)
}