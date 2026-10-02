import { NextResponse } from "next/server";
import { updateGroup, deleteGroup } from "@/db/groups";
import { requireAdmin, isResponse } from "@/lib/authz";
import { readJson } from "@/lib/http";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await requireAdmin(req); if (isResponse(s)) return s;
  const { id } = await params;
  const body = await readJson(req); if (isResponse(body)) return body;
  return NextResponse.json(await updateGroup(id, body as Parameters<typeof updateGroup>[1]));
}
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await requireAdmin(req); if (isResponse(s)) return s;
  const { id } = await params;
  await deleteGroup(id);
  return NextResponse.json({ ok: true });
}
