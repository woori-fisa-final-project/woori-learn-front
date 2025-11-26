// 거래내역 조회 (JWT 토큰 기반)

"use client";

import { useState, useCallback } from "react";
import { Transaction, TransactionResponse } from "@/types";
import { transformApiTransaction } from "../utils/transactionFormatter";
import axiosInstance from "@/utils/axiosInstance";
import type { ApiResponse } from "@/types/api";
import { devError } from "@/utils/logger";

export function useTransactionFetch() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(
    async (accountId: number, params: URLSearchParams) => {
      try {
        // axiosInstance를 사용하여 JWT 토큰 자동 포함
        const response = await axiosInstance.get<ApiResponse<TransactionResponse[]>>(
          `/education/accounts/transactions?${params.toString()}`
        );

        const mapped = response.data.data.map((item: TransactionResponse, index: number) =>
          transformApiTransaction(item, index, accountId)
        );

        setTransactions(mapped);
        setError(null);
      } catch (e: any) {
        devError("[useTransactionFetch] 거래내역 조회 실패:", e);

        // 403 에러 처리 (권한 없음)
        if (e.response?.status === 403) {
          setError("해당 계좌에 대한 접근 권한이 없습니다.");
        } else {
          setError(e.message || "거래내역 조회 실패");
        }

        setTransactions([]);
      }
    },
    []
  );

  return { transactions, fetchTransactions, error };
}
