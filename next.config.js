/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
	// Link Mention previews are hotlinked from any site (#63), so no host
	// list can cover them. Long cache so each image is fetched and resized
	// rarely, and keeps showing for a while if the site drops it.
	images: {
		remotePatterns: [{ protocol: "https", hostname: "**" }],
		minimumCacheTTL: 2678400, // 31 days, in seconds
	},
	// The Work page became Projects; keep old links and /work#<id> anchors alive.
	async redirects() {
		return [{ source: "/work", destination: "/projects", permanent: true }];
	},
	// Friendly save name for the resume; the URL stays lowercase and hyphenated.
	async headers() {
		return [
			{
				source: "/nicholas-rios-resume.pdf",
				headers: [
					{
						key: "Content-Disposition",
						value: 'inline; filename="Nicholas_Rios_Resume.pdf"',
					},
				],
			},
		];
	},
};

export default config;
