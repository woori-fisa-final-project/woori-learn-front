/*
  1) 시나리오 8 → accountNumber 넘겨옴
      ↓
  2) useAccountInfo() → 계좌 1개 정보 조회
      ↓
  3) useTransactionFetch() → 해당 계좌의 거래내역 조회
      ↓
  4) useTransactionFilters() → 필터 적용/해제 관리
      ↓
  5) useTransactionTransform() → “정렬 + 필터 결과 + 월별 그룹” 만든다
      ↓
  6) TransactionList 컴포넌트로 렌더링
*/

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";

import { useAccountInfo } from "./hooks/useAccountInfo";
import { useTransactionFetch } from "./hooks/useTransactionFetch";
import { useTransactionFilters } from "./hooks/useTransactionFilters";
import { useTransactionTransform } from "./hooks/useTransactionTransform";

import TransactionHeader from "./components/TransactionHeader";
import TransactionSummary from "./components/TransactionSummary";
import TransactionList from "./components/TransactionList";
import FilterBottomSheet from "./components/FilterBottomSheet";

export const TRANSACTION_STORAGE_KEY = "searchaccount:lastTransaction";

export default function Scenario9() {
  const router = useRouter();
  const params = useSearchParams();
  const accountNumber = params.get("accountNumber") ?? "";

  const { setOnBack, setTitle } = useScenarioHeader();

  const { accountInfo, loadAccountInfo, error: accountError } =
    useAccountInfo(accountNumber);

  const { transactions, fetchTransactions, error: txError } =
    useTransactionFetch();

  const {
    filterState,
    appliedFilters,
    draftFilters,
    setDraftFilters,
    applyFilters,
    resetFilters,
  } = useTransactionFilters();

  const transformed = useTransactionTransform(
    transactions,
    appliedFilters,
    accountInfo
  );

  const [openFilter, setOpenFilter] = useState(false);

  useEffect(() => {
    setTitle("거래내역조회");
    setOnBack(() => () => router.push("/searchaccount-scenario"));

    (async () => {
      const info = await loadAccountInfo();
      if (info) {
        const params = new URLSearchParams();
        params.append("accountId", String(info.id));
        params.append("period", "3M"); // default
        params.append("type", "ALL");

        await fetchTransactions(info.id, params);
      }
    })();

    return () => setOnBack(null);
  }, []);

  if (accountError || txError) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <p className="text-red-500">
          {accountError ?? txError ?? "오류가 발생했습니다."}
        </p>
      </div>
    );
  }

  return (
    <div className="px-[20px] pb-[32px]">
      {accountInfo && <TransactionHeader account={accountInfo} />}

      <TransactionSummary
        filters={filterState}
        onOpen={() => setOpenFilter(true)}
        totalAmount={transformed.totalAmount}
        appliedRange={transformed.rangeText}
      />

      <TransactionList
        grouped={transformed.grouped}
        onSelect={(t) => {
        
          sessionStorage.setItem(
            TRANSACTION_STORAGE_KEY,
            JSON.stringify({
              id: t.id,
              accountId: t.accountId,  
              date: t.date,
              time: t.time,
              amount: t.amount,
              description: t.description,
            })
          );

    // 화면 이동
    router.push(`/searchaccount-scenario?step=10&id=${t.id}`);
  }}
/>

      <FilterBottomSheet
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        draft={draftFilters}
        setDraft={setDraftFilters}
        onReset={resetFilters}
        onApply={async () => {
        await applyFilters(accountInfo!, fetchTransactions);
        setOpenFilter(false);  
        }}
      />
    </div>
  );
}
