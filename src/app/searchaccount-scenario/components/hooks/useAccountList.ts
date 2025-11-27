// 전체 계좌 목록 조회 (JWT 토큰 기반)
// 홈 화면 전체 계좌 목록 조회 (입출금/예적금 구분 포함)

"use client";

import { useState, useEffect } from "react";
import { formatAccountNumber, formatBalance } from "../utils/accountFormatter";
import type { AccountResponse, AccountCard } from "@/types";
import { getAccountList } from "@/lib/api/account";
import { devError } from "@/utils/logger";

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

      const transformed: AccountCard[] = result.map((acc, idx: number) => {
        // FIXME: 계좌 종류를 배열 인덱스로 판단하는 것은 위험합니다.
        // 비즈니스 규칙: 백엔드에서 항상 첫 번째 계좌는 입출금, 두 번째 계좌는 예적금으로 반환됨
        // 향후 API 응답에 계좌 타입 필드(type: "deposit" | "savings")를 추가하여 명시적으로 처리하는 것을 권장합니다.
        const isDeposit = idx === 0;

        return {
          id: acc.id,
          title: isDeposit ? "WON통장" : "WON적금통장",
          bank: "우리",
          accountNumber: formatAccountNumber(acc.accountNumber),
          accountName: acc.accountName,
          badge: "한도제한",
          balance: formatBalance(acc.balance),
          rawBalance: acc.balance,
          transferAvailable: isDeposit,
          type: isDeposit ? "deposit" : "savings",
          disabledMessage: !isDeposit
            ? "예적금 계좌에서는 이체를 이용할 수 없습니다."
            : undefined,
        };
      });

      setAccounts(transformed);
      setDepositAccounts(transformed.filter((v: AccountCard) => v.type === "deposit"));
      setSavingsAccounts(transformed.filter((v: AccountCard) => v.type === "savings"));

      const sum = transformed.reduce((acc: number, cur: AccountCard) => acc + cur.rawBalance, 0);
      setTotalBalance(sum);
    } catch (e: any) {
      devError("[useAccountList] 계좌 목록 조회 실패:", e);

      // 403 에러 처리 (권한 없음)
      if (e.response?.status === 403) {
        setError("해당 계좌에 대한 접근 권한이 없습니다.");
      } else {
        setError(e.message || "오류가 발생했습니다.");
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
