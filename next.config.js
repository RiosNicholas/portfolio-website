/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
	// The Work page became Projects; keep old links and /work#<id> anchors alive.
	async redirects() {
		return [{ source: "/work", destination: "/projects", permanent: true }];
	},
};

export default config;
