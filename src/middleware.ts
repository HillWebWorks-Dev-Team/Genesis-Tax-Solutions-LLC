import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "gts_admin_session";

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const secret = getSecret();
  if (!token || !secret) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const isPublicAuthRoute =
    pathname.startsWith("/admin/login") || pathname.startsWith("/admin/setup");

  const loggedIn = await hasValidSession(request);

  if (isPublicAuthRoute) {
    if (loggedIn) {
      return NextResponse.redirect(new URL("/admin/", request.url));
    }
    return NextResponse.next();
  }

  if (!loggedIn) {
    return NextResponse.redirect(new URL("/admin/login/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
