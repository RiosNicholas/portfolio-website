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
import { SortableList, SortableRow } from "~/components/admin/sortable-list";
import { useAnimationsEnabled } from "~/lib/use-animations-enabled";
import { api } from "~/trpc/react";

type SkillKind = "SKILL" | "TOOL";

type FormState = {
	id: string | null;
	kind: SkillKind;
	label: string;
};

const emptyForm: FormState = {
	id: null,
	kind: "SKILL",
	label: "",
};

export default function AdminSkillsPage() {
	const utils = api.useUtils();
	const {
		data: skills,
		isLoading,
		isError,
		error: queryError,
	} = api.skill.all.useQuery();
	const [form, setForm] = useState<FormState>(emptyForm);
	const [error, setError] = useState<string | null>(null);
	const [saved, flash] = useFlash();
	const formRef = useRef<HTMLDivElement>(null);
	const animationsEnabled = useAnimationsEnabled();

	const invalidate = () => utils.skill.all.invalidate();

	function startEdit(row: SkillRow) {
		setForm({
			id: row.id,
			kind: row.kind,
			label: row.label,
		});
		formRef.current?.scrollIntoView({
			behavior: animationsEnabled ? "smooth" : "auto",
			block: "start",
		});
	}

	const createMutation = api.skill.create.useMutation({
		onSuccess: async () => {
			await invalidate();
			setForm(emptyForm);
			flash("Added");
		},
		onError: (e) => setError(e.message),
	});
	const updateMutation = api.skill.update.useMutation({
		onSuccess: async () => {
			await invalidate();
			setForm(emptyForm);
			flash("Saved");
		},
		onError: (e) => setError(e.message),
	});
	const reorderMutation = api.skill.reorder.useMutation({
		onSuccess: () => flash("Order saved"),
		onSettled: invalidate,
		onError: (e) => setError(e.message),
	});
	const deleteMutation = api.skill.delete.useMutation({
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
		const payload = {
			kind: form.kind,
			label: form.label.trim(),
		};
		if (!payload.label) {
			setError("Label is required.");
			return;
		}
		if (form.id) {
			updateMutation.mutate({ id: form.id, ...payload });
		} else {
			// New rows go to the end of their list.
			const last = skills?.filter((s) => s.kind === form.kind).at(-1);
			createMutation.mutate({
				...payload,
				sortOrder: (last?.sortOrder ?? -1) + 1,
			});
		}
	}

	// Only the dragged kind's ids are renumbered; the other kind keeps its order.
	function reorder(ids: string[]) {
		utils.skill.all.setData(undefined, (prev) =>
			prev
				?.map((s) =>
					ids.includes(s.id) ? { ...s, sortOrder: ids.indexOf(s.id) } : s,
				)
				.sort((a, b) => a.sortOrder - b.sortOrder),
		);
		reorderMutation.mutate({ ids });
	}

	const skillRows = skills?.filter((s) => s.kind === "SKILL") ?? [];
	const toolRows = skills?.filter((s) => s.kind === "TOOL") ?? [];

	return (
		<div>
			<AdminPageHeader
				description="Your skills and favorite tools on the home page. Drag to change their order."
				title="Skills & tools"
			/>

			<AdminCard className="mb-8" ref={formRef}>
				<h2 className="m-0 mb-4 font-display font-semibold text-foreground text-lg">
					{form.id ? `Edit skill/tool - ${form.label}` : "Add skill/tool"}
				</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<AdminField htmlFor="kind" label="Kind">
						<AdminSelect
							id="kind"
							onChange={(e) =>
								setForm((f) => ({ ...f, kind: e.target.value as SkillKind }))
							}
							value={form.kind}
						>
							<option value="SKILL">Skill</option>
							<option value="TOOL">Tool</option>
						</AdminSelect>
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

			{isError && !skills && (
				<AdminErrorState>
					Couldn't load skills/tools - {queryError.message}
				</AdminErrorState>
			)}

			{!isLoading && skills?.length === 0 && (
				<AdminEmptyState>No skills or tools yet.</AdminEmptyState>
			)}

			{!isLoading && skills && skills.length > 0 && (
				<div className="flex flex-col gap-8">
					<SkillGroup
						label="Skills"
						onDelete={(id) => deleteMutation.mutate({ id })}
						onEdit={startEdit}
						onReorder={reorder}
						rows={skillRows}
					/>
					<SkillGroup
						label="Tools"
						onDelete={(id) => deleteMutation.mutate({ id })}
						onEdit={startEdit}
						onReorder={reorder}
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
	sortOrder: number;
};

function SkillGroup({
	label,
	rows,
	onEdit,
	onDelete,
	onReorder,
}: {
	label: string;
	rows: SkillRow[];
	onEdit: (row: SkillRow) => void;
	onDelete: (id: string) => void;
	onReorder: (ids: string[]) => void;
}) {
	return (
		<div>
			<AdminSectionLabel>
				{label} ({rows.length})
			</AdminSectionLabel>
			<SortableList ids={rows.map((row) => row.id)} onReorder={onReorder}>
				<AdminList>
					{rows.map((row) => (
						<SortableRow id={row.id} key={row.id}>
							<AdminListRow
								actions={
									<>
										<AdminButton onClick={() => onEdit(row)} size="sm">
											<Pencil className="size-3.5" />
											Edit
										</AdminButton>
										<AdminButton
											onClick={() => {
												if (confirm(`Delete "${row.label}"?`)) onDelete(row.id);
											}}
											size="sm"
											variant="danger"
										>
											<Trash2 className="size-3.5" />
											Delete
										</AdminButton>
									</>
								}
							>
								<span className="font-display font-semibold text-foreground text-sm">
									{row.label}
								</span>
							</AdminListRow>
						</SortableRow>
					))}
				</AdminList>
			</SortableList>
		</div>
	);
}
