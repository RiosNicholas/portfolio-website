import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
/**
 * Changing these invalidates every existing `ADMIN_PASSWORD_HASH` —
 * regenerate with `npm run auth:hash`. `maxmem` must exceed `128 * N * r`
 * (Node's 32MB default is not enough if `N` is raised to 32768).
 */
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

function derive(password: string, salt: Buffer): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		scrypt(password, salt, KEY_LENGTH, SCRYPT_PARAMS, (err, key) =>
			err ? reject(err) : resolve(key),
		);
	});
}

/**
 * Hashes a plaintext password into the storage format
 * `scrypt:<saltHex>:<keyHex>`. Used offline by `scripts/hash-password.ts` to
 * produce the value that goes into `ADMIN_PASSWORD_HASH`.
 */
export async function hashPassword(password: string): Promise<string> {
	const salt = randomBytes(SALT_LENGTH);
	const key = await derive(password, salt);
	return `scrypt:${salt.toString("hex")}:${key.toString("hex")}`;
}

/**
 * Verifies a plaintext password against a stored `scrypt:<salt>:<key>`
 * hash using a constant-time comparison. Never throws on malformed input —
 * always resolves `false` — so a corrupt/truncated hash can't surface as a
 * 500 instead of a failed login.
 */
export async function verifyPassword(
	password: string,
	stored: string,
): Promise<boolean> {
	const parts = stored.split(":");
	if (parts.length !== 3) return false;

	const [scheme, saltHex, keyHex] = parts;
	if (scheme !== "scrypt" || !saltHex || !keyHex) return false;

	const expected = Buffer.from(keyHex, "hex");
	// `Buffer.from(x, "hex")` truncates silently on malformed hex, and
	// `timingSafeEqual` throws on a length mismatch — guard first.
	if (expected.length !== KEY_LENGTH) return false;

	const salt = Buffer.from(saltHex, "hex");
	const actual = await derive(password, salt);

	return timingSafeEqual(actual, expected);
}
