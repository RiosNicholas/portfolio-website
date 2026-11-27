"use client";

import { useState } from "react";
import {
	AdminButton,
	AdminCard,
	AdminField,
	AdminInput,
	AdminLoading,
	AdminPageHeader,
	AdminTextarea,
} from "~/components/admin/admin-ui";
import { type ProfileInput, profileInput } from "~/server/api/schemas/profile";
import { api } from "~/trpc/react";

type ProfileField = {
	key: keyof ProfileInput;
	label: string;
	hint?: string;
	multiline?: boolean;
};

const fields: ProfileField[] = [
	{ key: "intro", label: "Intro" },
	{
		key: "summary",
		label: "Summary",
		multiline: true,
		hint: "Markdown. Separate paragraphs with a blank line.",
	},
	{
		key: "status",
		label: "Status",
		multiline: true,
		hint: "Wrap words in **double asterisks** to emphasize them. No other formatting.",
	},
	{ key: "city", label: "City" },
	{ key: "region", label: "Region" },
	{ key: "employer", label: "Employer" },
	{ key: "team", label: "Team" },
	{ key: "projectsLede", label: "Projects lede" },
	{ key: "writingLede", label: "Writing lede" },
	{ key: "contactLede", label: "Contact lede" },
];

export default function AdminProfilePage() {
	const { data, isLoading, isError, error } = api.profile.get.useQuery();

	return (
		<div>
			<AdminPageHeader
				description="Site copy for the About summary, the home bento grid and the Projects, Writing and Contact sections."
				title="Profile"
			/>

			{isLoading && <AdminLoading />}
			{isError && (
				<p className="font-mono text-(--destructive) text-xs">
					{error.message}
				</p>
			)}
			{data && <ProfileForm initial={data} />}
		</div>
	);
}

function ProfileForm({ initial }: { initial: ProfileInput }) {
	const utils = api.useUtils();
	const [form, setForm] = useState(initial);
	const [error, setError] = useState<string | null>(null);

	const update = api.profile.update.useMutation({
		onSuccess: () => utils.profile.get.invalidate(),
		onError: (e) => setError(e.message),
	});

	function submit() {
		setError(null);
		if (fields.some((f) => !form[f.key].trim())) {
			setError("Every field is required.");
			return;
		}
		update.mutate(form);
	}

	return (
		<AdminCard>
			<div className="flex flex-col gap-4">
				{fields.map((f) => {
					const onChange = (
						e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
					) => setForm((s) => ({ ...s, [f.key]: e.target.value }));
					return (
						<AdminField
							hint={f.hint}
							htmlFor={f.key}
							key={f.key}
							label={f.label}
						>
							{f.multiline ? (
								<AdminTextarea
									id={f.key}
									maxLength={profileInput.shape[f.key].maxLength ?? undefined}
									onChange={onChange}
									value={form[f.key]}
								/>
							) : (
								<AdminInput
									id={f.key}
									maxLength={profileInput.shape[f.key].maxLength ?? undefined}
									onChange={onChange}
									value={form[f.key]}
								/>
							)}
						</AdminField>
					);
				})}
			</div>
			{error && (
				<p className="mt-3 font-mono text-(--destructive) text-xs">{error}</p>
			)}
			<div className="mt-5 flex gap-2">
				<AdminButton
					disabled={update.isPending}
					onClick={submit}
					variant="primary"
				>
					Save changes
				</AdminButton>
			</div>
		</AdminCard>
	);
}
