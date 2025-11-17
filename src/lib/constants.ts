/**
 * 자동이체 관련 상수
 */
export const AUTO_PAYMENT = {
  MAX_AMOUNT: 5000000, // 자동이체 최대 금액 (5백만원)
  PAGE_SIZE: 100, // 페이지네이션 시 한 번에 조회할 항목 수
} as const;

/**
 * 에러 메시지
 */
export const ERROR_MESSAGES = {
  AMOUNT_EXCEEDED: `자동이체는 최대 ${AUTO_PAYMENT.MAX_AMOUNT.toLocaleString()}원까지\n등록 가능합니다.`,
  ACCOUNT_NOT_FOUND: "계좌 정보를 찾을 수 없습니다.\n처음부터 다시 진행해주세요.",
  REGISTRATION_FAILED: "자동이체 등록에 실패했습니다.\n다시 시도해주세요.",
} as const;
