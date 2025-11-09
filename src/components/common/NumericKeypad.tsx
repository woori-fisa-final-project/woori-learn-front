"use client";
import { useMemo, useState } from "react";

interface NumericKeypadProps {
  value: string;
  maxLength?: number;
  onValueChange: (value: string) => void;
  className?: string;
  shuffleNumbers?: boolean;
}

const DIGIT_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const shuffleArray = <T,>(array: T[]) => {
  const clone = [...array];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
};

export default function NumericKeypad({
  value,
  maxLength = 4,
  onValueChange,
  className = "",
  shuffleNumbers = false,
}: NumericKeypadProps) {
  const [shuffledDigits] = useState(() =>
    shuffleNumbers ? shuffleArray(DIGIT_KEYS) : DIGIT_KEYS
  );

  const topDigits = useMemo(() => shuffledDigits.slice(0, 9), [shuffledDigits]);
  const bottomDigit = useMemo(() => shuffledDigits[9] ?? "0", [shuffledDigits]);

  const handleNumberClick = (num: string) => {
    if (value.length < maxLength) {
      onValueChange(value + num);
    }
  };

  const handleDelete = () => {
    onValueChange(value.slice(0, -1));
  };

  const handleClear = () => {
    onValueChange("");
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-6 flex justify-center gap-2">
        {Array.from({ length: maxLength }).map((_, index) => (
          <div key={index} className="flex items-center justify-center">
            {index < value.length ? (
              <span className="text-[28px] font-semibold text-gray-700">●</span>
            ) : (
              <span className="text-[28px] text-gray-300">○</span>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-[12px]">
        {topDigits.map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            disabled={value.length >= maxLength}
            className="h-[58px] rounded-[16px] bg-white text-[18px] font-semibold text-gray-900 transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {num}
          </button>
        ))}

        <button
          onClick={handleClear}
          className="h-[58px] rounded-[16px] text-[13px] font-medium text-gray-600 transition-colors hover:bg-gray-100 active:bg-gray-200"
        >
          전체삭제
        </button>

        <button
          onClick={() => handleNumberClick(bottomDigit)}
          disabled={value.length >= maxLength}
          className="h-[58px] rounded-[16px] bg-white text-[18px] font-semibold text-gray-900 transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {bottomDigit}
        </button>

        <button
          onClick={handleDelete}
          disabled={value.length === 0}
          className="flex h-[58px] items-center justify-center rounded-[16px] bg-white text-[18px] font-semibold text-gray-900 transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ←
        </button>
      </div>
    </div>
  );
}

