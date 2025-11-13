/**
 * 은행 코드와 은행명 매핑
 */
export const BANK_CODE_MAP: Record<string, string> = {
  "001": "한국은행",
  "002": "산업은행",
  "003": "기업은행",
  "004": "국민은행",
  "007": "수협은행",
  "011": "농협은행",
  "020": "우리은행",
  "023": "SC제일은행",
  "027": "한국씨티은행",
  "031": "대구은행",
  "032": "부산은행",
  "034": "광주은행",
  "035": "제주은행",
  "037": "전북은행",
  "039": "경남은행",
  "045": "새마을금고",
  "048": "신협",
  "050": "상호저축은행",
  "071": "우체국",
  "081": "하나은행",
  "088": "신한은행",
  "089": "케이뱅크",
  "090": "카카오뱅크",
};

/**
 * 은행명 → 은행 코드 역매핑
 */
export const BANK_NAME_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(BANK_CODE_MAP).map(([code, name]) => [name, code])
);

/**
 * 은행 코드를 은행명으로 변환
 * @param code 은행 코드 (예: "004")
 * @returns 은행명 (예: "국민은행")
 */
export function getBankName(code: string): string {
  return BANK_CODE_MAP[code] || "기타은행";
}

/**
 * 은행명을 은행 코드로 변환
 * @param name 은행명 (예: "국민은행")
 * @returns 은행 코드 (예: "004"), 찾지 못하면 우리은행 코드 "020" 반환
 *
 * NOTE: 기본값으로 "020"(우리은행)을 반환하는 것은 의도된 동작입니다.
 * 이 앱은 우리은행 교육용 앱이며, 대부분의 자동이체가 우리은행 계좌에서 출금됩니다.
 *
 * TODO: 프로덕션 환경에서는 다음 중 하나를 선택
 * 1. undefined 반환하여 호출자가 명시적으로 에러 처리
 * 2. Error throw하여 잘못된 은행명 입력 방지
 * 3. 기본값 유지하되 경고 로그 출력
 */
export function getBankCode(name: string): string {
  const code = BANK_NAME_MAP[name];

  // 개발 환경에서는 알 수 없는 은행명 경고
  if (!code && process.env.NODE_ENV === "development") {
    console.warn(`[getBankCode] 알 수 없는 은행명: "${name}", 기본값 "020"(우리은행) 사용`);
  }

  return code || "020"; // 기본값: 우리은행
}
