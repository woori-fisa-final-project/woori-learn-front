"use client";

import { useState } from "react";
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

  // 튜토리얼 단계를 관리하는 상태 (0: 이번달, 1: 출금, 2: 최신순, 3: 적용하기)
  const [tutorialStep, setTutorialStep] = useState(0);

  /** 기간 선택 */
  const handleSelectPeriod = (period: FilterState["period"]) => {
    updatePeriod(period);
    // '이번달'을 누르면 다음 단계(출금)로 이동
    if (period === "이번달" && tutorialStep === 0) {
      setTutorialStep(1);
    }
  };

  /** 거래구분 선택 */
  const handleSelectType = (type: FilterState["type"]) => {
    setDraft((prev) => ({ ...prev, type }));
    // '출금'을 누르면 다음 단계(최신순)로 이동
    if (type === "출금" && tutorialStep === 1) {
      setTutorialStep(2);
    }
  };

  /** 정렬 선택 */
  const handleSelectSort = (order: FilterState["sortOrder"]) => {
    setDraft((prev) => ({ ...prev, sortOrder: order }));
    //'최신순'을 누르면 다음 단계(적용하기)로 이동
    if (order === "최신순" && tutorialStep === 2) {
      setTutorialStep(3);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="w-full max-w-[390px] bg-white rounded-t-xl p-4 animate-slide-up">

        {/* 기간 */}
        <section className="mb-4">
          <h4 className="font-semibold mb-2">조회기간</h4>
          <div className="flex gap-2">
            {["이번달", "3개월", "6개월", "1년"].map((p) => (
              <button
                key={p}
                onClick={() => handleSelectPeriod(p as FilterState["period"])}
                className={`px-3 py-2 rounded-lg border text-[14px] transition-colors ${draft.period === p
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
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
                className={`px-3 py-2 rounded-lg border text-[14px] transition-colors ${draft.type === t
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
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
                className={`px-3 py-2 rounded-lg border text-[14px] transition-colors ${draft.sortOrder === s
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* 하단 버튼 */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={onReset}
            className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition"
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