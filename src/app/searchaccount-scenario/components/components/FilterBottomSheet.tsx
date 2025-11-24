"use client";

import { FilterState } from "../hooks/useTransactionFilters";

interface FilterBottomSheetProps {
  open: boolean;
  onClose: () => void;
  draft: FilterState;
  setDraft: React.Dispatch<React.SetStateAction<FilterState>>;
  updatePeriod: (period: FilterState["period"]) => void; 
  onApply: () => void;
  onReset: () => void;
}

export default function FilterBottomSheet({
  open,
  onClose,
  draft,
  setDraft,
  updatePeriod,
  onApply,
  onReset,
}: FilterBottomSheetProps) {

  /** 기간 선택 → 날짜 자동 반영 */
  const handleSelectPeriod = (period: FilterState["period"]) => {
    updatePeriod(period);   // 날짜(start/end) 자동 설정
  };

  const handleSelectType = (type: FilterState["type"]) => {
    setDraft((prev) => ({ ...prev, type }));
  };

  const handleSelectSort = (order: FilterState["sortOrder"]) => {
    setDraft((prev) => ({ ...prev, sortOrder: order }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40">
      <div className="absolute bottom-0 w-full bg-white rounded-t-xl p-4">

        {/* 기간 */}
        <section className="mb-4">
          <h4 className="font-semibold mb-2">조회기간</h4>
          <div className="flex gap-2">
            {["이번달", "3개월", "6개월", "1년"].map((p) => (
              <button
                key={p}
                onClick={() => handleSelectPeriod(p as FilterState["period"])}
                className={`px-3 py-2 rounded-lg border ${
                  draft.period === p ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </section>

        {/* 거래구분 */}
        <section className="mb-4">
          <h4 className="font-semibold mb-2">거래구분</h4>
          <div className="flex gap-2">
            {["전체", "입금", "출금"].map((t) => (
              <button
                key={t}
                onClick={() => handleSelectType(t as FilterState["type"])}
                className={`px-3 py-2 rounded-lg border ${
                  draft.type === t ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* 정렬 */}
        <section className="mb-4">
          <h4 className="font-semibold mb-2">정렬</h4>
          <div className="flex gap-2">
            {["최신순", "과거순"].map((s) => (
              <button
                key={s}
                onClick={() => handleSelectSort(s as FilterState["sortOrder"])}
                className={`px-3 py-2 rounded-lg border ${
                  draft.sortOrder === s ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        <div className="flex gap-2 mt-4">
          <button
            onClick={onReset}
            className="flex-1 py-2 bg-gray-200 rounded-lg"
          >
            초기화
          </button>
          <button
            onClick={onApply}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg"
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
}
