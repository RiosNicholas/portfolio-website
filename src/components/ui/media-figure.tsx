import Image from "next/image";

import type { Media } from "~/lib/media";
import { cn } from "~/lib/utils";

export function MediaFigure({
	media,
	className,
	priority,
	sizes,
}: {
	media: Media;
	className?: string;
	priority?: boolean;
	sizes: string;
}) {
	return (
		<figure className={cn("m-0", className)}>
			<Image
				alt={media.alt}
				className="h-auto w-full rounded-3xl bg-surface"
				height={media.height}
				priority={priority}
				sizes={sizes}
				src={media.src}
				width={media.width}
			/>
			{media.caption && (
				<figcaption className="mt-3 text-body text-ink-muted">
					{media.caption}
				</figcaption>
			)}
		</figure>
	);
}
