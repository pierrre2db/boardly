import { NextResponse } from "next/server";
import { listBoards, createBoard } from "@/db/boards";
import { requireAuth, requireAdmin, isResponse } from "@/lib/authz";
import { readJson } from "@/lib/http";

export async function GET(req: Request) {
  const s = await requireAuth(req); if (isResponse(s)) return s;
  return NextResponse.json(await listBoards());
}
export async function POST(req: Request) {
  const s = await requireAdmin(req); if (isResponse(s)) return s;
  const body = await readJson(req); if (isResponse(body)) return body;
  const { name } = body as { name?: string };
  if (!name?.trim()) return NextResponse.json({ error: "name required" }, { status: 400 });
  return NextResponse.json(await createBoard(name.trim()), { status: 201 });
}
