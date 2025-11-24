// 전체 계좌 목록 조회
// 홈 화면 전체 계좌 목록 조회 (입출금/예적금 구분 포함)

"use client";

import { useState, useEffect } from "react";
import { formatAccountNumber, formatBalance } from "../utils/accountFormatter";
import type { AccountResponse, AccountCard } from "@/types";


export function useAccountList(userId: number) {
  const [accounts, setAccounts] = useState<AccountCard[]>([]);
  const [depositAccounts, setDepositAccounts] = useState<AccountCard[]>([]);
  const [savingsAccounts, setSavingsAccounts] = useState<AccountCard[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    console.log("[계좌목록] API 요청 시작", { userId });

    try {
      setLoading(true);
      setError(null);

      const url = `http://localhost:8080/education/accounts/list/${userId}`;
      //const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/education/accounts/list/${userId}`;
      console.log(`GET ${url}`);

      const res = await fetch(url);

      console.log("[API Raw Response]", res);

      if (res.status === 204) {
        setAccounts([]);
        setDepositAccounts([]);
        setSavingsAccounts([]);
        setTotalBalance(0);
        return;
      }

      if (!res.ok) throw new Error("계좌 정보를 불러오지 못했습니다.");

      const result = await res.json();

      if (!result.data) throw new Error("응답 구조가 잘못되었습니다.");

      const transformed = result.data.map((acc: AccountResponse, idx: number) => {
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
      setDepositAccounts(transformed.filter((v) => v.type === "deposit"));
      setSavingsAccounts(transformed.filter((v) => v.type === "savings"));

      const sum = transformed.reduce((acc, cur) => acc + cur.rawBalance, 0);
      setTotalBalance(sum);
    } catch (e: any) {
      setError(e.message || "오류가 발생했습니다.");
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
 