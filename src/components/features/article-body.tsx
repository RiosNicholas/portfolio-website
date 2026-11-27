import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import { MarkdownAsync } from "react-markdown";
import remarkGfm from "remark-gfm";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

const highlighter = createHighlighterCore({
	engine: createJavaScriptRegexEngine(),
	themes: [
		import("@shikijs/themes/github-light"),
		import("@shikijs/themes/github-dark"),
	],
	langs: [
		import("@shikijs/langs/typescript"),
		import("@shikijs/langs/tsx"),
		import("@shikijs/langs/javascript"),
		import("@shikijs/langs/jsx"),
		import("@shikijs/langs/json"),
		import("@shikijs/langs/bash"),
		import("@shikijs/langs/css"),
		import("@shikijs/langs/html"),
		import("@shikijs/langs/python"),
		import("@shikijs/langs/sql"),
		import("@shikijs/langs/markdown"),
	],
});

/** Raw HTML in the Markdown is not rendered: react-markdown escapes it by default. */
export async function ArticleBody({ markdown }: { markdown: string }) {
	return (
		<div className="flex flex-col gap-6 text-base text-ink [&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-surface [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_a]:font-medium [&_a]:text-brand-strong [&_a]:underline [&_a]:decoration-2 [&_a]:decoration-brand [&_a]:underline-offset-[0.25em] [&_blockquote]:border-brand [&_blockquote]:border-l-2 [&_blockquote]:pl-6 [&_blockquote]:text-ink-muted [&_h1]:mt-6 [&_h1]:font-semibold [&_h1]:text-2xl [&_h1]:tracking-tight md:[&_h1]:text-3xl [&_h2]:mt-6 [&_h2]:font-semibold [&_h2]:text-2xl [&_h2]:tracking-tight md:[&_h2]:text-3xl [&_h3]:mt-4 [&_h3]:font-semibold [&_h3]:text-lg md:[&_h3]:text-xl [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-3xl [&_ol]:list-decimal [&_ol]:pl-6 [&_pre]:overflow-x-auto [&_pre]:rounded-3xl [&_pre]:bg-surface [&_pre]:p-6 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_td]:px-3 [&_td]:py-2 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_ul]:list-disc [&_ul]:pl-6">
			<MarkdownAsync
				rehypePlugins={[
					[
						rehypeShikiFromHighlighter,
						await highlighter,
						{
							themes: { light: "github-light", dark: "github-dark" },
							defaultColor: "light",
						},
					],
				]}
				remarkPlugins={[remarkGfm]}
			>
				{markdown}
			</MarkdownAsync>
		</div>
	);
}
