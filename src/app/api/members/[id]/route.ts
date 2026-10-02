import { NextResponse } from "next/server";
import { deleteMemberAndUnassign, updateMember } from "@/db/members";
import { requireAdmin, isResponse } from "@/lib/authz";
import { readJson } from "@/lib/http";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await requireAdmin(req); if (isResponse(s)) return s;
  const { id } = await params;
  await deleteMemberAndUnassign(id);
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await requireAdmin(req); if (isResponse(s)) return s;
  const { id } = await params;
  const body = await readJson(req); if (isResponse(body)) return body;
  const { name, email, avatarColor, role, active, password } = body as {
    name?: string; email?: string; avatarColor?: string; role?: string; active?: boolean; password?: string;
  };
  try {
    const updated = await updateMember(id, { name, email, avatarColor, role, active, password });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
