// 전체 계좌 목록 조회 (JWT 토큰 기반)
// 홈 화면 전체 계좌 목록 조회 (입출금/예적금 구분 포함)

"use client";

import { useState, useEffect } from "react";
import { formatAccountNumber, formatBalance } from "../utils/accountFormatter";
import type { AccountResponse, AccountCard } from "@/types";
import { getAccountList } from "@/lib/api/account";
import { devError } from "@/utils/logger";
import { isApiError } from "@/types/errors";
import {
  ACCOUNT_TYPE,
  ACCOUNT_DISPLAY_TYPE,
  ACCOUNT_TYPE_LABEL,
  ACCOUNT_TRANSFER_DISABLED_MESSAGE,
  isValidAccountType,
  isTransferAvailable,
} from "@/constants/account";

export function useAccountList() {
  const [accounts, setAccounts] = useState<AccountCard[]>([]);
  const [depositAccounts, setDepositAccounts] = useState<AccountCard[]>([]);
  const [savingsAccounts, setSavingsAccounts] = useState<AccountCard[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // JWT 토큰 기반 계좌 목록 조회
      const result = await getAccountList();

      if (!result || result.length === 0) {
        setAccounts([]);
        setDepositAccounts([]);
        setSavingsAccounts([]);
        setTotalBalance(0);
        return;
      }

      const transformed: AccountCard[] = result.map((acc) => {
        // accountType 필드 검증
        if (!isValidAccountType(acc.accountType)) {
          devError(
            `[useAccountList] 유효하지 않은 accountType: ${acc.accountType}, accountNumber: ${acc.accountNumber}`
          );
          // accountType이 없거나 유효하지 않은 경우, 안전하게 이체 불가 계좌로 처리
          return {
            id: acc.id,
            title: "알 수 없는 계좌",
            bank: "우리",
            accountNumber: formatAccountNumber(acc.accountNumber),
            accountName: acc.accountName,
            badge: "한도제한",
            balance: formatBalance(acc.balance),
            rawBalance: acc.balance,
            transferAvailable: false,
            type: ACCOUNT_DISPLAY_TYPE.SAVINGS,
            disabledMessage: "계좌 유형을 확인할 수 없어 이체를 이용할 수 없습니다.",
          };
        }

        // 정상적인 accountType 처리
        const isChecking = isTransferAvailable(acc.accountType);
        const displayType = isChecking
          ? ACCOUNT_DISPLAY_TYPE.CHECKING
          : ACCOUNT_DISPLAY_TYPE.SAVINGS;

        return {
          id: acc.id,
          title: ACCOUNT_TYPE_LABEL[acc.accountType],
          bank: "우리",
          accountNumber: formatAccountNumber(acc.accountNumber),
          accountName: acc.accountName,
          badge: "한도제한",
          balance: formatBalance(acc.balance),
          rawBalance: acc.balance,
          transferAvailable: isChecking, // 중복 계산 제거: isChecking 직접 사용
          type: displayType,
          disabledMessage: !isChecking
            ? ACCOUNT_TRANSFER_DISABLED_MESSAGE[acc.accountType]
            : undefined,
        };
      });

      setAccounts(transformed);
      setDepositAccounts(
        transformed.filter((v: AccountCard) => v.type === ACCOUNT_DISPLAY_TYPE.CHECKING)
      );
      setSavingsAccounts(
        transformed.filter((v: AccountCard) => v.type === ACCOUNT_DISPLAY_TYPE.SAVINGS)
      );

      const sum = transformed.reduce((acc: number, cur: AccountCard) => acc + cur.rawBalance, 0);
      setTotalBalance(sum);
    } catch (error: unknown) {
      devError("[useAccountList] 계좌 목록 조회 실패:", error);

      // ApiError 타입 가드를 사용한 안전한 에러 처리
      if (isApiError(error)) {
        // 403 에러 처리 (권한 없음)
        if (error.status === 403) {
          setError("해당 계좌에 대한 접근 권한이 없습니다.");
        } else {
          setError(error.message);
        }
      } else {
        // 예상치 못한 에러 (네트워크 에러 등)
        setError("오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    accounts,
    depositAccounts,
    savingsAccounts,
    totalBalance,
    isLoading,
    error,
    refetch: fetchData,
  };
}
