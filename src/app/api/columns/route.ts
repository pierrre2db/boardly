import { NextResponse } from "next/server";
import { createColumn } from "@/db/columns";
import { isColumnType } from "@/lib/columns/registry";
import { requireAdmin, isResponse } from "@/lib/authz";
import { readJson } from "@/lib/http";

export async function POST(req: Request) {
  const s = await requireAdmin(req); if (isResponse(s)) return s;
  const body = await readJson(req); if (isResponse(body)) return body;
  const { boardId, name, type } = body as { boardId: string; name?: string; type?: string };
  if (typeof type !== "string" || !isColumnType(type)) {
    return NextResponse.json({ error: "bad type" }, { status: 400 });
  }
  return NextResponse.json(await createColumn(boardId, name ?? "New column", type), { status: 201 });
}
