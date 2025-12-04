import { jwtDecode, JwtPayload } from "jwt-decode";

// accessToken이 만료되었는지 확인합니다.
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (typeof decoded.exp !== "number") {
      return true; // 만료 시간이 없으면 만료된 것으로 간주
    }
    // 3초의 여유를 두고 만료 처리
    return decoded.exp * 1000 < Date.now() + 3000;
  } catch (e) {
    return true; // 파싱 에러 시 만료로 간주
  }
}

