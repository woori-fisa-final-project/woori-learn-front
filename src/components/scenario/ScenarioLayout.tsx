import ScenarioHeader from "@/components/common/ScenarioHeader"; // 시나리오 화면 상단의 헤더를 재사용합니다.
import { ScenarioHeaderProvider } from "@/lib/context/ScenarioHeaderContext"; // 헤더의 상태와 뒤로가기 로직을 공유하기 위한 컨텍스트를 제공합니다.
import type { ReactNode } from "react"; // children 속성의 타입 정보를 명시합니다.

type ScenarioLayoutProps = {
  children: ReactNode;
};

/**
 * 이 컴포넌트는 시나리오 계열 페이지에서 공통으로 사용하는 레이아웃입니다.
 * 상단 고정 헤더와 100dvh 기준의 높이, 흰색 배경 등의 UI 틀을 통일합니다.
 */
export default function ScenarioLayout({ children }: ScenarioLayoutProps) {
  return (
    <ScenarioHeaderProvider>
      {/* 시나리오 전체 화면을 고정 높이와 흰 배경으로 통일하여 유지합니다. */}
      <div className="flex h-[100dvh] flex-col overflow-hidden bg-white font-sans">
        <ScenarioHeader /> {/* 상단 공통 헤더: 뒤로가기, 종료 모달 등의 행동을 포함합니다. */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-[60px]">{children}</main> {/* 콘텐츠가 길어질 때만 자연스럽게 스크롤이 생깁니다. */}
      </div>
    </ScenarioHeaderProvider>
  );
}

