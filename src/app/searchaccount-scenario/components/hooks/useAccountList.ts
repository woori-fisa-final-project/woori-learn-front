// 전체 계좌 목록 조회 (JWT 토큰 기반)
// 홈 화면 전체 계좌 목록 조회 (입출금/예적금 구분 포함)

"use client";

import { useState, useEffect } from "react";
import { formatAccountNumber, formatBalance } from "../utils/accountFormatter";
import type { AccountResponse, AccountCard } from "@/types";
import { getAccountList } from "@/lib/api/account";
import { devError } from "@/utils/logger";
import { isApiError } from "@/types/errors";

export function useAccountList() {
  const [accounts, setAccounts] = useState<AccountCard[]>([]);
  const [depositAccounts, setDepositAccounts] = useState<AccountCard[]>([]);
  const [savingsAccounts, setSavingsAccounts] = useState<AccountCard[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    console.log("[계좌목록] API 요청 시작 (JWT 토큰 기반)");

    try {
      setLoading(true);
      setError(null);

      // JWT 토큰 기반 계좌 목록 조회
      const result = await getAccountList();

      console.log("[API Response]", result);

      if (!result || result.length === 0) {
        setAccounts([]);
        setDepositAccounts([]);
        setSavingsAccounts([]);
        setTotalBalance(0);
        return;
      }

      const transformed: AccountCard[] = result.map((acc, idx) => {
        // 백엔드의 accountType 필드를 사용하여 계좌 유형 판단
        // CHECKING = 입출금 계좌, SAVINGS = 예적금 계좌, DEPOSIT = 적금 (현재 미사용)
        // accountType이 없으면 첫 번째 계좌를 입출금 계좌로 간주 (fallback)
        const isChecking = acc.accountType
          ? acc.accountType === "CHECKING"
          : idx === 0;

        console.log(`[계좌 ${idx}] accountType: ${acc.accountType}, isChecking: ${isChecking}, accountNumber: ${acc.accountNumber}`);

        return {
          id: acc.id,
          title: isChecking ? "WON통장" : "WON적금통장",
          bank: "우리",
          accountNumber: formatAccountNumber(acc.accountNumber),
          accountName: acc.accountName,
          badge: "한도제한",
          balance: formatBalance(acc.balance),
          rawBalance: acc.balance,
          transferAvailable: isChecking,
          type: isChecking ? "deposit" : "savings",
          disabledMessage: !isChecking
            ? "예적금 계좌에서는 이체를 이용할 수 없습니다."
            : undefined,
        };
      });

      setAccounts(transformed);
      setDepositAccounts(transformed.filter((v: AccountCard) => v.type === "deposit"));
      setSavingsAccounts(transformed.filter((v: AccountCard) => v.type === "savings"));

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
