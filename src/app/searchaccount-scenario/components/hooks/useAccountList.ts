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

      // ⚠️ 런타임 검증: 계좌가 정확히 2개인지 확인
      // 이 검증은 idx === 0 로직의 취약성을 조기 발견하기 위한 임시 방편입니다.
      if (result.length !== 2) {
        devError(
          `[useAccountList] 예상치 못한 계좌 개수: ${result.length}개. ` +
          `idx === 0 로직은 계좌가 정확히 2개(입출금 1개, 예적금 1개)일 때만 작동합니다. ` +
          `백엔드 API에 accountType 필드 추가가 시급합니다.`
        );
      }

      const transformed: AccountCard[] = result.map((acc, idx: number) => {
        // ⚠️ CRITICAL ISSUE: 계좌 종류를 배열 인덱스로 판단하는 것은 매우 취약합니다.
        //
        // 현재 비즈니스 규칙 (암묵적 가정):
        // - 백엔드에서 항상 첫 번째 계좌(idx=0)는 입출금 계좌
        // - 두 번째 계좌(idx=1)는 예적금 계좌
        //
        // ❌ 문제점:
        // 1. 백엔드 응답 순서가 변경되면 버그 발생
        // 2. 새로운 계좌가 추가되면 로직이 깨짐
        // 3. 계좌가 1개만 있거나 3개 이상이면 예상치 못한 동작
        //
        // ✅ 권장 해결 방안 (백엔드 API 개선):
        // EdubankapiAccountDto에 accountType 필드 추가:
        //
        // ```java
        // public record EdubankapiAccountDto(
        //     Long id,
        //     String accountName,
        //     String accountNumber,
        //     Integer balance,
        //     String accountType  // "DEPOSIT" | "SAVINGS" 추가
        // )
        // ```
        //
        // 프론트엔드 수정:
        // ```typescript
        // const isDeposit = acc.accountType === "DEPOSIT";
        // ```
        const isDeposit = idx === 0;

        // 런타임 로그: 디버깅용 (배포 시 제거 가능)
        if (process.env.NODE_ENV === "development") {
          console.log(
            `[계좌 매핑] idx=${idx}, accountName=${acc.accountName}, ` +
            `type=${isDeposit ? "deposit" : "savings"}`
          );
        }

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
