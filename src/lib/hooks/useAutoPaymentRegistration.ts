import { useState } from "react";
import { createAutoPayment } from "@/lib/api/autoPayment";
import type { EducationalAccount } from "@/types/account";
import type { ScheduleSummary } from "@/app/automaticpayment-scenario/components/types";
import { getBankCode } from "@/utils/bankUtils";
import { parseNumber, parseTransferDay } from "@/utils/numberUtils";
import { devError } from "@/utils/logger";
import { validateAutoPaymentAmount } from "@/utils/validationUtils";
import { ERROR_MESSAGES } from "@/lib/constants";
// ✅ [1] Zustand 훅 가져오기
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";

/**
 * 자동이체 등록 관련 로직을 관리하는 커스텀 훅
 */
export function useAutoPaymentRegistration() {
  // ✅ [2] 전역 상태에서 비밀번호 관련 기능 꺼내기
  const { enteredPassword, setEnteredPassword } = useTransferFlow();
  const [scheduleSummary, setScheduleSummary] = useState<ScheduleSummary | null>(null);
  const [isPasswordSheetOpen, setPasswordSheetOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleScheduleComplete = (options: ScheduleSummary) => {
    setScheduleSummary(options);
    setPasswordSheetOpen(true);
  };

  const handlePasswordSuccess = (password: string) => {
    // ✅ [3] 입력받은 비밀번호를 Zustand(전역 상태)에 저장
    setEnteredPassword(password);
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
      setErrorMessage(ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
      return false;
    }

    // 금액 검증
    const validation = validateAutoPaymentAmount(amount);
    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage || "");
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
        // ✅ [4] Zustand에 저장된 비밀번호를 서버로 전송
        accountPassword: enteredPassword,
      });

      // 성공 시 비밀번호 초기화 (보안)
      setEnteredPassword("");
      return true;
    } catch (error) {
      devError("[registerAutoPayment] 자동이체 등록 실패:", error);
      setErrorMessage(ERROR_MESSAGES.REGISTRATION_FAILED);
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