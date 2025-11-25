import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 프론트 측면에서 보안을 검증하면 안되므로 서버에서 이미 검증된 값을 넘겨줌
export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // // admin 경로 보호
  // if (req.nextUrl.pathname.startsWith("/admin")) {
  //   if (decoded.role !== "ROLE_ADMIN") {
  //     return NextResponse.redirect(new URL("/home", req.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/mypage/:path*"],
};
