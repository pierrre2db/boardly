// @vitest-environment node
import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("password", () => {
  it("produces a salt:hash string different from the plaintext", async () => {
    const stored = await hashPassword("hunter2");
    expect(stored).toContain(":");
    expect(stored).not.toBe("hunter2");
  });

  it("verifies a correct password", async () => {
    const stored = await hashPassword("hunter2");
    expect(await verifyPassword("hunter2", stored)).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const stored = await hashPassword("hunter2");
    expect(await verifyPassword("wrong-password", stored)).toBe(false);
  });

  it("rejects a malformed stored value", async () => {
    expect(await verifyPassword("hunter2", "x")).toBe(false);
  });

  it("produces different hashes for the same password (random salt)", async () => {
    const a = await hashPassword("hunter2");
    const b = await hashPassword("hunter2");
    expect(a).not.toBe(b);
  });
});
