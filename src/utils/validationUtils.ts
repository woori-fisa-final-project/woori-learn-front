import { AUTO_PAYMENT, ERROR_MESSAGES } from "@/lib/constants";

/**
 * 금액 검증 결과 타입
 */
export interface AmountValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * 자동이체 금액이 유효한지 검증하는 함수
 *
 * @param amount - 검증할 금액
 * @returns 검증 결과 객체 { isValid, errorMessage }
 *
 * @example
 * const result = validateAutoPaymentAmount(6000000);
 * if (!result.isValid) {
 *   console.log(result.errorMessage); // "자동이체는 최대 5,000,000원까지\n등록 가능합니다."
 * }
 */
export function validateAutoPaymentAmount(amount: number): AmountValidationResult {
  if (amount > AUTO_PAYMENT.MAX_AMOUNT) {
    return {
      isValid: false,
      errorMessage: ERROR_MESSAGES.AMOUNT_EXCEEDED,
    };
  }

  return { isValid: true };
}
