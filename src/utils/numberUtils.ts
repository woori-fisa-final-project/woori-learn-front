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
 * "말일"을 99로 변환하는 특수 처리 포함
 *
 * @param str - 이체일자 문자열 (예: "15일", "말일")
 * @returns 이체일자 숫자 (1-31, 99), 유효하지 않으면 1
 *
 * @example
 * parseTransferDay("15일") // 15
 * parseTransferDay("말일") // 99 (백엔드에서 해당 월의 마지막 날로 변환)
 * parseTransferDay("") // 1
 *
 * @note
 * 말일(99)은 백엔드에서 실제 날짜로 변환됩니다.
 * - 2월: 28일 또는 29일
 * - 4,6,9,11월: 30일
 * - 1,3,5,7,8,10,12월: 31일
 */
export function parseTransferDay(str?: string): number {
  if (!str) return 1;

  // "말일"을 99로 처리 (백엔드에서 해당 월의 실제 마지막 날로 변환)
  if (str.includes("말일")) {
    return 99;
  }

  const match = str.match(/\d+/);
  return match ? parseInt(match[0]) : 1;
}
