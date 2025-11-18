"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import PageContainer from "@/components/common/PageContainer";
import PointHistoryCard from "@/components/common/PointHistoryCard";
import FilterBottomSheet from "@/components/common/FilterBottomSheet";
import Image from "next/image";

import {
  periodEnum,
  sortEnum,
  statusEnum,
  viewText,
  PeriodType,
  SortType,
  StatusType,
} from "@/constants/points";

const searchIcon = "/images/search.png";

// -------------------------------------------------------
// API 응답 타입
// -------------------------------------------------------
interface PointHistoryItem {
  id: number;
  type: "DEPOSIT" | "WITHDRAW";
  status: "APPLY" | "SUCCESS" | "FAILED" | null;
  amount: number;
  createdAt: string;
}

// -------------------------------------------------------
// 필터 타입
// -------------------------------------------------------
interface FilterState {
  period: PeriodType;
  sort: SortType;
  status: StatusType;
  page: number;
  size: number;
}

export default function PointListPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"history" | "exchange">("history");
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const [filterState, setFilterState] = useState<FilterState>({
    period: "ALL",
    sort: "DESC",
    status: "ALL",
    page: 1,
    size: 50,
  });

  const [historyList, setHistoryList] = useState<PointHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // -------------------------------------------------------
  // 카드 타입 매핑
  // -------------------------------------------------------
  const mapCardType = (item: PointHistoryItem) => {
    if (item.type === "DEPOSIT") return "earn";

    if (item.type === "WITHDRAW") {
      switch (item.status) {
        case "APPLY":
          return "exchange_request";
        case "SUCCESS":
          return "exchange_complete";
        case "FAILED":
          return "exchange_failed";
      }
    }

    return "unknown";
  };

  // -------------------------------------------------------
  // 상태 텍스트 매핑
  // -------------------------------------------------------
  const mapStatusText = (item: PointHistoryItem) => {
    if (item.type === "DEPOSIT") return "적립 완료";

    if (item.type === "WITHDRAW") {
      switch (item.status) {
        case "APPLY":
          return "환전 신청";
        case "SUCCESS":
          return "환전 완료";
        case "FAILED":
          return "환전 실패";
      }
    }

    return "상태 없음";
  };

  // -------------------------------------------------------
  // 📌 API 조회 + 오류 처리
  // -------------------------------------------------------
  const fetchHistory = async () => {
    setError(null); // 요청 시작 시 에러 초기화

    try {
      const query = new URLSearchParams({
        username: "testuser",
        period: filterState.period,
        sort: filterState.sort,
        status: filterState.status,
        page: String(filterState.page),
        size: String(filterState.size),
      }).toString();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/points/history?${query}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("응답 오류");
      }

      const json = await response.json();
const items: PointHistoryItem[] = json.data?.content ?? [];
setHistoryList(items);

    } catch (error) {
      console.error("포인트 내역 조회 오류:", error);
      setError(
        "내역을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
      setHistoryList([]); // 에러 발생 시 리스트 초기화
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [filterState, activeTab]);

  // -------------------------------------------------------
  // 필터 적용
  // -------------------------------------------------------
   const handleFilterApply = (filters: { period: string; sort: string; status: string; }) => {
    setFilterState((prev) => ({
      ...prev,
      period: periodEnum[filters.period] ?? prev.period,
      sort: sortEnum[filters.sort] ?? prev.sort,
      status: statusEnum[filters.status] ?? prev.status,
      page: 1,
    }));
  };
  return (
    <PageContainer>
      <div className="flex h-[calc(100dvh-60px)] w-full flex-col">
        <div className="flex-shrink-0">
          <PageHeader title="포인트 관리" onBack={() => router.push("/mypage")} />

          {/* 탭 */}
          <div className="mt-8 flex w-full border-b border-gray-200">
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 pb-3 text-[16px] font-medium ${
                activeTab === "history"
                  ? "border-b-2 border-primary-400 text-primary-400"
                  : "text-gray-400"
              }`}
            >
              포인트 내역
            </button>

            <button
              onClick={() => router.push("/points/exchange")}
              className="flex-1 pb-3 text-[16px] font-medium text-gray-400"
            >
              포인트 환전
            </button>
          </div>

          {/* 현재 필터 */}
          <div className="mt-5 flex w-full items-center justify-between">
            <p className="text-[14px] text-gray-500">
              {viewText.status[filterState.status]} /{" "}
              {viewText.sort[filterState.sort]} /{" "}
              {viewText.period[filterState.period]}
            </p>

            <button
              onClick={() => setIsBottomSheetOpen(true)}
              className="h-6 w-6"
            >
              <Image src={searchIcon} width={24} height={24} alt="filter" />
            </button>
          </div>
        </div>

        {/* 리스트 */}
        <div className="mt-5 flex-1 min-h-0 overflow-y-auto">
          {error && (
            <p className="px-4 pb-2 text-center text-sm text-red-500">{error}</p>
          )}

          <div className="flex flex-col gap-4 pb-4">
            {!error && historyList.length > 0 ? (
              historyList.map((item) => (
                <PointHistoryCard
                  key={item.id}
                  date={item.createdAt?.slice(0, 10)}
                  status={mapStatusText(item)}
                  amount={item.amount.toLocaleString()}
                  type={mapCardType(item)}
                />
              ))
            ) : !error ? (
              <div className="p-8 text-center text-gray-500">
                조회된 내역이 없습니다.
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* 바텀시트 */}
      <FilterBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        onApply={handleFilterApply}
        initialFilters={{
          period: viewText.period[filterState.period],
          sort: viewText.sort[filterState.sort],
          status: viewText.status[filterState.status],
        }}
      />
    </PageContainer>
  );
}
