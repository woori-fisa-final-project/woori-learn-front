"use client"; // 단계별 화면 상단에서 설명을 렌더링하므로 클라이언트 전용으로 선언합니다.
import { ReactNode } from "react"; // 설명 영역을 문자열 또는 JSX로 받을 수 있도록 ReactNode 타입을 사용합니다.
import PageHeader from "./PageHeader"; // 공통 헤더 컴포넌트를 재사용합니다.

interface StepHeaderProps {
  title: string; // 헤더에 표시할 제목입니다.
  description: ReactNode; // 제목 아래에 표시할 설명 문구 또는 커스텀 요소입니다.
  onBack?: () => void; // 뒤로가기 버튼 클릭 시 실행할 콜백입니다.
}

export default function StepHeader({
  title,
  description,
  onBack,
}: StepHeaderProps) {
  // 단계별 화면에 제목과 설명을 일관된 간격으로 표시합니다.
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



