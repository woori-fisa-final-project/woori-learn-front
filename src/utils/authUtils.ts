/**
 * 인증 관련 유틸리티 함수
 *
 * TODO: 인증 서버 완료 후 이 파일을 수정하여 실제 로그인된 사용자 ID를 반환하도록 변경
 * - localStorage나 Context에서 실제 사용자 정보 가져오기
 * - JWT 토큰 디코딩하여 사용자 ID 추출
 * - 세션 스토리지 활용 등
 */

const TEMP_USER_ID = 1;

/**
 * 현재 로그인된 사용자의 ID를 반환합니다.
 *
 * @returns {number} 사용자 ID
 *
 * @example
 * const userId = getCurrentUserId();
 * const accounts = await getAccountList(userId);
 */
export function getCurrentUserId(): number {
  // TODO: 인증 서버 연동 후 실제 로그인된 사용자 ID 반환
  // 예시:
  // const user = JSON.parse(localStorage.getItem('user') || '{}');
  // return user.id;

  return TEMP_USER_ID;
}

/**
 * 사용자가 로그인되어 있는지 확인합니다.
 *
 * @returns {boolean} 로그인 여부
 */
export function isAuthenticated(): boolean {
  // TODO: 인증 서버 연동 후 실제 인증 상태 확인
  // 예시:
  // const token = localStorage.getItem('accessToken');
  // return !!token;

  return true; // 현재는 항상 인증된 것으로 간주
}

/**
 * 현재 로그인된 사용자의 이름을 반환합니다.
 *
 * @returns {string} 사용자 이름
 */
export function getCurrentUserName(): string {
  // TODO: 인증 서버 연동 후 실제 사용자 이름 반환
  if (typeof window !== "undefined") {
    const savedName = localStorage.getItem("userName");
    if (savedName) return savedName;
  }

  return "김우리"; // 기본값
}
