"use client";                                                                                                                             
                                                                                                                                            
  import { useEffect, useState } from "react";
  import { useRouter, useSearchParams } from "next/navigation";
  import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";
  import { useAccountInfo } from "../../../../../searchaccount-scenario/components/hooks/useAccountInfo";
  import { useTransactionFetch } from "../../../../../searchaccount-scenario/components/hooks/useTransactionFetch";
  import { useTransactionFilters } from "../../../../../searchaccount-scenario/components/hooks/useTransactionFilters";
  import { useTransactionTransform } from "../../../../../searchaccount-scenario/components/hooks/useTransactionTransform";
  import TransactionHeader from "../../../../../searchaccount-scenario/components/components/TransactionHeader";
  import TransactionSummary from "../../../../../searchaccount-scenario/components/components/TransactionSummary";
  import TransactionList from "../../../../../searchaccount-scenario/components/components/TransactionList";
  import FilterBottomSheet from "../../../../../searchaccount-scenario/components/components/FilterBottomSheet";
  import type { Transaction } from "@/types";

  export const TRANSACTION_STORAGE_KEY = "searchaccount:lastTransaction";

  type Scenario9Props = {
    onOpenFilter?: () => void;
    onApplyFilter?: () => void;
    onSelectTransaction?: (tx: Transaction) => void;
    onBackToList?: () => void;
  };

  export default function Scenario9({
    onOpenFilter,
    onApplyFilter,
    onSelectTransaction,
    onBackToList,
  }: Scenario9Props) {
    const router = useRouter();
    const params = useSearchParams();
    const accountNumber = params.get("accountNumber") ?? "";

    const { setOnBack, setTitle } = useScenarioHeader();

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

    useEffect(() => {
      setTitle("거래내역조회");
      setOnBack(() => () => {
        if (onBackToList) {
          onBackToList();
          return;
        }
        router.push("/searchaccount-scenario");
      });

      if (!accountNumber) {
        return;
      }

      (async () => {
        const info = await loadAccountInfo();
        if (info) {
          const qs = new URLSearchParams();
          qs.append("accountId", String(info.id));
          qs.append("period", "3M");
          qs.append("type", "ALL");
          await fetchTransactions(info.id, qs);
        }
      })();

      return () => setOnBack(null);
    }, [accountNumber, fetchTransactions, loadAccountInfo, onBackToList, router, setOnBack, setTitle]);

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
          onOpen={() => {
            onOpenFilter?.();
            setOpenFilter(true);
          }}
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
              }),
            );
            onSelectTransaction?.(t);
          }}
        />

        <FilterBottomSheet
          open={openFilter}
          onClose={() => setOpenFilter(false)}
          draft={draftFilters}
          setDraft={setDraftFilters}
          updatePeriod={updatePeriod}
          onReset={resetFilters}
          onApply={async () => {
            if (!accountInfo) return;
            await applyFilters(accountInfo, fetchTransactions);
            onApplyFilter?.();
            setOpenFilter(false);
          }}
        />
      </div>
    );
  }