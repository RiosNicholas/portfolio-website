"use client";

import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
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
	AdminSelect,
	useFlash,
} from "~/components/admin/admin-ui";
import { months } from "~/components/admin/date-range";
import { AdminTopicTagInput } from "~/components/admin/topic-tag-input";
import { formatDateParts } from "~/lib/dates";
import {
	embedUrlFor,
	isShortLink,
	sourceFor,
	titleRequired,
} from "~/lib/sources";
import { useAnimationsEnabled } from "~/lib/use-animations-enabled";
import { MAX_DAY, mentionInput } from "~/server/api/schemas/mention";
import { api } from "~/trpc/react";

type MentionRow = {
	id: string;
	url: string;
	title: string | null;
	sourceName: string | null;
	imageUrl: string | null;
	year: number;
	month: number | null;
	day: number | null;
	topicTags: string[];
	published: boolean;
};

type FormState = {
	id: string | null;
	url: string;
	title: string;
	sourceName: string;
	year: string;
	month: string;
	day: string;
	topicTags: string[];
	/** The fetched or pasted image shown in the preview. */
	image: string;
	/** False keeps the server's image. True sends `image`, or null when empty. */
	imageTouched: boolean;
	published: boolean;
};

const emptyForm: FormState = {
	id: null,
	url: "",
	title: "",
	sourceName: "",
	year: String(new Date().getFullYear()),
	month: "",
	day: "",
	topicTags: [],
	image: "",
	imageTouched: false,
	published: true,
};

