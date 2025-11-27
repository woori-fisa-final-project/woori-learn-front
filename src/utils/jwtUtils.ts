import { jwtDecode } from "jwt-decode";

export function isTokenExpired(token: string | null): boolean {
  // 토큰이 없으면 만료된 것으로 간주
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;
    return decoded.exp * 1000 < Date.now() + 10000;
  } catch (e) {
    return true; // 파싱 에러나면 만료된 셈 침
  }
}