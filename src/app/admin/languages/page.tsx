"use client";

import { useState } from "react";
import {
	AdminButton,
	AdminCard,
	AdminCheckbox,
	AdminEmptyState,
	AdminField,
	AdminInput,
	AdminPageHeader,
} from "~/components/admin/admin-ui";
import { api } from "~/trpc/react";

type FormState = {
	id: string | null;
	name: string;
	level: string;
	published: boolean;
	sortOrder: string;
};

const emptyForm: FormState = {
	id: null,
	name: "",
	level: "",
	published: true,
	sortOrder: "0",
};

export default function AdminLanguagesPage() {
	const utils = api.useUtils();
	const { data: languages, isLoading } = api.language.all.useQuery();
	const [form, setForm] = useState<FormState>(emptyForm);
	const [error, setError] = useState<string | null>(null);

	const invalidate = () => utils.language.all.invalidate();

	const createMutation = api.language.create.useMutation({
		onSuccess: () => {
			invalidate();
			setForm(emptyForm);
		},
		onError: (e) => setError(e.message),
	});
	const updateMutation = api.language.update.useMutation({
		onSuccess: () => {
			invalidate();
			setForm(emptyForm);
		},
		onError: (e) => setError(e.message),
	});
	const deleteMutation = api.language.delete.useMutation({
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
			name: form.name.trim(),
			level: form.level.trim(),
			published: form.published,
			sortOrder: Number.parseInt(form.sortOrder, 10) || 0,
		};
		if (!payload.name || !payload.level) {
			setError("Name and level are required.");
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
				description="The home page bento grid's Languages cell. `published` controls whether a row shows on the public site."
				title="Languages"
			/>

			<AdminCard className="mb-8">
				<h2 className="m-0 mb-4 font-display font-semibold text-foreground text-lg">
					{form.id ? "Edit language" : "Add language"}
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

			{!isLoading && languages?.length === 0 && (
				<AdminEmptyState>No languages yet.</AdminEmptyState>
			)}

			{!isLoading && languages && languages.length > 0 && (
				<div className="flex flex-col">
					{languages.map((row) => (
						<div
							className="flex items-center justify-between gap-4 border-border border-t py-3"
							key={row.id}
						>
							<div>
								<span className="font-display font-semibold text-foreground text-sm">
									{row.name}
								</span>
								<span className="ml-2 font-mono text-(--ink-4) text-xs">
									{row.level}
								</span>
								{!row.published && (
									<span className="ml-2 font-mono text-(--ink-4) text-xs uppercase tracking-wider">
										unpublished
									</span>
								)}
							</div>
							<div className="flex shrink-0 gap-2">
								<AdminButton
									onClick={() =>
										setForm({
											id: row.id,
											name: row.name,
											level: row.level,
											published: row.published,
											sortOrder: String(row.sortOrder),
										})
									}
								>
									Edit
								</AdminButton>
								<AdminButton
									onClick={() => {
										if (confirm(`Delete "${row.name}"?`))
											deleteMutation.mutate({ id: row.id });
									}}
									variant="danger"
								>
									Delete
								</AdminButton>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
