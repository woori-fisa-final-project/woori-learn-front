import { useState, useRef } from "react";
import { createAutoPayment } from "@/lib/api/autoPayment";
import type { EducationalAccount } from "@/types/account";
import type { ScheduleSummary } from "@/app/automaticpayment-scenario/components/types";
import { getBankCode } from "@/utils/bankUtils";
import { parseNumber, parseTransferDay } from "@/utils/numberUtils";
import { devError } from "@/utils/logger";

const MAX_AMOUNT = 5000000; // 자동이체 최대 금액 (5백만원)

/**
 * 자동이체 등록 관련 로직을 관리하는 커스텀 훅
 */
export function useAutoPaymentRegistration() {
  const [scheduleSummary, setScheduleSummary] = useState<ScheduleSummary | null>(null);
  const [isPasswordSheetOpen, setPasswordSheetOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const accountPasswordRef = useRef<string>("");

  const handleScheduleComplete = (options: ScheduleSummary) => {
    setScheduleSummary(options);
    setPasswordSheetOpen(true);
  };

  const handlePasswordSuccess = (password: string) => {
    accountPasswordRef.current = password;
    setPasswordSheetOpen(false);
  };

  const handlePasswordClose = () => {
    setPasswordSheetOpen(false);
  };

  const registerAutoPayment = async (
    selectedAccount: EducationalAccount | null,
    selectedBank: string | null,
    accountNumber: string,
    recipientName: string,
    amount: number
  ) => {
    if (!scheduleSummary) {
      devError("[registerAutoPayment] 일정 정보가 없습니다.");
      return false;
    }

    if (!selectedAccount) {
      setErrorMessage("계좌 정보를 찾을 수 없습니다.\n처음부터 다시 진행해주세요.");
      return false;
    }

    // 5백만원 초과 체크
    if (amount > MAX_AMOUNT) {
      setErrorMessage(`자동이체는 최대 ${MAX_AMOUNT.toLocaleString()}원까지\n등록 가능합니다.`);
      return false;
    }

    try {
      // frequency와 transferDay에서 숫자 추출
      const transferCycle = parseNumber(scheduleSummary.frequency);
      const designatedDate = parseTransferDay(scheduleSummary.transferDay);

      // API 호출
      await createAutoPayment({
        educationalAccountId: selectedAccount.id,
        depositBankCode: getBankCode(selectedBank || "국민은행"),
        depositNumber: accountNumber || "",
        amount: amount,
        counterpartyName: recipientName || "받는 분",
        displayName: "타행자동이체",
        transferCycle: transferCycle,
        designatedDate: designatedDate,
        startDate: scheduleSummary.startDate,
        expirationDate: scheduleSummary.endDate,
        accountPassword: accountPasswordRef.current,
      });

      // 성공 시 비밀번호 초기화 (보안)
      accountPasswordRef.current = "";
      return true;
    } catch (error) {
      devError("[registerAutoPayment] 자동이체 등록 실패:", error);
      setErrorMessage("자동이체 등록에 실패했습니다.\n다시 시도해주세요.");
      return false;
    }
  };

  return {
    scheduleSummary,
    isPasswordSheetOpen,
    errorMessage,
    handleScheduleComplete,
    handlePasswordSuccess,
    handlePasswordClose,
    registerAutoPayment,
    setPasswordSheetOpen,
  };
}
