import ScenarioLayout from "@/components/scenario/ScenarioLayout"; // 시나리오 공통 레이아웃을 재사용하여 UI를 통일합니다.
import type { ReactNode } from "react"; // children 타입 정의를 명시합니다.

type SearchAccountScenarioLayoutProps = {
  children: ReactNode;
};

/**
 * `/searchaccount-scenario` 경로 전용 레이아웃입니다.
 * 이 레이아웃은 이체 시나리오와 동일한 헤더 및 레이아웃 구조를 공유합니다.
 */
export default function SearchAccountScenarioLayout({
  children,
}: SearchAccountScenarioLayoutProps) {
  return <ScenarioLayout>{children}</ScenarioLayout>; // 공통 레이아웃을 적용하여 동일한 사용자 경험을 제공합니다.
}


