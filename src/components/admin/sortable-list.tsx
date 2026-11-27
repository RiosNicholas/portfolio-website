"use client";

import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

/** A vertical list whose `SortableRow` children reorder by drag or keyboard.
 * `onReorder` gets every id in the new order. */
export function SortableList({
	ids,
	onReorder,
	children,
}: {
	ids: string[];
	onReorder: (ids: string[]) => void;
	children: React.ReactNode;
}) {
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);
	return (
		<DndContext
			collisionDetection={closestCenter}
			onDragEnd={({ active, over }) => {
				if (!over || active.id === over.id) return;
				onReorder(
					arrayMove(
						ids,
						ids.indexOf(String(active.id)),
						ids.indexOf(String(over.id)),
					),
				);
			}}
			sensors={sensors}
		>
			<SortableContext items={ids} strategy={verticalListSortingStrategy}>
				{children}
			</SortableContext>
		</DndContext>
	);
}

export function SortableRow({
	id,
	children,
}: {
	id: string;
	children: React.ReactNode;
}) {
	const {
		attributes,
		listeners,
		setActivatorNodeRef,
		setNodeRef,
		transform,
		transition,
	} = useSortable({ id });
	return (
		<div
			className="flex items-stretch gap-2"
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
		>
			<button
				aria-label="Drag to reorder"
				className="flex w-8 shrink-0 cursor-grab touch-none items-center justify-center text-(--ink-3) hover:text-foreground"
				ref={setActivatorNodeRef}
				type="button"
				{...attributes}
				{...listeners}
			>
				<GripVertical className="size-4" />
			</button>
			<div className="min-w-0 flex-1">{children}</div>
		</div>
	);
}
