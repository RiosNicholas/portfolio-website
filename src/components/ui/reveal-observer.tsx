"use client";

import { useEffect } from "react";

export function RevealObserver() {
	useEffect(() => {
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						const delay = parseInt(
							(e.target as HTMLElement).dataset.delay ?? "0",
							10,
						);
						setTimeout(() => e.target.classList.add("in"), delay);
						io.unobserve(e.target);
					}
				}
			},
			{ threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
		);

		const observe = () => {
			document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
				io.observe(el);
			});
		};

		observe();

		// Re-observe after next paint to catch elements rendered after hydration
		const id = requestAnimationFrame(observe);

		return () => {
			cancelAnimationFrame(id);
			io.disconnect();
		};
	}, []);

	return null;
}
