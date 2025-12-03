"use client";

// 자동이체 일정 입력 단계에서 필요한 React 상태와 공통 컴포넌트를 불러온다.
import { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import { clampDayToMonth, formatYMD } from "@/utils/dateUtils";
import type { ScheduleSummary } from "./types";

type Scenario14Props = {
  onComplete: (options: ScheduleSummary) => void;
};

const frequency = "1개월";
const DURATION_OPTIONS: Array<{ label: string; months: number | null }> = [
  { label: "6개월", months: 6 },
  { label: "12개월", months: 12 },
  { label: "36개월", months: 36 },
  { label: "미지정", months: null },
];

const TRANSFER_DAYS = ["1일", "5일", "10일", "15일", "20일", "25일", "말일"];

// 자동이체의 시작일, 종료일, 지정일을 입력받는 단계 컴포넌트이다.
export default function Scenario14({ onComplete }: Scenario14Props) {
  const now = new Date();
  const today = formatYMD(now.getFullYear(), now.getMonth() + 1, now.getDate());
  // 시작일과 종료일, 지정일, 기간 옵션 선택 상태를 관리한다.
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");
  const [transferDay, setTransferDay] = useState("1일");
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  const [tutorialStep, setTutorialStep] = useState(0);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getDayOrDefault = (source: string) => {
    const [, , day] = source.split("-");
    if (!day || Number.isNaN(Number(day))) return "01";
    return day.padStart(2, "0");
  };

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
    return formatYMD(target.getFullYear(), target.getMonth() + 1, target.getDate());
  };

  useEffect(() => {
    if (selectedDuration !== null && startDate) {
      setEndDate(addMonths(startDate, selectedDuration));
    }
  }, [selectedDuration, startDate]);

  const handleSelectDuration = (months: number | null) => {
    setSelectedDuration(months);
    if (months === null) {
      setEndDate("");
      return;
    }
    const computed = addMonths(startDate, months);
    setEndDate(computed);

    if (months === 12 && tutorialStep === 2) {
      setTutorialStep(3);
    }
  };

  const handleSubmit = () => {
    if (!startDate || !endDate || !transferDay) return;
    onComplete({ startDate, endDate, frequency, transferDay });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
    if (tutorialStep === 0 && !isDropdownOpen) {
      setTutorialStep(1);
    }
  };

  const handleSelectDay = (day: string) => {
    setTransferDay(day);
    setIsDropdownOpen(false);
    if (day === "5일" && tutorialStep === 1) {
      setTutorialStep(2);
    }
  };

  return (
    <div className="flex h-full flex-col relative" onClick={() => {
      if (isDropdownOpen) setIsDropdownOpen(false);
    }}>
      <section className="mt-[32px] space-y-[24px]">
        <h1 className="text-[22px] font-semibold text-gray-900">
          언제부터 언제까지 이체하시겠어요?
        </h1>

        <div className="space-y-[16px]">
          <div className="space-y-[8px]">
            <label className="text-[14px] font-medium text-gray-700">
              이체주기 및 지정일
            </label>

            <div className="flex flex-col gap-[12px]">
              <div className="relative w-full max-w-[350px]">
                <div className="w-full rounded-[12px] border border-gray-200 bg-gray-50 px-[14px] py-[12px] text-[15px] text-gray-800">
                  {frequency}
                </div>
                <span className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[18px] text-gray-400">▾</span>
              </div>
              <div className="relative w-full max-w-[350px]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown();
                  }}
                  className="flex w-full items-center justify-between rounded-[12px] border border-gray-200 bg-white px-[14px] py-[12px] text-[15px] text-gray-800 focus:outline-none active:bg-gray-50"
                >
                  <span>{transferDay}</span>
                  <span className="text-[18px] text-gray-400">▾</span>
                </button>

                {isDropdownOpen && (
                  <ul className="absolute top-full z-20 mt-[4px] w-full overflow-hidden rounded-[12px] border border-gray-200 bg-white shadow-lg max-h-[200px] overflow-y-auto">
                    {TRANSFER_DAYS.map((day) => (
                      <li key={day} className="border-b border-gray-100 last:border-none">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectDay(day);
                          }}
                          className="w-full px-[14px] py-[12px] text-left text-[15px] text-gray-900 hover:bg-blue-50 active:bg-blue-100"
                        >
                          {day}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div >

          <div className="space-y-[16px]">
            <label className="text-[14px] font-medium text-gray-700">
              이체기간(월)
            </label>

            <div className="grid grid-cols-2 gap-[8px]">
              {DURATION_OPTIONS.map((option) => {
                const isActive = selectedDuration === option.months;
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => handleSelectDuration(option.months)}
                    className={`h-[40px] w-full rounded-[12px] border px-[12px] text-[14px] font-medium transition ${isActive
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
                    if (!value) { setStartDate(""); return; }
                    const [y, m] = value.split("-").map(Number);
                    if (!y || !m) { setStartDate(""); return; }
                    const prevDay = startDate ? new Date(startDate).getDate() : (Number(getDayOrDefault(startDate)) || 1);
                    const adjustedDay = clampDayToMonth(y, m, prevDay);
                    setStartDate(formatYMD(y, m, adjustedDay));
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
                    if (!value) { setEndDate(""); return; }
                    const [y, m] = value.split("-").map(Number);
                    if (!y || !m) { setEndDate(""); return; }
                    const baseDate = endDate || startDate;
                    const prevDay = baseDate ? new Date(baseDate).getDate() : 1;
                    const adjustedDay = clampDayToMonth(y, m, prevDay);
                    setEndDate(formatYMD(y, m, adjustedDay));
                  }}
                  disabled={selectedDuration !== null}
                  className="w-full rounded-[12px] border border-gray-200 px-[14px] py-[12px] text-[15px] text-gray-800 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div >
      </section >

      <div className="mt-auto flex flex-col gap-[12px] pb-[24px]">
        <Button onClick={handleSubmit} disabled={!startDate || !endDate || !transferDay}>
          다음
        </Button>
      </div>
    </div >
  );
}