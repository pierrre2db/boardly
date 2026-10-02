import { NextResponse } from "next/server";
import { SESSION_COOKIE, signSession } from "@/lib/session";
import { getMemberByEmail } from "@/db/members";
import { verifyPassword } from "@/lib/password";
import { isResponse } from "@/lib/authz";
import { readJson } from "@/lib/http";
import { rateLimit, rateLimitReset, clientIp } from "@/lib/ratelimit";

const INVALID_CREDENTIALS = "Email ou mot de passe invalide";
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 5 * 60_000;

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rlKey = `login:${ip}`;
  const rl = rateLimit(rlKey, MAX_ATTEMPTS, WINDOW_MS);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez plus tard." },
      { status: 429, headers: { "retry-after": String(rl.retryAfter) } },
    );
  }

  const body = await readJson(req); if (isResponse(body)) return body;
  const { email, password } = body as { email?: unknown; password?: unknown };

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: INVALID_CREDENTIALS }, { status: 401 });
  }

  const member = await getMemberByEmail(email);
  if (!member || !member.active || !(await verifyPassword(password, member.passwordHash))) {
    return NextResponse.json({ error: INVALID_CREDENTIALS }, { status: 401 });
  }

  rateLimitReset(rlKey); // successful login — don't penalize this client's next attempts
  const token = await signSession(process.env.SESSION_SECRET!, { uid: member.id, role: member.role });
  const res = NextResponse.json({
    ok: true,
    user: { id: member.id, name: member.name, email: member.email, role: member.role },
  });
  res.cookies.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
