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
import { SortableList, SortableRow } from "~/components/admin/sortable-list";
import { useAnimationsEnabled } from "~/lib/use-animations-enabled";
import { api } from "~/trpc/react";

type LanguageRow = {
	id: string;
	name: string;
	level: string;
	published: boolean;
	sortOrder: number;
};

type FormState = {
	id: string | null;
	name: string;
	level: string;
	published: boolean;
};

const emptyForm: FormState = {
	id: null,
	name: "",
	level: "",
	published: true,
};

export default function AdminLanguagesPage() {
	const utils = api.useUtils();
	const {
		data: languages,
		isLoading,
		isError,
		error: queryError,
	} = api.language.all.useQuery();
	const [form, setForm] = useState<FormState>(emptyForm);
	const [error, setError] = useState<string | null>(null);
	const [saved, flash] = useFlash();
	const formRef = useRef<HTMLDivElement>(null);
	const animationsEnabled = useAnimationsEnabled();

	const invalidate = () => utils.language.all.invalidate();

	function startEdit(row: LanguageRow) {
		setForm({
			id: row.id,
			name: row.name,
			level: row.level,
			published: row.published,
		});
		formRef.current?.scrollIntoView({
			behavior: animationsEnabled ? "smooth" : "auto",
			block: "start",
		});
	}

	const createMutation = api.language.create.useMutation({
		onSuccess: () => {
			invalidate();
			setForm(emptyForm);
			flash("Added");
		},
		onError: (e) => setError(e.message),
	});
	const updateMutation = api.language.update.useMutation({
		onSuccess: () => {
			invalidate();
			setForm(emptyForm);
			flash("Saved");
		},
		onError: (e) => setError(e.message),
	});
	const reorderMutation = api.language.reorder.useMutation({
		onSuccess: () => flash("Order saved"),
		onSettled: invalidate,
		onError: (e) => setError(e.message),
	});
	const deleteMutation = api.language.delete.useMutation({
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
			name: form.name.trim(),
			level: form.level.trim(),
			published: form.published,
		};
		if (!payload.name || !payload.level) {
			setError("Name and level are required.");
			return;
		}
		if (form.id) {
			updateMutation.mutate({ id: form.id, ...payload });
		} else {
			// New rows go to the end of the list.
			createMutation.mutate({
				...payload,
				sortOrder: (languages?.at(-1)?.sortOrder ?? -1) + 1,
			});
		}
	}

	function reorder(ids: string[]) {
		utils.language.all.setData(undefined, (prev) =>
			prev
				?.map((r) => ({ ...r, sortOrder: ids.indexOf(r.id) }))
				.sort((a, b) => a.sortOrder - b.sortOrder),
		);
		reorderMutation.mutate({ ids });
	}

	return (
		<div>
			<AdminPageHeader
				description="The home page bento grid's Languages cell. `published` controls whether a row shows on the public site."
				title="Languages"
			/>

			<AdminCard className="mb-8" ref={formRef}>
				<h2 className="m-0 mb-4 font-display font-semibold text-foreground text-lg">
					{form.id ? `Edit language - ${form.name}` : "Add language"}
				</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<AdminField htmlFor="name" label="Name">
						<AdminInput
							id="name"
							onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
							placeholder="English"
							value={form.name}
						/>
					</AdminField>
					<AdminField htmlFor="level" label="Level">
						<AdminInput
							id="level"
							onChange={(e) =>
								setForm((f) => ({ ...f, level: e.target.value }))
							}
							placeholder="Native"
							value={form.level}
						/>
					</AdminField>
					<AdminField label="Published">
						<AdminCheckbox
							checked={form.published}
							label="Visible on the public site"
							onChange={(checked) =>
								setForm((f) => ({ ...f, published: checked }))
							}
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

			{isError && !languages && (
				<AdminErrorState>
					Couldn't load languages - {queryError.message}
				</AdminErrorState>
			)}

			{!isLoading && languages?.length === 0 && (
				<AdminEmptyState>No languages yet.</AdminEmptyState>
			)}

			{!isLoading && languages && languages.length > 0 && (
				<SortableList ids={languages.map((r) => r.id)} onReorder={reorder}>
					<AdminList>
						{languages.map((row) => (
							<SortableRow id={row.id} key={row.id}>
								<AdminListRow
									actions={
										<>
											<AdminButton onClick={() => startEdit(row)} size="sm">
												<Pencil className="size-3.5" />
												Edit
											</AdminButton>
											<AdminButton
												onClick={() => {
													if (confirm(`Delete "${row.name}"?`)) {
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
								>
									<span className="font-display font-semibold text-foreground text-sm">
										{row.name}
									</span>
									<span className="ml-2 font-mono text-(--ink-4) text-xs">
										{row.level}
									</span>
									{!row.published && <AdminBadge>Unpublished</AdminBadge>}
								</AdminListRow>
							</SortableRow>
						))}
					</AdminList>
				</SortableList>
			)}
		</div>
	);
}
