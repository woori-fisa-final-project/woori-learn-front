"use client";

import { useState } from "react"; 
import type { FilterState } from "../hooks/useTransactionFilters";

interface TransactionSummaryProps {
  filters: FilterState;
  onOpen: () => void;
  totalAmount: number;
  appliedRange: string;
}

export default function TransactionSummary({
  filters,
  onOpen,
  totalAmount,
  appliedRange,
}: TransactionSummaryProps) {
  // 손가락 표시 여부를 관리하는 상태 (초기값: true)
  const [showFinger, setShowFinger] = useState(true);

  const handleOpen = () => {
    setShowFinger(false); // 손가락 숨기기
    onOpen();             // 바텀 시트 열기 (기존 동작)
  };

  return (
    <section className="mt-[24px]">
      <div className="flex justify-between text-[13px] text-gray-600">
        <span>{appliedRange}</span>

        <div className="relative">
          
          {/* showFinger가 true일 때만 손가락 렌더링 */}
          {showFinger && (
            <div className="absolute -top-[30px] left-1/2 -translate-x-1/2 animate-bounce z-10 pointer-events-none">
              <span className="text-[24px]" aria-hidden="true">👇</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleOpen} // onClick 함수 교체
            className="flex items-center gap-[6px]"
          >
            {filters.period} · {filters.type} · {filters.sortOrder}
            <img src="/images/search.png" className="h-[16px] w-[16px] opacity-60" alt="거래내역 필터" />
          </button>
        </div>

      </div>

      <div className="mt-[18px] flex justify-between border-t border-[#E4E8F0] pt-[12px]">
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