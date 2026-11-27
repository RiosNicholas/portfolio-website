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
import type { ProfileInput } from "~/server/api/schemas/profile";
import { api } from "~/trpc/react";

type ProfileField = {
	key: keyof ProfileInput;
	label: string;
	max: number;
	hint?: string;
	multiline?: boolean;
};

const fields: ProfileField[] = [
	{
		key: "summary",
		label: "Summary",
		max: 4000,
		multiline: true,
		hint: "Markdown. Separate paragraphs with a blank line.",
	},
	{
		key: "status",
		label: "Status",
		max: 160,
		multiline: true,
		hint: "Markdown. **Bold** text shows as emphasis.",
	},
	{ key: "city", label: "City", max: 60 },
	{ key: "region", label: "Region", max: 60 },
	{ key: "employer", label: "Employer", max: 80 },
	{ key: "team", label: "Team", max: 120 },
	{ key: "projectsLede", label: "Projects lede", max: 280 },
	{ key: "writingLede", label: "Writing lede", max: 280 },
	{ key: "contactLede", label: "Contact lede", max: 280 },
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
									maxLength={f.max}
									onChange={onChange}
									value={form[f.key]}
								/>
							) : (
								<AdminInput
									id={f.key}
									maxLength={f.max}
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
