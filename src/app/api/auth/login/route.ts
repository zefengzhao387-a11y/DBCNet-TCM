import { compare } from "bcryptjs";
import { NextResponse } from "next/server";

import { createSessionToken, MAX_AGE_S, SESSION_COOKIE_NAME } from "@/lib/auth-token";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { staffId?: string; password?: string };
  try {
    body = (await request.json()) as { staffId?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "请求体无效" }, { status: 400 });
  }

  const rawId = String(body.staffId ?? "").trim();
  const password = String(body.password ?? "");
  const staffId = rawId.toLowerCase();

  if (!staffId || !password) {
    return NextResponse.json({ error: "请输入工号与密码" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { staffId } });
  if (!user) {
    return NextResponse.json({ error: "工号或密码不正确" }, { status: 401 });
  }

  const ok = await compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "工号或密码不正确" }, { status: 401 });
  }

  const token = await createSessionToken({
    sub: user.id,
    staffId: user.staffId,
    displayName: user.displayName,
  });

  const res = NextResponse.json({
    user: {
      id: user.id,
      staffId: user.staffId,
      displayName: user.displayName,
    },
  });

  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE_S,
  });

  return res;
}
