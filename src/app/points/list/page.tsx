"use client"; // 클라이언트 컴포넌트로 선언하여 상태 및 브라우저 기능을 사용할 수 있도록 합니다.

import { useRouter } from "next/navigation"; // 페이지 전환을 처리하기 위해 라우터를 사용합니다.
import { useMemo, useState } from "react"; // 필터 상태와 결과를 관리하기 위해 상태와 메모 훅을 사용합니다.
import PageHeader from "@/components/common/PageHeader"; // 상단 헤더 UI를 담당하는 공통 컴포넌트입니다.
import PageContainer from "@/components/common/PageContainer"; // 전체 페이지 레이아웃을 감싸는 컨테이너입니다.
import PointHistoryCard from "@/components/common/PointHistoryCard"; // 포인트 내역 하나를 표시하는 카드 컴포넌트입니다.
import FilterBottomSheet from "@/components/common/FilterBottomSheet"; // 필터 조건을 선택할 수 있는 바텀 시트입니다.

const searchIcon = "/images/search.png"; // 조회 조건 버튼에 사용할 검색 아이콘입니다.

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
  const router = useRouter(); // 다른 페이지로 이동하기 위한 라우터 인스턴스입니다.
  const [activeTab, setActiveTab] = useState<"history" | "exchange">("history"); // 현재 선택된 탭 상태입니다.
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false); // 필터 바텀 시트 열림 여부를 관리합니다.
  const [filterState, setFilterState] = useState({ period: "3개월", sort: "최신순", status: "전체" }); // 필터 조건 상태입니다.

  const handleBack = () => {
    router.push("/mypage"); // 뒤로가기 시 마이페이지로 이동합니다.
  };

  const handleSearchClick = () => {
    setIsBottomSheetOpen(true); // 조회 조건 버튼 클릭 시 바텀 시트를 엽니다.
  };

  const handleBottomSheetClose = () => {
    setIsBottomSheetOpen(false); // 바텀 시트를 닫습니다.
  };

  const handleFilterApply = (filters: { period: string; sort: string; status: string }) => {
    setFilterState(filters); // 선택된 필터 조건을 저장합니다.
    setIsBottomSheetOpen(false); // 적용 후 바텀 시트를 닫습니다.
  };

  const handleExchangeTab = () => {
    router.push("/points/exchange"); // 환전 탭 선택 시 환전 페이지로 이동합니다.
  };

  const filteredData = useMemo(() => {
    let filtered = [...pointHistoryData]; // 원본 데이터를 복사해 필터링합니다.

    if (filterState.status !== "전체") {
      filtered = filtered.filter((item) => item.status === filterState.status); // 상태 조건이 전체가 아니면 해당 상태만 남깁니다.
    }

    const now = new Date();
    const startDate = new Date(now); // 기간 필터의 시작 날짜를 계산하기 위해 현재 날짜 기준으로 설정합니다.
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
      return filterState.sort === "최신순" ? dateB - dateA : dateA - dateB; // 정렬 조건에 따라 최신/과거 순으로 정렬합니다.
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

          <div className="mt-8 flex w/full border-b border-gray-200">
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



