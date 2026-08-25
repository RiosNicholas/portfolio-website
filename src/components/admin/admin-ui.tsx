"use client";

import Link from "next/link";
import type {
	ButtonHTMLAttributes,
	InputHTMLAttributes,
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

const buttonVariants: Record<ButtonVariant, string> = {
	primary:
		"bg-(--cta-bg) text-(--cta-ink) shadow-(--shadow-pop) hover:bg-(--cta-bg-hover) hover:-translate-y-0.5",
	ghost:
		"border border-(--border-2) bg-transparent text-foreground hover:bg-(--frosted)",
	danger:
		"border border-(--border-2) bg-transparent text-(--destructive) hover:bg-red-500/10",
};

export function AdminButton({
	variant = "ghost",
	className,
	...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
	return (
		<button
			className={cn(
				"inline-flex items-center gap-1.5 whitespace-nowrap rounded-(--r-md) px-4 py-2 font-display font-semibold text-sm tracking-tight transition duration-200 ease-out disabled:pointer-events-none disabled:opacity-50",
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
