// 거래내역 조회

"use client";

import { useState, useCallback } from "react";
import { Transaction, TransactionResponse } from "@/types";
import { transformApiTransaction } from "../utils/transactionFormatter";

export function useTransactionFetch() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(
    async (accountId: number, params: URLSearchParams) => {
      try {
        const res = await fetch(
          `/education/accounts/transactions?${params.toString()}`
        );
        if (!res.ok) throw new Error("거래내역 조회 실패");

        const json = await res.json();

        const mapped = json.data.map((item: TransactionResponse, index: number) =>
          transformApiTransaction(item, index, accountId)   
        );



        setTransactions(mapped);
      } catch (e: any) {
        setError(e.message);
      }
    },
    []
  );

  return { transactions, fetchTransactions, error };
}
