/**
 * CLI to generate an `ADMIN_PASSWORD_HASH` value for `.env`. Run via
 * `npm run auth:hash`. Imports the real `hashPassword()` so the generated
 * hash can never drift from what `src/server/auth/config.ts` verifies
 * against at sign-in.
 */
import { createInterface } from "node:readline/promises";
import { hashPassword } from "../src/server/auth/password";

async function main() {
	const rl = createInterface({ input: process.stdin, output: process.stdout });
	console.log(
		"Note: your input will echo on screen — make sure nobody's watching.",
	);
	const password = await rl.question("Admin password: ");
	rl.close();

	if (!password) {
		console.error("Password cannot be empty.");
		process.exit(1);
	}

	const hash = await hashPassword(password);
	console.log("\nPaste this into .env (and your Vercel project env vars):\n");
	console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
	console.log(
		"\nRemember: .env is gitignored — this hash must also be set as a",
		"Vercel project environment variable separately before deploying.",
	);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
