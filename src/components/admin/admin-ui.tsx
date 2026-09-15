"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import type {
	ButtonHTMLAttributes,
	InputHTMLAttributes,
	SelectHTMLAttributes,
	TextareaHTMLAttributes,
} from "react";
import { cn } from "~/lib/utils";

/** Small set of styled form primitives for `/admin`'s CRUD pages. Not a
 * general-purpose library — built to match the site's existing design
 * tokens (`--paper-2`/`--border`/`--r-md`/`--cta-bg`, `font-mono` labels)
 * rather than pulling in an unstyled default form kit. */

export function AdminLabel({
	children,
	htmlFor,
}: {
	children: React.ReactNode;
	htmlFor?: string;
}) {
	return (
		<label
			className="mb-1.5 block font-medium font-mono text-(--ink-3) text-xs uppercase tracking-wider"
			htmlFor={htmlFor}
		>
			{children}
		</label>
	);
}

const fieldCls =
	"w-full rounded-(--r-md) border border-(--border-2) bg-(--paper-2) px-3 py-2 font-sans text-foreground text-sm outline-none transition-colors placeholder:text-(--ink-4) focus-visible:border-(--accent)";

export function AdminInput(props: InputHTMLAttributes<HTMLInputElement>) {
	const { className, ...rest } = props;
	return <input className={cn(fieldCls, className)} {...rest} />;
}

export function AdminTextarea(
	props: TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
	const { className, ...rest } = props;
	return (
		<textarea
			className={cn(fieldCls, "min-h-24 resize-y", className)}
			{...rest}
		/>
	);
}

export function AdminSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
	const { className, ...rest } = props;
	return (
		<div className="relative">
			<select
				className={cn(
					fieldCls,
					"scheme-light dark:scheme-dark cursor-pointer appearance-none pr-9",
					className,
				)}
				{...rest}
			/>
			<ChevronDown
				aria-hidden="true"
				className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-(--ink-3)"
			/>
		</div>
	);
}

export function AdminField({
	label,
	htmlFor,
	children,
	hint,
	className,
}: {
	label: string;
	htmlFor?: string;
	children: React.ReactNode;
	hint?: string;
	className?: string;
}) {
	return (
		<div className={className}>
			<AdminLabel htmlFor={htmlFor}>{label}</AdminLabel>
			{children}
			{hint && <p className="mt-1 font-mono text-(--ink-4) text-xs">{hint}</p>}
		</div>
	);
}

export function AdminCheckbox({
	label,
	checked,
	onChange,
}: {
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
}) {
	return (
		<label className="flex cursor-pointer items-center gap-2 font-medium font-sans text-foreground text-sm">
			<input
				checked={checked}
				className="size-4 accent-(--accent)"
				onChange={(e) => onChange(e.target.checked)}
				type="checkbox"
			/>
			{label}
		</label>
	);
}

type ButtonVariant = "primary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

const buttonVariants: Record<ButtonVariant, string> = {
	primary:
		"bg-(--cta-bg) text-(--cta-ink) shadow-(--shadow-pop) hover:bg-(--cta-bg-hover) hover:-translate-y-0.5",
	ghost:
		"border border-(--border-2) bg-(--frosted) text-foreground hover:bg-(--frosted-2)",
	danger:
		"border border-(--border-2) bg-transparent text-(--destructive) hover:border-(--destructive) hover:bg-red-500/10",
};

const buttonSizes: Record<ButtonSize, string> = {
	sm: "px-3 py-1.5 text-xs",
	md: "px-4 py-2 text-sm",
};

export function AdminButton({
	variant = "ghost",
	size = "md",
	className,
	...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant;
	size?: ButtonSize;
}) {
	return (
		<button
			className={cn(
				"inline-flex items-center gap-1.5 whitespace-nowrap rounded-(--r-md) font-display font-semibold tracking-tight transition duration-200 ease-out disabled:pointer-events-none disabled:opacity-50",
				buttonSizes[size],
				buttonVariants[variant],
				className,
			)}
			type="button"
			{...props}
		/>
	);
}

export function AdminCard({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"rounded-(--r-lg) border border-border bg-(--paper-2) p-5 shadow-(--shadow-card)",
				className,
			)}
		>
			{children}
		</div>
	);
}

export function AdminList({ children }: { children: React.ReactNode }) {
	return <div className="flex flex-col gap-2">{children}</div>;
}

export function AdminListRow({
	children,
	actions,
}: {
	children: React.ReactNode;
	actions?: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-3 rounded-(--r-md) border border-border bg-(--paper-2) px-4 py-3 shadow-(--shadow-card) transition duration-200 ease-out hover:border-(--border-2) hover:shadow-(--shadow-pop) sm:flex-row sm:items-center sm:justify-between sm:gap-4">
			<div className="min-w-0 flex-1">{children}</div>
			<div className="flex shrink-0 gap-2">{actions}</div>
		</div>
	);
}

type BadgeTone = "accent" | "muted";

const badgeTones: Record<BadgeTone, string> = {
	accent: "bg-(--accent) text-(--marker-ink)",
	muted: "bg-(--frosted-2) text-(--ink-3)",
};

export function AdminBadge({
	children,
	tone = "muted",
}: {
	children: React.ReactNode;
	tone?: BadgeTone;
}) {
	return (
		<span
			className={cn(
				"inline-flex shrink-0 items-center rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
				badgeTones[tone],
			)}
		>
			{children}
		</span>
	);
}

export function AdminSectionLabel({ children }: { children: React.ReactNode }) {
	return (
		<h2 className="mb-3 font-medium font-mono text-(--accent-text) text-xs uppercase tracking-wider">
			{children}
		</h2>
	);
}

export function AdminLoading() {
	return <p className="font-mono text-(--ink-3) text-sm">Loading…</p>;
}

export function AdminPageHeader({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div className="mb-8">
			<Link
				className="inline-flex items-center gap-1.5 font-medium font-mono text-(--ink-3) text-xs uppercase tracking-wider hover:text-(--accent-text)"
				href="/admin"
			>
				← Admin
			</Link>
			<h1 className="mt-3 mb-0 font-display font-semibold text-3xl text-foreground leading-none tracking-tighter md:text-4xl">
				{title}
			</h1>
			<p className="mt-2 max-w-prose font-normal font-sans text-(--ink-2) text-sm leading-relaxed">
				{description}
			</p>
		</div>
	);
}

export function AdminEmptyState({ children }: { children: React.ReactNode }) {
	return (
		<p className="rounded-(--r-lg) border border-(--border) border-dashed p-6 text-center font-mono text-(--ink-3) text-sm">
			{children}
		</p>
	);
}
