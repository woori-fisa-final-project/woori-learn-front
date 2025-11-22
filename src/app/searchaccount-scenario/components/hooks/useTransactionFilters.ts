"use client";

import { useState, useCallback } from "react";
import { subMonths } from "../utils/dateUtils";
import type { AccountInfo } from "./useAccountInfo";

/** 기간 라벨 타입 */
type PeriodLabel = "이번달" | "3개월" | "6개월" | "1년";
/** 거래구분 */
type TransactionType = "전체" | "입금" | "출금";
/** 정렬 */
type SortOrder = "최신순" | "과거순";

export interface FilterState {
  period: PeriodLabel;
  startDate: Date;
  endDate: Date;
  type: TransactionType;
  sortOrder: SortOrder;
}

/** 백엔드 period 파라미터 매핑 */
const PERIOD_PARAM_MAP: Record<PeriodLabel, string> = {
  이번달: "1M",
  "3개월": "3M",
  "6개월": "6M",
  "1년": "1Y",
};

/** 기간 선택 → 날짜 범위 자동 계산 */
function calculateRange(period: PeriodLabel) {
  const today = new Date();
  let start = new Date();

  switch (period) {
    case "이번달":
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case "3개월":
      start = subMonths(today, 3);
      break;
    case "6개월":
      start = subMonths(today, 6);
      break;
    case "1년":
      start = subMonths(today, 12);
      break;
  }

  return { start, end: today };
}

export function useTransactionFilters() {
  const today = new Date();

  const createDefaultFilters = (): FilterState => ({
    period: "3개월",
    startDate: subMonths(today, 3),
    endDate: today,
    type: "전체",
    sortOrder: "최신순",
  });

  const [filterState, setFilters] = useState<FilterState>(createDefaultFilters);
  const [draftFilters, setDraftFilters] = useState<FilterState>(createDefaultFilters);

  /** 적용된 필터 */
  const appliedFilters = {
    start: new Date(filterState.startDate),
    end: new Date(filterState.endDate),
    type: filterState.type,
    order: filterState.sortOrder,
  };

  /** 필터 적용 + 거래내역 재조회 */
  const applyFilters = useCallback(
    async (
      accountInfo: AccountInfo,
      fetchTransactions: (accountId: number, params: URLSearchParams) => Promise<void>
    ) => {
      const next: FilterState = {
        ...draftFilters,
        startDate: new Date(draftFilters.startDate),
        endDate: new Date(draftFilters.endDate),
      };

      setFilters(next);

      const params = new URLSearchParams();
      params.append("accountId", String(accountInfo.id));

      // 기간 파라미터
      params.append("period", PERIOD_PARAM_MAP[next.period]);

      // 거래구분 매핑
      const typeParam =
        next.type === "전체"
          ? "ALL"
          : next.type === "입금"
          ? "DEPOSIT"
          : "WITHDRAW";
      params.append("type", typeParam);

      await fetchTransactions(accountInfo.id, params);
    },
    [draftFilters]
  );

  /** 기간 선택 시 자동으로 날짜 계산되도록 여기서 로직 추가 */
  const updatePeriod = useCallback((period: PeriodLabel) => {
    const { start, end } = calculateRange(period);

    setDraftFilters((prev) => ({
      ...prev,
      period,
      startDate: start,
      endDate: end,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    const reset = createDefaultFilters();
    setDraftFilters(reset);
  }, []);

  return {
    filterState,
    appliedFilters,
    draftFilters,
    setDraftFilters,
    updatePeriod,   
    applyFilters,
    resetFilters,
  };
}
