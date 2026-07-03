"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
	const dotRef = useRef<HTMLDivElement>(null);
	const ringRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (matchMedia("(hover: none)").matches) return;

		const dot = dotRef.current;
		const ring = ringRef.current;
		if (!dot || !ring) return;

		let ringX = 0,
			ringY = 0;
		let mouseX = 0,
			mouseY = 0;
		let lastTrail = 0;
		let rafId: number;

		const onMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
			dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

			const target = e.target as Element;
			const isLink = target.closest("a, button, [role=button]");
			const isPhoto = target.closest("[data-cursor=photo]");
			const isText = target.closest("p, h1, h2, h3, h4, h5, h6");

			ring.classList.toggle("hover-link", !!isLink && !isPhoto);
			ring.classList.toggle("hover-photo", !!isPhoto);
			ring.classList.toggle("hover-text", !!isText && !isLink && !isPhoto);
			dot.classList.toggle("hover-photo", !!isPhoto);

			// Occasional trail
			const now = performance.now();
			if (now - lastTrail > 60 && Math.random() < 0.35) {
				lastTrail = now;
				const trail = document.createElement("div");
				trail.className = "cursor-trail";
				trail.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
				document.body.appendChild(trail);
				requestAnimationFrame(() => {
					trail.style.opacity = "0";
					trail.style.transform += " scale(3)";
				});
				setTimeout(() => trail.remove(), 700);
			}
		};

		const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

		const tick = () => {
			ringX = lerp(ringX, mouseX, 0.18);
			ringY = lerp(ringY, mouseY, 0.18);
			ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
			rafId = requestAnimationFrame(tick);
		};

		const onLeave = () => {
			dot.style.opacity = "0";
			ring.style.opacity = "0";
		};
		const onEnter = () => {
			dot.style.opacity = "1";
			ring.style.opacity = "1";
		};

		document.addEventListener("mousemove", onMove);
		document.addEventListener("mouseleave", onLeave);
		document.addEventListener("mouseenter", onEnter);
		rafId = requestAnimationFrame(tick);

		return () => {
			document.removeEventListener("mousemove", onMove);
			document.removeEventListener("mouseleave", onLeave);
			document.removeEventListener("mouseenter", onEnter);
			cancelAnimationFrame(rafId);
		};
	}, []);

	return (
		<>
			<div className="cursor-dot" ref={dotRef} />
			<div className="cursor-ring" ref={ringRef} />
		</>
	);
}
