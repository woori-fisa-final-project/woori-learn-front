"use client"; // 진행 상황을 시각화하는 컴포넌트로 클라이언트 렌더링 전용입니다.
import { Fragment } from "react";
import CheckIcon from "./CheckIcon"; // 각 단계를 표시하기 위해 재사용하는 체크 아이콘입니다.

interface ProgressStep {
  label: string; // 단계에 표시할 텍스트입니다.
  bgColor?: string; // 단계 아이콘의 배경 색상입니다.
  textColor?: string; // 라벨 텍스트 색상입니다.
  iconSrc?: string; // 단계별 커스텀 아이콘입니다.
  iconAlt?: string; // 커스텀 아이콘 대체 텍스트입니다.
  iconClassName?: string; // 아이콘 외곽선/배경을 제어할 클래스입니다.
  wrapperClassName?: string; // 외곽 원 스타일
}

interface ProgressBarProps {
  steps: ProgressStep[]; // 렌더링할 단계 배열입니다.
  className?: string; // 외부에서 전달받는 추가 클래스입니다.
  lineColorClassName?: string; // 진행 선 색상을 커스텀할 클래스입니다.
  showEndCaps?: boolean; // 양 끝의 선을 표시할지 여부입니다.
  horizontalPadding?: string; // 전체 선 양끝 여백 클래스입니다.
}

export default function ProgressBar({
  steps,
  className = "",
  lineColorClassName = "bg-[#376FDB]",
  showEndCaps = true,
  horizontalPadding = "px-4 sm:px-12",
}: ProgressBarProps) {
  // 단계별로 체크 아이콘과 라벨을 나열하며, 단계 사이를 선으로 연결합니다.
  return (
    <div className={`bg-white rounded-[10px] py-6 w-full ${className}`}>
      <div className={`relative flex w-full items-start justify-between gap-0 ${horizontalPadding}`}>
        <div
          className={`pointer-events-none absolute top-[18px] h-[2px] ${lineColorClassName}`}
          style={{
            left: showEndCaps ? "12px" : "16px",
            right: showEndCaps ? "12px" : "16px",
          }}
        />
        {!showEndCaps && (
          <>
            <div className="pointer-events-none absolute left-0 top-[16px] z-10 h-[16px] w-16 rounded-full" />
            <div className="pointer-events-none absolute right-0 top-[16px] z-10 h-[16px] w-16 rounded-full" />
          </>
        )}
        {steps.map((step) => (
          <div
            key={step.label}
            className="relative flex min-w-[64px] flex-1 flex-col items-center"
          >
            <CheckIcon
              size="md"
              bgColor={step.bgColor || "bg-primary-700"}
              active={true}
              iconSrc={step.iconSrc}
              iconAlt={step.iconAlt}
              className={`relative ${step.iconClassName ?? ""}`}
            />
            <p
              className={`mt-2 text-[12px] font-bold text-center leading-tight ${
                step.textColor || "text-gray-500"
              }`}
            >
              {step.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
