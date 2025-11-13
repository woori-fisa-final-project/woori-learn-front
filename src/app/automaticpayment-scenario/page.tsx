"use client";

import Scenario11, {
  type AutoTransferInfo,
} from "./components/Scenario11";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { getAutoPaymentList } from "@/lib/api/autoPayment";
import { getAccountList } from "@/lib/api/account";
import type { AutoPayment } from "@/types/autoPayment";
import type { EducationalAccount } from "@/types/account";
import { formatAccountNumber, getAccountSuffix } from "@/lib/utils/accountUtils";
import { getBankName } from "@/lib/utils/bankUtils";
import { getCurrentUserId } from "@/lib/utils/authUtils";
import { usePageFocusRefresh } from "@/lib/hooks/usePageFocusRefresh";
import { devLog, devError } from "@/lib/utils/logger";

// AutoPayment를 AutoTransferInfo로 변환하는 함수
function convertToAutoTransferInfo(
  payment: AutoPayment,
  account: EducationalAccount
): AutoTransferInfo {
  // 상태 한글 변환
  const statusMap = {
    ACTIVE: "정상",
    CANCELLED: "해지",
  };

  // 금액 포맷팅
  const formattedAmount = `${payment.amount.toLocaleString()}원`;

  // 이체일자/주기 포맷팅
  const schedule = `${payment.designatedDate}일/${payment.transferCycle}개월`;

  return {
    id: payment.id,
    status: statusMap[payment.processingStatus] || payment.processingStatus,
    title: payment.displayName || "자동이체",
    bankName: getBankName(payment.depositBankCode),
    bankAccount: formatAccountNumber(payment.depositNumber),
    amount: formattedAmount,
    schedule: schedule,
    transferDay: payment.designatedDate.toString(),
    frequency: payment.transferCycle.toString(),
    startDate: payment.startDate,
    endDate: payment.expirationDate,
    ownerName: account.accountName, // API에서 제공되는 계좌명
    recipientName: payment.counterpartyName,
    registerDate: payment.startDate, // 등록일 (API에 별도 필드가 없어 시작일 사용)
    sourceAccountBank: "우리은행", // 교육용 계좌는 모두 우리은행
    sourceAccountNumber: formatAccountNumber(account.accountNumber), // API에서 제공되는 계좌번호
  };
}

export default function AutomaticPaymentScenarioPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id");

  const [accountSuffix, setAccountSuffix] = useState("0000");
  const [autoTransferList, setAutoTransferList] = useState<AutoTransferInfo[]>([]);
  const [hasAutoTransfer, setHasAutoTransfer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      // userId가 없으면 현재 로그인된 사용자 ID 사용
      const currentUserId = userId ? parseInt(userId) : getCurrentUserId();

      // 1. 계좌 목록 조회
      const accounts = await getAccountList(currentUserId);

      if (!accounts || accounts.length === 0) {
        devError("[fetchData] 계좌가 없습니다.");
        setIsLoading(false);
        return;
      }

      // 2. 첫 번째 계좌(대표계좌) 선택
      const representativeAccount = accounts[0];

      // 3. 계좌번호 뒷자리 4자리 추출
      const suffix = getAccountSuffix(representativeAccount.accountNumber);
      setAccountSuffix(suffix);

      // 4. 해당 계좌의 자동이체 목록 조회
      const payments = await getAutoPaymentList({
        educationalAccountId: representativeAccount.id,
      });

      // 5. 모든 자동이체를 배열로 변환하여 표시
      if (payments && payments.length > 0) {
        devLog(`[fetchData] 자동이체 ${payments.length}건 조회`);
        const convertedList = payments.map(payment => {
          devLog(`- ID ${payment.id}: ${payment.processingStatus}`);
          return convertToAutoTransferInfo(payment, representativeAccount);
        });
        setAutoTransferList(convertedList);
        setHasAutoTransfer(true);
      } else {
        setAutoTransferList([]);
        setHasAutoTransfer(false);
      }
    } catch (error) {
      devError("[fetchData] 데이터 조회 실패:", error);
      setAutoTransferList([]);
      setHasAutoTransfer(false);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 페이지가 다시 포커스를 받을 때 데이터 새로고침
  usePageFocusRefresh(() => {
    devLog("[usePageFocusRefresh] 페이지 포커스 복귀 - 데이터 새로고침");
    fetchData();
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <Scenario11
      accountSuffix={accountSuffix}
      hasAutoTransfer={hasAutoTransfer}
      autoTransferList={autoTransferList}
    />
  );
}

