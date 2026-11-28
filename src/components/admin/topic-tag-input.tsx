"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { AdminInput } from "~/components/admin/admin-ui";

/** One tag at a time with suggestions from existing tags. A tag that matches
 * an existing one case-insensitively takes its casing. */
export function AdminTopicTagInput({
	id,
	value,
	onChange,
	suggestions,
}: {
	id: string;
	value: string[];
	onChange: (tags: string[]) => void;
	suggestions: string[];
}) {
	const [draft, setDraft] = useState("");
	const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

	function commit() {
		const typed = draft.trim();
		const tag = suggestions.find((s) => same(s, typed)) ?? typed;
		if (tag && !value.some((t) => same(t, tag))) onChange([...value, tag]);
		setDraft("");
	}

	return (
		<div>
			{value.length > 0 && (
				<ul className="m-0 mb-2 flex list-none flex-wrap gap-1.5 p-0">
					{value.map((tag) => (
						<li
							className="inline-flex items-center gap-1 rounded-full bg-(--frosted-2) py-0.5 pr-1 pl-2.5 font-mono text-(--ink-2) text-xs"
							key={tag}
						>
							{tag}
							<button
								aria-label={`Remove ${tag}`}
								className="rounded-full p-1 hover:text-(--destructive)"
								onClick={() => onChange(value.filter((t) => t !== tag))}
								type="button"
							>
								<X className="size-3" />
							</button>
						</li>
					))}
				</ul>
			)}
			<AdminInput
				id={id}
				list={`${id}-suggestions`}
				onBlur={commit}
				onChange={(e) => setDraft(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === ",") {
						e.preventDefault();
						commit();
					}
				}}
				placeholder="Type a tag, then Enter"
				value={draft}
			/>
			<datalist id={`${id}-suggestions`}>
				{suggestions
					.filter((s) => !value.some((t) => same(t, s)))
					.map((s) => (
						<option key={s} value={s} />
					))}
			</datalist>
		</div>
	);
}
