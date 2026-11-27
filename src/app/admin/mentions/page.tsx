"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import {
	AdminBadge,
	AdminButton,
	AdminCard,
	AdminCheckbox,
	AdminEmptyState,
	AdminErrorState,
	AdminField,
	AdminInput,
	AdminList,
	AdminListRow,
	AdminLoading,
	AdminPageHeader,
	AdminSaveStatus,
	useFlash,
} from "~/components/admin/admin-ui";
import { useAnimationsEnabled } from "~/lib/use-animations-enabled";
import { mentionInput } from "~/server/api/schemas/mention";
import { api } from "~/trpc/react";

type MentionRow = {
	id: string;
	url: string;
	title: string;
	outlet: string;
	publishedAt: Date;
	tags: string[];
	published: boolean;
};

type FormState = {
	id: string | null;
	url: string;
	title: string;
	outlet: string;
	publishedAt: string;
	tags: string;
	published: boolean;
};

const emptyForm: FormState = {
	id: null,
	url: "",
	title: "",
	outlet: "",
	publishedAt: "",
	tags: "",
	published: true,
};

const toDateInput = (date: Date) => date.toISOString().split("T")[0] ?? "";

export default function AdminMentionsPage() {
	const utils = api.useUtils();
	const {
		data: mentions,
		isLoading,
		isError,
		error: queryError,
	} = api.mention.all.useQuery();
	const [form, setForm] = useState<FormState>(emptyForm);
	const [error, setError] = useState<string | null>(null);
	const [saved, flash] = useFlash();
	const formRef = useRef<HTMLDivElement>(null);
	const animationsEnabled = useAnimationsEnabled();

	const invalidate = () => utils.mention.all.invalidate();

	function startEdit(row: MentionRow) {
		setForm({
			id: row.id,
			url: row.url,
			title: row.title,
			outlet: row.outlet,
			publishedAt: toDateInput(row.publishedAt),
			tags: row.tags.join(", "),
			published: row.published,
		});
		formRef.current?.scrollIntoView({
			behavior: animationsEnabled ? "smooth" : "auto",
			block: "start",
		});
	}

	const createMutation = api.mention.create.useMutation({
		onSuccess: () => {
			invalidate();
			setForm(emptyForm);
			flash("Added");
		},
		onError: (e) => setError(e.message),
	});
	const updateMutation = api.mention.update.useMutation({
		onSuccess: () => {
			invalidate();
			setForm(emptyForm);
			flash("Saved");
		},
		onError: (e) => setError(e.message),
	});
	const deleteMutation = api.mention.delete.useMutation({
		onSuccess: (_data, variables) => {
			if (variables.id === form.id) setForm(emptyForm);
			invalidate();
			flash("Deleted");
		},
		onError: (e) => setError(e.message),
	});

	const pending =
		createMutation.isPending ||
		updateMutation.isPending ||
		deleteMutation.isPending;

	function submit() {
		setError(null);
		const parsed = mentionInput.safeParse({
			url: form.url.trim(),
			title: form.title.trim(),
			outlet: form.outlet.trim(),
			publishedAt: new Date(form.publishedAt),
			tags: form.tags
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean),
			published: form.published,
		});
		if (!parsed.success) {
			setError(
				parsed.error.issues.map((i) => `${i.path[0]}: ${i.message}`).join(", "),
			);
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
				description="External links on the Writing page - pieces you wrote elsewhere or that feature you. Leave `published` off to stage one."
				title="Mentions"
			/>

			<AdminCard className="mb-8" ref={formRef}>
				<h2 className="m-0 mb-4 font-display font-semibold text-foreground text-lg">
					{form.id ? `Edit mention - ${form.title}` : "Add mention"}
				</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<AdminField htmlFor="title" label="Title">
						<AdminInput
							id="title"
							onChange={(e) =>
								setForm((f) => ({ ...f, title: e.target.value }))
							}
							value={form.title}
						/>
					</AdminField>
					<AdminField htmlFor="outlet" label="Outlet">
						<AdminInput
							id="outlet"
							onChange={(e) =>
								setForm((f) => ({ ...f, outlet: e.target.value }))
							}
							placeholder="LinkedIn, Forbes, ..."
							value={form.outlet}
						/>
					</AdminField>
					<AdminField className="sm:col-span-2" htmlFor="url" label="URL">
						<AdminInput
							id="url"
							onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
							placeholder="https://..."
							value={form.url}
						/>
					</AdminField>
					<AdminField htmlFor="publishedAt" label="Published date">
						<AdminInput
							id="publishedAt"
							onChange={(e) =>
								setForm((f) => ({ ...f, publishedAt: e.target.value }))
							}
							type="date"
							value={form.publishedAt}
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
				</div>
				<div className="mt-5 flex gap-2">
					<AdminButton disabled={pending} onClick={submit} variant="primary">
						{form.id ? "Save changes" : "Add"}
					</AdminButton>
					{form.id && (
						<AdminButton onClick={() => setForm(emptyForm)}>Cancel</AdminButton>
					)}
					<AdminSaveStatus error={error} pending={pending} saved={saved} />
				</div>
			</AdminCard>

			{isLoading && <AdminLoading />}
			{isError && !mentions && (
				<AdminErrorState>
					Couldn't load mentions - {queryError.message}
				</AdminErrorState>
			)}
			{!isLoading && mentions?.length === 0 && (
				<AdminEmptyState>No mentions yet.</AdminEmptyState>
			)}

			{!isLoading && mentions && mentions.length > 0 && (
				<AdminList>
					{mentions.map((row) => (
						<AdminListRow
							actions={
								<>
									<AdminButton onClick={() => startEdit(row)} size="sm">
										<Pencil className="size-3.5" />
										Edit
									</AdminButton>
									<AdminButton
										onClick={() => {
											if (confirm(`Delete "${row.title}"?`)) {
												setError(null);
												deleteMutation.mutate({ id: row.id });
											}
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
								{!row.published && <AdminBadge>Draft</AdminBadge>}
							</div>
							<div className="font-mono text-(--ink-3) text-xs">
								{row.outlet} · {toDateInput(row.publishedAt)}
							</div>
						</AdminListRow>
					))}
				</AdminList>
			)}
		</div>
	);
}
