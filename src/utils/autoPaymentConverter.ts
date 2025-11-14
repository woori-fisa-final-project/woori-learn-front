import type { AutoPayment } from "@/types/autoPayment";
import type { EducationalAccount } from "@/types/account";
import type { Scenario18Detail } from "@/app/automaticpayment-scenario/components/Scenario18";
import { formatAccountNumber } from "@/utils/accountUtils";
import { getBankName } from "@/utils/bankUtils";
import { getCurrentUserName } from "@/utils/authUtils";

/**
 * AutoPayment를 Scenario18Detail로 변환하는 공통 유틸리티 함수
 *
 * @param payment - 변환할 AutoPayment 객체
 * @param sourceAccount - 출금 계좌 정보 (선택적)
 * @returns Scenario18Detail 객체
 */
export function convertToScenario18Detail(
  payment: AutoPayment,
  sourceAccount?: EducationalAccount
): Scenario18Detail {
  const statusMap = {
    ACTIVE: "정상",
    CANCELLED: "해지",
  };

  const formatDateRange = (startDate: string, expirationDate: string): string => {
    return `${startDate} ~ ${expirationDate}`;
  };

  const bankName = getBankName(payment.depositBankCode);
  const bankAccount = formatAccountNumber(payment.depositNumber);

  // 출금 계좌 정보가 있으면 사용, 없으면 기본값
  const ownerName = sourceAccount?.accountName || getCurrentUserName();
  const sourceAccountInfo = sourceAccount
    ? `우리은행 · ${formatAccountNumber(sourceAccount.accountNumber)}`
    : "우리은행 · -";

  return {
    status: statusMap[payment.processingStatus] || payment.processingStatus,
    title: payment.displayName || "자동이체",
    amount: `${payment.amount.toLocaleString()}원`,
    transferDay: `${payment.designatedDate}일`,
    frequency: `${payment.transferCycle}개월`,
    period: formatDateRange(payment.startDate, payment.expirationDate),
    ownerName: ownerName,
    recipientName: payment.counterpartyName,
    registerDate: payment.startDate, // 등록일 (API에 별도 필드가 없어 시작일 사용)
    sourceAccount: sourceAccountInfo,
    inboundAccount: `${bankName} · ${bankAccount}`,
  };
}
