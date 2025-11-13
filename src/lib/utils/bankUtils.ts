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
 */
export function getBankCode(name: string): string {
  return BANK_NAME_MAP[name] || "020"; // 기본값: 우리은행
}
