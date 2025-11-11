"use client"; // 라우터 및 상태 관리를 사용하므로 클라이언트 컴포넌트로 선언합니다.

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext"; // 뒤로가기 동작을 시나리오별로 제어하기 위해 컨텍스트를 사용합니다.
import { useTransferFlow } from "@/lib/hooks/useTransferFlow"; // 시나리오 8에서 선택한 계좌 정보를 이어받기 위해 컨텍스트를 사용합니다.

// 거래 조회 페이지에서 필요한 타입 정의를 나열합니다. 정렬 기준, 거래 유형, 기간 선택을 문자열 리터럴로 제한해 타입 안정성을 높입니다.
type SortOrder = "최신순" | "과거순";
type TransactionType = "전체" | "입금" | "출금";
type PeriodLabel = "이번달" | "3개월" | "6개월" | "1년";
type SelectedPeriod = PeriodLabel | "맞춤기간";

export type Transaction = {
  id: string;
  date: string; // YYYY-MM-DD 형식으로 관리하여 비교 연산을 단순화합니다.
  time: string; // HH:mm:ss 형태의 문자열입니다.
  description: string;
  amount: number; // 양수면 입금, 음수면 출금으로 간주합니다.
  runningBalance?: number; // 거래 후 잔액을 나타냅니다.
};

type FilterState = {
  period: SelectedPeriod;
  startDate: Date;
  endDate: Date;
  type: TransactionType;
  sortOrder: SortOrder;
};

// 필터 버튼에서 빠르게 기간을 지정할 수 있도록 라벨과 월 수를 매핑해 둡니다.
const PERIOD_OPTIONS: Array<{ label: PeriodLabel; months: number }> = [
  { label: "이번달", months: 1 },
  { label: "3개월", months: 3 },
  { label: "6개월", months: 6 },
  { label: "1년", months: 12 },
];

const TRANSACTION_TYPE_TABS: TransactionType[] = ["전체", "입금", "출금"];
const SORT_TABS: SortOrder[] = ["최신순", "과거순"];

export const TRANSACTION_STORAGE_KEY = "searchaccount:lastTransaction";

// 실제 서비스에서는 API 응답으로 대체될 더미 거래 내역입니다.
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    date: "2025-09-20",
    time: "11:23:14",
    description: "김집주",
    amount: -500000,
    runningBalance: 3500000,
  },
  {
    id: "t2",
    date: "2025-09-05",
    time: "16:36:58",
    description: "계좌이체",
    amount: -50000,
    runningBalance: 4000000,
  },
  {
    id: "t3",
    date: "2025-08-18",
    time: "09:14:22",
    description: "급여",
    amount: 2500000,
    runningBalance: 4050000,
  },
];

