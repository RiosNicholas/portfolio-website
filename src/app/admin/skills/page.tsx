"use client";

import { useState } from "react";
import {
	AdminButton,
	AdminCard,
	AdminEmptyState,
	AdminField,
	AdminInput,
	AdminPageHeader,
} from "~/components/admin/admin-ui";
import { api } from "~/trpc/react";

type SkillKind = "SKILL" | "TOOL";

type FormState = {
	id: string | null;
	kind: SkillKind;
	label: string;
	accent: string;
	sortOrder: string;
};

const emptyForm: FormState = {
	id: null,
	kind: "SKILL",
	label: "",
	accent: "",
	sortOrder: "0",
};

export default function AdminSkillsPage() {
	const utils = api.useUtils();
	const { data: skills, isLoading } = api.skill.all.useQuery();
	const [form, setForm] = useState<FormState>(emptyForm);
	const [error, setError] = useState<string | null>(null);

	const invalidate = () => utils.skill.all.invalidate();

	const createMutation = api.skill.create.useMutation({
		onSuccess: () => {
			invalidate();
			setForm(emptyForm);
		},
		onError: (e) => setError(e.message),
	});
	const updateMutation = api.skill.update.useMutation({
		onSuccess: () => {
			invalidate();
			setForm(emptyForm);
		},
		onError: (e) => setError(e.message),
	});
	const deleteMutation = api.skill.delete.useMutation({
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
			kind: form.kind,
			label: form.label.trim(),
			accent: form.accent.trim() || undefined,
			sortOrder: Number.parseInt(form.sortOrder, 10) || 0,
		};
		if (!payload.label) {
			setError("Label is required.");
			return;
		}
		if (form.id) {
			updateMutation.mutate({ id: form.id, ...payload });
		} else {
			createMutation.mutate(payload);
		}
	}

	const skillRows = skills?.filter((s) => s.kind === "SKILL") ?? [];
	const toolRows = skills?.filter((s) => s.kind === "TOOL") ?? [];

	return (
		<div>
			<AdminPageHeader
				description="The home page bento grid's Skills marquee and Favorite tools chip list. `accent` marks a substring of the label rendered as an accented word."
				title="Skills & tools"
			/>

			<AdminCard className="mb-8">
				<h2 className="m-0 mb-4 font-display font-semibold text-foreground text-lg">
					{form.id ? "Edit skill/tool" : "Add skill/tool"}
				</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<AdminField htmlFor="kind" label="Kind">
						<select
							className="w-full rounded-(--r-md) border border-(--border-2) bg-(--paper-2) px-3 py-2 font-sans text-foreground text-sm"
							id="kind"
							onChange={(e) =>
								setForm((f) => ({ ...f, kind: e.target.value as SkillKind }))
							}
							value={form.kind}
						>
							<option value="SKILL">Skill</option>
							<option value="TOOL">Tool</option>
						</select>
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
					<AdminField htmlFor="label" label="Label">
						<AdminInput
							id="label"
							onChange={(e) =>
								setForm((f) => ({ ...f, label: e.target.value }))
							}
							placeholder="React · Next.js"
							value={form.label}
						/>
					</AdminField>
					<AdminField
						hint="Optional — substring of the label to accent, e.g. Next.js"
						htmlFor="accent"
						label="Accent"
					>
						<AdminInput
							id="accent"
							onChange={(e) =>
								setForm((f) => ({ ...f, accent: e.target.value }))
							}
							value={form.accent}
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

			{isLoading && (
				<p className="font-mono text-(--ink-3) text-sm">Loading…</p>
			)}

			{!isLoading && skills?.length === 0 && (
				<AdminEmptyState>No skills or tools yet.</AdminEmptyState>
			)}

			{!isLoading && skills && skills.length > 0 && (
				<div className="flex flex-col gap-8">
					<SkillGroup
						label="Skills"
						onDelete={(id) => deleteMutation.mutate({ id })}
						onEdit={(row) =>
							setForm({
								id: row.id,
								kind: row.kind,
								label: row.label,
								accent: row.accent ?? "",
								sortOrder: String(row.sortOrder),
							})
						}
						rows={skillRows}
					/>
					<SkillGroup
						label="Tools"
						onDelete={(id) => deleteMutation.mutate({ id })}
						onEdit={(row) =>
							setForm({
								id: row.id,
								kind: row.kind,
								label: row.label,
								accent: row.accent ?? "",
								sortOrder: String(row.sortOrder),
							})
						}
						rows={toolRows}
					/>
				</div>
			)}
		</div>
	);
}

type SkillRow = {
	id: string;
	kind: SkillKind;
	label: string;
	accent: string | null;
	sortOrder: number;
};

function SkillGroup({
	label,
	rows,
	onEdit,
	onDelete,
}: {
	label: string;
	rows: SkillRow[];
	onEdit: (row: SkillRow) => void;
	onDelete: (id: string) => void;
}) {
	return (
		<div>
			<h2 className="mb-3 font-medium font-mono text-(--accent-text) text-xs uppercase tracking-wider">
				{label} ({rows.length})
			</h2>
			<div className="flex flex-col">
				{rows.map((row) => (
					<div
						className="flex items-center justify-between gap-4 border-border border-t py-3"
						key={row.id}
					>
						<div>
							<span className="font-display font-semibold text-foreground text-sm">
								{row.label}
							</span>
							{row.accent && (
								<span className="ml-2 font-mono text-(--ink-4) text-xs">
									accent: {row.accent}
								</span>
							)}
						</div>
						<div className="flex shrink-0 gap-2">
							<AdminButton onClick={() => onEdit(row)}>Edit</AdminButton>
							<AdminButton
								onClick={() => {
									if (confirm(`Delete "${row.label}"?`)) onDelete(row.id);
								}}
								variant="danger"
							>
								Delete
							</AdminButton>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
