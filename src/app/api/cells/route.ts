import { NextResponse } from "next/server";
import { setCell } from "@/db/cells";
import { requireMember, isResponse } from "@/lib/authz";
import { readJson } from "@/lib/http";

export async function PUT(req: Request) {
  const s = await requireMember(req); if (isResponse(s)) return s;
  const body = await readJson(req); if (isResponse(body)) return body;
  const { itemId, columnId, value } = body as { itemId: string; columnId: string; value?: Record<string, unknown> };
  try {
    return NextResponse.json(await setCell(itemId, columnId, value ?? {}));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
