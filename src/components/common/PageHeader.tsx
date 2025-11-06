"use client";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  rightElement?: ReactNode;
  titleSize?: "sm" | "md" | "lg";
  className?: string;
}

const backIcon = "/images/backicon.png";

export default function PageHeader({
  title,
  onBack,
  rightElement,
  titleSize = "md",
  className = "",
}: PageHeaderProps) {
  const titleClasses = {
    sm: "text-[20px] text-gray-700 font-medium leading-[1.38] tracking-[-0.6px]",
    md: "text-[20px] text-gray-700 font-semibold leading-[1.38] tracking-[-0.6px]",
    lg: "text-[22px] text-gray-700 font-medium leading-[31px] tracking-[-0.88px]",
  };

  return (
    <div className={`flex items-center ${rightElement ? "justify-between" : "gap-2"} w-full ${className}`}>
      <div className="flex items-center gap-2">
        {onBack && (
          <button
            onClick={onBack}
            className="w-[14px] h-[7px] flex items-center justify-center -rotate-90 shrink-0"
            aria-label="뒤로가기"
          >
            <img
              alt="뒤로가기"
              className="w-[14px] h-[7px] object-contain"
              src={backIcon}
            />
          </button>
        )}
        <h1 className={titleClasses[titleSize]}>{title}</h1>
      </div>
      {rightElement && <div className="shrink-0">{rightElement}</div>}
    </div>
  );
}

