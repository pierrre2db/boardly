import { NextResponse } from "next/server";
import { createGroup } from "@/db/groups";
import { requireAdmin, isResponse } from "@/lib/authz";
import { readJson } from "@/lib/http";

export async function POST(req: Request) {
  const s = await requireAdmin(req); if (isResponse(s)) return s;
  const body = await readJson(req); if (isResponse(body)) return body;
  const { boardId, name } = body as { boardId: string; name?: string };
  return NextResponse.json(await createGroup(boardId, name ?? "New group"), { status: 201 });
}
