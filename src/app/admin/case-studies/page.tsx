"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import {
	AdminBadge,
	AdminButton,
	AdminCard,
	AdminCheckbox,
	AdminEmptyState,
	AdminField,
	AdminInput,
	AdminList,
	AdminListRow,
	AdminLoading,
	AdminPageHeader,
	AdminTextarea,
} from "~/components/admin/admin-ui";
import { api } from "~/trpc/react";

type StatForm = { k: string; v: string };

type FormState = {
	id: string; // slug — also acts as create/edit discriminator via `originalId`
	originalId: string | null;
	num: string;
	year: string;
	title: string;
	titleEm: string;
	titleSuffix: string;
	role: string;
	org: string;
	description: string;
	tags: string;
	stats: [StatForm, StatForm, StatForm];
	featured: boolean;
	sortOrder: string;
};

const emptyForm: FormState = {
	id: "",
	originalId: null,
	num: "",
	year: "",
	title: "",
	titleEm: "",
	titleSuffix: "",
	role: "",
	org: "",
	description: "",
	tags: "",
	stats: [
		{ k: "", v: "" },
		{ k: "", v: "" },
		{ k: "", v: "" },
	],
	featured: false,
	sortOrder: "0",
};

export default function AdminCaseStudiesPage() {
	const utils = api.useUtils();
	const { data: cases, isLoading } = api.caseStudy.all.useQuery();
	const [form, setForm] = useState<FormState>(emptyForm);
	const [error, setError] = useState<string | null>(null);

	const invalidate = () => utils.caseStudy.all.invalidate();

	const createMutation = api.caseStudy.create.useMutation({
		onSuccess: () => {
			invalidate();
			setForm(emptyForm);
		},
		onError: (e) => setError(e.message),
	});
	const updateMutation = api.caseStudy.update.useMutation({
		onSuccess: () => {
			invalidate();
			setForm(emptyForm);
		},
		onError: (e) => setError(e.message),
	});
	const deleteMutation = api.caseStudy.delete.useMutation({
		onSuccess: () => invalidate(),
		onError: (e) => setError(e.message),
	});

	const pending =
		createMutation.isPending ||
		updateMutation.isPending ||
		deleteMutation.isPending;

	function updateStat(index: 0 | 1 | 2, key: "k" | "v", value: string) {
		setForm((f) => {
			const stats = [...f.stats] as [StatForm, StatForm, StatForm];
			stats[index] = { ...stats[index], [key]: value };
			return { ...f, stats };
		});
	}

	function submit() {
		setError(null);
		const payload = {
			id: form.id.trim(),
			num: form.num.trim(),
			year: form.year.trim(),
			title: form.title,
			titleEm: form.titleEm.trim() || undefined,
			titleSuffix: form.titleSuffix.trim() || undefined,
			role: form.role.trim(),
			org: form.org.trim(),
			description: form.description.trim(),
			tags: form.tags
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean),
			stats: form.stats.map((s) => ({ k: s.k.trim(), v: s.v.trim() })),
			featured: form.featured,
			sortOrder: Number.parseInt(form.sortOrder, 10) || 0,
		};
		if (!payload.id || !payload.role || !payload.org || !payload.description) {
			setError("Slug (id), role, org, and description are required.");
			return;
		}
		if (payload.stats.some((s) => !s.k || !s.v)) {
			setError("All 3 stats need both a label and a value.");
			return;
		}
		if (form.originalId) {
			updateMutation.mutate({ ...payload, id: form.originalId });
		} else {
			createMutation.mutate(payload);
		}
	}

	return (
		<div>
			<AdminPageHeader
				description="/work case studies and the home page's featured teaser. `id` is the slug used as /work#<id> — keep it stable once a case study is live."
				title="Case studies"
			/>

			<AdminCard className="mb-8">
				<h2 className="m-0 mb-4 font-display font-semibold text-foreground text-lg">
					{form.originalId ? "Edit case study" : "Add case study"}
				</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<AdminField
						hint="Slug — load-bearing as /work#<id>, e.g. risk-agents"
						htmlFor="id"
						label="ID"
					>
						<AdminInput
							disabled={!!form.originalId}
							id="id"
							onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
							value={form.id}
						/>
					</AdminField>
					<AdminField htmlFor="num" label="Number">
						<AdminInput
							id="num"
							onChange={(e) => setForm((f) => ({ ...f, num: e.target.value }))}
							placeholder="1"
							value={form.num}
						/>
					</AdminField>
					<AdminField htmlFor="year" label="Year">
						<AdminInput
							id="year"
							onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
							placeholder="2025 —"
							value={form.year}
						/>
					</AdminField>
					<AdminField htmlFor="sortOrder" label="Sort order">
						<AdminInput
							id="sortOrder"
							onChange={(e) =>
								setForm((f) => ({ ...f, sortOrder: e.target.value }))
							}
							type="number"
							value={form.sortOrder}
						/>
					</AdminField>
					<AdminField
						hint="Leading plain text before the accent"
						htmlFor="title"
						label="Title"
					>
						<AdminInput
							id="title"
							onChange={(e) =>
								setForm((f) => ({ ...f, title: e.target.value }))
							}
							value={form.title}
						/>
					</AdminField>
					<AdminField
						hint="Accent word rendered inside the title"
						htmlFor="titleEm"
						label="Title accent"
					>
						<AdminInput
							id="titleEm"
							onChange={(e) =>
								setForm((f) => ({ ...f, titleEm: e.target.value }))
							}
							value={form.titleEm}
						/>
					</AdminField>
					<AdminField htmlFor="titleSuffix" label="Title suffix">
						<AdminInput
							id="titleSuffix"
							onChange={(e) =>
								setForm((f) => ({ ...f, titleSuffix: e.target.value }))
							}
							value={form.titleSuffix}
						/>
					</AdminField>
					<AdminField htmlFor="role" label="Role">
						<AdminInput
							id="role"
							onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
							placeholder="Platform · Lead UI"
							value={form.role}
						/>
					</AdminField>
					<AdminField className="sm:col-span-2" htmlFor="org" label="Org">
						<AdminInput
							id="org"
							onChange={(e) => setForm((f) => ({ ...f, org: e.target.value }))}
							value={form.org}
						/>
					</AdminField>
					<AdminField
						className="sm:col-span-2"
						htmlFor="description"
						label="Description"
					>
						<AdminTextarea
							id="description"
							onChange={(e) =>
								setForm((f) => ({ ...f, description: e.target.value }))
							}
							value={form.description}
						/>
					</AdminField>
					<AdminField
						className="sm:col-span-2"
						hint="Comma-separated"
						htmlFor="tags"
						label="Tags"
					>
						<AdminInput
							id="tags"
							onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
							placeholder="Next.js, shadcn/ui, MCP"
							value={form.tags}
						/>
					</AdminField>

					<div className="sm:col-span-2">
						<AdminLabelRow />
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
							{form.stats.map((stat, i) => (
								<div className="flex gap-2" key={i}>
									<AdminInput
										aria-label={`Stat ${i + 1} label`}
										onChange={(e) =>
											updateStat(i as 0 | 1 | 2, "k", e.target.value)
										}
										placeholder="Label"
										value={stat.k}
									/>
									<AdminInput
										aria-label={`Stat ${i + 1} value`}
										onChange={(e) =>
											updateStat(i as 0 | 1 | 2, "v", e.target.value)
										}
										placeholder="Value"
										value={stat.v}
									/>
								</div>
							))}
						</div>
					</div>

					<div className="flex items-end">
						<AdminCheckbox
							checked={form.featured}
							label="Featured (shown in home page teaser)"
							onChange={(featured) => setForm((f) => ({ ...f, featured }))}
						/>
					</div>
				</div>
				{error && (
					<p className="mt-3 font-mono text-(--destructive) text-xs">{error}</p>
				)}
				<div className="mt-5 flex gap-2">
					<AdminButton disabled={pending} onClick={submit} variant="primary">
						{form.originalId ? "Save changes" : "Add"}
					</AdminButton>
					{form.originalId && (
						<AdminButton onClick={() => setForm(emptyForm)}>Cancel</AdminButton>
					)}
				</div>
			</AdminCard>

			{isLoading && <AdminLoading />}
			{!isLoading && cases?.length === 0 && (
				<AdminEmptyState>No case studies yet.</AdminEmptyState>
			)}

			{!isLoading && cases && cases.length > 0 && (
				<AdminList>
					{cases.map((row) => {
						const stats = row.stats as unknown as StatForm[];
						return (
							<AdminListRow
								actions={
									<>
										<AdminButton
											onClick={() =>
												setForm({
													id: row.id,
													originalId: row.id,
													num: row.num,
													year: row.year,
													title: row.title,
													titleEm: row.titleEm ?? "",
													titleSuffix: row.titleSuffix ?? "",
													role: row.role,
													org: row.org,
													description: row.description,
													tags: row.tags.join(", "),
													stats: [
														stats[0] ?? { k: "", v: "" },
														stats[1] ?? { k: "", v: "" },
														stats[2] ?? { k: "", v: "" },
													],
													featured: row.featured,
													sortOrder: String(row.sortOrder),
												})
											}
											size="sm"
										>
											<Pencil className="size-3.5" />
											Edit
										</AdminButton>
										<AdminButton
											onClick={() => {
												if (confirm(`Delete "${row.id}"?`))
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
										{row.titleEm}
										{row.titleSuffix}
									</span>
									{row.featured && (
										<AdminBadge tone="accent">Featured</AdminBadge>
									)}
								</div>
								<div className="font-mono text-(--ink-3) text-xs">
									{row.id} · {row.role}
								</div>
							</AdminListRow>
						);
					})}
				</AdminList>
			)}
		</div>
	);
}

function AdminLabelRow() {
	return (
		<span className="mb-1.5 block font-medium font-mono text-(--ink-3) text-xs uppercase tracking-wider">
			Stats (exactly 3)
		</span>
	);
}
