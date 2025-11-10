"use client"; // 바텀 시트 열림 상태와 스크롤 잠금을 제어하므로 클라이언트 전용으로 선언합니다.
import { useState, useEffect } from "react"; // 필터 선택 상태와 바텀 시트 생명주기를 관리합니다.
import Button from "@/components/common/Button"; // 초기화 및 적용 버튼으로 커스텀 버튼 컴포넌트를 사용합니다.

interface FilterBottomSheetProps {
  isOpen: boolean; // 바텀 시트가 열렸는지 여부입니다.
  onClose: () => void; // 바깥 영역 클릭 등으로 시트를 닫을 때 호출되는 콜백입니다.
  onApply: (filters: { period: string; sort: string; status: string }) => void; // 선택된 필터 값을 상위 컴포넌트로 전달합니다.
  initialFilters: {
    period: string; // 초기 조회 기간 값입니다.
    sort: string; // 초기 정렬 기준입니다.
    status: string; // 초기 상태 필터입니다.
  };
}

export default function FilterBottomSheet({
  isOpen,
  onClose,
  onApply,
  initialFilters,
}: FilterBottomSheetProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(initialFilters.period); // 현재 선택된 조회 기간입니다.
  const [selectedSort, setSelectedSort] = useState(initialFilters.sort); // 현재 선택된 정렬 기준입니다.
  const [selectedStatus, setSelectedStatus] = useState(initialFilters.status); // 현재 선택된 상태 필터입니다.

  useEffect(() => {
    if (isOpen) {
      setSelectedPeriod(initialFilters.period);
      setSelectedSort(initialFilters.sort);
      setSelectedStatus(initialFilters.status);
      document.body.style.overflow = "hidden"; // 시트가 열려 있을 때 배경 스크롤을 방지합니다.
    } else {
      document.body.style.overflow = "unset"; // 닫히면 원래 스크롤 상태로 복구합니다.
    }

    return () => {
      document.body.style.overflow = "unset"; // 컴포넌트 언마운트 시에도 스크롤 잠금이 남지 않도록 처리합니다.
    };
  }, [isOpen, initialFilters]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) { // 배경을 직접 클릭했을 때만 시트를 닫습니다.
      onClose();
    }
  };

  const handleReset = () => {
    setSelectedPeriod("3개월"); // 기본 조회 기간으로 되돌립니다.
    setSelectedSort("최신순"); // 기본 정렬 기준으로 되돌립니다.
    setSelectedStatus("전체"); // 상태 필터를 전체로 되돌립니다.
  };

  const handleApply = () => {
    onApply({
      period: selectedPeriod,
      sort: selectedSort,
      status: selectedStatus,
    });
  };

  if (!isOpen) return null; // 닫혀 있으면 아무 것도 렌더링하지 않습니다.

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
            {["1주일", "1개월", "3개월"].map((period) => (
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
            {/* 1행: 전체, 적립 */}
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
            {/* 2행: 환전 신청, 환전 실패, 환전 완료 */}
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
