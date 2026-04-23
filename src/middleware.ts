import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose/jwt/verify";

import { SESSION_COOKIE_NAME } from "@/lib/auth-token";

const PROTECTED = ["/clinical", "/constitution", "/knowledge", "/favorites", "/profile"];

function mustAuth(pathname: string) {
  return PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!mustAuth(pathname)) {
    return NextResponse.next();
  }

  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    console.error("[auth] 缺少至少 16 位 AUTH_SECRET，已拦截受保护功能页。请在 .env 中设置。");
    const login = new URL("/login", request.url);
    login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    const login = new URL("/login", request.url);
    login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }

  try {
    const key = new TextEncoder().encode(secret);
    await jwtVerify(token, key);
    return NextResponse.next();
  } catch {
    const login = new URL("/login", request.url);
    login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }
}

export const config = {
  matcher: [
    "/clinical",
    "/clinical/:path*",
    "/constitution",
    "/constitution/:path*",
    "/knowledge",
    "/knowledge/:path*",
    "/favorites",
    "/favorites/:path*",
    "/profile",
    "/profile/:path*",
  ],
};
