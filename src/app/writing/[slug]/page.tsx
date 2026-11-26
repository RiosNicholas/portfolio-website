import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleBody } from "~/components/features/article-body";
import { JsonLd } from "~/components/layout/json-ld";
import { textLinkClass } from "~/components/ui/button-link";
import { siteUrl } from "~/lib/site-links";
import { personJsonLd } from "~/lib/structured-data";
import { cn } from "~/lib/utils";
import {
	getArticleBySlug,
	getPublishedArticleSlugs,
} from "~/server/data/writing";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
	return (await getPublishedArticleSlugs()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const article = await getArticleBySlug(slug);
	if (!article) return {};

	const url = `/writing/${slug}`;
	return {
		title: article.title,
		description: article.summary,
		alternates: { canonical: url },
		openGraph: {
			type: "article",
			url,
			title: article.title,
			description: article.summary,
			publishedTime: article.publishedAt,
			modifiedTime: article.updatedAt,
		},
	};
}

export default async function ArticlePage({ params }: Props) {
	const { slug } = await params;
	const article = await getArticleBySlug(slug);
	if (!article) notFound();

	const url = `${siteUrl}/writing/${slug}`;
	const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		timeZone: "UTC",
	});

	return (
		<main className="shell pt-14 pb-24 md:pt-36 md:pb-40" id="main-content">
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@type": "BlogPosting",
					headline: article.title,
					description: article.summary,
					datePublished: article.publishedAt,
					dateModified: article.updatedAt,
					url,
					mainEntityOfPage: url,
					author: personJsonLd,
				}}
			/>

			<article className="mx-auto flex max-w-[68ch] flex-col gap-10">
				<header className="flex flex-col gap-6">
					<Link className={cn(textLinkClass, "w-fit")} href="/writing">
						Back to writing
					</Link>
					<h1 className="m-0 font-semibold text-title">{article.title}</h1>
					<p className="m-0 flex flex-wrap gap-x-3 gap-y-2 text-body text-ink-muted">
						<time dateTime={article.publishedAt}>{date}</time>
						{article.tags.map((name) => (
							<span key={name}>{name}</span>
						))}
					</p>
				</header>

				<ArticleBody markdown={article.body} />
			</article>
		</main>
	);
}
