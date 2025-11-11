import ScenarioLayout from "@/components/scenario/ScenarioLayout"; // 시나리오 계열 페이지에서 공통으로 사용하는 레이아웃을 불러옵니다.
import type { ReactNode } from "react"; // children 속성의 타입을 명확히 하기 위해 ReactNode 타입을 사용합니다.

type TransferScenarioLayoutProps = {
  children: ReactNode;
};

export default function TransferScenarioLayout({
  children,
}: TransferScenarioLayoutProps) {
  return <ScenarioLayout>{children}</ScenarioLayout>; // 공통 레이아웃을 그대로 사용하여 UI 일관성을 유지합니다.
}
