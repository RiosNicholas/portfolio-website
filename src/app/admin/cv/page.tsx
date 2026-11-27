"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import {
	AdminButton,
	AdminCard,
	AdminEmptyState,
	AdminErrorState,
	AdminField,
	AdminInput,
	AdminList,
	AdminListRow,
	AdminLoading,
	AdminPageHeader,
	AdminSaveStatus,
	AdminSectionLabel,
	AdminSelect,
	useFlash,
} from "~/components/admin/admin-ui";
import { AdminDateRange } from "~/components/admin/date-range";
import {
	type DateFields,
	type DateForm,
	formatDateRange,
	fromDateForm,
	toDateForm,
} from "~/lib/dates";
import { useAnimationsEnabled } from "~/lib/use-animations-enabled";
import { api } from "~/trpc/react";

type CvCategory = "EXPERIENCE" | "EDUCATION" | "ACTIVITY" | "AWARD";

type CvEntryRow = DateFields & {
	id: string;
	category: CvCategory;
	title: string;
	where: string;
};

const categories: { value: CvCategory; label: string }[] = [
	{ value: "EXPERIENCE", label: "Experience" },
	{ value: "EDUCATION", label: "Education" },
	{ value: "ACTIVITY", label: "Activities" },
	{ value: "AWARD", label: "Awards & certifications" },
];

type FormState = {
	id: string | null;
	category: CvCategory;
	dates: DateForm;
	title: string;
	where: string;
};

const emptyForm: FormState = {
	id: null,
	category: "EXPERIENCE",
	dates: {
		startYear: "",
		startMonth: "",
		endYear: "",
		endMonth: "",
		present: false,
	},
	title: "",
	where: "",
};

export default function AdminCvPage() {
	const utils = api.useUtils();
	const {
		data: entries,
		isLoading,
		isError,
		error: queryError,
	} = api.cvEntry.all.useQuery();
	const [form, setForm] = useState<FormState>(emptyForm);
	const [error, setError] = useState<string | null>(null);
	const [saved, flash] = useFlash();
	const formRef = useRef<HTMLDivElement>(null);
	const animationsEnabled = useAnimationsEnabled();

	const invalidate = () => utils.cvEntry.all.invalidate();

	function startEdit(row: CvEntryRow) {
		setForm({
			id: row.id,
			category: row.category,
			dates: toDateForm(row),
			title: row.title,
			where: row.where,
		});
		formRef.current?.scrollIntoView({
			behavior: animationsEnabled ? "smooth" : "auto",
			block: "start",
		});
	}

	const createMutation = api.cvEntry.create.useMutation({
		onSuccess: () => {
			invalidate();
			setForm(emptyForm);
			flash("Added");
		},
		onError: (e) => setError(e.message),
	});
	const updateMutation = api.cvEntry.update.useMutation({
		onSuccess: () => {
			invalidate();
			setForm(emptyForm);
			flash("Saved");
		},
		onError: (e) => setError(e.message),
	});
	const deleteMutation = api.cvEntry.delete.useMutation({
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
		const { startYear, ...dates } = fromDateForm(form.dates);
		const payload = {
			...dates,
			category: form.category,
			title: form.title.trim(),
			where: form.where.trim(),
		};
		if (!payload.title || !payload.where || startYear === null) {
			setError("Title, where, and start year are required.");
			return;
		}
		if (form.id) {
			updateMutation.mutate({ id: form.id, ...payload, startYear });
		} else {
			createMutation.mutate({ ...payload, startYear });
		}
	}

	return (
		<div>
			<AdminPageHeader
				description="The About page's Experience, Education, Activities, and Awards & certifications rows."
				title="CV entries"
			/>

			<AdminCard className="mb-8" ref={formRef}>
				<h2 className="m-0 mb-4 font-display font-semibold text-foreground text-lg">
					{form.id ? `Edit entry - ${form.title}` : "Add entry"}
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
					<AdminDateRange
						onChange={(dates) => setForm((f) => ({ ...f, dates }))}
						value={form.dates}
					/>
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
			{isError && !entries && (
				<AdminErrorState>
					Couldn't load CV entries - {queryError.message}
				</AdminErrorState>
			)}
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
											<div className="font-display font-semibold text-foreground text-sm">
												{row.title}
											</div>
											<div className="font-mono text-(--ink-3) text-xs">
												{formatDateRange(row)} · {row.where}
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
