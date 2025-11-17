// 계좌 1개 상세 조회
// 시나리오9에서 사용자가 선택한 계좌 1개 정보만 가져오기

"use client";

import { useState, useCallback } from "react";
import { formatAccountNumber } from "../utils/transactionFormatter";

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
      const userId = 1;
      const res = await fetch(`/education/accounts/list/${userId}`);
      if (!res.ok) throw new Error("계좌 조회 실패");

      const json = await res.json();
      const list = json.data;

      let selected = list.find(
        (acc: any) =>
          formatAccountNumber(acc.accountNumber) === displayAccountNumber
      );

      if (!selected) selected = list[0];
      if (!selected) throw new Error("계좌 없음");

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
