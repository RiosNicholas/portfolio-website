"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import {
	AdminButton,
	AdminCard,
	AdminEmptyState,
	AdminField,
	AdminInput,
	AdminList,
	AdminListRow,
	AdminLoading,
	AdminPageHeader,
	AdminSectionLabel,
	AdminSelect,
} from "~/components/admin/admin-ui";
import { api } from "~/trpc/react";

type CvCategory = "EXPERIENCE" | "EDUCATION" | "ACTIVITY";

const categories: { value: CvCategory; label: string }[] = [
	{ value: "EXPERIENCE", label: "Experience" },
	{ value: "EDUCATION", label: "Education" },
	{ value: "ACTIVITY", label: "Activities" },
];

type FormState = {
	id: string | null;
	category: CvCategory;
	years: string;
	title: string;
	titleAccent: string;
	where: string;
	sortOrder: string;
};

const emptyForm: FormState = {
	id: null,
	category: "EXPERIENCE",
	years: "",
	title: "",
	titleAccent: "",
	where: "",
	sortOrder: "0",
};

export default function AdminCvPage() {
	const utils = api.useUtils();
	const { data: entries, isLoading } = api.cvEntry.all.useQuery();
	const [form, setForm] = useState<FormState>(emptyForm);
	const [error, setError] = useState<string | null>(null);

	const invalidate = () => utils.cvEntry.all.invalidate();

	const createMutation = api.cvEntry.create.useMutation({
		onSuccess: () => {
			invalidate();
			setForm(emptyForm);
		},
		onError: (e) => setError(e.message),
	});
	const updateMutation = api.cvEntry.update.useMutation({
		onSuccess: () => {
			invalidate();
			setForm(emptyForm);
		},
		onError: (e) => setError(e.message),
	});
	const deleteMutation = api.cvEntry.delete.useMutation({
		onSuccess: () => invalidate(),
		onError: (e) => setError(e.message),
	});

	const pending =
		createMutation.isPending ||
		updateMutation.isPending ||
		deleteMutation.isPending;

	function submit() {
		setError(null);
		const payload = {
			category: form.category,
			years: form.years.trim(),
			title: form.title.trim(),
			titleAccent: form.titleAccent
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean),
			where: form.where.trim(),
			sortOrder: Number.parseInt(form.sortOrder, 10) || 0,
		};
		if (!payload.title || !payload.where) {
			setError("Title and where are required.");
			return;
		}
		if (form.id) {
			updateMutation.mutate({ id: form.id, ...payload });
		} else {
			createMutation.mutate(payload);
		}
	}

	return (
		<div>
			<AdminPageHeader
				description="The About page's Experience, Education, and Activities rows."
				title="CV entries"
			/>

			<AdminCard className="mb-8">
				<h2 className="m-0 mb-4 font-display font-semibold text-foreground text-lg">
					{form.id ? "Edit entry" : "Add entry"}
				</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<AdminField htmlFor="category" label="Category">
						<AdminSelect
							id="category"
							onChange={(e) =>
								setForm((f) => ({
									...f,
									category: e.target.value as CvCategory,
								}))
							}
							value={form.category}
						>
							{categories.map((c) => (
								<option key={c.value} value={c.value}>
									{c.label}
								</option>
							))}
						</AdminSelect>
					</AdminField>
					<AdminField
						hint="Mono display range, e.g. Feb '25 — Present"
						htmlFor="years"
						label="Years"
					>
						<AdminInput
							id="years"
							onChange={(e) =>
								setForm((f) => ({ ...f, years: e.target.value }))
							}
							value={form.years}
						/>
					</AdminField>
					<AdminField htmlFor="title" label="Title">
						<AdminInput
							id="title"
							onChange={(e) =>
								setForm((f) => ({ ...f, title: e.target.value }))
							}
							value={form.title}
						/>
					</AdminField>
					<AdminField htmlFor="where" label="Where">
						<AdminInput
							id="where"
							onChange={(e) =>
								setForm((f) => ({ ...f, where: e.target.value }))
							}
							placeholder="Employer · City, ST"
							value={form.where}
						/>
					</AdminField>
					<AdminField
						hint="Comma-separated word(s) within the title to accent"
						htmlFor="titleAccent"
						label="Title accent"
					>
						<AdminInput
							id="titleAccent"
							onChange={(e) =>
								setForm((f) => ({ ...f, titleAccent: e.target.value }))
							}
							value={form.titleAccent}
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
			{!isLoading && entries?.length === 0 && (
				<AdminEmptyState>No CV entries yet.</AdminEmptyState>
			)}

			{!isLoading && entries && entries.length > 0 && (
				<div className="flex flex-col gap-8">
					{categories.map((c) => {
						const rows = entries.filter((e) => e.category === c.value);
						if (rows.length === 0) return null;
						return (
							<div key={c.value}>
								<AdminSectionLabel>
									{c.label} ({rows.length})
								</AdminSectionLabel>
								<AdminList>
									{rows.map((row) => (
										<AdminListRow
											actions={
												<>
													<AdminButton
														onClick={() =>
															setForm({
																id: row.id,
																category: row.category,
																years: row.years,
																title: row.title,
																titleAccent: row.titleAccent.join(", "),
																where: row.where,
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
											<div className="font-display font-semibold text-foreground text-sm">
												{row.title}
											</div>
											<div className="font-mono text-(--ink-3) text-xs">
												{row.years} · {row.where}
											</div>
										</AdminListRow>
									))}
								</AdminList>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
