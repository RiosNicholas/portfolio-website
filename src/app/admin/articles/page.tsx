"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
	AdminBadge,
	AdminButton,
	AdminCard,
	AdminCheckbox,
	AdminEmptyState,
	AdminErrorState,
	AdminField,
	AdminInput,
	AdminLabel,
	AdminList,
	AdminListRow,
	AdminLoading,
	AdminPageHeader,
	AdminTextarea,
} from "~/components/admin/admin-ui";
import { useAnimationsEnabled } from "~/lib/use-animations-enabled";
import { articleInput } from "~/server/api/schemas/article";
import { api } from "~/trpc/react";

type ArticleRow = {
	id: string;
	slug: string;
	title: string;
	summary: string;
	body: string;
	tags: string[];
	published: boolean;
};

type FormState = {
	id: string | null;
	slug: string;
	slugLocked: boolean;
	title: string;
	summary: string;
	tags: string;
	published: boolean;
	body: string;
};

const emptyForm: FormState = {
	id: null,
	slug: "",
	slugLocked: false,
	title: "",
	summary: "",
	tags: "",
	published: false,
	body: "",
};

const slugify = (value: string) =>
	value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

const previewCls =
	"space-y-3 font-sans text-(--ink-2) text-sm leading-relaxed [&_:is(h1,h2,h3)]:font-display [&_:is(h1,h2,h3)]:font-semibold [&_:is(h1,h2,h3)]:text-foreground [&_:is(h1,h2,h3)]:text-lg [&_a]:text-(--accent-text) [&_a]:underline [&_blockquote]:border-(--border-2) [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_code]:rounded-(--r-sm) [&_code]:bg-(--frosted-2) [&_code]:px-1 [&_code]:font-mono [&_code]:text-xs [&_img]:h-auto [&_img]:max-w-full [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5";

