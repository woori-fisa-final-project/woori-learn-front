import { jwtDecode, JwtPayload } from "jwt-decode";

export function isTokenExpired(token: string | null): boolean {
  // 토큰이 없으면 만료된 것으로 간주
  if (!token) return true;

  try {
    const decoded = jwtDecode<JwtPayload>(token);  // 토큰 디코딩
    if (typeof decoded.exp !== 'number') {
      return true; // 만료 시간 정보가 없으면 만료된 것으로 간주
    }
    return decoded.exp * 1000 < Date.now() + 3000;  // 만료 시간과 현재 시간 비교
  } catch (e) {
    return true; // 파싱 에러나면 만료된 셈 침
  }
}