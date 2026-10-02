import { NextResponse } from "next/server";

// Parse a JSON request body, returning a 400 NextResponse on malformed/empty
// input instead of letting req.json() throw into a generic 500.
// Mirrors the authz-guard style: `const body = await readJson(req); if (isResponse(body)) return body;`
export async function readJson(req: Request): Promise<unknown | NextResponse> {
  try {
    return await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }
}