export default function AdminMentionsPage() {
	const utils = api.useUtils();
	const {
		data: mentions,
		isLoading,
		isError,
		error: queryError,
	} = api.mention.all.useQuery();
	const { data: tagSuggestions = [] } = api.mention.topicTags.useQuery();
	const [form, setForm] = useState<FormState>(emptyForm);
	const [error, setError] = useState<string | null>(null);
	const [saved, flash] = useFlash();
	const formRef = useRef<HTMLDivElement>(null);
	const animationsEnabled = useAnimationsEnabled();

	const invalidate = () =>
		Promise.all([
			utils.mention.all.invalidate(),
			utils.mention.topicTags.invalidate(),
		]);

	function startEdit(row: MentionRow) {
		setForm({
			id: row.id,
			url: row.url,
			title: row.title ?? "",
			sourceName: row.sourceName ?? "",
			year: String(row.year),
			month: row.month ? String(row.month) : "",
			day: row.day ? String(row.day) : "",
			topicTags: row.topicTags,
			image: row.imageUrl ?? "",
			imageTouched: false,
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
			url: form.url,
			title: form.title.trim() || null,
			sourceName: form.sourceName.trim() || null,
			imageUrl: form.imageTouched ? form.image.trim() || null : undefined,
			year: Number(form.year),
			month: form.month ? Number(form.month) : null,
			day: form.day ? Number(form.day) : null,
			topicTags: form.topicTags,
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

	const url = form.url.trim();
	const source = sourceFor(url);
	const embeds = embedUrlFor(url) !== null;
	const needsTitle = titleRequired(url);
	const sourceHint = !source
		? "The Source is recognized from the link."
		: isShortLink(url)
			? `${source.name} short link, resolved when you save`
			: `${source.name} - ${embeds ? "shown as an embed" : "shown as a link"}`;

	return (
		<div>
			<AdminPageHeader
				description="Links on the Writing page to work that lives on other sites, like a post you wrote elsewhere or an interview with you. Turn off Published to hide one."
				title="Mentions"
			/>

			<AdminCard className="mb-8" ref={formRef}>
				<h2 className="m-0 mb-4 font-display font-semibold text-foreground text-lg">
					{form.id ? `Edit mention - ${form.title || form.url}` : "Add mention"}
				</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<AdminField
						className="sm:col-span-2"
						hint={sourceHint}
						htmlFor="url"
						label="URL"
					>
						<AdminInput
							id="url"
							inputMode="url"
							onChange={(e) =>
								setForm((f) => ({
									...f,
									url: e.target.value,
									image: f.imageTouched ? f.image : "",
								}))
							}
							placeholder="https://..."
							value={form.url}
						/>
					</AdminField>
					<AdminField
						hint={
							needsTitle
								? undefined
								: "The embed shows the post, so a title is optional"
						}
						htmlFor="title"
						label={needsTitle ? "Title" : "Title (optional)"}
					>
						<AdminInput
							id="title"
							onChange={(e) =>
								setForm((f) => ({ ...f, title: e.target.value }))
							}
							value={form.title}
						/>
					</AdminField>
					{source && !source.known && (
						<AdminField
							hint="Shown instead of the domain"
							htmlFor="sourceName"
							label="Source name (optional)"
						>
							<AdminInput
								id="sourceName"
								onChange={(e) =>
									setForm((f) => ({ ...f, sourceName: e.target.value }))
								}
								placeholder={source.name}
								value={form.sourceName}
							/>
						</AdminField>
					)}
					<div className="grid grid-cols-3 gap-4 sm:col-span-2">
						<AdminField htmlFor="year" label="Year">
							<AdminInput
								id="year"
								inputMode="numeric"
								onChange={(e) =>
									setForm((f) => ({ ...f, year: e.target.value }))
								}
								type="number"
								value={form.year}
							/>
						</AdminField>
						<AdminField htmlFor="month" label="Month">
							<AdminSelect
								id="month"
								onChange={(e) =>
									setForm((f) => ({
										...f,
										month: e.target.value,
										day: e.target.value ? f.day : "",
									}))
								}
								value={form.month}
							>
								<option value="">No month</option>
								{months.map((name, i) => (
									<option key={name} value={i + 1}>
										{name}
									</option>
								))}
							</AdminSelect>
						</AdminField>
						<AdminField htmlFor="day" label="Day">
							<AdminInput
								disabled={!form.month}
								id="day"
								inputMode="numeric"
								max={MAX_DAY}
								min={1}
								onChange={(e) =>
									setForm((f) => ({ ...f, day: e.target.value }))
								}
								type="number"
								value={form.day}
							/>
						</AdminField>
					</div>
					<AdminField
						className="sm:col-span-2"
						htmlFor="topicTags"
						label="Topic tags"
					>
						<AdminTopicTagInput
							id="topicTags"
							onChange={(topicTags) => setForm((f) => ({ ...f, topicTags }))}
							suggestions={tagSuggestions}
							value={form.topicTags}
						/>
					</AdminField>
					{source && !embeds && (
						<AdminField className="sm:col-span-2" label="Preview image">
							{form.image && URL.canParse(form.image) ? (
								// 1.91:1 is the Open Graph image ratio
								<div className="relative aspect-[1.91/1] w-full max-w-sm overflow-hidden rounded-(--r-md) border border-border">
									<Image
										alt=""
										className="object-cover"
										fill
										sizes="24rem"
										src={form.image}
										unoptimized
									/>
								</div>
							) : (
								<p className="font-mono text-(--ink-3) text-xs">
									{form.imageTouched
										? "No image. The Writing page shows a text card."
										: "Fetched from the page when you save."}
								</p>
							)}
							{form.imageTouched && (
								<AdminInput
									className="mt-2"
									id="image"
									inputMode="url"
									onChange={(e) =>
										setForm((f) => ({ ...f, image: e.target.value }))
									}
									placeholder="https://... (empty for no image)"
									value={form.image}
								/>
							)}
							<div className="mt-2 flex gap-2">
								<AdminButton
									onClick={() => setForm((f) => ({ ...f, imageTouched: true }))}
									size="sm"
								>
									Replace
								</AdminButton>
								<AdminButton
									onClick={() =>
										setForm((f) => ({ ...f, image: "", imageTouched: true }))
									}
									size="sm"
									variant="danger"
								>
									Clear
								</AdminButton>
							</div>
						</AdminField>
					)}
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
											if (confirm(`Delete "${row.title ?? row.url}"?`)) {
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
									{row.title ?? sourceFor(row.url, row.sourceName)?.name}
								</span>
								{!row.published && <AdminBadge>Draft</AdminBadge>}
							</div>
							<div className="font-mono text-(--ink-3) text-xs">
								{sourceFor(row.url, row.sourceName)?.name} ·{" "}
								{formatDateParts(row.year, row.month, row.day)}
							</div>
						</AdminListRow>
					))}
				</AdminList>
			)}
		</div>
	);
}
