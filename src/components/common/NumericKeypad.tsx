"use client"; // 숫자 입력 버튼과 상태를 제어하므로 클라이언트 전용으로 선언합니다.
import { useMemo, useState } from "react"; // 숫자 배열을 섞고, 렌더링 최적화를 위해 useState/useMemo를 사용합니다.

interface NumericKeypadProps {
  value: string; // 현재 입력된 숫자 문자열입니다.
  maxLength?: number; // 허용되는 최대 자리수입니다.
  onValueChange: (value: string) => void; // 입력 값이 바뀔 때 상위 컴포넌트에 전달하는 콜백입니다.
  className?: string; // 키패드 외부 컨테이너 클래스입니다.
  shuffleNumbers?: boolean; // 숫자 배열을 무작위로 섞을지 여부입니다.
}

const DIGIT_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]; // 키패드에 배치할 기본 숫자 순서입니다.

const shuffleArray = <T,>(array: T[]) => {
  const clone = [...array]; // 원본 배열을 변경하지 않기 위해 복사본을 생성합니다.
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]]; // 피셔-예이츠 알고리즘으로 요소를 섞습니다.
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
  ); // 최초 렌더링 시에만 배열을 섞어 랜덤 키패드를 구성합니다.

  const topDigits = useMemo(() => shuffledDigits.slice(0, 9), [shuffledDigits]); // 상단 3x3 버튼에 사용할 숫자들입니다.
  const bottomDigit = useMemo(() => shuffledDigits[9] ?? "0", [shuffledDigits]); // 하단 중앙에 배치할 숫자입니다.

  const handleNumberClick = (num: string) => {
    if (value.length < maxLength) {
      onValueChange(value + num); // 최대 자리수를 넘지 않는 경우에만 숫자를 추가합니다.
    }
  };

  const handleDelete = () => {
    onValueChange(value.slice(0, -1)); // 마지막 입력 숫자를 하나 제거합니다.
  };

  const handleClear = () => {
    onValueChange(""); // 모든 입력을 초기화합니다.
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-6 flex justify-center gap-2">
        {/* 입력된 자릿수는 ●로 표시하고 남은 자리는 ○로 표시하여 시각적 피드백을 제공합니다. */}
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
        {/* 상단 3행의 숫자 버튼을 순회하며 렌더링합니다. */}
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

        {/* 세 번째 행에는 전체삭제, 0, 삭제 키를 배치합니다. */}
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
          ← {/* 마지막 자릿수를 지우는 백스페이스 역할의 버튼입니다. */}
        </button>
      </div>
    </div>
  );
}

