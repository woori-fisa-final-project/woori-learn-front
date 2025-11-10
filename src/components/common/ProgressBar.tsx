"use client"; // 진행 상황을 시각화하는 컴포넌트로 클라이언트 렌더링 전용입니다.
import CheckIcon from "./CheckIcon"; // 각 단계를 표시하기 위해 재사용하는 체크 아이콘입니다.

interface ProgressStep {
  label: string; // 단계에 표시할 텍스트입니다.
  bgColor?: "primary-700" | "green-500"; // 단계 아이콘의 배경 색상입니다.
  textColor?: "gray-500" | "green-500"; // 라벨 텍스트 색상입니다.
}

interface ProgressBarProps {
  steps: ProgressStep[]; // 렌더링할 단계 배열입니다.
  className?: string; // 외부에서 전달받는 추가 클래스입니다.
}

export default function ProgressBar({
  steps,
  className = "",
}: ProgressBarProps) {
  // 단계별로 체크 아이콘과 라벨을 나열하며, 단계 사이를 선으로 연결합니다.
  return (
    <div
      className={`bg-white rounded-[10px] p-6 flex items-center justify-center w-full overflow-x-hidden ${className}`}
    >
      {steps.map((step, index) => (
        <div key={index} className="flex items-center flex-1 min-w-0">
          <div className="flex flex-col items-center gap-0.5 w-12 shrink-0">
            <CheckIcon
              size="md"
              bgColor={step.bgColor || "primary-700"}
              active={true}
            />
            <p
              className={`text-[12px] text-center whitespace-nowrap ${
                step.textColor || "text-gray-500"
              }`}
            >
              {step.label}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 h-px bg-primary-700 mx-2 min-w-0" /> // 마지막 단계를 제외하고 가느다란 선으로 다음 단계와 연결합니다.
          )}
        </div>
      ))}
    </div>
  );
}