function formatKoreanDate(date: Date) {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function subMonths(base: Date, months: number) {
  const cloned = new Date(base);
  cloned.setMonth(cloned.getMonth() - (months - 1));
  cloned.setDate(1);
  return cloned;
}

function toDateValue(date: string) {
  return new Date(`${date}T00:00:00`);
}

export default function Scenario9() {
  const router = useRouter(); // 뒤로가기 및 다른 시나리오로 이동할 때 사용합니다.
  const { setOnBack, setTitle } = useScenarioHeader(); // 헤더의 뒤로가기 버튼 및 중앙 타이틀을 설정합니다.
  const { sourceAccountNumber } = useTransferFlow(); // 출금 계좌 번호를 재사용하여 화면에 노출합니다.

  const today = useMemo(() => new Date(), []); // 컴포넌트가 마운트될 때의 날짜를 기준으로 필터를 초기화합니다.
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false); // 조회조건선택 바텀시트 열림 상태입니다.

  const createDefaultFilters = useCallback((): FilterState => {
    return {
      period: "3개월",
      startDate: subMonths(today, 3),
      endDate: new Date(today),
      type: "전체",
      sortOrder: "최신순",
    };
  }, [today]);

  const cloneFilters = useCallback((state: FilterState): FilterState => {
    return {
      ...state,
      startDate: new Date(state.startDate),
      endDate: new Date(state.endDate),
      sortOrder: state.sortOrder,
    };
  }, []);

  const [filters, setFilters] = useState<FilterState>(() => createDefaultFilters()); // 실제로 적용된 필터 상태입니다.
  const [draftFilters, setDraftFilters] = useState<FilterState>(() => createDefaultFilters()); // 바텀시트에서 임시로 조정 중인 필터입니다.

  useEffect(() => {
    // 헤더의 뒤로가기 버튼을 누르면 시나리오 8 단계로 복귀하도록 설정합니다.
    setTitle("거래내역조회");
    setOnBack(() => () => {
      router.push("/searchaccount-scenario");
    });

    return () => {
      setOnBack(null); // 시나리오 9를 벗어날 때 뒤로가기 핸들러를 초기화합니다.
      setTitle("");
    };
  }, [router, setOnBack, setTitle]);

  const appliedFilters = useMemo(() => {
    // 필터 상태를 기반으로 실제 비교에 사용할 시작/종료 시각을 계산합니다.
    const start = new Date(filters.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(filters.endDate);
    end.setHours(23, 59, 59, 999);

    return {
      start,
      end,
      type: filters.type,
      order: filters.sortOrder,
    };
  }, [filters]);

  const filteredTransactions = useMemo(() => {
    // 거래 리스트에서 조건에 맞는 데이터만 필터링하고 정렬합니다.
    const { start, end, type, order } = appliedFilters;

    const filtered = MOCK_TRANSACTIONS.filter((transaction) => {
      const transactionDate = toDateValue(transaction.date);
      const withinRange = transactionDate >= start && transactionDate <= end;

      if (!withinRange) {
        return false;
      }

      if (type === "입금") {
        return transaction.amount >= 0;
      }

      if (type === "출금") {
        return transaction.amount < 0;
      }

      return true;
    });

    const sorted = filtered.sort((a, b) => {
      const first = toDateValue(a.date).getTime();
      const second = toDateValue(b.date).getTime();
      if (order === "최신순") {
        return second - first;
      }
      return first - second;
    });

    return sorted;
  }, [appliedFilters]);

  const displayRange = `${formatKoreanDate(appliedFilters.start)}~${formatKoreanDate(appliedFilters.end)}`;
  const totalAmount = useMemo(() => {
    return filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0); // 조건에 해당하는 거래 금액을 모두 더해 기간 합계를 계산합니다.
  }, [filteredTransactions]);

  const groupedTransactions = useMemo(() => {
    // 같은 연도/월에 속하는 거래를 묶어서 화면에 나누어 보여 줍니다.
    return filteredTransactions.reduce<Array<{ label: string; items: Transaction[] }>>((groups, transaction) => {
      const [year, month] = transaction.date.split("-");
      const monthNumber = Number(month);
      const label = `${year}년 ${monthNumber}월`;
      const lastGroup = groups[groups.length - 1];

      if (lastGroup && lastGroup.label === label) {
        lastGroup.items.push(transaction);
        return groups;
      }

      return [...groups, { label, items: [transaction] }];
    }, []);
  }, [filteredTransactions]);

  const handleOpenBottomSheet = useCallback(() => {
    setDraftFilters(cloneFilters(filters)); // 현재 적용된 필터 상태를 복사한 뒤 바텀시트에서 수정할 수 있게 합니다.
    setIsBottomSheetOpen(true); // 조회조건선택 바텀시트를 엽니다.
  }, [cloneFilters, filters]);

  const handleCloseBottomSheet = useCallback(() => {
    setIsBottomSheetOpen(false); // 바텀시트를 닫습니다.
  }, []);

  const handleSelectPeriod = useCallback(
    (period: PeriodLabel) => {
      // 기본 기간 버튼을 눌렀을 때 해당 기간에 맞도록 임시 필터 값을 갱신합니다.
      const selectedOption = PERIOD_OPTIONS.find((option) => option.label === period);
      if (!selectedOption) {
        return;
      }
      setDraftFilters((prev) => ({
        ...prev,
        period,
        startDate: subMonths(today, selectedOption.months),
        endDate: new Date(today),
      }));
    },
    [today],
  );

  const handleApplyFilters = useCallback(() => {
    setFilters(cloneFilters(draftFilters)); // 바텀시트에서 조정한 필터를 실제 목록에 적용합니다.
    setIsBottomSheetOpen(false); // 사용자가 적용 버튼을 누르면 바텀시트를 닫습니다.
  }, [cloneFilters, draftFilters]);

  const handleSelectTransaction = useCallback(
    (transaction: Transaction) => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(TRANSACTION_STORAGE_KEY, JSON.stringify(transaction));
      }
      router.push("/searchaccount-scenario?step=10");
    },
    [router],
  );

  return (
    <div className="flex min-h-[100dvh] flex-col"> {/* 전체 페이지를 세로 배치하여 헤더 아래 콘텐츠와 바텀시트를 구성합니다. */}
      <main className="flex-1 overflow-y-auto px-[20px] pb-[32px]"> {/* 스크롤 가능한 거래 조회 메인 영역입니다. */}
        {/* 계좌 요약 헤더 */}
        <section className="pt-[24px]">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-[12px] text-gray-500">거래내역조회</p>
              <p className="mt-[4px] text-[18px] font-semibold text-gray-900">
                우리 {sourceAccountNumber || "0000-000-000000"}
              </p>
            </div>
            <div>
              <p className="text-[20px] font-bold text-gray-900">0원</p>
              <p className="mt-[8px] text-[13px] text-gray-500">
                출금가능금액 0원
              </p>
            </div>
          </header>
          <button
            type="button"
            className="mt-[14px] w-full rounded-[10px] bg-[#2F6FD9] py-[12px] text-[15px] font-semibold text-white"
          >
            이체
          </button>
        </section>

        {/* 조회 조건 요약 영역 */}
        <section className="mt-[24px]">
          <div className="flex flex-wrap items-center justify-between gap-[12px] text-[13px] text-gray-600">
            <span>{displayRange}</span>
            <div className="flex items-center gap-[8px]">
              <span>{filters.period === "맞춤기간" ? "맞춤기간" : filters.period}</span>
              <span className="text-gray-400">·</span>
              <span>{filters.type}</span>
              <span className="text-gray-400">·</span>
              <span>{filters.sortOrder}</span>
              <button
                type="button"
                onClick={handleOpenBottomSheet}
                className="inline-flex items-center justify-center bg-transparent p-0 text-gray-600 align-middle"
                aria-label="조회 조건 열기"
              >
                <img src="/images/search.png" alt="조회" className="h-[18px] w-[18px] object-contain grayscale" />
              </button>
            </div>
          </div>

          <div className="mt-[18px] border-t border-[#E4E8F0] pt-[12px] text-[13px] text-gray-700">
            <div className="flex items-center justify-between">
              <span>기간 내 합계</span>
              <span className="text-[15px] font-semibold text-gray-900">
              {totalAmount > 0
                  ? `+${totalAmount.toLocaleString()}원`
                  : `${totalAmount.toLocaleString()}원`}
              </span>
            </div>
          </div>
        </section>

        {/* 거래내역 목록 */}
        <section className="mt-[28px]">
          {groupedTransactions.map((group) => (
            <div key={group.label} className="mb/[20px]">
              <h2 className="text-[16px] font-semibold text-gray-900">{group.label}</h2>
              <ul className="mt-[16px] space-y-[12px]">
                {group.items.map((transaction) => (
                  <li
                    key={transaction.id}
                    className="cursor-pointer rounded-[16px] bg-white p/[18px] shadow-sm transition hover:bg-[#F6F8FC]"
                    role="button"
                    onClick={() => handleSelectTransaction(transaction)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        handleSelectTransaction(transaction);
                      }
                    }}
                    tabIndex={0}
                  >
                    <div className="flex items-center justify-between text-[13px] text-gray-500">
                      <span>
                        {transaction.date.replace(/-/g, ".")} {transaction.time}
                      </span>
                    </div>
                    <div className="mt-[10px] flex items-baseline justify-between">
                      <p className="text-[15px] text-gray-900">{transaction.description}</p>
                      <p
                        className={`text-[18px] font-semibold ${
                          transaction.amount >= 0 ? "text-[#2F6FD9]" : "text-gray-900"
                        }`}
                      >
                        {transaction.amount >= 0
                          ? `+${transaction.amount.toLocaleString()}원`
                          : `${transaction.amount.toLocaleString()}원`}
                      </p>
                    </div>
                    <div className="mt-[8px] flex justify-end text-[13px] text-gray-500">
                      <span>잔액</span>
                      <span className="ml/[6px]">
                        {(transaction.runningBalance ?? 0).toLocaleString()}원
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {filteredTransactions.length === 0 && (
            <div className="bg-white p-[24px] text-center text-[14px] text-gray-500">
              선택한 조건에 해당하는 거래내역이 없습니다.
            </div>
          )}
        </section>
      </main>

      {isBottomSheetOpen && (
        <>
          {/* 오버레이 */}
          <button
            type="button"
            aria-label="조회 조건 선택 닫기"
            onClick={handleCloseBottomSheet}
            className="fixed inset-0 z-40 bg-black/40"
          />

          {/* 바텀시트 */}
          <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-[24px] bg-white p-[24px] shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-gray-900">조회조건선택</h3>
              <button
                type="button"
                onClick={handleCloseBottomSheet}
                aria-label="조회조건선택 닫기"
                className="flex h-[28px] w-[28px] items-center justify-center text-[18px] text-gray-400"
              >
                ×
              </button>
            </div>

            <div className="mt-[20px] space-y-[24px]">
              <section>
                <h4 className="text-[14px] font-medium text-gray-700">조회기간</h4>
                <div className="mt-[12px] grid grid-cols-4 gap-[10px]">
                  {PERIOD_OPTIONS.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => handleSelectPeriod(option.label)}
                      className={`rounded-[12px] px-[12px] py-[10px] text-[13px] ${
                        draftFilters.period === option.label
                          ? "bg-[#2F6FD9] text-white"
                          : "bg-[#F5F6F8] text-gray-600"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                
              </section>

              <section>
                <h4 className="text-[14px] font-medium text-gray-700">거래구분</h4>
                <div className="mt-[12px] flex items-center gap-[10px]">
                  {TRANSACTION_TYPE_TABS.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          type: tab,
                        }))
                      }
                      className={`rounded-[12px] px-[14px] py-[10px] text-[13px] ${
                        draftFilters.type === tab ? "bg-[#2F6FD9] text-white" : "bg-[#F5F6F8] text-gray-600"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-[14px] font-medium text-gray-700">정렬</h4>
                <div className="mt-[12px] flex items-center gap-[10px]">
                  {SORT_TABS.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          sortOrder: tab,
                        }))
                      }
                      className={`rounded-[12px] px-[14px] py-[10px] text-[13px] ${
                        draftFilters.sortOrder === tab ? "bg-[#2F6FD9] text-white" : "bg-[#F5F6F8] text-gray-600"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </section>

            </div>

            <div className="mt/[28px] flex items-center gap/[12px]">
              <button
                type="button"
                onClick={() => {
                  setDraftFilters(createDefaultFilters());
                }}
                className="flex-1 rounded-[12px] border border-[#D3DCF0] py/[12px] text-[14px] font-medium text-gray-600"
              >
                초기화
              </button>
              <button
                type="button"
                onClick={handleApplyFilters}
                className="flex-1 rounded/[12px] bg-[#2F6FD9] py/[12px] text-[14px] font-semibold text-white"
              >
                적용하기
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

