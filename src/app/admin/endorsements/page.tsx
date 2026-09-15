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
	AdminTextarea,
} from "~/components/admin/admin-ui";
import { useAnimationsEnabled } from "~/lib/use-animations-enabled";
import { api } from "~/trpc/react";

type EndorsementRow = {
	id: string;
	name: string;
	role: string;
	quote: string;
	linkedinUrl: string;
	avatarUrl: string | null;
	published: boolean;
	sortOrder: number;
};

type FormState = {
	id: string | null;
	name: string;
	role: string;
	quote: string;
	linkedinUrl: string;
	avatarUrl: string;
	published: boolean;
	sortOrder: string;
};

const emptyForm: FormState = {
	id: null,
	name: "",
	role: "",
	quote: "",
	linkedinUrl: "",
	avatarUrl: "",
	published: true,
	sortOrder: "0",
};

export default function AdminEndorsementsPage() {
	const utils = api.useUtils();
	const {
		data: endorsements,
		isLoading,
		isError,
		error: queryError,
	} = api.endorsement.all.useQuery();
	const [form, setForm] = useState<FormState>(emptyForm);
	const [error, setError] = useState<string | null>(null);
	const formRef = useRef<HTMLDivElement>(null);
	const animationsEnabled = useAnimationsEnabled();

	const invalidate = () => utils.endorsement.all.invalidate();

	function startEdit(row: EndorsementRow) {
		setForm({
			id: row.id,
			name: row.name,
			role: row.role,
			quote: row.quote,
			linkedinUrl: row.linkedinUrl,
			avatarUrl: row.avatarUrl ?? "",
			published: row.published,
			sortOrder: String(row.sortOrder),
		});
		formRef.current?.scrollIntoView({
			behavior: animationsEnabled ? "smooth" : "auto",
			block: "start",
		});
	}

	const createMutation = api.endorsement.create.useMutation({
		onSuccess: () => {
			invalidate();
			setForm(emptyForm);
		},
		onError: (e) => setError(e.message),
	});
	const updateMutation = api.endorsement.update.useMutation({
		onSuccess: () => {
			invalidate();
			setForm(emptyForm);
		},
		onError: (e) => setError(e.message),
	});
	const deleteMutation = api.endorsement.delete.useMutation({
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
		const payload = {
			name: form.name.trim(),
			role: form.role.trim(),
			quote: form.quote.trim(),
			linkedinUrl: form.linkedinUrl.trim(),
			avatarUrl: form.avatarUrl.trim() || null,
			published: form.published,
			sortOrder: Number.parseInt(form.sortOrder, 10) || 0,
		};
		if (
			!payload.name ||
			!payload.role ||
			!payload.quote ||
			!payload.linkedinUrl
		) {
			setError("Name, role, quote, and LinkedIn URL are required.");
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
				description="Home page recommendation cards. Paste in real LinkedIn recommendations — leave `published` off to stage one before it goes live."
				title="Endorsements"
			/>

			<AdminCard className="mb-8" ref={formRef}>
				<h2 className="m-0 mb-4 font-display font-semibold text-foreground text-lg">
					{form.id ? `Edit endorsement — ${form.name}` : "Add endorsement"}
				</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<AdminField htmlFor="name" label="Name">
						<AdminInput
							id="name"
							onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
							value={form.name}
						/>
					</AdminField>
					<AdminField htmlFor="role" label="Role">
						<AdminInput
							id="role"
							onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
							placeholder="Eng Mgr · Fintech"
							value={form.role}
						/>
					</AdminField>
					<AdminField className="sm:col-span-2" htmlFor="quote" label="Quote">
						<AdminTextarea
							id="quote"
							onChange={(e) =>
								setForm((f) => ({ ...f, quote: e.target.value }))
							}
							value={form.quote}
						/>
					</AdminField>
					<AdminField htmlFor="linkedinUrl" label="LinkedIn URL">
						<AdminInput
							id="linkedinUrl"
							onChange={(e) =>
								setForm((f) => ({ ...f, linkedinUrl: e.target.value }))
							}
							placeholder="https://www.linkedin.com/in/..."
							value={form.linkedinUrl}
						/>
					</AdminField>
					<AdminField
						hint="Optional — falls back to initials"
						htmlFor="avatarUrl"
						label="Avatar URL"
					>
						<AdminInput
							id="avatarUrl"
							onChange={(e) =>
								setForm((f) => ({ ...f, avatarUrl: e.target.value }))
							}
							value={form.avatarUrl}
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
					<div className="flex items-end">
						<AdminCheckbox
							checked={form.published}
							label="Published"
							onChange={(published) => setForm((f) => ({ ...f, published }))}
						/>
					</div>
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
			{isError && (
				<AdminErrorState>
					Couldn't load endorsements — {queryError.message}
				</AdminErrorState>
			)}
			{!isLoading && !isError && endorsements?.length === 0 && (
				<AdminEmptyState>
					No endorsements yet — the 12 placeholder testimonials that used to
					live in `src/lib/endorsements.ts` were deliberately not migrated. Add
					real ones here.
				</AdminEmptyState>
			)}

			{!isLoading && !isError && endorsements && endorsements.length > 0 && (
				<AdminList>
					{endorsements.map((row) => (
						<AdminListRow
							actions={
								<>
									<AdminButton onClick={() => startEdit(row)} size="sm">
										<Pencil className="size-3.5" />
										Edit
									</AdminButton>
									<AdminButton
										onClick={() => {
											if (confirm(`Delete "${row.name}"?`))
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
									{row.name}
								</span>
								{!row.published && <AdminBadge>Draft</AdminBadge>}
							</div>
							<div className="max-w-md truncate font-mono text-(--ink-3) text-xs">
								{row.role} — &ldquo;{row.quote}&rdquo;
							</div>
						</AdminListRow>
					))}
				</AdminList>
			)}
		</div>
	);
}
