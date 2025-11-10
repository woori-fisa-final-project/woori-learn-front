"use client"; // 헤더의 뒤로가기 버튼 등 상호작용을 처리하기 위해 클라이언트 전용으로 선언합니다.
import { ReactNode } from "react"; // 우측 커스텀 요소를 받기 위해 ReactNode 타입을 사용합니다.

interface PageHeaderProps {
  title: string; // 헤더 중앙에 표시할 제목입니다.
  onBack?: () => void; // 뒤로가기 버튼 클릭 시 실행할 콜백입니다.
  rightElement?: ReactNode; // 헤더 오른쪽에 배치할 추가 요소입니다.
  titleSize?: "sm" | "md" | "lg"; // 제목의 타이포 크기를 선택합니다.
  className?: string; // 외부에서 전달하는 추가 클래스입니다.
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
              src={backIcon} // 공통 뒤로가기 아이콘 이미지를 사용합니다.
            />
          </button>
        )}
        <h1 className={titleClasses[titleSize]}>{title}</h1>
      </div>
      {rightElement && <div className="shrink-0">{rightElement}</div>}
    </div>
  );
}


