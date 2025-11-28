/**
 * 계좌 관련 상수 정의
 */

/**
 * 백엔드 API에서 사용하는 계좌 타입
 */
export const ACCOUNT_TYPE = {
  CHECKING: "CHECKING", // 입출금 계좌
  SAVINGS: "SAVINGS", // 예적금 계좌
  DEPOSIT: "DEPOSIT", // 적금 계좌 (현재 미사용)
} as const;

/**
 * 프론트엔드에서 사용하는 계좌 타입 (UI 표시용)
 * ACCOUNT_TYPE과 용어 일관성 유지
 */
export const ACCOUNT_DISPLAY_TYPE = {
  CHECKING: "deposit", // 입출금 (UI 표시)
  SAVINGS: "savings", // 예적금 (UI 표시)
} as const;

/**
 * 계좌 타입별 한글 명칭
 */
export const ACCOUNT_TYPE_LABEL = {
  [ACCOUNT_TYPE.CHECKING]: "WON통장",
  [ACCOUNT_TYPE.SAVINGS]: "WON적금통장",
  [ACCOUNT_TYPE.DEPOSIT]: "WON적금통장", // fallback (현재 미사용)
} as const;

/**
 * 계좌 타입별 이체 가능 여부 메시지
 */
export const ACCOUNT_TRANSFER_DISABLED_MESSAGE = {
  [ACCOUNT_TYPE.CHECKING]: "예적금 계좌에서는 이체를 이용할 수 있습니다.",
  [ACCOUNT_TYPE.SAVINGS]: "적금 계좌에서는 이체를 이용할 수 없습니다.",
  [ACCOUNT_TYPE.DEPOSIT]: "적금 계좌에서는 이체를 이용할 수 없습니다.",
} as const;

/**
 * accountType이 유효한지 확인하는 타입 가드
 * in 연산자를 사용하여 타입 안전성 향상
 */
export function isValidAccountType(
  type: unknown
): type is keyof typeof ACCOUNT_TYPE_LABEL {
  return typeof type === "string" && type in ACCOUNT_TYPE_LABEL;
}

/**
 * 계좌 타입이 이체 가능한지 확인
 */
export function isTransferAvailable(accountType: (typeof ACCOUNT_TYPE)[keyof typeof ACCOUNT_TYPE]): boolean {
  return accountType === ACCOUNT_TYPE.CHECKING;
}
