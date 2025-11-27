export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    // JWT는 점(.)으로 3부분(Header.Payload.Signature) 구분
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    
    // exp는 초 단위, Date.now()는 밀리초 단위
    // 여유 있게 만료 10초 전이면 만료된 것으로 간주
    return decodedPayload.exp * 1000 < Date.now() + 10000;
  } catch (e) {
    return true; // 파싱 에러나면 만료된 셈 침
  }
}