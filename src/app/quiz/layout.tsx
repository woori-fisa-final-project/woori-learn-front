import ScenarioLayout from "@/components/scenario/ScenarioLayout"; // 시나리오 공통 레이아웃을 재사용합니다.
import type { ReactNode } from "react";

export default function QuizLayout({ children }: { children: ReactNode }) {
  return <ScenarioLayout>{children}</ScenarioLayout>;
}

