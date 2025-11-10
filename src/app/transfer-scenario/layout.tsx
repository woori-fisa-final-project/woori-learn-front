import ScenarioHeader from "@/components/common/ScenarioHeader"; // 시나리오 화면 상단의 헤더 컴포넌트를 불러옵니다.
import { ScenarioHeaderProvider } from "@/lib/context/ScenarioHeaderContext"; // 헤더의 뒤로가기 동작 등을 제어하기 위한 컨텍스트를 제공합니다.
import type { ReactNode } from "react"; // children 속성의 타입을 명확히 하기 위해 ReactNode 타입을 사용합니다.

type TransferScenarioLayoutProps = {
  children: ReactNode;
};

export default function TransferScenarioLayout({
  children,
}: TransferScenarioLayoutProps) {
  return (
    <ScenarioHeaderProvider> {/* 헤더 컨텍스트를 하위 컴포넌트에 제공하여 뒤로가기 로직을 공유합니다. */}
      <div className="flex h-[100dvh] flex-col overflow-hidden bg-white font-sans pt-[60px]"> {/* 전체 시나리오 화면의 레이아웃을 고정 높이와 흰 배경으로 구성합니다. */}
        <ScenarioHeader/> {/* 상단 고정 헤더를 렌더링하여 단계별 이동을 지원합니다. */}
        <main className="flex-1 overflow-hidden">{children}</main> {/* 현재 시나리오 단계의 실제 콘텐츠를 표시합니다. */}
      </div>
    </ScenarioHeaderProvider>
  );
}
