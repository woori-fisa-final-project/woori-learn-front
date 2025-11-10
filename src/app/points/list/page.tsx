"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import PageContainer from "@/components/common/PageContainer";
import PointHistoryCard from "@/components/common/PointHistoryCard";
import FilterBottomSheet from "@/components/common/FilterBottomSheet";

const searchIcon = "/images/search.png";

const pointHistoryData: Array<{
  id: number;
  date: string;
  amount: string;
  status: string;
  type: "earn" | "exchange_request" | "exchange_complete" | "exchange_failed";
}> = [
  { id: 1, date: "2025.11.01", amount: "+5,000", status: "적립", type: "earn" },
  { id: 2, date: "2025.10.10", amount: "-2,000", status: "환전 신청", type: "exchange_request" },
  { id: 3, date: "2025.10.05", amount: "+3,000", status: "적립", type: "earn" },
  { id: 4, date: "2025.10.28", amount: "-1,000", status: "환전 완료", type: "exchange_complete" },
  { id: 5, date: "2025.09.20", amount: "+10,000", status: "적립", type: "earn" },
  { id: 6, date: "2025.09.15", amount: "-500", status: "환전 실패", type: "exchange_failed" },
];

export default function PointListPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"history" | "exchange">("history");
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [filterState, setFilterState] = useState({ period: "3개월", sort: "최신순", status: "전체" });

  const handleBack = () => {
    router.push("/mypage");
  };

  const handleSearchClick = () => {
    setIsBottomSheetOpen(true);
  };

  const handleBottomSheetClose = () => {
    setIsBottomSheetOpen(false);
  };

  const handleFilterApply = (filters: { period: string; sort: string; status: string }) => {
    setFilterState(filters);
    setIsBottomSheetOpen(false);
  };

  const handleExchangeTab = () => {
    router.push("/points/exchange");
  };

  const filteredData = useMemo(() => {
    let filtered = [...pointHistoryData];

    if (filterState.status !== "전체") {
      filtered = filtered.filter((item) => item.status === filterState.status);
    }

    const now = new Date();
    const startDate = new Date(now);
    switch (filterState.period) {
      case "1주일":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "1개월":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "3개월":
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      default:
        startDate.setFullYear(2000, 0, 1);
        break;
    }

    filtered = filtered.filter((item) => {
      const itemDate = new Date(item.date.replace(/\./g, "-"));
      return itemDate >= startDate;
    });

    filtered.sort((a, b) => {
      const dateA = new Date(a.date.replace(/\./g, "-")).getTime();
      const dateB = new Date(b.date.replace(/\./g, "-")).getTime();
      return filterState.sort === "최신순" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [filterState]);

  return (
    <PageContainer>
      <div className="flex h-[calc(100dvh-60px)] w-full max-h-[calc(100dvh-60px)] flex-col">
        <div className="flex-shrink-0">
          <PageHeader
            title="포인트 관리"
            onBack={handleBack}
          />

          <div className="mt-8 flex w-full border-b border-gray-200">
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 pb-3 text-[16px] font-medium transition-colors ${
                activeTab === "history" ? "border-b-2 border-primary-400 text-primary-400" : "text-gray-400"
              }`}
            >
              포인트 내역
            </button>
            <button
              onClick={handleExchangeTab}
              className={`flex-1 pb-3 text-[16px] font-medium transition-colors ${
                activeTab === "exchange" ? "border-b-2 border-primary-400 text-primary-400" : "text-gray-400"
              }`}
            >
              포인트 환전
            </button>
          </div>

          {activeTab === "history" && (
            <div className="mt-5 flex w-full items-center justify-between">
              <p className="text-[14px] text-gray-500">
                {filterState.status} / {filterState.sort} / {filterState.period}
              </p>
              <button onClick={handleSearchClick} className="flex h-6 w-6 items-center justify-center transition-opacity hover:opacity-70" aria-label="조회조건선택">
                <img alt="조회" src={searchIcon} className="h-full w-full object-contain" />
              </button>
            </div>
          )}
        </div>

        {activeTab === "history" && (
          <div className="mt-5 flex-1 min-h-0 w-full overflow-y-auto">
            <div className="flex flex-col gap-4 pb-4">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <PointHistoryCard key={item.id} date={item.date} status={item.status} amount={item.amount} type={item.type} />
                ))
              ) : (
                <div className="w-full p-8 text-center text-gray-500">
                  <p>필터 조건에 맞는 내역이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <FilterBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={handleBottomSheetClose}
        onApply={handleFilterApply}
        initialFilters={filterState}
      />
    </PageContainer>
  );
}



