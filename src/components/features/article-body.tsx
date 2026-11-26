import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import { MarkdownAsync } from "react-markdown";
import remarkGfm from "remark-gfm";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { bundledLanguages } from "shiki/langs";
import { bundledThemes } from "shiki/themes";

const langs = [
	"typescript",
	"tsx",
	"javascript",
	"jsx",
	"json",
	"bash",
	"css",
	"html",
	"python",
	"sql",
	"markdown",
] as const;

const highlighter = createHighlighterCore({
	engine: createJavaScriptRegexEngine(),
	themes: [bundledThemes["github-light"], bundledThemes["github-dark"]],
	langs: langs.map((lang) => bundledLanguages[lang]),
});

/** Raw HTML in the Markdown is not rendered: react-markdown escapes it by default. */
export async function ArticleBody({ markdown }: { markdown: string }) {
	return (
		<div className="flex flex-col gap-6 text-body text-ink [&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-surface [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_a]:font-medium [&_a]:text-brand-strong [&_a]:underline [&_a]:decoration-2 [&_a]:decoration-brand [&_a]:underline-offset-[0.25em] [&_blockquote]:border-brand [&_blockquote]:border-l-2 [&_blockquote]:pl-6 [&_blockquote]:text-ink-muted [&_h2]:mt-6 [&_h2]:font-semibold [&_h2]:text-statement [&_h3]:mt-4 [&_h3]:font-semibold [&_h3]:text-lead [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-3xl [&_ol]:list-decimal [&_ol]:pl-6 [&_pre]:overflow-x-auto [&_pre]:rounded-3xl [&_pre]:p-6 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_td]:px-3 [&_td]:py-2 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_ul]:list-disc [&_ul]:pl-6">
			{
				await MarkdownAsync({
					children: markdown,
					remarkPlugins: [remarkGfm],
					rehypePlugins: [
						[
							rehypeShikiFromHighlighter,
							await highlighter,
							{
								themes: { light: "github-light", dark: "github-dark" },
								defaultColor: "light",
							},
						],
					],
				})
			}
		</div>
	);
}
