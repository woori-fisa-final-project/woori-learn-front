"use client"; // 페이지 레이아웃이 주로 클라이언트 렌더링을 기준으로 구성되므로 클라이언트 전용으로 선언합니다.
import { ReactNode } from "react"; // 자식 요소를 받기 위해 ReactNode 타입을 사용합니다.

interface PageContainerProps {
  children: ReactNode; // 페이지에 렌더링할 실제 콘텐츠입니다.
  className?: string; // 컨테이너에 추가로 전달할 클래스입니다.
  noPadding?: boolean; // 기본 좌우 패딩을 제거할지 여부입니다.
}

export default function PageContainer({
  children,
  className = "",
  noPadding = false,
}: PageContainerProps) {
  // 모바일 중심으로 설계된 페이지 레이아웃을 일관되게 적용합니다.
  return (
    <main className="flex justify-center items-start min-h-[100dvh] bg-white overflow-x-hidden overflow-y-hidden">
      <div
        className={`w-full max-w-[390px] sm:max-w-[430px] md:max-w-[560px] lg:max-w-[768px] ${
          noPadding ? "" : "px-5 sm:px-[20px]"
        } pt-[60px] pb-0 flex flex-col min-h-[100dvh] ${className}`}
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)", // 노치가 있는 디바이스에서도 하단 콘텐츠가 잘리지 않도록 여백을 확보합니다.
        }}
      >
        {children}
      </div>
    </main>
  );
}
