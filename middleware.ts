import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  //   // /admin 경로 보호
  //   if (req.nextUrl.pathname.startsWith("/admin")) {
  //     if (decoded.role !== "ROLE_ADMIN") {
  //       return NextResponse.redirect(new URL("/home", req.url));
  //     }
  //   }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/mypage/:path*"],
};
