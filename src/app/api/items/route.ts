import { NextResponse } from "next/server";
import { createItem } from "@/db/items";
import { requireMember, isResponse } from "@/lib/authz";
import { readJson } from "@/lib/http";

export async function POST(req: Request) {
  const s = await requireMember(req); if (isResponse(s)) return s;
  const body = await readJson(req); if (isResponse(body)) return body;
  const { boardId, groupId, name } = body as { boardId: string; groupId: string; name?: string };
  return NextResponse.json(await createItem(boardId, groupId, name ?? "New item"), { status: 201 });
}