export default function AdminArticlesPage() {
	const utils = api.useUtils();
	const {
		data: articles,
		isLoading,
		isError,
		error: queryError,
	} = api.article.all.useQuery();
	const [form, setForm] = useState<FormState>(emptyForm);
	const [error, setError] = useState<string | null>(null);
	const formRef = useRef<HTMLDivElement>(null);
	const animationsEnabled = useAnimationsEnabled();

	const invalidate = () => utils.article.all.invalidate();

	function startEdit(row: ArticleRow) {
		setForm({
			id: row.id,
			slug: row.slug,
			slugLocked: true,
			title: row.title,
			summary: row.summary,
			tags: row.tags.join(", "),
			published: row.published,
			body: row.body,
		});
		formRef.current?.scrollIntoView({
			behavior: animationsEnabled ? "smooth" : "auto",
			block: "start",
		});
	}

	const createMutation = api.article.create.useMutation({
		onSuccess: () => {
			invalidate();
			setForm(emptyForm);
		},
		onError: (e) => setError(e.message),
	});
	const updateMutation = api.article.update.useMutation({
		onSuccess: () => {
			invalidate();
			setForm(emptyForm);
		},
		onError: (e) => setError(e.message),
	});
	const deleteMutation = api.article.delete.useMutation({
		onSuccess: (_data, variables) => {
			if (variables.id === form.id) setForm(emptyForm);
			invalidate();
		},
		onError: (e) => setError(e.message),
	});

	const pending =
		createMutation.isPending ||
		updateMutation.isPending ||
		deleteMutation.isPending;

	function submit() {
		setError(null);
		const parsed = articleInput.safeParse({
			slug: form.slug.trim(),
			title: form.title.trim(),
			summary: form.summary.trim(),
			body: form.body,
			tags: form.tags
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean),
			published: form.published,
		});
		if (!parsed.success) {
			setError(parsed.error.issues[0]?.message ?? "Check the fields.");
			return;
		}
		if (form.id) {
			updateMutation.mutate({ id: form.id, ...parsed.data });
		} else {
			createMutation.mutate(parsed.data);
		}
	}

	return (
		<div>
			<AdminPageHeader
				description="Long-form posts on the Writing page, at /writing/<slug>. Leave `published` off to keep a draft."
				title="Articles"
			/>

			<AdminCard className="mb-8" ref={formRef}>
				<h2 className="m-0 mb-4 font-display font-semibold text-foreground text-lg">
					{form.id ? `Edit article - ${form.title}` : "Add article"}
				</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<AdminField htmlFor="title" label="Title">
						<AdminInput
							id="title"
							onChange={(e) =>
								setForm((f) => ({
									...f,
									title: e.target.value,
									slug: f.slugLocked ? f.slug : slugify(e.target.value),
								}))
							}
							value={form.title}
						/>
					</AdminField>
					<AdminField
						hint="Lowercase words joined by hyphens"
						htmlFor="slug"
						label="Slug"
					>
						<AdminInput
							id="slug"
							onChange={(e) =>
								setForm((f) => ({
									...f,
									slug: e.target.value,
									slugLocked: true,
								}))
							}
							value={form.slug}
						/>
					</AdminField>
					<AdminField
						className="sm:col-span-2"
						htmlFor="summary"
						label="Summary"
					>
						<AdminTextarea
							id="summary"
							onChange={(e) =>
								setForm((f) => ({ ...f, summary: e.target.value }))
							}
							value={form.summary}
						/>
					</AdminField>
					<AdminField
						hint="Comma-separated, e.g. LinkedIn, News, Social"
						htmlFor="tags"
						label="Source tags"
					>
						<AdminInput
							id="tags"
							onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
							value={form.tags}
						/>
					</AdminField>
					<div className="flex items-end">
						<AdminCheckbox
							checked={form.published}
							label="Published"
							onChange={(published) => setForm((f) => ({ ...f, published }))}
						/>
					</div>
					<AdminField
						className="sm:col-span-2"
						hint="Images: paste a Markdown image link, e.g. ![alt](https://...)"
						htmlFor="body"
						label="Body (Markdown)"
					>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<AdminTextarea
								className="min-h-80 font-mono text-xs"
								id="body"
								onChange={(e) =>
									setForm((f) => ({ ...f, body: e.target.value }))
								}
								value={form.body}
							/>
							<div>
								<AdminLabel>Preview</AdminLabel>
								<div className="min-h-80 rounded-(--r-md) border border-border bg-(--paper) p-4">
									<div className={previewCls}>
										<Markdown remarkPlugins={[remarkGfm]}>{form.body}</Markdown>
									</div>
								</div>
							</div>
						</div>
					</AdminField>
				</div>
				{error && (
					<p className="mt-3 font-mono text-(--destructive) text-xs">{error}</p>
				)}
				<div className="mt-5 flex gap-2">
					<AdminButton disabled={pending} onClick={submit} variant="primary">
						{form.id ? "Save changes" : "Add"}
					</AdminButton>
					{form.id && (
						<AdminButton onClick={() => setForm(emptyForm)}>Cancel</AdminButton>
					)}
				</div>
			</AdminCard>

			{isLoading && <AdminLoading />}
			{isError && !articles && (
				<AdminErrorState>
					Couldn't load articles - {queryError.message}
				</AdminErrorState>
			)}
			{!isLoading && articles?.length === 0 && (
				<AdminEmptyState>No articles yet.</AdminEmptyState>
			)}

			{!isLoading && articles && articles.length > 0 && (
				<AdminList>
					{articles.map((row) => (
						<AdminListRow
							actions={
								<>
									<AdminButton onClick={() => startEdit(row)} size="sm">
										<Pencil className="size-3.5" />
										Edit
									</AdminButton>
									<AdminButton
										onClick={() => {
											if (confirm(`Delete "${row.title}"?`))
												deleteMutation.mutate({ id: row.id });
										}}
										size="sm"
										variant="danger"
									>
										<Trash2 className="size-3.5" />
										Delete
									</AdminButton>
								</>
							}
							key={row.id}
						>
							<div className="flex items-center gap-2">
								<span className="font-display font-semibold text-foreground text-sm">
									{row.title}
								</span>
								<AdminBadge tone={row.published ? "accent" : "muted"}>
									{row.published ? "Published" : "Draft"}
								</AdminBadge>
							</div>
							<div className="font-mono text-(--ink-3) text-xs">
								/writing/{row.slug}
							</div>
						</AdminListRow>
					))}
				</AdminList>
			)}
		</div>
	);
}
