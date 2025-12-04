// 계좌 1개 상세 조회 (JWT 토큰 기반)
// 시나리오9에서 사용자가 선택한 계좌 1개 정보만 가져오기

"use client";

import { useState, useCallback } from "react";
import { formatAccountNumber } from "../utils/accountFormatter";
import { getAccountList } from "@/lib/api/account";
import { devError } from "@/utils/logger";
import { isApiError } from "@/types/errors";

export interface AccountInfo {
  id: number;
  accountName: string;
  accountNumber: string;
  balance: number;
}

export function useAccountInfo(displayAccountNumber: string) {
  const [accountInfo, setInfo] = useState<AccountInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadAccountInfo = useCallback(async () => {
    try {
      // JWT 토큰 기반 계좌 목록 조회
      const list = await getAccountList();

      const selected = list.find(
        (acc) =>
          formatAccountNumber(acc.accountNumber) === displayAccountNumber
      );

      if (!selected) {
        throw new Error("일치하는 계좌를 찾을 수 없습니다.");
      }

      const info: AccountInfo = {
        id: selected.id,
        accountName: selected.accountName,
        balance: selected.balance,
        accountNumber: formatAccountNumber(selected.accountNumber),
      };

      setInfo(info);
      return info;
    } catch (error: unknown) {
      devError("[useAccountInfo] 계좌 정보 조회 실패:", error);

      // ApiError 타입 가드를 사용한 안전한 에러 처리
      if (isApiError(error)) {
        // 403 에러 처리 (권한 없음)
        if (error.status === 403) {
          setError("해당 계좌에 대한 접근 권한이 없습니다.");
        } else {
          setError(error.message);
        }
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("계좌 조회 실패");
      }
      return null;
    }
  }, [displayAccountNumber]);

  return { accountInfo, loadAccountInfo, error };
}
