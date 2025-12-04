"use client";

import { useEffect, useState } from "react";

import { useAccountInfo } from "./hooks/useAccountInfo";
import { useTransactionFetch } from "./hooks/useTransactionFetch";
import { useTransactionFilters } from "./hooks/useTransactionFilters";
import { useTransactionTransform } from "./hooks/useTransactionTransform";

import TransactionHeader from "./components/TransactionHeader";
import TransactionSummary from "./components/TransactionSummary";
import TransactionList from "./components/TransactionList";
import FilterBottomSheet from "./components/FilterBottomSheet";

import type { Transaction } from "@/types";

type Scenario9Props = {
  accountNumber: string;

  filterOpen: boolean;
  onRequestOpenFilter: () => void | Promise<void>;
  onRequestCloseFilter: () => void;

  onRequestApplyFilter: () => void | Promise<void>;
  onPickTransaction: (t: Transaction) => void | Promise<void>;
};

export default function Scenario9({
  accountNumber,
  filterOpen,
  onRequestOpenFilter,
  onRequestCloseFilter,
  onRequestApplyFilter,
  onPickTransaction,
}: Scenario9Props) {
  const { accountInfo, loadAccountInfo, error: accountError } = useAccountInfo(accountNumber);
  const { transactions, fetchTransactions, error: txError } = useTransactionFetch();

  const {
    filterState,
    appliedFilters,
    draftFilters,
    setDraftFilters,
    updatePeriod,
    applyFilters,
    resetFilters,
  } = useTransactionFilters();

  const transformed = useTransactionTransform(transactions, appliedFilters);
  const [openFilter, setOpenFilter] = useState(false);
  // 리스트에 손가락을 보여줄지 결정하는 상태 => 초기값: false
  const [showListFinger, setShowListFinger] = useState(false);

  useEffect(() => {
    if (!accountNumber) return;

    (async () => {
      const info = await loadAccountInfo();
      if (!info) return;
      const params = new URLSearchParams();
      params.append("accountId", String(info.id));
      params.append("period", "3M");
      params.append("type", "ALL");

      await fetchTransactions(info.id, params);
    })();
  }, [accountNumber, loadAccountInfo, fetchTransactions]);

  if (!accountNumber) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center text-gray-500">
        계좌를 선택해주세요.
      </div>
    );
  }

  if (accountError || txError) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <p className="text-red-500">{accountError ?? txError ?? "오류가 발생했습니다."}</p>
      </div>
    );
  }

  return (
    <div className="px-[20px] pb-[32px]">
      {accountInfo && <TransactionHeader account={accountInfo} />}

      <TransactionSummary
        filters={filterState}
        onOpen={() => void onRequestOpenFilter()}
        totalAmount={transformed.totalAmount}
        appliedRange={transformed.rangeText}
      />

      {/* showFinger 상태를 리스트에 전달 */}
      <TransactionList
        grouped={transformed.grouped}
        showFinger={showListFinger}
        onSelect={(t) => void onPickTransaction(t)}
      />

      <FilterBottomSheet
        open={filterOpen}
        onClose={onRequestCloseFilter}
        draft={draftFilters}
        setDraft={setDraftFilters}
        updatePeriod={updatePeriod}
        onReset={resetFilters}
        onApply={async () => {
          if (!accountInfo) return;
          await applyFilters(accountInfo, fetchTransactions);
          await onRequestApplyFilter();
          setOpenFilter(false);
          // "적용하기"를 누르면 리스트에 손가락 애니메이션 나타나기
          setShowListFinger(true);
        }}
      />
    </div >
  );
}