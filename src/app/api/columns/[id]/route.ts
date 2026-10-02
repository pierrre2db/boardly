import { NextResponse } from "next/server";
import { updateColumn, deleteColumn } from "@/db/columns";
import { requireAdmin, isResponse } from "@/lib/authz";
import { readJson } from "@/lib/http";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await requireAdmin(req); if (isResponse(s)) return s;
  const { id } = await params;
  const body = await readJson(req); if (isResponse(body)) return body;
  return NextResponse.json(await updateColumn(id, body as Parameters<typeof updateColumn>[1]));
}
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await requireAdmin(req); if (isResponse(s)) return s;
  const { id } = await params;
  await deleteColumn(id);
  return NextResponse.json({ ok: true });
}
