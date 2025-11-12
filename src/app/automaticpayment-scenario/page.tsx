"use client";

import Scenario11, {
  type AutoTransferInfo,
} from "./components/Scenario11";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getAutoPaymentList } from "@/lib/api/autoPayment";
import { getAccountList } from "@/lib/api/account";
import type { AutoPayment } from "@/types/autoPayment";
import type { EducationalAccount } from "@/types/account";

const DEFAULT_ACCOUNT_SUFFIX = "0000";
const TEMP_USER_ID = 1; // 임시 사용자 ID (로그인 구현 후 제거)

// AutoPayment를 AutoTransferInfo로 변환하는 함수
function convertToAutoTransferInfo(payment: AutoPayment): AutoTransferInfo {
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
    ownerName: null,
    recipientName: payment.counterpartyName,
    registerDate: null,
    sourceAccountBank: null,
    sourceAccountNumber: null,
  };
}

// 은행 코드를 은행명으로 변환 (임시)
function getBankName(code: string): string {
  const bankMap: Record<string, string> = {
    "001": "한국은행",
    "002": "산업은행",
    "003": "기업은행",
    "004": "국민은행",
    "007": "수협은행",
    "011": "농협은행",
    "020": "우리은행",
    "023": "SC제일은행",
    "027": "한국씨티은행",
    "031": "대구은행",
    "032": "부산은행",
    "034": "광주은행",
    "035": "제주은행",
    "037": "전북은행",
    "039": "경남은행",
    "045": "새마을금고",
    "048": "신협",
    "050": "상호저축은행",
    "071": "우체국",
    "081": "하나은행",
    "088": "신한은행",
    "089": "케이뱅크",
    "090": "카카오뱅크",
  };
  return bankMap[code] || "기타은행";
}

// 계좌번호 포맷팅
function formatAccountNumber(accountNumber?: string | null): string {
  // null, undefined 체크
  if (!accountNumber) {
    return "계좌번호 없음";
  }

  // 숫자만 추출
  const numbers = accountNumber.replace(/[^0-9]/g, "");

  // 길이에 따라 포맷 적용
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
}

// 계좌번호에서 뒷자리 4자리 추출
function getAccountSuffix(accountNumber?: string | null): string {
  if (!accountNumber) {
    return DEFAULT_ACCOUNT_SUFFIX;
  }

  const numbers = accountNumber.replace(/[^0-9]/g, "");
  if (numbers.length >= 4) {
    return numbers.slice(-4);
  }
  return numbers || DEFAULT_ACCOUNT_SUFFIX;
}

export default function AutomaticPaymentScenarioPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id");

  const [account, setAccount] = useState<EducationalAccount | null>(null);
  const [accountSuffix, setAccountSuffix] = useState(DEFAULT_ACCOUNT_SUFFIX);
  const [autoTransferInfo, setAutoTransferInfo] = useState<AutoTransferInfo | undefined>();
  const [hasAutoTransfer, setHasAutoTransfer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        // userId가 없으면 임시 ID 사용
        const currentUserId = userId ? parseInt(userId) : TEMP_USER_ID;

        // 1. 계좌 목록 조회
        const accounts = await getAccountList(currentUserId);

        if (!accounts || accounts.length === 0) {
          console.error("계좌가 없습니다.");
          setIsLoading(false);
          return;
        }

        // 2. 첫 번째 계좌(대표계좌) 선택
        const representativeAccount = accounts[0];
        setAccount(representativeAccount);

        // 3. 계좌번호 뒷자리 4자리 추출
        const suffix = getAccountSuffix(representativeAccount.accountNumber);
        setAccountSuffix(suffix);

        // 4. 해당 계좌의 자동이체 목록 조회
        const payments = await getAutoPaymentList({
          educationalAccountId: representativeAccount.id,
        });

        // 5. 첫 번째 자동이체만 표시 (여러 개인 경우 추후 리스트로 확장 가능)
        if (payments && payments.length > 0) {
          const firstPayment = payments[0];
          setAutoTransferInfo(convertToAutoTransferInfo(firstPayment));
          setHasAutoTransfer(true);
        } else {
          setAutoTransferInfo(undefined);
          setHasAutoTransfer(false);
        }
      } catch (error) {
        console.error("데이터 조회 실패:", error);
        setAutoTransferInfo(undefined);
        setHasAutoTransfer(false);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [userId]);

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
      autoTransferInfo={autoTransferInfo}
    />
  );
}

