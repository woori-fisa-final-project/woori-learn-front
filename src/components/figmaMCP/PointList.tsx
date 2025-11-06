"use client";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import PageHeader from "@/components/common/PageHeader";
import PageContainer from "@/components/common/PageContainer";
import PointHistoryCard from "@/components/common/PointHistoryCard";
import FilterBottomSheet from "@/components/common/FilterBottomSheet";

const searchIcon = "/images/search.png";

// 고정 데이터
const pointHistoryData: Array<{
  id: number;
  date: string;
  amount: string;
  status: string;
  type: "earn" | "exchange_request" | "exchange_complete" | "exchange_failed";
}> = [
  { id: 1, date: "2024.01.15", amount: "+5,000", status: "적립", type: "earn" },
  { id: 2, date: "2024.01.10", amount: "-2,000", status: "환전 신청", type: "exchange_request" },
  { id: 3, date: "2024.01.05", amount: "+3,000", status: "적립", type: "earn" },
  { id: 4, date: "2023.12.28", amount: "-1,000", status: "환전 완료", type: "exchange_complete" },
  { id: 5, date: "2023.12.20", amount: "+10,000", status: "적립", type: "earn" },
  { id: 6, date: "2023.12.15", amount: "-500", status: "환전 실패", type: "exchange_failed" },
];

export default function PointList() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"history" | "exchange">("history");
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [filterState, setFilterState] = useState({
    period: "3개월",
    sort: "최신순",
    status: "전체",
  });

  const handleBack = () => {
    router.push("/mypage");
  };

  const handleSearchClick = () => {
    setIsBottomSheetOpen(true);
  };

  const handleBottomSheetClose = () => {
    setIsBottomSheetOpen(false);
  };

  const handleFilterApply = (filters: {
    period: string;
    sort: string;
    status: string;
  }) => {
    setFilterState(filters);
    setIsBottomSheetOpen(false);
  };

  const handleExchangeTab = () => {
    router.push("/points/exchange");
  };

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    let filtered = [...pointHistoryData];

    // 상태 필터링
    if (filterState.status !== "전체") {
      filtered = filtered.filter((item) => item.status === filterState.status);
    }

    // 정렬
    filtered.sort((a, b) => {
      const dateA = new Date(a.date.replace(/\./g, "-")).getTime();
      const dateB = new Date(b.date.replace(/\./g, "-")).getTime();
      
      if (filterState.sort === "최신순") {
        return dateB - dateA; // 최신순: 내림차순
      } else {
        return dateA - dateB; // 과거순: 오름차순
      }
    });

    // 기간 필터링 (간단한 예시, 실제로는 날짜 계산 필요)
    // 여기서는 모든 데이터를 표시하되, 실제 구현 시 날짜 범위로 필터링

    return filtered;
  }, [filterState]);

  return (
    <PageContainer>
      <PageHeader
        title="포인트 관리"
        onBack={handleBack}
        rightElement={
          <button
            onClick={handleSearchClick}
            className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer"
            aria-label="조회조건선택"
          >
            <img
              alt="조회"
              src={searchIcon}
              className="w-full h-full object-contain"
            />
          </button>
        }
      />

      {/* Tabs */}
      <div className="mt-8 w-full flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 pb-3 text-[16px] font-medium transition-colors ${
              activeTab === "history"
                ? "text-primary-400 border-b-2 border-primary-400"
                : "text-gray-400"
            }`}
          >
            포인트 내역
          </button>
          <button
            onClick={handleExchangeTab}
            className={`flex-1 pb-3 text-[16px] font-medium transition-colors ${
              activeTab === "exchange"
                ? "text-primary-400 border-b-2 border-primary-400"
                : "text-gray-400"
            }`}
          >
            포인트 환전
          </button>
        </div>

      {/* Filter Info */}
      {activeTab === "history" && (
        <div className="mt-5 w-full flex items-center justify-between">
          <p className="text-[14px] text-gray-500">
            {filterState.status} / {filterState.sort} / {filterState.period}
          </p>
          <button
            onClick={handleSearchClick}
            className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer"
            aria-label="조회조건선택"
          >
            <img
              alt="조회"
              src={searchIcon}
              className="w-full h-full object-contain"
            />
          </button>
        </div>
      )}

      {/* Point History List */}
      {activeTab === "history" && (
        <div className="mt-5 w-full flex flex-col gap-4">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <PointHistoryCard
                key={item.id}
                date={item.date}
                status={item.status}
                amount={item.amount}
                type={item.type}
              />
            ))
          ) : (
            <div className="w-full p-8 text-center text-gray-500">
              <p>필터 조건에 맞는 내역이 없습니다.</p>
            </div>
          )}
        </div>
      )}

      {/* Bottom Sheet */}
      <FilterBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={handleBottomSheetClose}
        onApply={handleFilterApply}
        initialFilters={filterState}
      />
    </PageContainer>
  );
}
