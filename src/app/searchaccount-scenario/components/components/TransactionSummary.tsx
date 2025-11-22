"use client";

import type { FilterState } from "../hooks/useTransactionFilters";

interface TransactionSummaryProps {
  filters: FilterState;
  onOpen: () => void;
  totalAmount: number;
  appliedRange: string;
}

export default function TransactionSummary(
  { filters, onOpen, totalAmount, appliedRange }: TransactionSummaryProps) {
  return (
    <section className="mt-[24px]">
      <div className="flex justify-between text-[13px] text-gray-600">
        <span>{appliedRange}</span>

        <button
          type="button"
          onClick={onOpen}
          className="flex items-center gap-[6px]"
        >
          {filters.period} · {filters.type} · {filters.sortOrder}
          <img src="/images/search.png" className="h-[16px] w-[16px] opacity-60" />
        </button>
      </div>

      <div className="mt-[18px] border-t border-[#E4E8F0] pt-[12px] flex justify-between">
        <span className="text-[13px] text-gray-600">기간 내 합계</span>
        <span className="text-[15px] font-semibold text-gray-900">
          {totalAmount >= 0
            ? `+${totalAmount.toLocaleString()}원`
            : `${totalAmount.toLocaleString()}원`}
        </span>
      </div>
    </section>
  );
}
