import { NextResponse, type NextRequest } from "next/server";

const ADMIN_PREFIX = "/admin";
const ADMIN_PUBLIC = new Set(["/admin/signin", "/admin/signin/check"]);
const SESSION_COOKIE = "authjs.session-token";
const SECURE_SESSION_COOKIE = "__Secure-authjs.session-token";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith(ADMIN_PREFIX)) return NextResponse.next();
  if (ADMIN_PUBLIC.has(pathname)) return NextResponse.next();

  const hasSession =
    req.cookies.has(SESSION_COOKIE) || req.cookies.has(SECURE_SESSION_COOKIE);

  if (!hasSession) {
    const signin = new URL("/admin/signin", req.url);
    signin.searchParams.set("next", pathname);
    return NextResponse.redirect(signin);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
