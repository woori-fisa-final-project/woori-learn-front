// 퀴즈 경로에서도 이체 시나리오와 동일한 레이아웃을 사용하기 위해 공용 레이아웃 컴포넌트를 재활용합니다.
import ScenarioLayout from "@/components/scenario/ScenarioLayout"; // 시나리오 공통 레이아웃을 재사용합니다.
import type { ReactNode } from "react";

// /quiz 경로의 모든 페이지를 ScenarioLayout으로 감싸 일관된 헤더와 배경을 유지합니다.
export default function QuizLayout({ children }: { children: ReactNode }) {
  return <ScenarioLayout>{children}</ScenarioLayout>;
}

