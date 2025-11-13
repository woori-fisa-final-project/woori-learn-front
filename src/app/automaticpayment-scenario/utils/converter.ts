import type { AutoPayment } from "@/types/autoPayment";
import type { Scenario18Detail } from "../components/Scenario18";
import { formatAccountNumber } from "@/lib/utils/accountUtils";
import { getBankName } from "@/lib/utils/bankUtils";

/**
 * AutoPayment를 Scenario18Detail로 변환하는 공통 유틸리티 함수
 *
 * @param payment - 변환할 AutoPayment 객체
 * @returns Scenario18Detail 객체
 */
export function convertToScenario18Detail(payment: AutoPayment): Scenario18Detail {
  const statusMap = {
    ACTIVE: "정상",
    CANCELLED: "해지",
  };

  const formatDateRange = (startDate: string, expirationDate: string): string => {
    return `${startDate} ~ ${expirationDate}`;
  };

  const bankName = getBankName(payment.depositBankCode);
  const bankAccount = formatAccountNumber(payment.depositNumber);

  return {
    status: statusMap[payment.processingStatus] || payment.processingStatus,
    title: payment.displayName || "자동이체",
    amount: `${payment.amount.toLocaleString()}원`,
    transferDay: `${payment.designatedDate}일`,
    frequency: `${payment.transferCycle}개월`,
    period: formatDateRange(payment.startDate, payment.expirationDate),
    ownerName: "김우리", // TODO: 실제 계좌 소유자 이름 (인증 서버 연동 후)
    recipientName: payment.counterpartyName,
    registerDate: payment.startDate, // 등록일 (API에 별도 필드가 없어 시작일 사용)
    sourceAccount: "우리은행 · -", // TODO: 실제 출금 계좌 정보
    inboundAccount: `${bankName} · ${bankAccount}`,
  };
}
