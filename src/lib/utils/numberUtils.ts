/**
 * 문자열에서 숫자를 추출하는 유틸리티 함수
 *
 * @param str - 숫자를 포함한 문자열
 * @returns 추출된 숫자, 숫자가 없으면 0
 *
 * @example
 * parseNumber("3개월") // 3
 * parseNumber("15일") // 15
 * parseNumber("abc") // 0
 */
export function parseNumber(str?: string): number {
  if (!str) return 0;
  const match = str.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

/**
 * 이체일자 문자열을 숫자로 변환하는 함수
 * "말일"을 31로 변환하는 특수 처리 포함
 *
 * @param str - 이체일자 문자열 (예: "15일", "말일")
 * @returns 이체일자 숫자 (1-31), 유효하지 않으면 1
 *
 * @example
 * parseTransferDay("15일") // 15
 * parseTransferDay("말일") // 31
 * parseTransferDay("") // 1
 */
export function parseTransferDay(str?: string): number {
  if (!str) return 1;

  // "말일"을 특수 처리
  if (str.includes("말일")) {
    // TODO: 백엔드 API 명세 확인 필요
    // - 31: 일반적인 말일 표현
    // - 0: 일부 시스템에서 말일을 0으로 표현
    // - -1: 마지막 날을 음수로 표현하는 경우
    // - 99: 특수 코드로 말일을 표현하는 경우
    return 31;
  }

  const match = str.match(/\d+/);
  return match ? parseInt(match[0]) : 1;
}
