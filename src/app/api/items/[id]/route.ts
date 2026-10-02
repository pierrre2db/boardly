import { NextResponse } from "next/server";
import { updateItem, deleteItem } from "@/db/items";
import { requireMember, isResponse } from "@/lib/authz";
import { readJson } from "@/lib/http";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await requireMember(req); if (isResponse(s)) return s;
  const { id } = await params;
  const body = await readJson(req); if (isResponse(body)) return body;
  return NextResponse.json(await updateItem(id, body as Parameters<typeof updateItem>[1]));
}
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await requireMember(req); if (isResponse(s)) return s;
  const { id } = await params;
  await deleteItem(id);
  return NextResponse.json({ ok: true });
}
