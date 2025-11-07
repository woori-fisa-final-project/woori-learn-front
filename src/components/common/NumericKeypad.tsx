"use client";
import { useState } from "react";

interface NumericKeypadProps {
  value: string;
  maxLength?: number;
  onValueChange: (value: string) => void;
  className?: string;
}

export default function NumericKeypad({
  value,
  maxLength = 4,
  onValueChange,
  className = "",
}: NumericKeypadProps) {
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
      {/* 숫자 표시 영역 - 배경 없이 동그라미만 */}
      <div className="flex justify-center gap-3 mb-8">
        {Array.from({ length: maxLength }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-center"
          >
            {index < value.length ? (
              <span className="text-[32px] text-gray-700 font-semibold">
                ●
              </span>
            ) : (
              <span className="text-[32px] text-gray-300">○</span>
            )}
          </div>
        ))}
      </div>

      {/* 숫자 키패드 - 배경 없이 */}
      <div className="grid grid-cols-3 gap-4">
        {/* 1-9 숫자 */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num.toString())}
            disabled={value.length >= maxLength}
            className="h-[64px] rounded-[16px] hover:bg-gray-50 active:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-[28px] text-gray-700 font-semibold"
          >
            {num}
          </button>
        ))}

        {/* 지우기 버튼 */}
        <button
          onClick={handleClear}
          className="h-[64px] rounded-[16px] hover:bg-gray-50 active:bg-gray-100 transition-colors text-[16px] text-gray-600 font-medium"
        >
          전체삭제
        </button>

        {/* 0 버튼 */}
        <button
          onClick={() => handleNumberClick("0")}
          disabled={value.length >= maxLength}
          className="h-[64px] rounded-[16px] hover:bg-gray-50 active:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-[28px] text-gray-700 font-semibold"
        >
          0
        </button>

        {/* 백스페이스 버튼 */}
        <button
          onClick={handleDelete}
          disabled={value.length === 0}
          className="h-[64px] rounded-[16px] hover:bg-gray-50 active:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 3H7C6.31 3 5.77 3.35 5.41 3.88L0 12L5.41 20.11C5.77 20.64 6.31 21 7 21H22C23.1 21 24 20.1 24 19V5C24 3.9 23.1 3 22 3ZM19 15.59L17.59 17L14 13.41L10.41 17L9 15.59L12.59 12L9 8.41L10.41 7L14 10.59L17.59 7L19 8.41L15.41 12L19 15.59Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

