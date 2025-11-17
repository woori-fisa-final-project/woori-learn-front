"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import PageContainer from "@/components/common/PageContainer";
import PointHistoryCard from "@/components/common/PointHistoryCard";
import FilterBottomSheet from "@/components/common/FilterBottomSheet";
import Image from "next/image";

const searchIcon = "/images/search.png";

export default function PointListPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"history" | "exchange">("history");
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const [filterState, setFilterState] = useState({
    period: "ALL",
    sort: "DESC",
    status: "ALL",
    page: 1,
    size: 50,
  });

  const [historyList, setHistoryList] = useState<any[]>([]);

  // ============================
  // 카드 타입 매핑
  // ============================
  const mapCardType = (item: any) => {
    if (item.type === "DEPOSIT") return "earn";

    if (item.type === "WITHDRAW") {
      if (item.status === "APPLY") return "exchange_request";
      if (item.status === "SUCCESS") return "exchange_complete";
      if (item.status === "FAILED") return "exchange_failed";
    }

    return "exchange_request";
  };

  // ============================
  // 상태 텍스트 매핑
  // ============================
  const mapStatusText = (item: any) => {
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

  // ============================
  // API 조회
  // ============================
  const fetchHistory = async () => {
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

      const json = await response.json();
      setHistoryList(json.content ?? []);
    } catch (error) {
      console.error("포인트 내역 조회 오류 :", error);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [filterState, activeTab]);

  // ============================
  // 필터 적용
  // ============================
  const handleFilterApply = (filters: any) => {
    const periodEnum: any = {
  "전체": "ALL",
  "1주일": "WEEK",
  "1개월": "MONTH",
  "3개월": "THREE_MONTHS",
};

const sortEnum: any = {
  "최신순": "DESC",
  "오래된순": "ASC",
};

const statusEnum: any = {
  "전체": "ALL",
  "적립": "DEPOSIT",
  "환전 신청": "WITHDRAW_APPLY",
  "환전 완료": "WITHDRAW_SUCCESS",
  "환전 실패": "WITHDRAW_FAILED",
};


    setFilterState((prev) => ({
      ...prev,
      period: periodEnum[filters.period] ?? prev.period,
      sort: sortEnum[filters.sort] ?? prev.sort,
      status: statusEnum[filters.status] ?? prev.status,
      page: 1,
    }));
  };

  // useState, 함수들 정의 뒤에 넣어줘
const viewText: any = {
  status: {
    ALL: "전체",
    DEPOSIT: "적립",
    WITHDRAW_APPLY: "환전 신청",
    WITHDRAW_SUCCESS: "환전 완료",
    WITHDRAW_FAILED: "환전 실패",
  },
  sort: {
    DESC: "최신순",
    ASC: "오래된순",
  },
  period: {
    WEEK: "1주일",
    MONTH: "1개월",
    THREE_MONTHS: "3개월",
    ALL: "전체",
  },
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
              {viewText.status[filterState.status]} / {viewText.sort[filterState.sort]} /{" "}
              {viewText.period[filterState.period]}
            </p>

            <button onClick={() => setIsBottomSheetOpen(true)} className="h-6 w-6">
              <Image src={searchIcon} width={24} height={24} alt="filter" />
            </button>
          </div>
        </div>

        {/* 리스트 */}
        <div className="mt-5 flex-1 min-h-0 overflow-y-auto">
          <div className="flex flex-col gap-4 pb-4">
            {historyList.length > 0 ? (
              historyList.map((item: any) => (
                <PointHistoryCard
                  key={item.id}
                  date={item.createdAt?.slice(0, 10)}
                  status={mapStatusText(item)}
                  amount={item.amount.toLocaleString()}
                  type={mapCardType(item)}
                />
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                조회된 내역이 없습니다.
              </div>
            )}
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
