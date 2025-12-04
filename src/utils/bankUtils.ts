/**
 * 은행명 → 이미지 경로 매핑
 */
export const BANK_IMAGES: Record<string, string> = {
  "우리은행": "/images/bank1.png",
  "농협은행": "/images/bank2.png",
  "국민은행": "/images/bank3.png",
  "카카오뱅크": "/images/bank4.png",
  "신한은행": "/images/bank5.png",
  "하나은행": "/images/bank6.png",
  "기업은행": "/images/bank7.png",
  "토스뱅크": "/images/bank8.png",
  "새마을금고": "/images/bank9.png",
  "케이뱅크": "/images/bank10.png",
  "iM뱅크": "/images/bank11.png",
  "부산은행": "/images/bank12.png",
};

/**
 * 은행코드 → 은행명 매핑
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
  "050": "저축은행",
  "071": "우체국",
  "081": "하나은행",
  "088": "신한은행",
  "089": "케이뱅크",
  "090": "카카오뱅크",
};

/**
 * 은행명 → 은행코드 역매핑
 */
export const BANK_NAME_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(BANK_CODE_MAP).map(([code, name]) => [name, code])
);

/**
 * 은행코드를 은행명으로 변환합니다.
 * @param code 은행코드 (예: "004")
 * @returns 은행명 (예: "국민은행")
 */
export function getBankName(code: string): string {
  return BANK_CODE_MAP[code] || "기타은행";
}

/**
 * 은행명을 은행코드로 변환합니다.
 * @param name 은행명 (예: "국민은행")
 * @returns 은행코드 (예: "004"), 찾지 못하면 기본코드 "004" 반환
 */
export function getBankCode(name: string): string {
  const code = BANK_NAME_MAP[name];

  // 개발 환경에서는 미등록 은행명에 대해 경고 로그 출력
  if (!code && process.env.NODE_ENV === "development") {
    console.warn(`[getBankCode] 미등록 은행명: "${name}", 기본값 "004"(국민은행) 사용`);
  }

  return code || "004"; // 기본값: 국민은행(교육 시나리오 기본값)
}

