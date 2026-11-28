"use client";

import {
	AdminCheckbox,
	AdminField,
	AdminInput,
	AdminSelect,
} from "~/components/admin/admin-ui";
import type { DateForm } from "~/lib/dates";

export const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export function AdminDateRange({
	value,
	onChange,
}: {
	value: DateForm;
	onChange: (value: DateForm) => void;
}) {
	return (
		<div className="flex flex-col gap-4">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div className="grid grid-cols-2 gap-4">
					<AdminField htmlFor="startMonth" label="Start month">
						<AdminSelect
							id="startMonth"
							onChange={(e) =>
								onChange({ ...value, startMonth: e.target.value })
							}
							value={value.startMonth}
						>
							<option value="">No month</option>
							{months.map((name, i) => (
								<option key={name} value={i + 1}>
									{name}
								</option>
							))}
						</AdminSelect>
					</AdminField>
					<AdminField htmlFor="startYear" label="Start year">
						<AdminInput
							id="startYear"
							inputMode="numeric"
							onChange={(e) =>
								onChange({ ...value, startYear: e.target.value })
							}
							type="number"
							value={value.startYear}
						/>
					</AdminField>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<AdminField htmlFor="endMonth" label="End month">
						<AdminSelect
							disabled={value.present}
							id="endMonth"
							onChange={(e) => onChange({ ...value, endMonth: e.target.value })}
							value={value.endMonth}
						>
							<option value="">No month</option>
							{months.map((name, i) => (
								<option key={name} value={i + 1}>
									{name}
								</option>
							))}
						</AdminSelect>
					</AdminField>
					<AdminField htmlFor="endYear" label="End year">
						<AdminInput
							disabled={value.present}
							id="endYear"
							inputMode="numeric"
							onChange={(e) => onChange({ ...value, endYear: e.target.value })}
							type="number"
							value={value.endYear}
						/>
					</AdminField>
				</div>
			</div>
			<AdminCheckbox
				checked={value.present}
				label="Present"
				onChange={(present) => onChange({ ...value, present })}
			/>
		</div>
	);
}
