import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = jwtDecode<{ role: string }>(token);

    // /admin 경로 보호
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (decoded.role !== "ROLE_ADMIN") {
        return NextResponse.redirect(new URL("/home", req.url));
      }
    }
  } catch (error) {
    // 토큰 디코딩 실패 시 (유효하지 않은 토큰 등) 로그인 페이지로 리다이렉트
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/mypage/:path*"],
};
