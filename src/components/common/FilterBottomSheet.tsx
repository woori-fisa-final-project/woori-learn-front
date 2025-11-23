"use client";
import { useState, useEffect } from "react";
import Button from "@/components/common/Button";

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: { period: string; sort: string; status: string }) => void;
  initialFilters: {
    period: string; // '전체' / '1주일' / '1개월' / '3개월'
    sort: string;   // '최신순' / '오래된순'
    status: string; // '전체' / '적립' / '환전 신청' ...
  };
}

export default function FilterBottomSheet({
  isOpen,
  onClose,
  onApply,
  initialFilters,
}: FilterBottomSheetProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(initialFilters.period);
  const [selectedSort, setSelectedSort] = useState(initialFilters.sort);
  const [selectedStatus, setSelectedStatus] = useState(initialFilters.status);

  useEffect(() => {
    if (isOpen) {
      setSelectedPeriod(initialFilters.period);
      setSelectedSort(initialFilters.sort);
      setSelectedStatus(initialFilters.status);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialFilters]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleReset = () => {
    setSelectedPeriod("전체");
    setSelectedSort("최신순");
    setSelectedStatus("전체");
  };

  const handleApply = () => {
    onApply({
      period: selectedPeriod,
      sort: selectedSort,
      status: selectedStatus,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white rounded-t-[20px] w-full max-w-[min(100%,_430px)] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[768px] p-6 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[20px] text-gray-700 font-semibold mb-6">
          조회조건선택
        </h2>

        {/* 조회기간 */}
        <div className="mb-6">
          <p className="text-[16px] text-gray-700 font-medium mb-3">조회기간</p>
          <div className="flex gap-2">
            {["전체", "1주일", "1개월", "3개월"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`flex-1 h-[44px] rounded-[10px] text-[14px] font-medium transition-all border-[1px] bg-gray-100 text-gray-500 ${
                  selectedPeriod === period
                    ? "border-primary-400"
                    : "border-gray-100"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* 정렬순서 */}
        <div className="mb-6">
          <p className="text-[16px] text-gray-700 font-medium mb-3">정렬순서</p>
          <div className="flex gap-2">
            {["최신순", "오래된순"].map((sort) => (
              <button
                key={sort}
                onClick={() => setSelectedSort(sort)}
                className={`flex-1 h-[44px] rounded-[10px] text-[14px] font-medium transition-all border-[1px] ${
                  selectedSort === sort
                    ? "bg-gray-100 text-gray-500 border-primary-400"
                    : "bg-gray-100 text-gray-500 border-gray-100"
                }`}
              >
                {sort}
              </button>
            ))}
          </div>
        </div>

        {/* 상태 필터 */}
        <div className="mb-6">
          <p className="text-[16px] text-gray-700 font-medium mb-3">상태</p>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              {["전체", "적립"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`h-[44px] rounded-[10px] text-[14px] font-medium transition-all border-[1px] ${
                    selectedStatus === status
                      ? "bg-gray-100 text-gray-500 border-primary-400"
                      : "bg-gray-100 text-gray-500 border-gray-100"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["환전 신청", "환전 실패", "환전 완료"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`h-[44px] rounded-[10px] text-[14px] font-medium transition-all border-[1px] ${
                    selectedStatus === status
                      ? "bg-gray-100 text-gray-500 border-primary-400"
                      : "bg-gray-100 text-gray-500 border-gray-100"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-8">
          <Button variant="secondary" onClick={handleReset} fullWidth>
            초기화
          </Button>
          <Button variant="primary" onClick={handleApply} fullWidth>
            적용하기
          </Button>
        </div>
      </div>
    </div>
  );
}
