"use client";

// 자동이체 일정 입력 단계에서 필요한 React 상태와 공통 컴포넌트를 불러온다.
import { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import { clampDayToMonth, formatYMD } from "@/utils/dateUtils";
import type { ScheduleSummary } from "./types";

// 상위 컴포넌트에서 완료 콜백을 전달받기 위한 props 타입을 정의한다.
type Scenario14Props = {
  onComplete: (options: ScheduleSummary) => void;
};

// UI에 표시될 고정 이체 주기와 선택 가능한 기간 옵션을 정의한다.
const frequency = "1개월";
const DURATION_OPTIONS: Array<{ label: string; months: number | null }> = [
  { label: "6개월", months: 6 },
  { label: "12개월", months: 12 },
  { label: "36개월", months: 36 },
  { label: "미지정", months: null },
];

// 자동이체의 시작일, 종료일, 지정일을 입력받는 단계 컴포넌트이다.
export default function Scenario14({ onComplete }: Scenario14Props) {
  const today = new Date().toISOString().slice(0, 10);
  // 시작일과 종료일, 지정일, 기간 옵션 선택 상태를 관리한다.
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");
  const [transferDay, setTransferDay] = useState("1일");
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  // 사용자가 월 단위를 입력했을 때 일자 정보가 없으면 기본값을 보정한다.
  const getDayOrDefault = (source: string) => {
    const [, , day] = source.split("-");
    if (!day || Number.isNaN(Number(day))) {
      return "01";
    }
    return day.padStart(2, "0");
  };

  // 시작일과 지정된 개월 수를 이용해 종료일을 계산한다.
  const addMonths = (base: string, months: number) => {
    const [yearString, monthString, dayString] = base.split("-");
    const year = Number(yearString);
    const month = Number(monthString);
    const day = Number(dayString);
    if (!year || !month || !day) return "";
    const baseDate = new Date(year, month - 1, day);
    const target = new Date(baseDate);
    target.setMonth(baseDate.getMonth() + months);
    const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
    target.setDate(Math.min(baseDate.getDate(), lastDay));
    return target.toISOString().slice(0, 10);
  };

  // 기간 버튼을 선택했을 때 종료일을 자동으로 갱신한다.
  useEffect(() => {
    if (selectedDuration !== null) {
      const computed = addMonths(startDate, selectedDuration);
      setEndDate(computed);
    }
  }, [selectedDuration, startDate]);

  // 기간 옵션을 선택했을 때 해당 개월 수에 맞춰 종료일을 설정한다.
  const handleSelectDuration = (months: number | null) => {
    setSelectedDuration(months);
    if (months === null) {
      setEndDate("");
      return;
    }
    const computed = addMonths(startDate, months);
    setEndDate(computed);
  };

  // 입력된 일정 정보를 상위 컴포넌트로 전달해 다음 단계로 이동한다.
  const handleSubmit = () => {
    if (!startDate || !endDate || !transferDay) {
      return;
    }
    onComplete({ startDate, endDate, frequency, transferDay });
  };

  return (
    <div className="flex h-full flex-col">
      {/* 일정 관련 입력 필드를 묶어 사용자에게 이체 기간을 설정하도록 안내한다. */}
      <section className="mt-[32px] space-y-[24px]">
        <h1 className="text-[22px] font-semibold text-gray-900">
          언제부터 언제까지 이체하시겠어요?
        </h1>

        <div className="space-y-[16px]">
          <div className="space-y-[8px]">
            <label className="text-[14px] font-medium text-gray-700">
              이체주기 및 지정일
            </label>
            {/* 이체 주기와 지정일을 선택하는 드롭다운 영역이다. */}
            <div className="flex flex-col gap-[12px]">
              <div className="relative w-full max-w-[350px]">
                <select
                  value={frequency}
                  disabled
                  className="w-full appearance-none rounded-[12px] border border-gray-200 bg-white px-[14px] py-[12px] text-[15px] text-gray-800 focus:outline-none disabled:cursor-default disabled:text-gray-800"
                >
                  <option value={frequency}>{frequency}</option>
                </select>
                <span className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2 text-[18px] text-gray-400">
                  ▾
                </span>
              </div>
              <div className="relative w-full max-w-[350px]">
                <select
                  value={transferDay}
                  onChange={(event) => setTransferDay(event.target.value)}
                  className="w-full appearance-none rounded-[12px] border border-gray-200 bg-white px-[14px] py-[12px] text-[15px] text-gray-800 focus:outline-none"
                >
                  <option value="1일">1일</option>
                  <option value="5일">5일</option>
                  <option value="10일">10일</option>
                  <option value="15일">15일</option>
                  <option value="20일">20일</option>
                  <option value="25일">25일</option>
                  <option value="말일">말일</option>
                </select>
                <span className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2 text-[18px] text-gray-400">
                  ▾
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-[16px]">
            <label className="text-[14px] font-medium text-gray-700">
              이체기간(월)
            </label>
            {/* 버튼 목록을 통해 미리 정의된 기간을 쉽게 선택하도록 한다. */}
            <div className="grid grid-cols-2 gap-[8px]">
              {DURATION_OPTIONS.map((option) => {
                const isActive = selectedDuration === option.months;
                return (
                  <button
                    type="button"
                    key={option.label}
                    onClick={() => handleSelectDuration(option.months)}
                    className={`h-[40px] rounded-[12px] border px-[12px] text-[14px] font-medium transition ${
                      isActive
                        ? "border-primary-500 bg-primary-50 text-primary-600"
                        : "border-gray-200 bg-white text-gray-700 hover:border-primary-300"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-[12px]">
              <div className="flex flex-col gap-[6px]">
                <span className="text-[13px] text-gray-500">시작일</span>
                <input
                  type="month"
                  value={startDate.slice(0, 7)}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (!value) {
                      setStartDate("");
                      return;
                    }
                    const [yearString, monthString] = value.split("-");
                    const year = Number(yearString);
                    const month = Number(monthString);
                    if (!year || !month) {
                      setStartDate("");
                      return;
                    }
                    const prevDay = startDate
                      ? new Date(startDate).getDate()
                      : Number(getDayOrDefault(startDate)) || 1;
                    const adjustedDay = clampDayToMonth(year, month, prevDay);
                    setStartDate(formatYMD(year, month, adjustedDay));
                  }}
                  className="w-full rounded-[12px] border border-gray-200 px-[14px] py-[12px] text-[15px] text-gray-800 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <span className="text-[13px] text-gray-500">종료일</span>
                <input
                  type="month"
                  value={endDate ? endDate.slice(0, 7) : ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (!value) {
                      setEndDate("");
                      return;
                    }
                    const [yearString, monthString] = value.split("-");
                    const year = Number(yearString);
                    const month = Number(monthString);
                    if (!year || !month) {
                      setEndDate("");
                      return;
                    }
                    const baseDate = endDate || startDate;
                    const prevDay = baseDate ? new Date(baseDate).getDate() : 1;
                    const adjustedDay = clampDayToMonth(year, month, prevDay);
                    setEndDate(formatYMD(year, month, adjustedDay));
                  }}
                  disabled={selectedDuration !== null}
                  className="w-full rounded-[12px] border border-gray-200 px-[14px] py-[12px] text-[15px] text-gray-800 focus:outline-none disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      <div className="mt-auto flex flex-col gap-[12px] pb-[24px]">
        {/* 입력이 완료되면 다음 단계로 이동하기 위한 버튼이다. */}
        <Button onClick={handleSubmit} disabled={!startDate || !endDate || !transferDay}>
          다음
        </Button>
      </div>
    </div>
  );
}

