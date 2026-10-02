import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

// Password hashing using scrypt (Node's built-in, no extra dependency).
// Async (promisified) so hashing/verification never blocks the event loop.
// Stored format: "<saltHex>:<hashHex>" — identical to the sync version in
// scripts/bootstrap-admin.mjs, so hashes stay cross-compatible.
const scrypt = promisify(scryptCb);

export async function hashPassword(pw: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = (await scrypt(pw, salt, 64)) as Buffer;
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export async function verifyPassword(pw: string, stored: string): Promise<boolean> {
  const [s, h] = stored.split(":");
  if (!s || !h) return false;
  const hash = Buffer.from(h, "hex");
  const test = (await scrypt(pw, Buffer.from(s, "hex"), 64)) as Buffer;
  return hash.length === test.length && timingSafeEqual(hash, test);
}
