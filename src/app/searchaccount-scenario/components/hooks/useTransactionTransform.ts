"use client";

import { useMemo } from "react";
import { Transaction } from "@/types";
import { formatKoreanDate } from "../utils/dateUtils";;

export function useTransactionTransform(
  transactions: Transaction[],
  appliedFilters: any,
  accountInfo: any
) {
  const filtered = useMemo(() => {
    const { start, end, type } = appliedFilters;

    return transactions.filter((t) => {
      const d = new Date(`${t.date}T00:00:00`);

      if (d < start || d > end) return false;

      if (type === "입금") return t.amount >= 0;
      if (type === "출금") return t.amount < 0;

      return true;
    });
  }, [transactions, appliedFilters]);

  const totalAmount = filtered.reduce((sum, tx) => sum + tx.amount, 0);

  const rangeText = `${formatKoreanDate(
    appliedFilters.start
  )}~${formatKoreanDate(appliedFilters.end)}`;

  const grouped = filtered.reduce((acc: any[], tx: Transaction) => {
    const [y, m] = tx.date.split("-");
    const key = `${y}년 ${Number(m)}월`;

    let group = acc.find((g) => g.label === key);
    if (!group) {
      group = { label: key, items: [] };
      acc.push(group);
    }
    group.items.push(tx);

    return acc;
  }, []);

  return { grouped, totalAmount, rangeText };
}
