// 계좌 1개 상세 조회
// 시나리오9에서 사용자가 선택한 계좌 1개 정보만 가져오기

"use client";

import { useState, useCallback } from "react";
import { formatAccountNumber } from "../utils/accountFormatter";

export interface AccountInfo {
  id: number;
  accountName: string;
  accountNumber: string;
  balance: number;
}

const normalizeDigits = (value: string) => value.replace(/\D/g, "");

export function useAccountInfo(displayAccountNumber: string) {
  const [accountInfo, setInfo] = useState<AccountInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadAccountInfo = useCallback(async () => {
    try {
      const targetDigits = normalizeDigits(displayAccountNumber);
      if (!targetDigits) {
        throw new Error("계좌번호가 전달되지 않았습니다.");
      }

      const userId = 1;
      const res = await fetch(`/education/accounts/list/${userId}`);
      if (!res.ok) throw new Error("계좌 조회 실패");

      const json = await res.json();
      const list = json.data;

      const selected = list.find(
        (acc: any) => normalizeDigits(acc.accountNumber) === targetDigits
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
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  }, [displayAccountNumber]);

  return { accountInfo, loadAccountInfo, error };
}
