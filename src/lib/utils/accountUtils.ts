/**
 * 계좌번호를 포맷팅 (3-4-나머지 형식)
 * @param accountNumber 계좌번호 (숫자 또는 하이픈 포함)
 * @returns 포맷팅된 계좌번호 (예: "123-4567-890123")
 */
export function formatAccountNumber(accountNumber?: string | null): string {
  if (!accountNumber) return "-";

  // 숫자만 추출
  const numbers = accountNumber.replace(/[^0-9]/g, "");

  // 길이에 따라 포맷 적용
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
}

/**
 * 계좌번호에서 뒷자리 4자리 추출
 * @param accountNumber 계좌번호
 * @returns 뒷자리 4자리 (없으면 "0000")
 */
export function getAccountSuffix(accountNumber?: string | null): string {
  if (!accountNumber) {
    return "0000";
  }

  const numbers = accountNumber.replace(/[^0-9]/g, "");

  if (numbers.length < 4) {
    return numbers.padStart(4, "0");
  }

  return numbers.slice(-4);
}
