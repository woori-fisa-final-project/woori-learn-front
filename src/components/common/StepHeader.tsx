"use client";
import { ReactNode } from "react";
import PageHeader from "./PageHeader";

interface StepHeaderProps {
  title: string;
  description: ReactNode;
  onBack?: () => void;
}

export default function StepHeader({
  title,
  description,
  onBack,
}: StepHeaderProps) {
  return (
    <>
      <PageHeader title={title} onBack={onBack} />
      {/* 설명 텍스트 - 헤더 밑 고정 40px 간격 */}
      <div className="mt-[40px] w-full">
        {typeof description === "string" ? (
          <p className="text-[21px] text-gray-700 font-medium leading-[28.86px]">
            {description}
          </p>
        ) : (
          <div className="text-[21px] text-gray-700 font-medium leading-[28.86px]">
            {description}
          </div>
        )}
      </div>
    </>
  );
}



